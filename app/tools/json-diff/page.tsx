'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DiffResult {
  type: 'added' | 'removed' | 'modified' | 'equal';
  key: string;
  value1?: any;
  value2?: any;
  path: string;
}

export default function JsonDiff() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');

  const compareJson = useCallback(() => {
    if (!json1.trim() || !json2.trim()) {
      setError('请提供两个JSON数据进行对比');
      return;
    }

    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);

      const diff = deepDiff(obj1, obj2, '');
      setDiffResult(diff);
      setError('');
    } catch (err) {
      setError(`JSON格式错误: ${err instanceof Error ? err.message : '未知错误'}`);
      setDiffResult([]);
    }
  }, [json1, json2]);

  const deepDiff = (obj1: any, obj2: any, path: string): DiffResult[] => {
    const results: DiffResult[] = [];

    // 获取所有键
    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

    keys.forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      if (!(key in obj1)) {
        // 新增
        results.push({
          type: 'added',
          key,
          value2: val2,
          path: currentPath
        });
      } else if (!(key in obj2)) {
        // 删除
        results.push({
          type: 'removed',
          key,
          value1: val1,
          path: currentPath
        });
      } else if (typeof val1 === 'object' && typeof val2 === 'object' &&
                 val1 !== null && val2 !== null &&
                 !Array.isArray(val1) && !Array.isArray(val2)) {
        // 递归比较对象
        results.push(...deepDiff(val1, val2, currentPath));
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        // 修改
        results.push({
          type: 'modified',
          key,
          value1: val1,
          value2: val2,
          path: currentPath
        });
      } else {
        // 相等
        results.push({
          type: 'equal',
          key,
          value1: val1,
          path: currentPath
        });
      }
    });

    return results;
  };

  const clearAll = useCallback(() => {
    setJson1('');
    setJson2('');
    setDiffResult([]);
    setError('');
  }, []);

  const loadExample = useCallback(() => {
    const example1 = {
      "name": "John Doe",
      "age": 30,
      "email": "john.doe@example.com",
      "skills": ["JavaScript", "TypeScript"],
      "address": {
        "city": "New York",
        "country": "USA"
      }
    };

    const example2 = {
      "name": "John Doe",
      "age": 31,
      "email": "john.doe@newdomain.com",
      "skills": ["JavaScript", "TypeScript", "React"],
      "address": {
        "city": "Boston",
        "country": "USA",
        "zipCode": "02101"
      },
      "phone": "+1-555-1234"
    };

    setJson1(JSON.stringify(example1, null, 2));
    setJson2(JSON.stringify(example2, null, 2));
  }, []);

  const getDiffColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'removed': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'modified': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getDiffIcon = (type: string) => {
    switch (type) {
      case 'added': return '➕';
      case 'removed': return '➖';
      case 'modified': return '✏️';
      default: return '➡️';
    }
  };

  const exportResult = useCallback(() => {
    if (diffResult.length === 0) return;

    const result = {
      summary: {
        total: diffResult.length,
        added: diffResult.filter(d => d.type === 'added').length,
        removed: diffResult.filter(d => d.type === 'removed').length,
        modified: diffResult.filter(d => d.type === 'modified').length,
        equal: diffResult.filter(d => d.type === 'equal').length
      },
      differences: diffResult
    };

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'json-diff-result.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [diffResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            JSON 对比工具
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            对比两个JSON数据的差异
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
                onClick={compareJson}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🔍 开始对比
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🗑️ 清空
              </button>
              <button
                onClick={exportResult}
                disabled={diffResult.length === 0}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                📊 导出结果
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadExample}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm"
              >
                加载示例
              </button>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  显示模式:
                </label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as 'side-by-side' | 'unified')}
                  className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="side-by-side">并排对比</option>
                  <option value="unified">统一视图</option>
                </select>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                JSON 1 (原始):
              </label>
              <textarea
                value={json1}
                onChange={(e) => setJson1(e.target.value)}
                placeholder="输入第一个JSON数据..."
                className="w-full h-64 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                JSON 2 (对比):
              </label>
              <textarea
                value={json2}
                onChange={(e) => setJson2(e.target.value)}
                placeholder="输入第二个JSON数据..."
                className="w-full h-64 p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* 错误信息 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </motion.div>
          )}

          {/* 统计信息 */}
          {diffResult.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                📊 对比统计
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{diffResult.filter(d => d.type === 'added').length}</div>
                  <div className="text-green-600">新增➕</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{diffResult.filter(d => d.type === 'removed').length}</div>
                  <div className="text-red-600">删除➖</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{diffResult.filter(d => d.type === 'modified').length}</div>
                  <div className="text-yellow-600">修改✏️</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{diffResult.filter(d => d.type === 'equal').length}</div>
                  <div className="text-gray-600">相同➡️</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 差异结果 */}
          {diffResult.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                差异详情:
              </label>
              <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                {diffResult.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${getDiffColor(diff.type)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{getDiffIcon(diff.type)}</span>
                        <span className="font-mono font-semibold">{diff.path}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        diff.type === 'added' ? 'bg-green-200 text-green-800' :
                        diff.type === 'removed' ? 'bg-red-200 text-red-800' :
                        diff.type === 'modified' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {diff.type === 'added' ? '新增' :
                         diff.type === 'removed' ? '删除' :
                         diff.type === 'modified' ? '修改' : '相同'}
                      </span>
                    </div>

                    {diff.type === 'modified' && (
                      <div className="mt-2 ml-6 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-800">
                          <span className="text-red-600 dark:text-red-400 font-medium">原始值:</span>
                          <pre className="mt-1 text-xs font-mono whitespace-pre-wrap">{JSON.stringify(diff.value1, null, 2)}</pre>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-800">
                          <span className="text-green-600 dark:text-green-400 font-medium">新值:</span>
                          <pre className="mt-1 text-xs font-mono whitespace-pre-wrap">{JSON.stringify(diff.value2, null, 2)}</pre>
                        </div>
                      </div>
                    )}

                    {diff.type === 'added' && (
                      <div className="mt-2 ml-6">
                        <pre className="text-xs font-mono p-2 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-800 whitespace-pre-wrap">
                          {JSON.stringify(diff.value2, null, 2)}
                        </pre>
                      </div>
                    )}

                    {diff.type === 'removed' && (
                      <div className="mt-2 ml-6">
                        <pre className="text-xs font-mono p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-800 whitespace-pre-wrap">
                          {JSON.stringify(diff.value1, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}