import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, X, BookOpen } from 'lucide-react';
import type { Chapter } from '@/types';

interface SearchPageProps {
  chapters: Chapter[];
  onNavigate: (page: 'chapter', chapterId: number) => void;
  onBack: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ chapters, onNavigate, onBack }) => {
  const [query, setQuery] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matches: { chapter: Chapter; field: string; snippet: string }[] = [];

    chapters.forEach(chapter => {
      // Search in title
      if (chapter.title.toLowerCase().includes(q)) {
        matches.push({ chapter, field: 'العنوان', snippet: chapter.title });
      }
      // Search in summary
      if (chapter.summary.toLowerCase().includes(q)) {
        const idx = chapter.summary.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 30);
        const end = Math.min(chapter.summary.length, idx + 60);
        matches.push({ chapter, field: 'الملخص', snippet: '...' + chapter.summary.slice(start, end) + '...' });
      }
      // Search in key points
      chapter.keyPoints.forEach(point => {
        if (point.toLowerCase().includes(q)) {
          matches.push({ chapter, field: 'نقطة مهمة', snippet: point });
        }
      });
      // Search in analogy
      if (chapter.analogy.toLowerCase().includes(q)) {
        const idx = chapter.analogy.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 30);
        const end = Math.min(chapter.analogy.length, idx + 60);
        matches.push({ chapter, field: 'مثال', snippet: '...' + chapter.analogy.slice(start, end) + '...' });
      }
      // Search in content
      const contentText = JSON.stringify(chapter.content).toLowerCase();
      if (contentText.includes(q)) {
        matches.push({ chapter, field: 'المحتوى', snippet: chapter.content.overview.slice(0, 80) + '...' });
      }
    });

    return matches;
  }, [query, chapters]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="bg-[rgba(0,212,255,0.3)] text-white px-0.5 rounded">{part}</span>
        : part
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A93B8] hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span>رجوع</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">البحث 🔍</h1>

        {/* Search Input */}
        <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4 mb-8 border-b-2 border-[#2A3260] focus-within:border-[#00D4FF] transition-colors">
          <Search className="w-6 h-6 text-[#5A6388] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="دور على أي حاجة..."
            className="bg-transparent text-white text-xl placeholder-[#5A6388] outline-none flex-1"
            dir="rtl"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#5A6388] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="space-y-3">
            <p className="text-[#5A6388] text-sm mb-4">{results.length} نتيجة</p>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#5A6388]">مفيش نتائج للبحث "{query}"</p>
              </div>
            ) : (
              results.map((result, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onNavigate('chapter', result.chapter.id)}
                  className="glass rounded-xl p-4 cursor-pointer hover:border-[#4A5CC7] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">{result.chapter.title}</span>
                        <span className="text-[#00D4FF] text-xs bg-[#00D4FF]/10 px-2 py-0.5 rounded-full">{result.field}</span>
                      </div>
                      <p className="text-[#8A93B8] text-sm">{highlightMatch(result.snippet, query)}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Quick Categories */}
        {!query.trim() && (
          <div className="mt-8">
            <p className="text-[#5A6388] text-sm mb-4">ابحث عن:</p>
            <div className="flex flex-wrap gap-2">
              {['كلاس', 'أوبجكت', 'وراثة', 'Polymorphism', 'Interface', 'Constructor', 'Delegate'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-full border border-[#2A3260] text-[#8A93B8] hover:border-[#4A5CC7] hover:text-white transition-all text-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(SearchPage);
