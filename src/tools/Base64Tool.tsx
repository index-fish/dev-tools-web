import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { Upload, Download, Trash2, Copy } from 'lucide-react';

const Base64Tool: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleEncode = () => {
        try {
            if (!input) return;
            // Handle Unicode correctly
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
        } catch (e: any) {
            setOutput(`编码失败: ${e.message}`);
        }
    };

    const handleDecode = () => {
        try {
            if (!input) return;
            const decoded = decodeURIComponent(escape(atob(input)));
            setOutput(decoded);
        } catch (e: any) {
            setOutput(`解码失败: ${e.message}`);
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
    };

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
        }
    };

    return (
        <ToolCard
            title="Base64 编码/解码"
            description="Base64 编码与解码工具，支持 UTF-8 中文字符"
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>输入文本 / Base64</label>
                    <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <MonacoEditor
                            value={input}
                            onChange={(v) => setInput(v || '')}
                            language="text"
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleEncode}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--accent-primary)', color: 'white',
                            padding: '8px 16px', borderRadius: '6px', fontWeight: 500
                        }}
                    >
                        <Upload size={18} /> 编码
                    </button>
                    <button
                        onClick={handleDecode}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--accent-secondary)', color: 'white',
                            padding: '8px 16px', borderRadius: '6px', fontWeight: 500
                        }}
                    >
                        <Download size={18} /> 解码
                    </button>
                    <button
                        onClick={handleClear}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                            padding: '8px 16px', borderRadius: '6px'
                        }}
                    >
                        <Trash2 size={18} /> 清空
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>输出结果</label>
                        <button
                            onClick={handleCopy}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                fontSize: '0.75rem', color: 'var(--accent-primary)',
                                background: 'transparent', padding: '2px 8px'
                            }}
                        >
                            <Copy size={14} /> 复制
                        </button>
                    </div>
                    <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <MonacoEditor
                            value={output}
                            readOnly
                            language="text"
                        />
                    </div>
                </div>
            </div>
        </ToolCard>
    );
};

export default Base64Tool;
