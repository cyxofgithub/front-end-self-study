import React, { useState } from 'react';

export function App() {
    const [text] = useState('aaabbb aaabbb aaabbb;');
    const [keyword] = useState('aab');
    const max = 1; // 只高亮前2个

    const getHighlight = () => {
        if (!keyword) return text;
        // gi表示忽略大小写
        const reg = new RegExp(`(${keyword})`, 'gi');
        let count = 0;
        const arr = text.split(reg);
        return arr.map((item, i) => {
            if (reg.test(item) && count < max) {
                count++;
                return (
                    <span key={i} style={{ color: 'red' }}>
                        {item}
                    </span>
                );
            }
            return item;
        });
    };

    return (
        <div>
            <p>{getHighlight()}</p>
        </div>
    );
}
