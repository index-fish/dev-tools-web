import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout, ToolPane } from '../components/ToolLayout';
import QRCode from 'qrcode';
import { Upload, Download, Copy, Trash2, Image as ImageIcon } from 'lucide-react';
import { useTools } from '../store/ToolContext';

const ImageTool: React.FC = () => {
    const { activeTool } = useTools();
    const [base64, setBase64] = useState('');
    const [qrText, setQrText] = useState('https://github.com/succez/dev-tools');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (activeTool === 'qrcode' && qrText) {
            QRCode.toDataURL(qrText, {
                width: 240,
                margin: 2,
                errorCorrectionLevel: 'H'
            }).then(url => {
                setQrDataUrl(url);
            }).catch(err => {
                console.error(err);
            });
        }
    }, [qrText, activeTool]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const res = event.target?.result as string;
                setBase64(res);
                setPreview(res);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadQr = () => {
        if (!qrDataUrl) return;
        const downloadLink = document.createElement('a');
        downloadLink.download = 'qrcode.png';
        downloadLink.href = qrDataUrl;
        downloadLink.click();
    };

    if (activeTool === 'qrcode') {
        return (
            <ToolLayout
                title="二维码生成器"
                description="快速生成 QR 二维码。您可以输入网址或文本，并自定义下载图片。"
                header={
                    <button onClick={downloadQr} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '12px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={20} /> 下载二维码图片
                    </button>
                }
                splitId="qrcode-tool"
            >
                <ToolPane title="二维码内容 (URL/文本)" style={{ paddingRight: '4px' }}>
                    <textarea
                        value={qrText}
                        onChange={e => setQrText(e.target.value)}
                        style={{ height: '100%', width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0', fontSize: '1rem', resize: 'none' }}
                    />
                </ToolPane>
                <ToolPane title="预览结果" style={{ paddingLeft: '4px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '12px' }}>
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="QR Code" style={{ maxWidth: '80%', height: 'auto' }} />
                        ) : (
                            <div style={{ color: 'var(--text-muted)' }}>生成中...</div>
                        )}
                    </div>
                </ToolPane>
            </ToolLayout>
        );
    }

    return (
        <ToolLayout
            title="图片与 Base64 转换"
            description="将本地图片文件转换为 Base64 编码，或将 Base64 编码还原为预览图片。"
            header={
                <>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                    <button onClick={() => fileInputRef.current?.click()} style={{ background: 'var(--accent-gradient)', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Upload size={18} /> 上传图片
                    </button>
                    <div style={{ flex: 1 }}></div>
                    <button onClick={() => { setBase64(''); setPreview(null); }} style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>
                        <Trash2 size={16} /> 清空
                    </button>
                </>
            }
            splitId="image-base64-tool"
        >
            <ToolPane
                title="BASE64 编码"
                style={{ paddingRight: '4px' }}
                extra={<button onClick={() => navigator.clipboard.writeText(base64)} style={{ color: 'var(--accent-primary)', fontSize: '0.75rem' }}><Copy size={14} /> 复制</button>}
            >
                <textarea
                    value={base64}
                    onChange={e => { setBase64(e.target.value); setPreview(e.target.value); }}
                    style={{ flex: 1, width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0', fontSize: '0.8rem', resize: 'none', fontFamily: 'monospace', wordBreak: 'break-all' }}
                />
            </ToolPane>
            <ToolPane title="预览" style={{ paddingLeft: '4px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {preview ? (
                        <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                        <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <ImageIcon size={40} style={{ opacity: 0.3 }} />
                            <span>未加载图片</span>
                        </div>
                    )}
                </div>
            </ToolPane>
        </ToolLayout>
    );
};

export default ImageTool;
