'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as yaml from 'js-yaml';

export default function FormatConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [inputFormat, setInputFormat] = useState<'json' | 'yaml' | 'xml'>('json');
  const [outputFormat, setOutputFormat] = useState<'json' | 'yaml' | 'xml'>('yaml');
  const [indentSize, setIndentSize] = useState(2);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setError('请输入数据');
      return;
    }

    try {
      let parsedData: any;

      // 解析输入
      switch (inputFormat) {
        case 'json':
          parsedData = JSON.parse(input);
          break;
        case 'yaml':
          parsedData = yaml.load(input);
          break;
        case 'xml':
          // 简单的XML解析（这里使用一个基本的实现）
          parsedData = parseSimpleXml(input);
          break;
      }

      // 转换输出
      let result: string;
      switch (outputFormat) {
        case 'json':
          result = JSON.stringify(parsedData, null, indentSize);
          break;
        case 'yaml':
          result = yaml.dump(parsedData, {
            indent: indentSize,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
          });
          break;
        case 'xml':
          result = convertToXml(parsedData, 'root');
          break;
      }

      setOutput(result);
      setError('');
    } catch (err) {
      setError(`转换错误: ${err instanceof Error ? err.message : '未知错误'}`);
      setOutput('');
    }
  }, [input, inputFormat, outputFormat, indentSize]);

  // 简单的XML解析函数
  const parseSimpleXml = (xmlString: string): any => {
    try {
      // 移除XML声明和注释
      const cleanXml = xmlString.replace(/<\?xml[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();

      // 简单的XML到对象转换
      const result: any = {};
      const tagRegex = /<([^>\s]+)([^>]*)>([\s\S]*?)<\/\1>/g;
      let match;

      while ((match = tagRegex.exec(cleanXml)) !== null) {
        const [, tagName, attributes, content] = match;

        // 检查是否有嵌套标签
        if (content.includes('<')) {
          result[tagName] = parseSimpleXml(content);
        } else {
          // 尝试转换为数字或布尔值
          const trimmedContent = content.trim();
          if (trimmedContent === 'true') {
            result[tagName] = true;
          } else if (trimmedContent === 'false') {
            result[tagName] = false;
          } else if (!isNaN(Number(trimmedContent))) {
            result[tagName] = Number(trimmedContent);
          } else {
            result[tagName] = trimmedContent;
          }
        }
      }

      return result;
    } catch (err) {
      throw new Error('XML格式不正确');
    }
  };

  // 转换对象为XML
  const convertToXml = (obj: any, rootName: string): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<${rootName}>`;
    xml += objectToXml(obj, indentSize);
    xml += `</${rootName}>`;
    return xml;
  };

  const objectToXml = (obj: any, indent: number): string => {
    let xml = '';
    const spaces = ' '.repeat(indent);

    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          xml += `\n${spaces}<${key}>`;
          if (typeof item === 'object' && item !== null) {
            xml += objectToXml(item, indent + indentSize);
            xml += `\n${spaces}</${key}>`;
          } else {
            xml += String(item);
            xml += `</${key}>`;
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        xml += `\n${spaces}<${key}>`;
        xml += objectToXml(value, indent + indentSize);
        xml += `\n${spaces}</${key}>`;
      } else {
        xml += `\n${spaces}<${key}>${value}</${key}>`;
      }
    }

    return xml;
  };

  const clearAll = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
  }, []);

  const copyOutput = useCallback(async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output);
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  }, [output]);

  const loadExample = useCallback(() => {
    const examples = {
      json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "traveling", "coding"],
  "active": true,
  "balance": 1234.56
}`,
      yaml: `name: John Doe
age: 30
email: john.doe@example.com
address:
  street: 123 Main St
  city: New York
  country: USA
hobbies:
  - reading
  - traveling
  - coding
active: true
balance: 1234.56`,
      xml: `<?xml version="1.0" encoding="UTF-8"?>
<user>
  <name>John Doe</name>
  <age>30</age>
  <email>john.doe@example.com</email>
  <address>
    <street>123 Main St</street>
    <city>New York</city>
    <country>USA</country>
  </address>
  <hobbies>
    <hobby>reading</hobby>
    <hobby>traveling</hobby>
    <hobby>coding</hobby>
  </hobbies>
  <active>true</active>
  <balance>1234.56</balance>
</user>`
    };

    setInput(examples[inputFormat] || examples.json);
  }, [inputFormat]);

  const switchFormats = useCallback(() => {
    const temp = inputFormat;
    setInputFormat(outputFormat);
    setOutputFormat(temp);

    // 交换输入输出
    const tempInput = input;
    const tempOutput = output;
    setInput(tempOutput);
    setOutput(tempInput);
    setError('');
  }, [inputFormat, outputFormat, input, output]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            格式转换工具
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            JSON、YAML、XML 格式互转
          </p>
        </motion.div>

        {/* 工具卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          {/* 格式选择和转换方向 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输入格式:</label>
                  <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value as 'json' | 'yaml' | 'xml')}
                    className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                    <option value="xml">XML</option>
                  </select>
                </div>

                <button
                  onClick={switchFormats}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all transform hover:scale-105"
                >
                  🔄
                </button>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">输出格式:</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as 'json' | 'yaml' | 'xml')}
                    className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="json">JSON</option>
                    <option value="yaml">YAML</option>
                    <option value="xml">XML</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">缩进:</label>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 空格</option>
                    <option value={4}>4 空格</option>
                    <option value={8}>8 空格</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={convert}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🔄 转换
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🗑️ 清空
              </button>
              <button
                onClick={copyOutput}
                disabled={!output}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                📋 复制结果
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                加载示例
              </button>
            </div>
          </div>

          {/* 输入输出区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输入 {inputFormat.toUpperCase()}:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`在此输入您的${inputFormat.toUpperCase()}数据...`}
                className="w-full h-96 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 输出区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输出 {outputFormat.toUpperCase()}:
              </label>
              <textarea
                value={output}
                readOnly
                placeholder={`转换后的${outputFormat.toUpperCase()}将显示在这里...`}
                className="w-full h-96 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm resize-none"
              />
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </motion.div>
          )}

          {/* 功能说明 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">📋 JSON</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500">JavaScript对象表示法，轻量级数据交换格式</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">📝 YAML</h3>
              <p className="text-xs text-green-600 dark:text-green-500">YAML不是标记语言，人类友好的数据格式</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">📄 XML</h3>
              <p className="text-xs text-purple-600 dark:text-purple-500">可扩展标记语言，结构化文档格式</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}