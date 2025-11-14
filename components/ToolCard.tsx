'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import { Tool } from '@/data/tools';

interface ToolCardProps {
  tool: Tool;
  index: number;
}

export default function ToolCard({ tool, index }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -12 }}
      className="group"
    >
      <div className="relative h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/20">
        {/* Colored Left Accent Bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${tool.gradient} rounded-l-3xl`} />

        {/* Subtle Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* Featured Badge - Glass Style */}
        {tool.featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center space-x-1 backdrop-blur-lg bg-yellow-400/90 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-500/50">
              <Star className="w-3 h-3 fill-current" />
              <span>推荐</span>
            </div>
          </div>
        )}

        <div className="p-8">
          {/* Icon - Larger with Glass Effect */}
          <div className="mb-6">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-5xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/30`}>
              {tool.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500">
            {tool.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2">
            {tool.description}
          </p>

          {/* Tags - Glass Style */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tool.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 backdrop-blur-sm bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-white/40 dark:border-gray-600/40"
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="px-3 py-1.5 backdrop-blur-sm bg-gray-100/60 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 rounded-full text-xs">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>

          {/* Action Button - Glass Gradient */}
          <button
            onClick={() => {
              if (tool.url.startsWith('/') && !tool.url.startsWith('//')) {
                window.location.href = tool.url;
              } else {
                window.open(tool.url, '_blank');
              }
            }}
            className={`w-full py-4 px-6 bg-gradient-to-r ${tool.gradient} text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 group/btn border border-white/20`}
          >
            <span className="drop-shadow-sm">立即体验</span>
            <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform drop-shadow-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
