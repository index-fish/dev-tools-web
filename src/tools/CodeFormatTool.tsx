import React, { useState } from 'react';
import MonacoEditor from '../components/Editor';
import { useTools } from '../store/ToolContext';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import { Trash2, Copy, Check } from 'lucide-react';

const CodeFormatTool: React.FC = () => {
    const { activeTool } = useTools();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleFormat = async () => {
        if (!input) return;
        try {
            const prettier = (await import('prettier/standalone')).default;
            const plugins: any[] = [];
            let parser = '';

            switch (activeTool) {
                case 'js-format':
                    parser = 'babel';
                    plugins.push((await import('prettier/plugins/babel')).default);
                    plugins.push((await import('prettier/plugins/estree')).default);
                    break;
                case 'html-format':
                    parser = 'html';
                    plugins.push((await import('prettier/plugins/html')).default);
                    break;
                case 'css-format':
                    parser = 'css';
                    plugins.push((await import('prettier/plugins/postcss')).default);
                    break;
                case 'xml-format':
                    parser = 'xml';
                    plugins.push((await import('@prettier/plugin-xml')).default);
                    break;
                case 'sql-format':
                    parser = 'sql';
                    plugins.push((await import('prettier-plugin-sql')).default);
                    break;
                default:
                    setOutput(input);
                    return;
            }

            const formatted = await prettier.format(input, {
                parser,
                plugins,
                semi: true,
                singleQuote: true,
                tabWidth: 4,
                printWidth: 100,
            });
            setOutput(formatted);
        } catch (e: any) {
            setOutput(`格式化失败: ${e.message}`);
        }
    };

    const getToolTitle = () => {
        switch (activeTool) {
            case 'html-format': return 'HTML 格式化';
            case 'js-format': return 'JavaScript 格式化';
            case 'css-format': return 'CSS 格式化';
            case 'xml-format': return 'XML 格式化';
            case 'sql-format': return 'SQL 格式化';
            default: return '代码格式化';
        }
    };

    const getLanguage = () => {
        switch (activeTool) {
            case 'html-format': return 'html';
            case 'js-format': return 'javascript';
            case 'css-format': return 'css';
            case 'xml-format': return 'xml';
            case 'sql-format': return 'sql';
            default: return 'text';
        }
    };

    return (
        <ToolLayout
            title={getToolTitle()}
            description={`清理并美化您的 ${getLanguage().toUpperCase()} 代码，提高可读性。`}
            header={
                <>
                    <button onClick={handleFormat} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={18} /> 执行格式化
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={16} /> 清空
                    </button>
                </>
            }
            splitId="code-format-tool"
        >
            <ToolPane title="源文本" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={input} onChange={v => setInput(v || '')} language={getLanguage()} />
            </ToolPane>
            <ToolPane
                title="格式化结果"
                style={{ paddingLeft: '4px' }}
                extra={
                    <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={14} /> 复制
                    </button>
                }
            >
                <MonacoEditor value={output} readOnly language={getLanguage()} />
            </ToolPane>
        </ToolLayout>
    );
};

export default CodeFormatTool;
