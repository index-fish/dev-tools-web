import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { useTools } from '../store/ToolContext';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';

const EncodingTool: React.FC = () => {
    const { activeTool } = useTools();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleProcess = (encode: boolean) => {
        if (!input) return;
        try {
            let result = '';
            switch (activeTool) {
                case 'url':
                    result = encode ? encodeURIComponent(input) : decodeURIComponent(input);
                    break;
                case 'unicode':
                    if (encode) {
                        result = input.replace(/[^\u0000-\u007f]/g, c => "\\u" + ("000" + c.charCodeAt(0).toString(16)).slice(-4));
                    } else {
                        result = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
                    }
                    break;
                case 'hex':
                    if (encode) {
                        result = Array.from(new TextEncoder().encode(input)).map(b => b.toString(16).padStart(2, '0')).join(' ');
                    } else {
                        const bytes = input.replace(/\s+/g, '').match(/.{1,2}/g)?.map(hex => parseInt(hex, 16)) || [];
                        result = new TextDecoder().decode(new Uint8Array(bytes));
                    }
                    break;
                default:
                    result = "暂未实现";
            }
            setOutput(result);
        } catch (e: any) {
            setOutput(`处理失败: ${e.message}`);
        }
    };

    const getToolTitle = () => {
        switch (activeTool) {
            case 'url': return 'URL 编码/解码';
            case 'unicode': return 'Unicode 编码/解码';
            case 'hex': return 'Hex 编码/解码';
            default: return '编码/解码';
        }
    };

    const getToolDescription = () => {
        switch (activeTool) {
            case 'url': return 'URL 安全编码与解码，常用于处理网页链接参数。';
            case 'unicode': return '转换文本为 Unicode 转义序列 (\\uXXXX) 或反向转换。';
            case 'hex': return '将文本转换为十六进制字节表示或反向转换。';
            default: return '数据格式转换工具。';
        }
    };

    return (
        <ToolCard title={getToolTitle()} description={getToolDescription()}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleProcess(true)} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        编码 <ArrowRightLeft size={18} />
                    </button>
                    <button onClick={() => handleProcess(false)} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        解码 <ArrowRightLeft size={18} />
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={16} /> 清空
                    </button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>输入数据</span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>输出结果</span>
                            <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Copy size={14} /> 复制
                            </button>
                        </div>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={output} readOnly language="text" />
                        </div>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
};

export default EncodingTool;
