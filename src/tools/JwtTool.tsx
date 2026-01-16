import React, { useState } from 'react';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import MonacoEditor from '../components/Editor';
import { ShieldAlert, Eye } from 'lucide-react';

const JwtTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [signature, setSignature] = useState('');
    const [error, setError] = useState<string | null>(null);

    const parseJwt = () => {
        if (!input) return;
        try {
            const parts = input.split('.');
            if (parts.length !== 3) {
                throw new Error('无效的 JWT 格式（必须包含三个部分）');
            }

            const decode = (str: string) => {
                try {
                    return JSON.stringify(JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/'))), null, 4);
                } catch (e) {
                    return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
                }
            };

            setHeader(decode(parts[0]));
            setPayload(decode(parts[1]));
            setSignature(parts[2]);
            setError(null);
        } catch (e: any) {
            setError(e.message);
            setHeader('');
            setPayload('');
            setSignature('');
        }
    };

    return (
        <ToolLayout
            title="JWT 解析器"
            description="解码 JSON Web Token (JWT)，查看其 Header、Payload 和签名部分的内容。"
            header={
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>输入 JWT Token</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="在此粘贴 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                style={{ flex: 1, height: '80px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'monospace', resize: 'none' }}
                            />
                            <button onClick={parseJwt} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '0 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Eye size={18} /> 解析
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid var(--error-color)', borderRadius: '10px', color: 'var(--error-color)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <ShieldAlert size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SIGNATURE (签名)</span>
                        <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', color: 'var(--accent-secondary)' }}>
                            {signature || '等待解析...'}
                        </div>
                    </div>
                </div>
            }
            splitId="jwt-tool"
        >
            <ToolPane title="HEADER (ALGORITHM & TOKEN TYPE)" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={header} readOnly language="json" />
            </ToolPane>
            <ToolPane title="PAYLOAD (DATA)" style={{ paddingLeft: '4px' }}>
                <MonacoEditor value={payload} readOnly language="json" />
            </ToolPane>
        </ToolLayout>
    );
};

export default JwtTool;
