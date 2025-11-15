'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as yaml from 'js-yaml';

export default function YamlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [lineWidth, setLineWidth] = useState(-1);

  const formatYaml = useCallback(() => {
    if (!input.trim()) {
      setError('请输入YAML数据');
      return;
    }

    try {
      const parsed = yaml.load(input);
      const formatted = yaml.dump(parsed, {
        indent: indentSize,
        lineWidth: lineWidth,
        noRefs: true,
        sortKeys: false,
        noCompatMode: false
      });
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError(`YAML格式错误: ${err instanceof Error ? err.message : '未知错误'}`);
      setOutput('');
    }
  }, [input, indentSize, lineWidth]);

  const validateYaml = useCallback(() => {
    if (!input.trim()) {
      setError('请输入YAML数据');
      return;
    }

    try {
      yaml.load(input);
      setError('✅ YAML格式正确');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      setError(`❌ YAML格式错误: ${err instanceof Error ? err.message : '未知错误'}`);
      setOutput('');
    }
  }, [input]);

  const minifyYaml = useCallback(() => {
    if (!input.trim()) {
      setError('请输入YAML数据');
      return;
    }

    try {
      const parsed = yaml.load(input);
      const minified = yaml.dump(parsed, {
        indent: 0,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
        flowLevel: 0
      });
      setOutput(minified);
      setError('');
    } catch (err) {
      setError(`YAML格式错误: ${err instanceof Error ? err.message : '未知错误'}`);
      setOutput('');
    }
  }, [input]);

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
    const example = `name: John Doe
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
balance: 1234.56
metadata:
  created: 2024-01-01
  updated: 2024-01-15
  tags:
    - developer
    - designer`;
    setInput(example);
  }, []);

  const loadComplexExample = useCallback(() => {
    const complexExample = `# 复杂YAML示例
users:
  - name: Alice
    age: 28
    roles:
      - admin
      - developer
    skills:
      programming:
        - JavaScript
        - Python
        - Go
      tools:
        - Docker
        - Kubernetes
  - name: Bob
    age: 32
    roles:
      - designer
    skills:
      design:
        - Photoshop
        - Figma
        - Sketch

database:
  host: localhost
  port: 5432
  name: myapp
  credentials:
    username: admin
    password: secret123

settings:
  debug: false
  timeout: 30
  features:
    enable_logging: true
    enable_caching: false
    max_connections: 100`;
    setInput(complexExample);
  }, []);

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
            YAML 格式化工具
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            格式化、验证和压缩YAML数据
          </p>
        </motion.div>

        {/* 工具卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6"
        >
          {/* 控制面板 */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  缩进大小:
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

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  行宽限制:
                </label>
                <select
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={-1}>无限制</option>
                  <option value={80}>80 字符</option>
                  <option value={120}>120 字符</option>
                  <option value={160}>160 字符</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={formatYaml}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🎨 格式化 YAML
              </button>
              <button
                onClick={validateYaml}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                ✅ 验证 YAML
              </button>
              <button
                onClick={minifyYaml}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🗜️ 压缩 YAML
              </button>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
              >
                清空
              </button>
              <button
                onClick={copyOutput}
                disabled={!output}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-colors text-sm"
              >
                复制结果
              </button>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
              >
                简单示例
              </button>
              <button
                onClick={loadComplexExample}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
              >
                复杂示例
              </button>
            </div>
          </div>

          {/* 输入输出区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 输入区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输入 YAML:
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此输入您的YAML数据..."
                className="w-full h-96 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 输出区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输出结果:
              </label>
              <textarea
                value={output}
                readOnly
                placeholder="处理后的结果将显示在这里..."
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
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">🎨 格式化</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500">美化YAML数据，调整缩进和行宽</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">✅ 验证</h3>
              <p className="text-xs text-green-600 dark:text-green-500">检查YAML语法，显示错误信息</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">🗜️ 压缩</h3>
              <p className="text-xs text-purple-600 dark:text-purple-500">压缩YAML，移除多余空格和换行</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}