'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorPosition?: {
    line: number;
    column: number;
    position: number;
  };
}

export default function JsonValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [highlightedError, setHighlightedError] = useState('');

  const validateJson = useCallback(() => {
    if (!input.trim()) {
      setResult({
        isValid: false,
        error: '请输入JSON数据'
      });
      return;
    }

    try {
      JSON.parse(input);
      setResult({
        isValid: true
      });
      setHighlightedError('');
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message;

      // 解析错误位置
      const positionMatch = errorMessage.match(/position (\d+)/);
      const lineMatch = errorMessage.match(/line (\d+) column (\d+)/);

      let errorPosition;
      if (lineMatch) {
        errorPosition = {
          line: parseInt(lineMatch[1]),
          column: parseInt(lineMatch[2]),
          position: positionMatch ? parseInt(positionMatch[1]) : 0
        };
      }

      setResult({
        isValid: false,
        error: errorMessage,
        errorPosition
      });

      // 高亮显示错误区域
      highlightErrorArea(input, errorPosition);
    }
  }, [input]);

  const highlightErrorArea = (jsonString: string, errorPos?: { line: number; column: number; position: number }) => {
    if (!errorPos) {
      setHighlightedError(jsonString);
      return;
    }

    // 简单的错误高亮显示
    const lines = jsonString.split('\n');
    let highlighted = '';

    lines.forEach((line, index) => {
      if (index === errorPos.line - 1) {
        // 错误行
        highlighted += line.substring(0, errorPos.column - 1);
        highlighted += `🔴${line.substring(errorPos.column - 1, errorPos.column)}🔴`;
        highlighted += line.substring(errorPos.column) + '\n';
        // 添加指向错误的箭头
        highlighted += ' '.repeat(errorPos.column - 1) + '↑\n';
      } else {
        highlighted += line + '\n';
      }
    });

    setHighlightedError(highlighted);
  };

  const clearAll = useCallback(() => {
    setInput('');
    setResult(null);
    setHighlightedError('');
  }, []);

  const loadExample = useCallback((type: 'valid' | 'invalid') => {
    if (type === 'valid') {
      const validExample = {
        "name": "张三",
        "age": 25,
        "email": "zhangsan@example.com",
        "skills": ["JavaScript", "TypeScript", "React"],
        "address": {
          "city": "北京",
          "country": "中国"
        }
      };
      setInput(JSON.stringify(validExample, null, 2));
    } else {
      // 有语法错误的JSON
      const invalidExample = `{
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "skills": ["JavaScript", "TypeScript", "React"],
  "address": {
    "city": "北京",
    "country": "中国",
  }
}`;
      setInput(invalidExample);
    }
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
            JSON 校验工具
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            验证JSON格式，显示详细的错误信息
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
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => validateJson()}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                ✅ 验证 JSON
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🗑️ 清空
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => loadExample('valid')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
              >
                有效示例
              </button>
              <button
                onClick={() => loadExample('invalid')}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm"
              >
                错误示例
              </button>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              输入 JSON:
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入您的JSON数据进行验证..."
              className="w-full h-64 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 验证结果 */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                result.isValid
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className={`mr-2 text-2xl ${
                  result.isValid ? '✅' : '❌'
                }`}></span>
                <span className={`font-semibold ${
                  result.isValid
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400'
                }`}>
                  {result.isValid ? 'JSON 格式正确!' : 'JSON 格式错误'}
                </span>
              </div>

              {result.error && (
                <div className="mt-2">
                  <p className={`text-sm ${
                    result.isValid
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}>
                    {result.error}
                  </p>

                  {result.errorPosition && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      错误位置: 第 {result.errorPosition.line} 行, 第 {result.errorPosition.column} 列
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* 错误高亮显示 */}
          {highlightedError && result && !result.isValid && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                错误位置指示:
              </label>
              <pre className="w-full h-32 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg font-mono text-sm overflow-auto whitespace-pre-wrap"
              >
                {highlightedError}
              </pre>
            </motion.div>
          )}

          {/* JSON结构预览 */}
          {result && result.isValid && input && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
            >
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                📊 JSON 结构分析
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-500">对象键数:</span>
                  <span className="ml-2 font-semibold">{Object.keys(JSON.parse(input)).length}</span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-500">字符长度:</span>
                  <span className="ml-2 font-semibold">{input.length}</span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-500">行数:</span>
                  <span className="ml-2 font-semibold">{input.split('\n').length}</span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-500">状态:</span>
                  <span className="ml-2 font-semibold text-green-600">有效</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}