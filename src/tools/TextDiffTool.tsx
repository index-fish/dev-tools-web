import React, { useState } from 'react';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import MonacoEditor from '../components/Editor';
import { diff_match_patch } from 'diff-match-patch';
import { SplitSquareVertical, Trash2 } from 'lucide-react';

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
        const summary = diffs.map(([op, text]) => {
            const prefix = op === 1 ? '+ ' : op === -1 ? '- ' : '  ';
            return text.split('\n').map(line => prefix + line).join('\n');
        }).join('\n');

        setDiffResult(summary);
    };

    return (
        <ToolLayout
            title="文本对比"
            description="对比两段文本的差异，清晰识别新增、删除及修改内容。"
            header={
                <>
                    <button onClick={handleCompare} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SplitSquareVertical size={18} /> 开始对比
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setOriginal(''); setModified(''); setDiffResult(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={16} /> 清空
                    </button>
                </>
            }
            splitId="text-diff-tool"
            footer={diffResult ? (
                <ToolPane title="差异详情">
                    <MonacoEditor value={diffResult} readOnly language="text" />
                </ToolPane>
            ) : null}
        >
            <ToolPane title="原本 (Original)" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={original} onChange={v => setOriginal(v || '')} language="text" />
            </ToolPane>
            <ToolPane title="修改后 (Modified)" style={{ paddingLeft: '4px' }}>
                <MonacoEditor value={modified} onChange={v => setModified(v || '')} language="text" />
            </ToolPane>
        </ToolLayout>
    );
};

export default TextDiffTool;
