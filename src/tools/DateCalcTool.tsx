import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import { Clock, Plus } from 'lucide-react';

const DateCalcTool: React.FC = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(0);
    const [resultDate, setResultDate] = useState('');

    const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
    const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);
    const [diffResult, setDiffResult] = useState(0);

    const handleAddDays = () => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + days);
        setResultDate(d.toISOString().split('T')[0]);
    };

    const handleCalcDiff = () => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDiffResult(diffDays);
    };

    const DateBox = ({ label, children }: { label: string, children: React.ReactNode }) => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
            {children}
        </div>
    );

    return (
        <ToolCard title="日期计算器" description="计算两个日期相差的天数，或者在指定日期上增加/减少天数。">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Add/Sub Days */}
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <DateBox label="日期加减计算">
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: '8px' }}>
                                <input type="number" value={days} onChange={e => setDays(parseInt(e.target.value))} style={{ width: '60px', background: 'transparent', border: 'none', color: 'var(--accent-primary)', textAlign: 'center', fontWeight: 700 }} />
                                <span style={{ fontSize: '0.9rem' }}>天</span>
                            </div>
                            <button onClick={handleAddDays} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 20px', borderRadius: '8px' }}><Plus size={20} /></button>
                        </div>
                        <div style={{ marginTop: '1rem', padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                            结果: {resultDate || '请计算'}
                        </div>
                    </DateBox>

                    <DateBox label="日期差计算">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="date" value={date1} onChange={e => setDate1(e.target.value)} style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }} />
                            <input type="date" value={date2} onChange={e => setDate2(e.target.value)} style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '10px', borderRadius: '8px' }} />
                            <button onClick={handleCalcDiff} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px', borderRadius: '8px', fontWeight: 600 }}>计算相差天数</button>
                        </div>
                        <div style={{ marginTop: '1rem', padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '8px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                            相差: {diffResult} 天
                        </div>
                    </DateBox>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Clock size={16} /> 提示: 日期计算默认不包含当天，若需包含请手动 +1。
                    </div>
                </div>

            </div>
        </ToolCard>
    );
};

export default DateCalcTool;
