import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import CryptoJS from 'crypto-js';
import { ShieldCheck, Trash2, Copy } from 'lucide-react';

const HashTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState({
        md5: '',
        sha1: '',
        sha256: '',
        sha512: ''
    });

    const calculateHash = () => {
        if (!input) return;
        setResults({
            md5: CryptoJS.MD5(input).toString(),
            sha1: CryptoJS.SHA1(input).toString(),
            sha256: CryptoJS.SHA256(input).toString(),
            sha512: CryptoJS.SHA512(input).toString()
        });
    };

    const clear = () => {
        setInput('');
        setResults({ md5: '', sha1: '', sha256: '', sha512: '' });
    };

    const copy = (val: string) => {
        navigator.clipboard.writeText(val);
    };

    const HashResult = ({ label, value }: { label: string, value: string }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
                {value && (
                    <button onClick={() => copy(value)} style={{ background: 'transparent', color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={12} /> 复制
                    </button>
                )}
            </div>
            <input
                readOnly
                value={value}
                placeholder={`等待计算...`}
                style={{
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px',
                    fontFamily: 'monospace', fontSize: '0.9rem'
                }}
            />
        </div>
    );

    return (
        <ToolCard
            title="MD5 / SHA 哈希计算"
            description="常用的摘要算法，用于校验数据完整性或简单的单向加密"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0 }}>
                <div style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>输入文本</label>
                    <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <MonacoEditor value={input} onChange={(v) => setInput(v || '')} language="text" />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={calculateHash}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--accent-primary)', color: 'white',
                            padding: '8px 16px', borderRadius: '6px', fontWeight: 500
                        }}
                    >
                        <ShieldCheck size={18} /> 计算哈希
                    </button>
                    <button onClick={clear} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                        padding: '8px 16px', borderRadius: '6px'
                    }}>
                        <Trash2 size={18} /> 清空
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', overflowY: 'auto', paddingRight: '4px' }}>
                    <HashResult label="MD5" value={results.md5} />
                    <HashResult label="SHA1" value={results.sha1} />
                    <HashResult label="SHA256" value={results.sha256} />
                    <HashResult label="SHA512" value={results.sha512} />
                </div>
            </div>
        </ToolCard>
    );
};

export default HashTool;
