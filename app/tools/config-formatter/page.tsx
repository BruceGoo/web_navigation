'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code, FileText, Settings, CheckCircle } from 'lucide-react';

const formatterTools = [
  {
    id: 'multi-format',
    name: '多格式转换器',
    description: 'YAML / JSON / TOML / INI / Properties 互转与格式化',
    icon: '🔄',
    route: '/tools/config-formatter/multi-format',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['格式转换', '语法校验', '错误提示', '双向转换']
  },
  {
    id: 'nginx',
    name: 'Nginx 配置格式化',
    description: 'Nginx 配置文件格式化、语法检查、高亮显示',
    icon: '🌐',
    route: '/tools/config-formatter/nginx',
    gradient: 'from-green-500 to-emerald-500',
    features: ['自动缩进', '括号配对', '语法高亮', '指令校验']
  },
  {
    id: 'dockerfile',
    name: 'Dockerfile 格式化',
    description: 'Dockerfile 格式化、指令排序、语法校验',
    icon: '🐳',
    route: '/tools/config-formatter/dockerfile',
    gradient: 'from-blue-600 to-blue-400',
    features: ['指令排序', '多阶段验证', '最佳实践', '格式美化']
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes YAML 工具',
    description: 'K8s YAML 格式化、资源识别、Schema 校验',
    icon: '☸️',
    route: '/tools/config-formatter/kubernetes',
    gradient: 'from-purple-500 to-indigo-500',
    features: ['资源识别', '格式校验', '字段检查', 'Schema 验证']
  }
];

export default function ConfigFormatterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            配置文件格式化工具
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的配置文件格式化、校验和转换工具，支持 Nginx、Dockerfile、YAML、JSON 等常用配置格式
          </p>
        </motion.div>

        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {formatterTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => router.push(tool.route)}
              className="cursor-pointer"
            >
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${tool.gradient} bg-opacity-10`}>
                {/* 工具图标和标题 */}
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{tool.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* 功能特性 */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    点击进入工具
                  </span>
                  <div className="flex items-center text-blue-500 dark:text-blue-400">
                    <span className="text-sm font-medium mr-1">使用工具</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              🔧 功能特色
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-center">
                <Code className="w-5 h-5 mr-2 text-blue-500" />
                智能语法高亮
              </div>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                实时错误检查
              </div>
              <div className="flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2 text-purple-500" />
                一键格式转换
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}