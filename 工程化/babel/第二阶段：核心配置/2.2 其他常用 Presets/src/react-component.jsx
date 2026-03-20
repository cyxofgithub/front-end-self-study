// React 组件示例
// 演示 JSX 语法和 React 特性

import React, { useState, useEffect } from 'react';

// 函数组件
function Greeting({ name = 'Guest' }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        console.log(`Component mounted, count is ${count}`);
    }, [count]);

    const handleClick = () => {
        setCount(count + 1);
    };

    return (
        <div className="greeting">
            <h1>Hello, {name}!</h1>
            <p>Count: {count}</p>
            <button onClick={handleClick}>Increment</button>
        </div>
    );
}

// 类组件
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    handleIncrement = () => {
        this.setState({ count: this.state.count + 1 });
    };

    render() {
        return (
            <div>
                <h2>Counter: {this.state.count}</h2>
                <button onClick={this.handleIncrement}>+</button>
            </div>
        );
    }
}

// 使用 Fragment
function List({ items }) {
    return (
        <>
            <h3>Items List</h3>
            <ul>
                {items?.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </>
    );
}

// 条件渲染
function ConditionalRender({ isLoggedIn }) {
    return (
        <div>
            {isLoggedIn ? (
                <p>Welcome back!</p>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
}

// 事件处理
function EventHandlers() {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter name" />
            <button type="submit">Submit</button>
        </form>
    );
}

// 导出组件
export default Greeting;
export { Counter, List, ConditionalRender, EventHandlers };
