export interface ToolInfo {
    id: string;
    name: string;
}

export interface SectionInfo {
    id: string;
    name: string;
    icon: string;
    tools: ToolInfo[];
}

export const SECTIONS: Record<string, SectionInfo> = {
    'json': {
        id: 'json',
        name: 'JSON 工具',
        icon: '📋',
        tools: [
            { id: 'json-format', name: 'JSON 格式化' },
            { id: 'json-escape', name: 'JSON 转义' },
            { id: 'json-to-class', name: 'JSON 生成实体类' },
        ]
    },
    'format': {
        id: 'format',
        name: '代码格式化',
        icon: '✨',
        tools: [
            { id: 'html-format', name: 'HTML 格式化' },
            { id: 'js-format', name: 'JavaScript 格式化' },
            { id: 'css-format', name: 'CSS 格式化' },
            { id: 'xml-format', name: 'XML 格式化' },
            { id: 'sql-format', name: 'SQL 格式化' },
        ]
    },
    'encode': {
        id: 'encode',
        name: '编码与解码',
        icon: '🔄',
        tools: [
            { id: 'base64', name: 'Base64 编码/解码' },
            { id: 'base-multi', name: 'Base16/32/58/62 编码' },
            { id: 'url', name: 'URL 编码/解码' },
            { id: 'unicode', name: 'Unicode 编码/解码' },
            { id: 'hex', name: 'Hex 编码/解码' },
            { id: 'gzip', name: 'Gzip 压缩/解压' },
            { id: 'jwt', name: 'JWT 解析器' },
        ]
    },
    'hash': {
        id: 'hash',
        name: '摘要算法',
        icon: '#️⃣',
        tools: [
            { id: 'hash', name: 'MD5/SHA 加密' },
            { id: 'hmac', name: 'HMAC 加密' },
            { id: 'crc', name: 'CRC 校验' },
            { id: 'file-hash', name: '文件 Hash 计算' },
        ]
    },
    'symmetric': {
        id: 'symmetric',
        name: '对称加密',
        icon: '🔐',
        tools: [
            { id: 'aes', name: 'AES 加密/解密' },
            { id: 'des', name: 'DES 加密/解密' },
            { id: 'rc4', name: 'RC4 加密/解密' },
            { id: 'rabbit', name: 'Rabbit 加密/解密' },
            { id: 'tripledes', name: 'TripleDES 加密/解密' },
        ]
    },
    'guomi': {
        id: 'guomi',
        name: '国密算法',
        icon: '🇨🇳',
        tools: [
            { id: 'sm-crypto', name: 'SM2/3/4 加解密' },
        ]
    },
    'asymmetric': {
        id: 'asymmetric',
        name: '非对称加密',
        icon: '🛡️',
        tools: [
            { id: 'rsa', name: 'RSA 加密/解密' },
        ]
    },
    'cipher': {
        id: 'cipher',
        name: '经典密码',
        icon: '🔑',
        tools: [
            { id: 'morse', name: '摩斯密码' },
        ]
    },
    'number': {
        id: 'number',
        name: '数字工具',
        icon: '🔢',
        tools: [
            { id: 'radix', name: '进制转换' },
            { id: 'rmb', name: '人民币大写转换' },
        ]
    },
    'text': {
        id: 'text',
        name: '文本工具',
        icon: '📝',
        tools: [
            { id: 'text-diff', name: '文本对比' },
            { id: 'regex', name: '正则表达式' },
            { id: 'case', name: '字母大小写转换' },
            { id: 'count', name: '字数统计' },
        ]
    },
    'date': {
        id: 'date',
        name: '日期工具',
        icon: '📅',
        tools: [
            { id: 'timestamp', name: 'Unix 时间戳' },
            { id: 'date-calc', name: '日期计算器' },
        ]
    },
    'random': {
        id: 'random',
        name: '随机数工具',
        icon: '🎲',
        tools: [
            { id: 'random', name: '随机数生成器' },
            { id: 'uuid', name: 'UUID 生成器' },
        ]
    },
    'color': {
        id: 'color',
        name: '颜色工具',
        icon: '🎨',
        tools: [
            { id: 'color', name: 'RGB 颜色转换' },
        ]
    },
    'image': {
        id: 'image',
        name: '图片工具',
        icon: '🖼️',
        tools: [
            { id: 'img-base64', name: '图片与Base64转换' },
            { id: 'qrcode', name: '二维码生成器' },
        ]
    }
};
