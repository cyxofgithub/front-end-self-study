import React from 'react';
import { Streamdown } from 'streamdown';
import { streamChat } from './utils/streamClient';
import './App.css';

function App() {
    const [messages, setMessages] = React.useState([]);
    const [isTyping, setIsTyping] = React.useState(false);
    const [conversationId, setConversationId] = React.useState(null);
    const [currentAssistantMessage, setCurrentAssistantMessage] =
        React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = React.useRef(null);

    // 自动滚动到底部
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentAssistantMessage]);

    const handleSend = async (e) => {
        e?.preventDefault();
        const textContent = inputValue.trim();
        if (!textContent) return;
        const userMessage = {
            message: textContent,
            sentTime: new Date().toISOString(),
            sender: 'user',
            direction: 'outgoing',
        };

        // 添加用户消息
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setCurrentAssistantMessage('');
        setInputValue(''); // 清空输入框

        try {
            // 累积的助手回复（用于增量更新）
            let accumulatedReply = '';

            await streamChat({
                url: '/api/chat/stream',
                message: textContent,
                conversation_id: conversationId,
                onMessage: (data) => {
                    // 调试：打印接收到的数据
                    console.log('📨 接收到数据:', data);
                    
                    // Dify API 返回的数据格式：
                    // { event: "message", answer: "增量文本片段", ... }
                    // { event: "message_end", ... }
                    
                    if (data.event === 'message_end' || data.event === 'workflow_finished') {
                        // 流式响应结束
                        console.log('✅ 流式响应结束');
                        return;
                    }

                    // 处理 answer 字段
                    // Dify API 的 answer 字段可能是：
                    // 1. 增量更新：每次只包含新增的文本片段（如 "你好"、"！"、"你" 等）
                    // 2. 累积更新：每次包含完整的累积答案
                    // 我们使用智能判断：如果新答案以当前累积内容开头，说明是累积的完整答案；否则是增量
                    if (data.answer !== undefined && data.answer !== null && data.answer !== '') {
                        const newAnswer = data.answer;
                        
                        // 判断是增量还是累积
                        if (accumulatedReply && newAnswer.startsWith(accumulatedReply)) {
                            // 累积的完整答案（新答案包含完整内容）
                            accumulatedReply = newAnswer;
                        } else {
                            // 增量更新，追加到累积内容
                            accumulatedReply += newAnswer;
                        }
                        
                        console.log('📝 累积回复长度:', accumulatedReply.length, '最新片段:', newAnswer);
                        setCurrentAssistantMessage(accumulatedReply);
                    } 
                    // 处理其他格式的文本字段
                    else if (data.text !== undefined && data.text !== null && data.text !== '') {
                        accumulatedReply += data.text;
                        console.log('📝 更新助手回复 (text):', accumulatedReply.substring(0, 100) + '...');
                        setCurrentAssistantMessage(accumulatedReply);
                    } 
                    // 处理包装的数据
                    else if (data.data !== undefined) {
                        try {
                            const innerData = typeof data.data === 'string' 
                                ? JSON.parse(data.data) 
                                : data.data;
                            console.log('📦 解析内部数据:', innerData);
                            if (innerData.answer !== undefined && innerData.answer !== null && innerData.answer !== '') {
                                const newAnswer = innerData.answer;
                                if (accumulatedReply && newAnswer.startsWith(accumulatedReply)) {
                                    accumulatedReply = newAnswer;
                                } else {
                                    accumulatedReply += newAnswer;
                                }
                                setCurrentAssistantMessage(accumulatedReply);
                            } else if (innerData.text !== undefined && innerData.text !== null && innerData.text !== '') {
                                accumulatedReply += innerData.text;
                                setCurrentAssistantMessage(accumulatedReply);
                            }
                        } catch (e) {
                            console.warn('⚠️ 解析数据错误:', e);
                        }
                    }

                    // 更新对话 ID
                    if (data.conversation_id) {
                        setConversationId(data.conversation_id);
                    }
                },
                onError: (error) => {
                    console.error('流式响应错误:', error);
                    setIsTyping(false);
                    
                    // 添加错误消息
                    const errorMessage = {
                        message: `错误: ${error.message || '请求失败'}`,
                        sentTime: new Date().toISOString(),
                        sender: 'assistant',
                        direction: 'incoming',
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                },
                onComplete: () => {
                    setIsTyping(false);
                    
                    // 添加完整的助手消息
                    if (accumulatedReply) {
                        const assistantMessage = {
                            message: accumulatedReply,
                            sentTime: new Date().toISOString(),
                            sender: 'assistant',
                            direction: 'incoming',
                        };
                        setMessages((prev) => [...prev, assistantMessage]);
                        setCurrentAssistantMessage('');
                    }
                },
            });
        } catch (error) {
            console.error('发送消息错误:', error);
            setIsTyping(false);
            
            const errorMessage = {
                message: `错误: ${error.message || '请求失败'}`,
                sentTime: new Date().toISOString(),
                sender: 'assistant',
                direction: 'incoming',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div className="app-container">
            <div className="chat-header">
                <h1>AI 聊天助手</h1>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === 'user' ? 'message-user' : 'message-assistant'}`}
                    >
                        <div className="message-content">
                            {msg.sender === 'assistant' ? (
                                <div className="markdown-content">
                                    <Streamdown parseIncompleteMarkdown={true}>
                                        {msg.message}
                                    </Streamdown>
                                </div>
                            ) : (
                                <div className="message-text">{msg.message}</div>
                            )}
                        </div>
                        <div className="message-time">
                            {new Date(msg.sentTime).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                {currentAssistantMessage && (
                    <div className="message message-assistant">
                        <div className="message-content">
                            <div className="markdown-content">
                                <Streamdown parseIncompleteMarkdown={true}>
                                    {currentAssistantMessage}
                                </Streamdown>
                            </div>
                        </div>
                    </div>
                )}
                {isTyping && (
                    <div className="message message-assistant">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-container" onSubmit={handleSend}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="输入消息..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                />
                <button
                    type="submit"
                    className="chat-send-button"
                    disabled={!inputValue.trim() || isTyping}
                >
                    发送
                </button>
            </form>
            {/* 调试：显示当前消息状态 */}
            {process.env.NODE_ENV === 'development' && (
                <div className="debug-info">
                    <div>当前消息长度: {currentAssistantMessage.length}</div>
                    <div>消息预览: {currentAssistantMessage.substring(0, 100)}...</div>
                    <div>是否正在输入: {isTyping ? '是' : '否'}</div>
                    <div>对话ID: {conversationId || '无'}</div>
                </div>
            )}
        </div>
    );
}

export default App;

