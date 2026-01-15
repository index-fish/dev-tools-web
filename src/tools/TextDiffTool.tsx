import React, { useState } from 'react';
import ToolCard from '../components/ToolCard';
import MonacoEditor from '../components/Editor';
import { diff_match_patch } from 'diff-match-patch';
import { SplitSquareVertical, ArrowRightLeft, Trash2 } from 'lucide-react';

const TextDiffTool: React.FC = () => {
    const [original, setOriginal] = useState('');
    const [modified, setModified] = useState('');
    const [diffResult, setDiffResult] = useState<string>('');

    const handleCompare = () => {
        if (!original && !modified) return;
        const dmp = new diff_match_patch();
        const diffs = dmp.diff_main(original, modified);
        dmp.diff_cleanupSemantic(diffs);

        // Simple HTML representation or text representation
        // For Monaco, we could use a DiffEditor, but let's provide a text summary first
        const summary = diffs.map(([op, text], i) => {
            const prefix = op === 1 ? '+ ' : op === -1 ? '- ' : '  ';
            return text.split('\n').map(line => prefix + line).join('\n');
        }).join('\n');

        setDiffResult(summary);
    };

    return (
        <ToolCard title="文本对比" description="对比两段文本的差异，清晰识别新增、删除及修改内容。">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>

                <div style={{ display: 'flex', gap: '1rem', height: '100%', minHeight: 0 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>原本 (Original)</span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={original} onChange={v => setOriginal(v || '')} language="text" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRightLeft size={24} color="var(--accent-primary)" opacity={0.5} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>修改后 (Modified)</span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={modified} onChange={v => setModified(v || '')} language="text" />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', padding: '10px' }}>
                    <button onClick={handleCompare} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '12px 60px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <SplitSquareVertical size={20} /> 开始对比
                    </button>
                    <button onClick={() => { setOriginal(''); setModified(''); setDiffResult(''); }} style={{ color: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={16} /> TODO: 切换 Diff 视图
                    </button>
                </div>

                {diffResult && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>差异详情</span>
                        <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                            <MonacoEditor value={diffResult} readOnly language="text" />
                        </div>
                    </div>
                )}

            </div>
        </ToolCard>
    );
};

export default TextDiffTool;
