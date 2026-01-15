import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import { Trash2, Copy } from 'lucide-react';
import { useTools } from '../store/ToolContext';

const RadixTool: React.FC = () => {
    const { activeTool } = useTools();
    const [decimal, setDecimal] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const [hex, setHex] = useState('');

    // RMB Tool State
    const [amount, setAmount] = useState('');
    const [rmbResult, setRmbResult] = useState('');

    const handleDecimalChange = (val: string) => {
        setDecimal(val);
        const n = parseInt(val, 10);
        if (!isNaN(n)) {
            setBinary(n.toString(2));
            setOctal(n.toString(8));
            setHex(n.toString(16).toUpperCase());
        } else {
            setBinary(''); setOctal(''); setHex('');
        }
    };

    const convertRMB = (numStr: string) => {
        const num = parseFloat(numStr);
        if (isNaN(num)) return '';
        const fraction = ['角', '分'];
        const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
        let s = '';
        for (let i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        let n = Math.floor(num);
        for (let i = 0; i < unit[0].length && n > 0; i++) {
            let p = '';
            for (let j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    };

    const handleRmbChange = (val: string) => {
        setAmount(val);
        setRmbResult(convertRMB(val));
    };

    const RadixItem = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'monospace' }}
                />
                <button
                    onClick={() => navigator.clipboard.writeText(value)}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }}
                >
                    <Copy size={16} />
                </button>
            </div>
        </div>
    );

    if (activeTool === 'rmb') {
        return (
            <ToolCard title="人民币大写转换" description="将阿拉伯数字金额转换为中文大写金额，符合财务规范。">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>输入金额 (数字)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => handleRmbChange(e.target.value)}
                                placeholder="如: 1234.56"
                                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', padding: '15px', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 700 }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>大写金额</label>
                            <div style={{ minHeight: '80px', background: 'rgba(255,255,255,0.02)', border: '2px dashed var(--accent-glow)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'center', wordBreak: 'break-all' }}>
                                {rmbResult || '壹仟贰佰叁拾肆元伍角陆分'}
                            </div>
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(rmbResult)}
                            style={{ alignSelf: 'center', background: 'var(--accent-gradient)', color: 'white', padding: '12px 40px', borderRadius: '12px', fontWeight: 700, marginTop: '1rem' }}
                        >
                            复制大写金额
                        </button>
                    </div>
                </div>
            </ToolCard>
        );
    }

    return (
        <ToolCard title="进制转换" description="支持 2进制、8进制、10进制、16进制之间的快速互相转换。">
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%', padding: '1rem' }}>
                <RadixItem label="10 进制 (Decimal)" value={decimal} onChange={handleDecimalChange} />
                <RadixItem label="2 进制 (Binary)" value={binary} onChange={v => handleDecimalChange(parseInt(v, 2).toString())} />
                <RadixItem label="8 进制 (Octal)" value={octal} onChange={v => handleDecimalChange(parseInt(v, 8).toString())} />
                <RadixItem label="16 进制 (Hexadecimal)" value={hex} onChange={v => handleDecimalChange(parseInt(v, 16).toString())} />
                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button onClick={() => handleDecimalChange('')} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error-color)', fontWeight: 600 }}>
                        <Trash2 size={18} /> 清空所有输入
                    </button>
                </div>
            </div>
        </ToolCard>
    );
};

export default RadixTool;
