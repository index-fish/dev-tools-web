import React, { useState } from 'react';
import MonacoEditor from '../components/Editor';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import { Trash2, Copy, Check, Info } from 'lucide-react';

const JsonFormatter: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const formatJson = (space: number = 4) => {
        try {
            if (!input) return;
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, space));
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError(null);
    };

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
        }
    };

    return (
        <ToolLayout
            title="JSON 格式化"
            description="清理并美化您的 JSON 代码，支持缩进调整和错误校验。"
            header={
                <>
                    <button
                        onClick={() => formatJson(4)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--accent-gradient)', color: 'white',
                            padding: '10px 20px', borderRadius: '10px', fontWeight: 600
                        }}
                    >
                        <Check size={18} /> 格式化 (4空格)
                    </button>
                    <button
                        onClick={() => formatJson(2)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                            padding: '10px 20px', borderRadius: '10px', fontWeight: 600,
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        2空格
                    </button>
                    <button
                        onClick={() => {
                            try {
                                const parsed = JSON.parse(input);
                                setOutput(JSON.stringify(parsed));
                                setError(null);
                            } catch (e: any) { setError(e.message); }
                        }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                            padding: '10px 20px', borderRadius: '10px', fontWeight: 600,
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        压缩
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button
                        onClick={handleClear}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error-color)', fontSize: '0.85rem' }}
                    >
                        <Trash2 size={16} /> 清空
                    </button>
                </>
            }
            splitId="json-formatter"
        >
            <ToolPane title="输入 JSON" style={{ paddingRight: '4px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
                    {error && (
                        <div style={{
                            padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.1)',
                            border: '1px solid var(--error-color)', borderRadius: '10px',
                            color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'center'
                        }}>
                            <Info size={16} />
                            <span>JSON 格式错误: {error}</span>
                        </div>
                    )}
                    <MonacoEditor
                        value={input}
                        onChange={(v) => setInput(v || '')}
                        language="json"
                    />
                </div>
            </ToolPane>
            <ToolPane
                title="格式化结果"
                style={{ paddingLeft: '4px' }}
                extra={
                    <button
                        onClick={handleCopy}
                        style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <Copy size={14} /> 复制
                    </button>
                }
            >
                <MonacoEditor
                    value={output}
                    readOnly
                    language="json"
                />
            </ToolPane>
        </ToolLayout>
    );
};

export default JsonFormatter;
