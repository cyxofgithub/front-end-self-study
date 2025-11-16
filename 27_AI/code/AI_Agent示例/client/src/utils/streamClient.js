/**
 * 处理 SSE 流式响应
 * @param {string} url - SSE 端点 URL
 * @param {Object} options - 请求选项
 * @param {string} options.message - 用户消息
 * @param {string} options.conversation_id - 对话 ID（可选）
 * @param {string} options.user - 用户 ID（可选）
 * @param {Function} options.onMessage - 消息回调函数 (data) => void
 * @param {Function} options.onError - 错误回调函数 (error) => void
 * @param {Function} options.onComplete - 完成回调函数 () => void
 * @returns {Promise<void>}
 */
export async function streamChat({
    url,
    message,
    conversation_id,
    user,
    onMessage,
    onError,
    onComplete,
}) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                conversation_id,
                user,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `HTTP ${response.status}: ${response.statusText}`,
            }));
            throw new Error(errorData.error || '请求失败');
        }

        // 直接处理 SSE 流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // 缓冲区用于累积不完整的 SSE 消息
        let buffer = '';
        let currentEvent = 'message';
        let currentData = '';

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    // 处理缓冲区中剩余的数据
                    if (buffer.trim()) {
                        const lines = buffer.split('\n');
                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (trimmed.startsWith('data:')) {
                                const data = trimmed.substring(5).trim();
                                if (data) {
                                    try {
                                        const jsonData = JSON.parse(data);
                                        if (onMessage) {
                                            onMessage(jsonData);
                                        }
                                    } catch (e) {
                                        // 忽略解析错误
                                    }
                                }
                            }
                        }
                    }

                    if (onComplete) {
                        onComplete();
                    }
                    break;
                }

                // 解码数据块
                buffer += decoder.decode(value, { stream: true });

                // 按行处理 SSE 格式
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // 保留最后不完整的行

                for (const line of lines) {
                    const trimmed = line.trim();

                    if (trimmed.startsWith('event:')) {
                        currentEvent = trimmed.substring(6).trim();
                    } else if (trimmed.startsWith('data:')) {
                        currentData = trimmed.substring(5).trim();
                    } else if (trimmed === '') {
                        // 空行表示一个完整的事件
                        if (currentData) {
                            try {
                                const jsonData = JSON.parse(currentData);
                                console.log(
                                    '📦 SSE 解析的 JSON 数据:',
                                    jsonData
                                );
                                if (onMessage) {
                                    onMessage(jsonData);
                                }
                            } catch (parseError) {
                                // 如果不是 JSON，尝试作为纯文本处理
                                console.log('📝 SSE 纯文本数据:', currentData);
                                if (onMessage) {
                                    onMessage({
                                        event: currentEvent,
                                        data: currentData,
                                        text: currentData,
                                    });
                                }
                            }
                        }
                        currentData = '';
                        currentEvent = 'message';
                    }
                }
            }
        } catch (streamError) {
            console.error('流读取错误:', streamError);
            if (onError) {
                onError(streamError);
            }
        }
    } catch (error) {
        console.error('流式请求错误:', error);
        if (onError) {
            onError(error);
        }
        throw error;
    }
}

/**
 * 手动解析 SSE 流（备用方案）
 * @param {ReadableStream} stream - 响应流
 * @param {Function} onMessage - 消息回调
 * @param {Function} onError - 错误回调
 * @param {Function} onComplete - 完成回调
 */
export async function parseSSEStream(stream, onMessage, onError, onComplete) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                if (onComplete) {
                    onComplete();
                }
                break;
            }

            // 解码数据块
            buffer += decoder.decode(value, { stream: true });

            // 按行分割处理 SSE 格式
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 保留最后不完整的行

            let eventType = 'message';
            let dataBuffer = '';

            for (const line of lines) {
                if (line.startsWith('event:')) {
                    eventType = line.substring(6).trim();
                } else if (line.startsWith('data:')) {
                    dataBuffer = line.substring(5).trim();
                } else if (line === '') {
                    // 空行表示一个完整的事件
                    if (dataBuffer) {
                        try {
                            const jsonData = JSON.parse(dataBuffer);
                            if (onMessage) {
                                onMessage(jsonData);
                            }
                        } catch (parseError) {
                            console.warn(
                                '解析 JSON 失败:',
                                parseError,
                                dataBuffer
                            );
                        }
                    }
                    dataBuffer = '';
                    eventType = 'message';
                }
            }
        }
    } catch (error) {
        console.error('解析 SSE 流错误:', error);
        if (onError) {
            onError(error);
        }
    } finally {
        reader.releaseLock();
    }
}
