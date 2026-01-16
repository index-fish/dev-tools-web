import React, { useState } from 'react';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
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
        <ToolLayout
            title="Base64 编码/解码"
            description="Base64 编码与解码工具，支持 UTF-8 中文字符。"
            header={
                <>
                    <button
                        onClick={handleEncode}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--accent-gradient)', color: 'white',
                            padding: '10px 24px', borderRadius: '10px', fontWeight: 700
                        }}
                    >
                        <Upload size={18} /> 编码
                    </button>
                    <button
                        onClick={handleDecode}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)',
                            padding: '10px 24px', borderRadius: '10px', fontWeight: 700
                        }}
                    >
                        <Download size={18} /> 解码
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
            splitId="base64-tool"
        >
            <ToolPane title="输入文本 / Base64" style={{ paddingRight: '4px' }}>
                <MonacoEditor
                    value={input}
                    onChange={(v) => setInput(v || '')}
                    language="text"
                />
            </ToolPane>
            <ToolPane
                title="输出结果"
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
                    language="text"
                />
            </ToolPane>
        </ToolLayout>
    );
};

export default Base64Tool;
