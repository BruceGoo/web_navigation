'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import ToolCard from './ToolCard';
import { toolsData, categories } from '@/data/tools';

interface ToolsSectionProps {
  searchQuery: string;
}

export default function ToolsSection({ searchQuery }: ToolsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTools = useMemo(() => {
    let filtered = toolsData;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((tool) => tool.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  const activeCategoryData = categories.find((cat) => cat.id === activeCategory);

  return (
    <section id="tools-section" className="py-20 bg-white dark:bg-gray-900 transition-colors relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block backdrop-blur-xl bg-white/50 dark:bg-black/30 rounded-3xl border border-white/20 p-8 shadow-xl">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
              {activeCategoryData?.name || '全部'}工具
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {searchQuery
                ? `搜索到 ${filteredTools.length} 个相关工具`
                : `发现 ${filteredTools.length} 个精彩工具，让创意无限延伸`}
            </p>
          </div>
        </motion.div>

        {/* Category Filter Tabs - Glass Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/30 scale-105'
                  : 'backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:scale-105'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Search Results Info */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center text-gray-600 dark:text-gray-400"
          >
            正在搜索: <span className="font-semibold text-primary-600">{searchQuery}</span>
          </motion.div>
        )}

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              未找到相关工具
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              尝试使用其他关键词或切换分类
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
