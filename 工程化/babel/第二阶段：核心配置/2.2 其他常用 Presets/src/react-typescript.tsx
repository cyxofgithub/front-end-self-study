// React + TypeScript 示例
// 演示同时使用 React 和 TypeScript

import React, { useState, useEffect, FC } from 'react';

// 1. 函数组件类型定义
interface GreetingProps {
    name: string;
    age?: number;
    onGreet?: (name: string) => void;
}

const Greeting: FC<GreetingProps> = ({ name, age, onGreet }) => {
    const [count, setCount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        setMessage(`Hello, ${name}!`);
        if (onGreet) {
            onGreet(name);
        }
    }, [name, onGreet]);

    const handleClick = (): void => {
        setCount(count + 1);
    };

    return (
        <div className="greeting">
            <h1>{message}</h1>
            {age && <p>Age: {age}</p>}
            <p>Count: {count}</p>
            <button onClick={handleClick}>Increment</button>
        </div>
    );
};

// 2. 类组件类型定义
interface CounterProps {
    initialValue?: number;
    step?: number;
}

interface CounterState {
    count: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
        super(props);
        this.state = {
            count: props.initialValue || 0,
        };
    }

    handleIncrement = (): void => {
        const step = this.props.step || 1;
        this.setState({ count: this.state.count + step });
    };

    render(): React.ReactNode {
        return (
            <div>
                <h2>Counter: {this.state.count}</h2>
                <button onClick={this.handleIncrement}>+</button>
            </div>
        );
    }
}

// 3. 泛型组件
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{renderItem(item)}</li>
            ))}
        </ul>
    );
}

// 4. 事件处理类型
interface FormProps {
    onSubmit: (data: FormData) => void;
}

function Form({ onSubmit }: FormProps) {
    const [name, setName] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const formData: FormData = new FormData();
        formData.append('name', name);
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="Enter name"
            />
            <button type="submit">Submit</button>
        </form>
    );
}

// 5. 使用类型和接口
interface User {
    id: number;
    name: string;
    email: string;
}

interface UserCardProps {
    user: User;
    onSelect?: (user: User) => void;
}

const UserCard: FC<UserCardProps> = ({ user, onSelect }) => {
    const handleClick = (): void => {
        if (onSelect) {
            onSelect(user);
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
        </div>
    );
};

// 6. 条件渲染类型安全
interface ConditionalProps {
    isLoggedIn: boolean;
    user?: User;
}

const ConditionalRender: FC<ConditionalProps> = ({ isLoggedIn, user }) => {
    return (
        <div>
            {isLoggedIn && user ? (
                <p>Welcome, {user.name}!</p>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

// 导出
export default Greeting;
export { Counter, List, Form, UserCard, ConditionalRender };
export type { User, GreetingProps, CounterProps };
