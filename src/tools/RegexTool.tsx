import React, { useState } from 'react';
import MonacoEditor from '../components/Editor';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import { Search, Trash2 } from 'lucide-react';

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
        <ToolLayout
            title="正则表达式测试"
            description="在线测试和调试正则表达式，支持匹配项统计、分组查看及常用正则参考。"
            header={
                <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
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
            }
            splitId="regex-tool"
        >
            <ToolPane
                title="待测试文本"
                style={{ paddingRight: '4px' }}
                extra={<button onClick={() => setTestText('')} style={{ color: 'var(--error-color)', fontSize: '0.75rem' }}><Trash2 size={14} /></button>}
            >
                <MonacoEditor value={testText} onChange={v => setTestText(v || '')} language="text" />
            </ToolPane>
            <ToolPane
                title="匹配结果"
                style={{ paddingLeft: '4px' }}
            >
                <MonacoEditor value={results} readOnly language="text" />
            </ToolPane>
        </ToolLayout>
    );
};

export default RegexTool;
