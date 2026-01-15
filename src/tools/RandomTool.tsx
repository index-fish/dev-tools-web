import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { Dices, Fingerprint, Copy, Trash2 } from 'lucide-react';

const RandomTool: React.FC = () => {
    const [output, setOutput] = useState('');

    // Random Number State
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [count, setCount] = useState(10);
    const [unique, setUnique] = useState(false);
    const [sort, setSort] = useState(false);

    // UUID State
    const [uuidCount, setUuidCount] = useState(5);
    const [uuidFormat, setUuidFormat] = useState('lowercase');

    const generateRandomNumbers = () => {
        let nums: number[] = [];
        if (unique && count > max - min + 1) {
            setOutput('错误: 范围太小无法生成不重复数字');
            return;
        }
        while (nums.length < count) {
            const n = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!unique || !nums.includes(n)) nums.push(n);
        }
        if (sort) nums.sort((a, b) => a - b);
        setOutput(nums.join('\n'));
    };

    const generateUuids = () => {
        const uuids = [];
        for (let i = 0; i < uuidCount; i++) {
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });

            if (uuidFormat.includes('nodash')) uuid = uuid.replace(/-/g, '');
            if (uuidFormat.includes('upper')) uuid = uuid.toUpperCase();

            uuids.push(uuid);
        }
        setOutput(uuids.join('\n'));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <ToolCard
            title="随机数 & UUID 生成器"
            description="生成各种格式的随机数字、密码和唯一标识符 (UUID)"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Random Numbers Section */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Dices size={20} className="text-[var(--accent-primary)]" /> 随机数字
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>最小值</label>
                                <input type="number" value={min} onChange={e => setMin(parseInt(e.target.value))} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>最大值</label>
                                <input type="number" value={max} onChange={e => setMax(parseInt(e.target.value))} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>生成数量</label>
                                <input type="number" value={count} onChange={e => setCount(parseInt(e.target.value))} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '4px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} /> 不重复
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={sort} onChange={e => setSort(e.target.checked)} /> 自动排序
                            </label>
                        </div>
                        <button onClick={generateRandomNumbers} style={{ width: '100%', background: 'var(--accent-primary)', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 600 }}>
                            生成数字
                        </button>
                    </div>

                    {/* UUID Section */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Fingerprint size={20} className="text-[var(--accent-secondary)]" /> UUID 生成
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>生成数量</label>
                                <input type="number" value={uuidCount} onChange={e => setUuidCount(parseInt(e.target.value))} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '4px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>输出格式</label>
                                <select value={uuidFormat} onChange={e => setUuidFormat(e.target.value)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: '4px' }}>
                                    <option value="lowercase">标准 (小写)</option>
                                    <option value="uppercase">标准 (大写)</option>
                                    <option value="lowercase-nodash">简写 (小写, 无连字符)</option>
                                    <option value="uppercase-nodash">简写 (大写, 无连字符)</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={generateUuids} style={{ width: '100%', background: 'var(--accent-secondary)', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 600 }}>
                            生成 UUID
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>生成结果</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleCopy} style={{ background: 'transparent', color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Copy size={14} /> 复制全部
                            </button>
                            <button onClick={() => setOutput('')} style={{ background: 'transparent', color: 'var(--error-color)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Trash2 size={14} /> 清空
                            </button>
                        </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <MonacoEditor value={output} readOnly language="text" />
                    </div>
                </div>

            </div>
        </ToolCard>
    );
};

export default RandomTool;
