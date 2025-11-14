'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { categories } from '@/data/tools';

interface NavbarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (category: string) => {
    onCategoryChange(category);
    const element = document.getElementById('tools-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl bg-white/90 dark:bg-gray-900/95 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg'
          : 'backdrop-blur-xl bg-white/10 dark:bg-black/10 border-b border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Simplified */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className={`w-10 h-10 rounded-lg backdrop-blur-sm flex items-center justify-center border ${
              isScrolled
                ? 'bg-purple-500/20 border-purple-500/30'
                : 'bg-white/20 border-white/30'
            }`}>
              <Sparkles className={`w-6 h-6 ${
                isScrolled ? 'text-purple-600 dark:text-purple-400' : 'text-white'
              }`} />
            </div>
            <span className={`text-2xl font-bold ${
              isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}>
              创意导航
            </span>
          </div>

          {/* Desktop Navigation - Glass Tags */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToSection(category.id)}
                  className={`px-6 py-3 rounded-full text-base font-semibold transition-all duration-200 ${
                    activeCategory === category.id
                      ? isScrolled
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/30 text-white backdrop-blur-lg border border-white/50 shadow-lg'
                      : isScrolled
                        ? 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800 hover:text-purple-600 border border-transparent'
                        : 'text-white/80 hover:bg-white/20 hover:text-white hover:backdrop-blur-sm border border-transparent'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar - Glass Style */}
          <div className="hidden md:block flex-1 max-w-xs mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full backdrop-blur-lg border ${
                  isScrolled
                    ? 'bg-gray-100/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50'
                } focus:outline-none text-base transition-all duration-200`}
              />
              <svg
                className={`absolute left-3 top-2.5 w-5 h-5 ${
                  isScrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/60'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Mobile menu button - Glass */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-white/90 hover:bg-white/20'
              }`}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Glass Card */}
      {isMenuOpen && (
        <div className={`md:hidden backdrop-blur-xl border-t ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 border-gray-200/50 dark:border-gray-700/50'
            : 'bg-black/20 border-white/20'
        }`}>
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search - Glass */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full backdrop-blur-lg border ${
                  isScrolled
                    ? 'bg-gray-100/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
                    : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/50'
                } focus:outline-none text-base transition-all duration-200`}
              />
              <svg
                className={`absolute left-3 top-2.5 w-5 h-5 ${
                  isScrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/60'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.id)}
                className={`w-full text-left px-5 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                  activeCategory === category.id
                    ? isScrolled
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/20 text-white backdrop-blur-lg border border-white/30'
                    : isScrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
