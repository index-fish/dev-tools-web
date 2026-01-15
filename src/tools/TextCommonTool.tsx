import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { useTools } from '../store/ToolContext';
import { Type, Hash, Trash2, Copy } from 'lucide-react';

const TextCommonTool: React.FC = () => {
    const { activeTool } = useTools();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleProcess = () => {
        if (!input) return;
        let result = '';
        switch (activeTool) {
            case 'case':
                // For 'case', we'll provide a toggle or just upper/lower
                result = `大写: ${input.toUpperCase()}\n小写: ${input.toLowerCase()}`;
                break;
            case 'count':
                const chars = input.length;
                const words = input.trim().split(/\s+/).filter(x => x).length;
                const lines = input.split('\n').length;
                const chinese = (input.match(/[\u4e00-\u9fa5]/g) || []).length;
                result = `字符数: ${chars}\n单词数: ${words}\n行数: ${lines}\n中文字符: ${chinese}`;
                break;
            default:
                result = input;
        }
        setOutput(result);
    };

    const getToolTitle = () => {
        switch (activeTool) {
            case 'case': return '字母大小写转换';
            case 'count': return '字数统计';
            default: return '文本处理';
        }
    };

    return (
        <ToolCard title={getToolTitle()} description="简单的文本处理工具，包含大小写转换、字数统计等功能。">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 0 }}>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleProcess} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {activeTool === 'count' ? <Hash size={18} /> : <Type size={18} />} 统计/处理
                    </button>
                    {activeTool === 'case' && (
                        <>
                            <button onClick={() => setOutput(input.toUpperCase())} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}>全大写</button>
                            <button onClick={() => setOutput(input.toLowerCase())} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 }}>全小写</button>
                        </>
                    )}
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>
                        <Trash2 size={16} /> 清空
                    </button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', minHeight: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>源文本</span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>结果</span>
                            <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Copy size={14} /> 复制
                            </button>
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

export default TextCommonTool;
