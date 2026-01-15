import React, { useState, useEffect } from 'react';
import ToolCard from '../components/ToolCard';
import { Clock, ArrowRightLeft, RefreshCcw, Copy, Calendar, Timer } from 'lucide-react';

const TimestampTool: React.FC = () => {
    const [now, setNow] = useState(Date.now());
    const [inputTs, setInputTs] = useState(Math.floor(Date.now() / 1000).toString());
    const [inputDate, setInputDate] = useState(new Date().toISOString().replace('T', ' ').slice(0, 19));
    const [output, setOutput] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const convertTsToDate = () => {
        try {
            let ts = parseInt(inputTs);
            if (inputTs.length === 10) ts *= 1000;
            const date = new Date(ts);
            if (isNaN(date.getTime())) throw new Error('无效的时间戳');
            setOutput(
                `日期时间: ${date.toLocaleString('zh-CN')}\n` +
                `ISO格式: ${date.toISOString()}\n` +
                `UTC: ${date.toUTCString()}\n` +
                `时间戳(秒): ${Math.floor(ts / 1000)}\n` +
                `时间戳(毫秒): ${ts}`
            );
        } catch (e: any) {
            setOutput(`转换失败: ${e.message}`);
        }
    };

    const convertDateToTs = () => {
        try {
            const date = new Date(inputDate);
            if (isNaN(date.getTime())) throw new Error('无效的日期格式');
            const ts = date.getTime();
            setOutput(
                `时间戳(秒): ${Math.floor(ts / 1000)}\n` +
                `时间戳(毫秒): ${ts}\n` +
                `日期时间: ${date.toLocaleString('zh-CN')}\n` +
                `ISO格式: ${date.toISOString()}`
            );
        } catch (e: any) {
            setOutput(`转换失败: ${e.message}`);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <ToolCard
            title="Unix 时间戳转换"
            description="时间戳与日期字符串互相转换，支持秒和毫秒单位，实时显示系统当前时间。"
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>

                {/* Current Time Banner */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px',
                    border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
                        <Clock size={120} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '12px', background: 'var(--accent-glow)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)'
                        }}>
                            <Timer size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>当前 Unix 时间戳</div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{Math.floor(now / 1000)}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{new Date(now).toLocaleString('zh-CN')}</div>
                        <button
                            onClick={() => handleCopy(Math.floor(now / 1000).toString())}
                            style={{
                                background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)',
                                fontSize: '0.75rem', marginTop: '8px', padding: '4px 12px', borderRadius: '20px', fontWeight: 600
                            }}
                        >
                            复制秒单位
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* TS to Date */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ArrowRightLeft size={16} className="text-[var(--accent-primary)]" /> 时间戳 → 日期
                        </h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={inputTs}
                                onChange={e => setInputTs(e.target.value)}
                                placeholder="输入10位或13位时间戳"
                                style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: '10px', fontSize: '1rem' }}
                            />
                            <button onClick={convertTsToDate} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '0 20px', borderRadius: '10px', fontWeight: 600 }}>
                                转换
                            </button>
                        </div>
                    </div>

                    {/* Date to TS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} className="text-[var(--accent-secondary)]" /> 日期 → 时间戳
                        </h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={inputDate}
                                onChange={e => setInputDate(e.target.value)}
                                placeholder="YYYY-MM-DD HH:mm:ss"
                                style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '12px 16px', borderRadius: '10px', fontSize: '1rem' }}
                            />
                            <button onClick={convertDateToTs} style={{ border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)', padding: '0 20px', borderRadius: '10px', fontWeight: 600 }}>
                                转换
                            </button>
                        </div>
                        <button
                            onClick={() => setInputDate(new Date().toISOString().replace('T', ' ').slice(0, 19))}
                            style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'none' }}
                        >
                            <RefreshCcw size={12} /> 设置为当前日期
                        </button>
                    </div>
                </div>

                {/* Results Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>转换详情</label>
                        {output && (
                            <button onClick={() => handleCopy(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'none' }}>
                                <Copy size={14} /> 复制全部
                            </button>
                        )}
                    </div>
                    <textarea
                        readOnly
                        value={output}
                        style={{
                            flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)', padding: '1.5rem', borderRadius: '12px',
                            fontFamily: 'monospace', fontSize: '0.95rem', resize: 'none', lineHeight: 1.6,
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        placeholder="等待转换结果..."
                    />
                </div>
            </div>
        </ToolCard >
    );
};

export default TimestampTool;
