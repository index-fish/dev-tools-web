import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { useTools } from '../store/ToolContext';
import CryptoJS from 'crypto-js';
import { Lock, Unlock, RefreshCw, Copy, Trash2 } from 'lucide-react';

const AesTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [key, setKey] = useState('');
    const [iv, setIv] = useState('');
    const [mode, setMode] = useState('CBC');
    const [padding, setPadding] = useState('Pkcs7');
    const [outFormat, setOutFormat] = useState('base64');

    const getOptions = () => {
        return {
            iv: iv ? CryptoJS.enc.Utf8.parse(iv) : undefined,
            mode: (CryptoJS.mode as any)[mode],
            padding: (CryptoJS.pad as any)[padding]
        };
    };

    const { activeTool } = useTools();

    const handleEncrypt = () => {
        try {
            if (!input || !key) return;
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            let encrypted;
            switch (activeTool) {
                case 'aes': encrypted = CryptoJS.AES.encrypt(input, keyBytes, getOptions()); break;
                case 'des': encrypted = CryptoJS.DES.encrypt(input, keyBytes, getOptions()); break;
                case 'tripledes': encrypted = CryptoJS.TripleDES.encrypt(input, keyBytes, getOptions()); break;
                case 'rc4': encrypted = CryptoJS.RC4.encrypt(input, keyBytes, getOptions()); break;
                case 'rabbit': encrypted = CryptoJS.Rabbit.encrypt(input, keyBytes, getOptions()); break;
                default: encrypted = CryptoJS.AES.encrypt(input, keyBytes, getOptions());
            }
            setOutput(outFormat === 'hex' ? encrypted.ciphertext.toString() : encrypted.toString());
        } catch (e: any) {
            setOutput(`加密失败: ${e.message}`);
        }
    };

    const handleDecrypt = () => {
        try {
            if (!input || !key) return;
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            const cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: outFormat === 'hex' ? CryptoJS.enc.Hex.parse(input) : CryptoJS.enc.Base64.parse(input)
            });
            let decrypted;
            switch (activeTool) {
                case 'aes': decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, getOptions()); break;
                case 'des': decrypted = CryptoJS.DES.decrypt(cipherParams, keyBytes, getOptions()); break;
                case 'tripledes': decrypted = CryptoJS.TripleDES.decrypt(cipherParams, keyBytes, getOptions()); break;
                case 'rc4': decrypted = CryptoJS.RC4.decrypt(cipherParams, keyBytes, getOptions()); break;
                case 'rabbit': decrypted = CryptoJS.Rabbit.decrypt(cipherParams, keyBytes, getOptions()); break;
                default: decrypted = CryptoJS.AES.decrypt(cipherParams, keyBytes, getOptions());
            }
            setOutput(decrypted.toString(CryptoJS.enc.Utf8));
        } catch (e: any) {
            setOutput(`解密失败: ${e.message}`);
        }
    };

    const generateRandomKey = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let newKey = '', newIv = '';
        for (let i = 0; i < 16; i++) {
            newKey += chars.charAt(Math.floor(Math.random() * chars.length));
            newIv += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setKey(newKey);
        setIv(newIv);
    };

    return (
        <ToolCard
            title="AES 加密/解密"
            description="高级加密标准 (Advanced Encryption Standard)，支持多种模式和填充方式，确保数据安全。"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0 }}>

                {/* Settings Bar */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.25rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px', border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>密钥 (Key)</label>
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="16/24/32位密钥"
                            style={{
                                width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>向量 (IV)</label>
                        <input
                            type="text"
                            value={iv}
                            onChange={(e) => setIv(e.target.value)}
                            placeholder="16位向量"
                            style={{
                                width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>配置选项</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }}
                            >
                                <option value="CBC">CBC</option>
                                <option value="ECB">ECB</option>
                                <option value="CFB">CFB</option>
                                <option value="OFB">OFB</option>
                                <option value="CTR">CTR</option>
                            </select>
                            <select
                                value={padding}
                                onChange={(e) => setPadding(e.target.value)}
                                style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }}
                            >
                                <option value="Pkcs7">PKCS7</option>
                                <option value="ZeroPadding">ZeroPadding</option>
                                <option value="NoPadding">NoPadding</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        onClick={handleEncrypt}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--accent-gradient)', color: 'white',
                            padding: '10px 24px', borderRadius: '10px', fontWeight: 700,
                            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        <Lock size={18} /> 加密
                    </button>
                    <button
                        onClick={handleDecrypt}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                            padding: '10px 24px', borderRadius: '10px', fontWeight: 700,
                            border: '1px solid var(--accent-primary)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Unlock size={18} /> 解密
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button
                        onClick={generateRandomKey}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            color: 'var(--text-muted)', fontSize: '0.85rem'
                        }}
                    >
                        <RefreshCw size={16} /> 随机密钥
                    </button>
                </div>

                {/* Editors */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>原文 / 密文</span>
                            <button
                                onClick={() => setInput('')}
                                style={{ color: 'var(--error-color)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <Trash2 size={14} /> 清空
                            </button>
                        </div>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <MonacoEditor value={input} onChange={(v) => setInput(v || '')} language="text" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>处理结果</span>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select
                                    value={outFormat}
                                    onChange={(e) => setOutFormat(e.target.value)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700 }}
                                >
                                    <option value="base64">BASE64</option>
                                    <option value="hex">HEX</option>
                                </select>
                                <button
                                    onClick={() => navigator.clipboard.writeText(output)}
                                    style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Copy size={14} /> 复制
                                </button>
                            </div>
                        </div>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <MonacoEditor value={output} readOnly language="text" />
                        </div>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
};

export default AesTool;
