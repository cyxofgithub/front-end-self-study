/**
 * options/App.tsx —— 选项页
 *
 * 企业级差异：配置读写走封装的 storage（schema 类型安全），
 * 颜色保存后靠 storage.subscribe 广播到所有 content script，实时生效。
 */
import { useEffect, useState } from 'react';
import { storage } from '../shared/storage';

export default function App() {
  const [color, setColor] = useState('#ffe58f');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.get('highlightColor').then(setColor);
  }, []);

  const handleChange = async (value: string) => {
    setColor(value);
    await storage.set('highlightColor', value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>⚙ 划词笔记设置</h1>
      <div style={styles.field}>
        <label style={styles.label} htmlFor="color">高亮颜色</label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div style={styles.status}>{saved && '已保存 ✓（所有已打开页面实时生效）'}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 480,
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: '-apple-system, "PingFang SC", sans-serif',
    color: '#333',
  },
  h1: { fontSize: 18, marginBottom: 24 },
  field: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  label: { width: 90, color: '#666' },
  status: { color: '#52c41a', fontSize: 13, marginTop: 8, height: 18 },
};
