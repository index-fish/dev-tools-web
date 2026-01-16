import React, { useState } from 'react';
import MonacoEditor from '../components/Editor';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import { Copy, Trash2 } from 'lucide-react';

// Simplified multi-base implementations or placeholders
const BaseMultiTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [base, setBase] = useState('base16');

    const handleProcess = async () => {
        if (!input) return;
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();

            if (base === 'base16') {
                if (mode === 'encode') {
                    setOutput(Array.from(encoder.encode(input)).map(b => b.toString(16).padStart(2, '0')).join(''));
                } else {
                    const bytes = input.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
                    setOutput(decoder.decode(new Uint8Array(bytes)));
                }
            } else if (base === 'base32') {
                const base32 = (await import('hi-base32')).default;
                if (mode === 'encode') {
                    setOutput(base32.encode(input));
                } else {
                    setOutput(decoder.decode(new Uint8Array(base32.decode.asBytes(input))));
                }
            } else if (base === 'base58' || base === 'base62') {
                const basex = (await import('base-x')).default;
                const ALPHABET = base === 'base58'
                    ? '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
                    : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const b = basex(ALPHABET);

                if (mode === 'encode') {
                    setOutput(b.encode(Buffer.from(input)));
                } else {
                    setOutput(decoder.decode(b.decode(input)));
                }
            }
        } catch (e: any) {
            setOutput(`处理失败: ${e.message}`);
        }
    };

    return (
        <ToolLayout
            title="多进制编码"
            description="支持 Base16, Base32, Base58, Base62 等多种格式的互相转换。"
            header={
                <>
                    <select value={mode} onChange={e => setMode(e.target.value as any)} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px' }}>
                        <option value="encode">编码 (Encode)</option>
                        <option value="decode">解码 (Decode)</option>
                    </select>
                    <select value={base} onChange={e => setBase(e.target.value)} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px' }}>
                        <option value="base16">Base16 (Hex)</option>
                        <option value="base32">Base32</option>
                        <option value="base58">Base58</option>
                        <option value="base62">Base62</option>
                    </select>
                    <button onClick={handleProcess} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '8px 24px', borderRadius: '8px', fontWeight: 600 }}>开始处理</button>
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)' }}><Trash2 size={16} /></button>
                </>
            }
            splitId="base-multi-tool"
        >
            <ToolPane title="输入数据" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
            </ToolPane>
            <ToolPane
                title="结果"
                style={{ paddingLeft: '4px' }}
                extra={
                    <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}>
                        <Copy size={14} /> 复制
                    </button>
                }
            >
                <MonacoEditor value={output} readOnly language="text" />
            </ToolPane>
        </ToolLayout>
    );
};

export default BaseMultiTool;
