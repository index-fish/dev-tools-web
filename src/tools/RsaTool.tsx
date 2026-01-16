import React, { useState } from 'react';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import MonacoEditor from '../components/Editor';
import { KEYUTIL, KJUR, hextob64 } from 'jsrsasign';
import { ShieldCheck, Lock, Unlock, Copy, RefreshCw } from 'lucide-react';

const RsaTool: React.FC = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [signature, setSignature] = useState('');
    const [keySize, setKeySize] = useState(1024);

    const generateKeys = () => {
        try {
            const keys = KEYUTIL.generateKeypair("RSA", keySize);
            const pub = KEYUTIL.getPEM(keys.pubKeyObj);
            const priv = KEYUTIL.getPEM(keys.prvKeyObj, "PKCS8PRV");
            setPublicKey(pub);
            setPrivateKey(priv);
            setOutput('密钥对生成成功');
        } catch (e: any) {
            setOutput(`生成密钥失败: ${e.message}`);
        }
    };

    const handleEncrypt = () => {
        if (!input || !publicKey) return;
        try {
            const pubObj = KEYUTIL.getKey(publicKey);
            const encryptedHex = KJUR.crypto.Cipher.encrypt(input, pubObj as any);
            setOutput(hextob64(encryptedHex));
        } catch (e: any) {
            setOutput(`加密失败: ${e.message}`);
        }
    };

    const handleDecrypt = () => {
        if (!input || !privateKey) return;
        try {
            const privObj = KEYUTIL.getKey(privateKey);
            const decrypted = KJUR.crypto.Cipher.decrypt(input, privObj as any);
            setOutput(decrypted || '解密结果为空');
        } catch (e: any) {
            setOutput(`解密失败: ${e.message}`);
        }
    };

    const handleSign = () => {
        if (!input || !privateKey) return;
        try {
            const sig = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
            sig.init(privateKey);
            sig.updateString(input);
            const sigVal = sig.sign();
            setOutput(sigVal);
            setSignature(sigVal);
        } catch (e: any) {
            setOutput(`签名失败: ${e.message}`);
        }
    };

    const handleVerify = () => {
        if (!input || !publicKey || !signature) {
            setOutput('验证失败: 需要待验签数据、公钥以及签名值');
            return;
        }
        try {
            const sig = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
            sig.init(publicKey);
            sig.updateString(input);
            const isValid = sig.verify(signature);
            setOutput(isValid ? '验证成功：签名有效' : '验证失败：签名无效');
        } catch (e: any) {
            setOutput(`验证过程出错: ${e.message}`);
        }
    };

    return (
        <ToolLayout
            title="RSA 加密/解密 & 签名"
            description="RSA 非对称加密算法。支持密钥对生成、公钥加密、私钥解密以及数字签名。"
            header={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                    {/* Key Config */}
                    <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '15px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <select value={keySize} onChange={e => setKeySize(parseInt(e.target.value))} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '6px' }}>
                                    <option value={1024}>1024 bit</option>
                                    <option value={2048}>2048 bit</option>
                                </select>
                                <button onClick={generateKeys} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '8px 20px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <RefreshCw size={16} /> 生成密钥对
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>公钥 (Public Key - PEM)</span>
                                <textarea value={publicKey} onChange={e => setPublicKey(e.target.value)} style={{ height: '100px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', resize: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>私钥 (Private Key - PEM)</span>
                                <textarea value={privateKey} onChange={e => setPrivateKey(e.target.value)} style={{ height: '100px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace', resize: 'none' }} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleEncrypt} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={18} /> 公钥加密</button>
                            <button onClick={handleDecrypt} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Unlock size={18} /> 私钥解密</button>
                            <button onClick={handleSign} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> 私钥签名</button>
                            <button onClick={handleVerify} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> 验证签名</button>
                        </div>
                        <div style={{ flex: 1 }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '300px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>签名值 (Signature - Hex)</span>
                            <input type="text" value={signature} onChange={e => setSignature(e.target.value)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', fontFamily: 'monospace' }} placeholder="签名/验签时使用的签名值" />
                        </div>
                    </div>
                </div>
            }
            splitId="rsa-tool"
        >
            <ToolPane title="待处理数据" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
            </ToolPane>
            <ToolPane
                title="输出结果"
                style={{ paddingLeft: '4px' }}
                extra={<button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}><Copy size={14} /> 复制</button>}
            >
                <MonacoEditor value={output} readOnly language="text" />
            </ToolPane>
        </ToolLayout>
    );
};

export default RsaTool;
