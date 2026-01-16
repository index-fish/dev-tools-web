import React from 'react';
import { ToolProvider, useTools } from './store/ToolContext';
import { IconProvider, DEFAULT_ICON_CONFIGS } from '@icon-park/react';
import MainLayout from './layouts/MainLayout';
import JsonFormatter from './tools/JsonFormatter';
import JsonExtraTool from './tools/JsonExtraTool';
import Base64Tool from './tools/Base64Tool';
import BaseMultiTool from './tools/BaseMultiTool';
import AesTool from './tools/AesTool';
import HashTool from './tools/HashTool';
import HashExpandTool from './tools/HashExpandTool';
import RandomTool from './tools/RandomTool';
import TimestampTool from './tools/TimestampTool';
import DateCalcTool from './tools/DateCalcTool';
import SmTool from './tools/SmTool';
import RsaTool from './tools/RsaTool';
import EncodingTool from './tools/EncodingTool';
import JwtTool from './tools/JwtTool';
import MorseTool from './tools/MorseTool';
import TextCommonTool from './tools/TextCommonTool';
import RegexTool from './tools/RegexTool';
import TextDiffTool from './tools/TextDiffTool';
import RadixTool from './tools/RadixTool';
import ColorTool from './tools/ColorTool';
import ImageTool from './tools/ImageTool';
import CodeFormatTool from './tools/CodeFormatTool';

const ToolRenderer: React.FC = () => {
  const { activeTool } = useTools();

  switch (activeTool) {
    case 'json-format':
      return <JsonFormatter />;
    case 'json-escape':
    case 'json-to-class':
      return <JsonExtraTool />;
    case 'html-format':
    case 'js-format':
    case 'css-format':
    case 'xml-format':
    case 'sql-format':
      return <CodeFormatTool />;
    case 'base64':
      return <Base64Tool />;
    case 'base-multi':
      return <BaseMultiTool />;
    case 'url':
    case 'unicode':
    case 'hex':
      return <EncodingTool />;
    case 'jwt':
      return <JwtTool />;
    case 'hash':
      return <HashTool />;
    case 'hmac':
    case 'crc':
    case 'file-hash':
    case 'gzip':
    case 'lzstring':
      return <HashExpandTool />;
    case 'aes':
    case 'des':
    case 'rc4':
    case 'rabbit':
    case 'tripledes':
      return <AesTool />;
    case 'sm-crypto':
      return <SmTool />;
    case 'rsa':
      return <RsaTool />;
    case 'morse':
      return <MorseTool />;
    case 'radix':
    case 'rmb':
      return <RadixTool />;
    case 'text-diff':
      return <TextDiffTool />;
    case 'regex':
      return <RegexTool />;
    case 'case':
    case 'count':
      return <TextCommonTool />;
    case 'timestamp':
      return <TimestampTool />;
    case 'date-calc':
      return <DateCalcTool />;
    case 'random':
    case 'uuid':
      return <RandomTool />;
    case 'color':
      return <ColorTool />;
    case 'img-base64':
    case 'qrcode':
      return <ImageTool />;
    default:
      return (
        <div style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>
          暂未实现 "{activeTool}" 工具的 React 版本
        </div>
      );
  }
};

const App: React.FC = () => {
  return (
    <IconProvider value={{ ...DEFAULT_ICON_CONFIGS, theme: 'outline', size: '1.25rem', strokeWidth: 4 }}>
      <ToolProvider>
        <MainLayout>
          <ToolRenderer />
        </MainLayout>
      </ToolProvider>
    </IconProvider>
  );
};

export default App;
