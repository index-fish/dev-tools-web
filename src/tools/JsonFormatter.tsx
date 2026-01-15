import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
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
        <ToolCard
            title="JSON 格式化"
            description="清理并美化您的 JSON 代码，支持缩进调整和错误校验。"
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>

                {/* Toolbar */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        padding: '1rem', background: 'rgba(244, 63, 94, 0.1)',
                        border: '1px solid var(--error-color)', borderRadius: '10px',
                        color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'center'
                    }}>
                        <Info size={18} />
                        <span>JSON 格式错误: {error}</span>
                    </div>
                )}

                {/* Editors */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>输入 JSON</span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor
                                value={input}
                                onChange={(v) => setInput(v || '')}
                                language="json"
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>格式化结果</span>
                            <button
                                onClick={handleCopy}
                                style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Copy size={14} /> 复制
                            </button>
                        </div>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor
                                value={output}
                                readOnly
                                language="json"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
};

export default JsonFormatter;
