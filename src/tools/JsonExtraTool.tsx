import React, { useState } from 'react';
import MonacoEditor from '../components/Editor';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import { useTools } from '../store/ToolContext';
import { Braces, Code, Copy, Trash2, FileJson } from 'lucide-react';

const JsonExtraTool: React.FC = () => {
    const { activeTool } = useTools();
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [lang, setLang] = useState('typescript');
    const [className, setClassName] = useState('MyClass');

    const handleEscape = (doEscape: boolean) => {
        if (!input) return;
        try {
            if (doEscape) {
                setOutput(JSON.stringify(input));
            } else {
                setOutput(JSON.parse(input));
            }
        } catch (e: any) {
            setOutput(`处理失败: ${e.message}`);
        }
    };

    const getType = (val: any, lang: string): string => {
        if (val === null) {
            if (lang === 'typescript') return 'any';
            if (lang === 'java') return 'Object';
            if (lang === 'csharp') return 'object';
            if (lang === 'python') return 'Any';
            return 'interface{}';
        }
        if (Array.isArray(val)) {
            if (lang === 'typescript') return 'any[]';
            if (lang === 'java') return 'List<Object>';
            if (lang === 'csharp') return 'List<object>';
            if (lang === 'python') return 'list';
            return '[]interface{}';
        }
        switch (typeof val) {
            case 'string': return lang === 'typescript' ? 'string' : lang === 'java' ? 'String' : lang === 'csharp' ? 'string' : lang === 'python' ? 'str' : 'string';
            case 'number': return Number.isInteger(val) ?
                (lang === 'typescript' ? 'number' : lang === 'java' ? 'int' : lang === 'csharp' ? 'int' : lang === 'python' ? 'int' : 'int') :
                (lang === 'typescript' ? 'number' : lang === 'java' ? 'double' : lang === 'csharp' ? 'double' : lang === 'python' ? 'float' : 'float64');
            case 'boolean': return lang === 'typescript' ? 'boolean' : lang === 'java' ? 'boolean' : lang === 'csharp' ? 'bool' : lang === 'python' ? 'bool' : 'bool';
            default: return 'any';
        }
    };

    const handleToClass = () => {
        if (!input) return;
        try {
            const obj = JSON.parse(input);
            let result = '';
            const cName = className || 'MyClass';

            if (lang === 'typescript') {
                result = `interface ${cName} {\n`;
                for (const [k, v] of Object.entries(obj)) result += `  ${k}: ${getType(v, lang)};\n`;
                result += '}';
            } else if (lang === 'java') {
                result = `public class ${cName} {\n`;
                for (const [k, v] of Object.entries(obj)) result += `    private ${getType(v, lang)} ${k};\n`;
                result += '\n    // Getters and Setters\n';
                for (const [k, v] of Object.entries(obj)) {
                    const cap = k.charAt(0).toUpperCase() + k.slice(1);
                    result += `    public ${getType(v, lang)} get${cap}() { return ${k}; }\n`;
                    result += `    public void set${cap}(${getType(v, lang)} ${k}) { this.${k} = ${k}; }\n`;
                }
                result += '}';
            } else if (lang === 'csharp') {
                result = `public class ${cName}\n{\n`;
                for (const [k, v] of Object.entries(obj)) {
                    const cap = k.charAt(0).toUpperCase() + k.slice(1);
                    result += `    public ${getType(v, lang)} ${cap} { get; set; }\n`;
                }
                result += '}';
            } else if (lang === 'python') {
                result = `from dataclasses import dataclass\nfrom typing import Any, List\n\n@dataclass\nclass ${cName}:\n`;
                for (const [k, v] of Object.entries(obj)) result += `    ${k}: ${getType(v, lang)}\n`;
            } else if (lang === 'go') {
                result = `type ${cName} struct {\n`;
                for (const [k, v] of Object.entries(obj)) {
                    const cap = k.charAt(0).toUpperCase() + k.slice(1);
                    result += `    ${cap} ${getType(v, lang)} \`json:"${k}"\`\n`;
                }
                result += '}';
            }
            setOutput(result);
        } catch (e: any) {
            setOutput(`生成失败: ${e.message}`);
        }
    };

    const isEscape = activeTool === 'json-escape';

    return (
        <ToolLayout
            title={isEscape ? 'JSON 转义/反转义' : 'JSON 生成实体类'}
            description={isEscape ? '将 JSON 字符串转义为普通文本，或将转义后的文本还原为 JSON。' : '将 JSON 对象自动转换为 TypeScript、Java、C# 等语言的类/接口定义。'}
            header={
                <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                    {isEscape ? (
                        <>
                            <button onClick={() => handleEscape(true)} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FileJson size={18} /> 转义 (Stringify)
                            </button>
                            <button onClick={() => handleEscape(false)} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Braces size={18} /> 反转义 (Parse)
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>语言</label>
                                <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px' }}>
                                    <option value="typescript">TypeScript</option>
                                    <option value="java">Java</option>
                                    <option value="csharp">C#</option>
                                    <option value="python">Python</option>
                                    <option value="go">Go</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>类/接口名</label>
                                <input type="text" value={className} onChange={e => setClassName(e.target.value)} placeholder="Class Name" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '6px' }} />
                            </div>
                            <button onClick={handleToClass} style={{ alignSelf: 'flex-end', background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Code size={18} /> 生成代码
                            </button>
                        </>
                    )}
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>
                        <Trash2 size={16} /> 清空
                    </button>
                </div>
            }
            splitId="json-extra-tool"
        >
            <ToolPane title="输入数据" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={input} onChange={v => setInput(v || '')} language="json" />
            </ToolPane>
            <ToolPane
                title="输出结果"
                style={{ paddingLeft: '4px' }}
                extra={
                    <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={14} /> 复制
                    </button>
                }
            >
                <MonacoEditor value={output} readOnly language={isEscape ? "text" : lang === "typescript" ? "typescript" : lang === "java" || lang === "csharp" ? "csharp" : lang === "python" ? "python" : "go"} />
            </ToolPane>
        </ToolLayout>
    );
};

export default JsonExtraTool;
