import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { Search, TextCursorInput, ListFilter, Trash2 } from 'lucide-react';

const RegexTool: React.FC = () => {
    const [regex, setRegex] = useState('');
    const [flags, setFlags] = useState('g');
    const [testText, setTestText] = useState('');
    const [results, setResults] = useState('');

    const handleTest = () => {
        if (!regex || !testText) return;
        try {
            const re = new RegExp(regex, flags);
            const matches = Array.from(testText.matchAll(re));
            if (matches.length === 0) {
                setResults('未找到匹配项');
            } else {
                const formatted = matches.map((m, i) => {
                    const groupInfo = m.length > 1 ? `\n   分组: ${m.slice(1).map((g, j) => `[${j + 1}]: ${g}`).join(', ')}` : '';
                    return `匹配项 #${i + 1}: "${m[0]}" (位置: ${m.index})${groupInfo}`;
                }).join('\n\n');
                setResults(`找到 ${matches.length} 个匹配项:\n\n${formatted}`);
            }
        } catch (e: any) {
            setResults(`正则表达式错误: ${e.message}`);
        }
    };



    return (
        <ToolCard
            title="正则表达式测试"
            description="在线测试和调试正则表达式，支持匹配项统计、分组查看及常用正则参考。"
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>

                {/* Regex Input Bar */}
                <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>/</span>
                        <input
                            type="text"
                            value={regex}
                            onChange={e => setRegex(e.target.value)}
                            placeholder="在此输入正则表达式..."
                            style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', padding: '12px 25px', borderRadius: '8px', fontSize: '1rem', fontFamily: 'monospace', fontWeight: 600 }}
                        />
                        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>/</span>
                    </div>
                    <input
                        type="text"
                        value={flags}
                        onChange={e => setFlags(e.target.value)}
                        placeholder="flags"
                        style={{ width: '60px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent-secondary)', padding: '12px', borderRadius: '8px', textAlign: 'center', fontFamily: 'monospace' }}
                    />
                    <button onClick={handleTest} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={18} /> 测试
                    </button>
                </div>

                {/* Editors */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <TextCursorInput size={14} /> 待测试文本
                            </span>
                            <button onClick={() => setTestText('')} style={{ color: 'var(--error-color)', fontSize: '0.75rem' }}><Trash2 size={14} /></button>
                        </div>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={testText} onChange={v => setTestText(v || '')} language="text" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ListFilter size={14} /> 匹配结果
                        </span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={results} readOnly language="text" />
                        </div>
                    </div>
                </div>

            </div>
        </ToolCard>
    );
};

export default RegexTool;
