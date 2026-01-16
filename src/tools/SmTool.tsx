import React, { useState } from 'react';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import MonacoEditor from '../components/Editor';
import { sm2, sm3, sm4 } from 'sm-crypto';
import { ShieldCheck, Lock, Unlock, RefreshCw, Copy, Trash2, Key } from 'lucide-react';

const SmTool: React.FC = () => {
    const [tab, setTab] = useState<'sm2' | 'sm3' | 'sm4'>('sm4');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [key, setKey] = useState('');
    const [iv, setIv] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [keyFormat, setKeyFormat] = useState('hex');
    const [ivFormat, setIvFormat] = useState('hex');

    const parseToHex = (data: string, format: string) => {
        if (!data) return '';
        if (format === 'hex') return data;
        try {
            if (format === 'base64') {
                const binary = atob(data);
                let hex = '';
                for (let i = 0; i < binary.length; i++) {
                    const h = binary.charCodeAt(i).toString(16);
                    hex += h.length === 1 ? '0' + h : h;
                }
                return hex;
            }
            if (format === 'utf8') {
                let hex = '';
                for (let i = 0; i < data.length; i++) {
                    const h = data.charCodeAt(i).toString(16);
                    hex += h.length === 1 ? '0' + h : h;
                }
                return hex;
            }
        } catch (e) {
            return '';
        }
        return '';
    };

    const handleSm3 = () => {
        if (!input) return;
        try {
            const hash = sm3(input);
            setOutput(hash);
        } catch (e: any) {
            setOutput(`SM3 计算失败: ${e.message}`);
        }
    };

    const handleSm4Encrypt = () => {
        if (!input || !key) return;
        try {
            const hexKey = parseToHex(key, keyFormat);
            const hexIv = parseToHex(iv, ivFormat);
            if (!hexKey) throw new Error('无效的密钥格式');
            const options: any = { padding: 'pkcs7' };
            if (hexIv) options.iv = hexIv;
            const encrypted = sm4.encrypt(input, hexKey, options);
            setOutput(encrypted);
        } catch (e: any) {
            setOutput(`SM4 加密失败: ${e.message}`);
        }
    };

    const handleSm4Decrypt = () => {
        if (!input || !key) return;
        try {
            const hexKey = parseToHex(key, keyFormat);
            const hexIv = parseToHex(iv, ivFormat);
            if (!hexKey) throw new Error('无效的密钥格式');
            const options: any = { padding: 'pkcs7' };
            if (hexIv) options.iv = hexIv;
            const decrypted = sm4.decrypt(input, hexKey, options);
            setOutput(decrypted);
        } catch (e: any) {
            setOutput(`SM4 解密失败: ${e.message}`);
        }
    };

    const handleSm2Encrypt = () => {
        if (!input || !publicKey) return;
        try {
            const encrypted = sm2.doEncrypt(input, publicKey);
            setOutput(encrypted);
        } catch (e: any) {
            setOutput(`SM2 加密失败: ${e.message}`);
        }
    };

    const handleSm2Decrypt = () => {
        if (!input || !privateKey) return;
        try {
            const decrypted = sm2.doDecrypt(input, privateKey);
            setOutput(decrypted);
        } catch (e: any) {
            setOutput(`SM2 解密失败: ${e.message}`);
        }
    };

    const generateSm2Key = () => {
        const keypair = sm2.generateKeyPairHex();
        setPublicKey(keypair.publicKey);
        setPrivateKey(keypair.privateKey);
    };

    const generateSm4Key = () => {
        const chars = '0123456789abcdef';
        let res = '';
        for (let i = 0; i < 32; i++) res += chars[Math.floor(Math.random() * 16)];
        setKey(res);
        let resIv = '';
        for (let i = 0; i < 32; i++) resIv += chars[Math.floor(Math.random() * 16)];
        setIv(resIv);
    };

    const NavTab = ({ id, label }: { id: typeof tab, label: string }) => (
        <button
            onClick={() => { setTab(id); setOutput(''); }}
            style={{
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: tab === id ? 'var(--accent-primary)' : 'var(--text-muted)',
                background: tab === id ? 'var(--accent-glow)' : 'transparent',
                border: tab === id ? '1px solid var(--accent-primary)' : '1px solid transparent',
            }}
        >
            {label}
        </button>
    );

    return (
        <ToolLayout
            title="国密算法 (GuoMi)"
            description="中国国家密码标准算法，包含 SM2 (非对称), SM3 (哈希摘要), SM4 (对称加密)。"
            header={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '10px', padding: '4px', background: 'var(--bg-secondary)', borderRadius: '12px', width: 'fit-content' }}>
                        <NavTab id="sm4" label="SM4 对称加密" />
                        <NavTab id="sm2" label="SM2 非对称加密" />
                        <NavTab id="sm3" label="SM3 哈希" />
                    </div>

                    <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        {tab === 'sm4' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>密钥 (Key)</label>
                                        <select
                                            value={keyFormat}
                                            onChange={(e) => setKeyFormat(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            <option value="hex">HEX</option>
                                            <option value="base64">BASE64</option>
                                            <option value="utf8">UTF8</option>
                                        </select>
                                    </div>
                                    <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder={keyFormat === 'hex' ? "32位十六进制字符串" : `输入 ${keyFormat.toUpperCase()} 格式密钥`} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>向量 (IV)</label>
                                        <select
                                            value={ivFormat}
                                            onChange={(e) => setIvFormat(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            <option value="hex">HEX</option>
                                            <option value="base64">BASE64</option>
                                            <option value="utf8">UTF8</option>
                                        </select>
                                    </div>
                                    <input type="text" value={iv} onChange={e => setIv(e.target.value)} placeholder={ivFormat === 'hex' ? "32位十六进制字符串" : `输入 ${ivFormat.toUpperCase()} 格式向量`} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }} />
                                </div>
                                <button onClick={generateSm4Key} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} title="生成随机 Hex 密钥">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        )}
                        {tab === 'sm2' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>公钥 (Hex)</label>
                                    <input type="text" value={publicKey} onChange={e => setPublicKey(e.target.value)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>私钥 (Hex)</label>
                                    <input type="text" value={privateKey} onChange={e => setPrivateKey(e.target.value)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }} />
                                </div>
                                <button onClick={generateSm2Key} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} title="生成 SM2 密钥对">
                                    <Key size={18} />
                                </button>
                            </div>
                        )}
                        {tab === 'sm3' && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                SM3 算法不需要额外的密钥或配置。直接在下方输入文本即可计算 256 位摘要。
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {tab === 'sm4' && (
                            <>
                                <button onClick={handleSm4Encrypt} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}><Lock size={18} />加密</button>
                                <button onClick={handleSm4Decrypt} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}><Unlock size={18} />解密</button>
                            </>
                        )}
                        {tab === 'sm2' && (
                            <>
                                <button onClick={handleSm2Encrypt} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}><Lock size={18} />公钥加密</button>
                                <button onClick={handleSm2Decrypt} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}><Unlock size={18} />私钥解密</button>
                            </>
                        )}
                        {tab === 'sm3' && (
                            <button onClick={handleSm3} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700 }}><ShieldCheck size={18} />计算哈希</button>
                        )}
                        <div style={{ flex: 1 }}></div>
                        <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Trash2 size={16} /> 清空
                        </button>
                    </div>
                </div>
            }
            splitId="sm-tool"
        >
            <ToolPane title="输入数据" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
            </ToolPane>
            <ToolPane
                title="结果"
                style={{ paddingLeft: '4px' }}
                extra={<button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Copy size={14} /> 复制</button>}
            >
                <MonacoEditor value={output} readOnly language="text" />
            </ToolPane>
        </ToolLayout>
    );
};

export default SmTool;
