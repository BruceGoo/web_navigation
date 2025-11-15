'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as yaml from 'js-yaml';

export default function JsonToYaml() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [conversionType, setConversionType] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  const [indentSize, setIndentSize] = useState(2);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setError('请输入数据');
      return;
    }

    try {
      if (conversionType === 'json-to-yaml') {
        // JSON to YAML
        const parsed = JSON.parse(input);
        const yamlStr = yaml.dump(parsed, {
          indent: indentSize,
          lineWidth: -1,
          noRefs: true,
          sortKeys: false
        });
        setOutput(yamlStr);
      } else {
        // YAML to JSON
        const parsed = yaml.load(input) as any;
        const jsonStr = JSON.stringify(parsed, null, indentSize);
        setOutput(jsonStr);
      }
      setError('');
    } catch (err) {
      setError(`转换错误: ${err instanceof Error ? err.message : '未知错误'}`);
      setOutput('');
    }
  }, [input, conversionType, indentSize]);

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
    if (conversionType === 'json-to-yaml') {
      const jsonExample = {
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
      };
      setInput(JSON.stringify(jsonExample, null, 2));
    } else {
      const yamlExample = `name: John Doe
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
balance: 1234.56`;
      setInput(yamlExample);
    }
  }, [conversionType]);

  const switchConversion = useCallback(() => {
    setConversionType(prev => prev === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
    // 交换输入输出
    const temp = input;
    setInput(output);
    setOutput(temp);
    setError('');
  }, [input, output]);

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
            JSON ↔ YAML 转换工具
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            JSON和YAML格式互转
          </p>
        </motion.div>

        {/* 工具卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          {/* 转换类型和控制面板 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={switchConversion}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all transform hover:scale-105"
                >
                  🔄 切换方向
                </button>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {conversionType === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  缩进:
                </label>
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

            <div className="flex gap-3">
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

            <div className="flex gap-3 mt-3">
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
                输入 {conversionType === 'json-to-yaml' ? 'JSON' : 'YAML'}:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`在此输入您的${conversionType === 'json-to-yaml' ? 'JSON' : 'YAML'}数据...`}
                className="w-full h-96 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 输出区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输出 {conversionType === 'json-to-yaml' ? 'YAML' : 'JSON'}:
              </label>
              <textarea
                value={output}
                readOnly
                placeholder={`转换后的${conversionType === 'json-to-yaml' ? 'YAML' : 'JSON'}将显示在这里...`}
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

          {/* 转换说明 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
              💡 转换说明
            </h3>
            <ul className="text-sm text-blue-600 dark:text-blue-500 space-y-1"
            >
              <li>• JSON 是 JavaScript 对象表示法，使用键值对格式</li>
              <li>• YAML 是 YAML Ain't Markup Language，使用缩进表示层级</li>
              <li>• 两种格式可以互相转换，但某些特性可能不完全兼容</li>
              <li>• YAML 支持注释和多文档，JSON 不支持</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}