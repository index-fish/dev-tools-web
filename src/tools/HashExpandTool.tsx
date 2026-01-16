import React, { useState } from 'react';
import MonacoEditor from '../components/Editor';
import { useTools } from '../store/ToolContext';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import CryptoJS from 'crypto-js';
import pako from 'pako';
import crc32 from 'crc-32';
import { ShieldCheck, Zap, Trash2, Copy, FileArchive, Upload } from 'lucide-react';

const HashExpandTool: React.FC = () => {
    const { activeTool } = useTools();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [key, setKey] = useState('');
    const [fileInfo, setFileInfo] = useState<{ name: string, size: number } | null>(null);
    const [hashResults, setHashResults] = useState<{ md5: string, sha256: string } | null>(null);

    const processFile = (file: File) => {
        setFileInfo({ name: file.name, size: file.size });
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (result instanceof ArrayBuffer) {
                const wordArray = CryptoJS.lib.WordArray.create(result as any);
                const md5 = CryptoJS.MD5(wordArray).toString();
                const sha256 = CryptoJS.SHA256(wordArray).toString();
                setHashResults({ md5, sha256 });
                setOutput(`文件名: ${file.name}\n文件大小: ${file.size} bytes\n\nMD5: ${md5}\nSHA256: ${sha256}`);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

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

    const getTitle = () => {
        switch (activeTool) {
            case 'hmac': return 'HMAC 加密';
            case 'crc': return 'CRC 校验';
            case 'file-hash': return '文件 Hash 计算';
            case 'gzip': return 'Gzip 压缩/解压';
            default: return '工具';
        }
    };

    const getDescription = () => {
        switch (activeTool) {
            case 'hmac': return '使用密钥的哈希消息认证码，额外安全性保障。';
            case 'crc': return '循环冗余校验，常用于数据传输检错。';
            case 'file-hash': return '计算文件的 MD5、SHA256 等摘要值，验证文件完整性。';
            case 'gzip': return '使用 Gzip 算法对文本进行高效压缩或解压缩。';
            default: return '';
        }
    };

    return (
        <ToolLayout
            title={getTitle()}
            description={getDescription()}
            header={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                    {activeTool === 'hmac' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>HMAC 密钥 (Key)</label>
                            <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="输入加密密钥..." style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', padding: '10px', borderRadius: '8px' }} />
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {activeTool === 'hmac' && <button onClick={handleHmac} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> 计算 HMAC-SHA256</button>}
                        {activeTool === 'crc' && <button onClick={handleCrc} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} /> 计算 CRC32</button>}
                        {activeTool === 'gzip' && (
                            <>
                                <button onClick={() => handleGzip(true)} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><FileArchive size={18} /> Gzip 压缩</button>
                                <button onClick={() => handleGzip(false)} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}>解压缩</button>
                            </>
                        )}
                        <div style={{ flex: 1 }}></div>
                        <button onClick={() => { setInput(''); setOutput(''); setFileInfo(null); setHashResults(null); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={16} /> 清空</button>
                    </div>
                </div>
            }
            splitId="hash-expand-tool"
        >
            <ToolPane
                title={activeTool === 'file-hash' ? '选择文件' : '输入数据'}
                style={{ paddingRight: '4px' }}
                noBorder={activeTool === 'file-hash'}
            >
                {activeTool === 'file-hash' ? (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        style={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                            background: 'rgba(255,255,255,0.02)', cursor: 'pointer', position: 'relative',
                            border: '2px dashed var(--border-color)', borderRadius: '12px'
                        }}
                    >
                        <input type="file" onChange={handleFileSelect} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                        <Upload size={48} color="var(--accent-primary)" opacity={0.5} />
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>点击或拖拽文件到此处</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>支持任意文件类型进行哈希计算</p>
                        </div>
                        {fileInfo && (
                            <div style={{ marginTop: '1rem', padding: '8px 16px', background: 'var(--accent-glow)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent-primary)' }}>
                                <FileArchive size={14} color="var(--accent-primary)" />
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{fileInfo.name} ({Math.round(fileInfo.size / 1024)} KB)</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
                )}
            </ToolPane>
            <ToolPane
                title="结果"
                style={{ paddingLeft: '4px' }}
                extra={
                    <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={14} /> 全部复制
                    </button>
                }
            >
                {activeTool === 'file-hash' && hashResults ? (
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-secondary)', height: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>MD5 摘要</span>
                                <button onClick={() => navigator.clipboard.writeText(hashResults.md5)} style={{ color: 'var(--accent-primary)', fontSize: '0.7rem' }}>复制</button>
                            </div>
                            <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all', border: '1px solid var(--border-color)', color: 'var(--accent-primary)' }}>
                                {hashResults.md5}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SHA256 摘要</span>
                                <button onClick={() => navigator.clipboard.writeText(hashResults.sha256)} style={{ color: 'var(--accent-primary)', fontSize: '0.7rem' }}>复制</button>
                            </div>
                            <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all', border: '1px solid var(--border-color)', color: 'var(--accent-primary)' }}>
                                {hashResults.sha256}
                            </div>
                        </div>
                    </div>
                ) : (
                    <MonacoEditor value={output} readOnly language="text" />
                )}
            </ToolPane>
        </ToolLayout>
    );
};

export default HashExpandTool;
