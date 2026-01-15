import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { useTools } from '../store/ToolContext';
import CryptoJS from 'crypto-js';
import pako from 'pako';
import crc32 from 'crc-32';
import { ShieldCheck, Zap, Trash2, Copy, FileArchive } from 'lucide-react';

const HashExpandTool: React.FC = () => {
    const { activeTool } = useTools();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [key, setKey] = useState('');

    const handleHmac = () => {
        if (!input || !key) return;
        try {
            // Default to SHA256 for HMAC
            const hash = CryptoJS.HmacSHA256(input, key).toString();
            setOutput(hash);
        } catch (e: any) {
            setOutput(`HMAC 计算失败: ${e.message}`);
        }
    };

    const handleCrc = () => {
        if (!input) return;
        try {
            const checksum = crc32.str(input);
            // Convert to unsigned hex
            setOutput((checksum >>> 0).toString(16).toUpperCase());
        } catch (e: any) {
            setOutput(`CRC 校验失败: ${e.message}`);
        }
    };

    const handleGzip = (compress: boolean) => {
        if (!input) return;
        try {
            if (compress) {
                const compressed = pako.gzip(input);
                const base64 = btoa(String.fromCharCode.apply(null, Array.from(compressed)));
                setOutput(base64);
            } else {
                const binary = atob(input);
                const charData = Array.from(binary).map(x => x.charCodeAt(0));
                const decompressed = pako.ungzip(new Uint8Array(charData));
                setOutput(new TextDecoder().decode(decompressed));
            }
        } catch (e: any) {
            setOutput(`Gzip 处理失败: ${e.message}`);
        }
    };

    return (
        <ToolCard
            title={activeTool === 'hmac' ? 'HMAC 加密' : activeTool === 'crc' ? 'CRC 校验' : 'Gzip 压缩/解压'}
            description={activeTool === 'hmac' ? '使用密钥的哈希消息认证码，额外安全性保障。' : activeTool === 'crc' ? '循环冗余校验，常用于数据传输检错。' : '使用 Gzip 算法对文本进行高效压缩或解压缩。'}
        >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>

                {activeTool === 'hmac' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>HMAC 密钥 (Key)</label>
                        <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="输入加密密钥..." style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', padding: '10px', borderRadius: '8px' }} />
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {activeTool === 'hmac' && <button onClick={handleHmac} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> 计算 HMAC-SHA256</button>}
                    {activeTool === 'crc' && <button onClick={handleCrc} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} /> 计算 CRC32</button>}
                    {activeTool === 'gzip' && (
                        <>
                            <button onClick={() => handleGzip(true)} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><FileArchive size={18} /> Gzip 压缩</button>
                            <button onClick={() => handleGzip(false)} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}>解压缩</button>
                        </>
                    )}
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}><Trash2 size={16} /> 清空</button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>输入数据</span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>结果</span>
                            <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}><Copy size={14} /> 复制</button>
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

export default HashExpandTool;
