import React, { useState } from 'react';
import MonacoEditor from '../components/Editor';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import { Radio, Send, Trash2, Copy } from 'lucide-react';

const MORSE_CODE_MAP: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', ' ': '/'
};

const REVERSE_MORSE_MAP: Record<string, string> = Object.entries(MORSE_CODE_MAP).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {});

const MorseTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleEncode = () => {
        if (!input) return;
        const result = input.toUpperCase().split('').map(char => MORSE_CODE_MAP[char] || char).join(' ');
        setOutput(result);
    };

    const handleDecode = () => {
        if (!input) return;
        const result = input.split(' ').map(code => REVERSE_MORSE_MAP[code] || code).join('');
        setOutput(result);
    };

    return (
        <ToolLayout
            title="摩斯密码"
            description="将文本转换为摩斯密码信号，或将摩斯信号还原为文本。支持字母、数字及空格。"
            header={
                <>
                    <button onClick={handleEncode} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={18} /> 编码
                    </button>
                    <button onClick={handleDecode} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Radio size={18} /> 解码
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setInput(''); setOutput(''); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>
                        <Trash2 size={16} /> 清空
                    </button>
                </>
            }
            splitId="morse-tool"
        >
            <ToolPane title="源文本 / 摩斯码" style={{ paddingRight: '4px' }}>
                <MonacoEditor value={input} onChange={v => setInput(v || '')} language="text" />
            </ToolPane>
            <ToolPane
                title="结果"
                style={{ paddingLeft: '4px' }}
                extra={
                    <button onClick={() => navigator.clipboard.writeText(output)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={14} /> 复制
                    </button>
                }
            >
                <MonacoEditor value={output} readOnly language="text" />
            </ToolPane>
        </ToolLayout>
    );
};

export default MorseTool;
