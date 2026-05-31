import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, FlaskConical, StickyNote, Highlighter } from 'lucide-react';
import type { Chapter } from '@/types';
import CodeBlock from '@/components/ui-custom/CodeBlock';

interface ChapterDetailProps {
  chapter: Chapter;
  isCompleted: boolean;
  simplifyMode: boolean;
  onBack: () => void;
  onMarkComplete: (chapterId: number) => void;
  onStartQuiz: (chapterId: number) => void;
  onAddNote: (text: string, chapterId: number, chapterTitle: string) => void;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({
  chapter,
  isCompleted,
  simplifyMode,
  onBack,
  onMarkComplete,
  onStartQuiz,
  onAddNote,
}) => {
  const [notePanelOpen, setNotePanelOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedText, setSelectedText] = useState('');

  const handleTextSelection = () => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 5) {
      setSelectedText(selection);
    }
  };

  const handleSaveNote = () => {
    const text = noteText || selectedText;
    if (text) {
      onAddNote(text, chapter.id, chapter.title);
      setNoteText('');
      setSelectedText('');
      setNotePanelOpen(false);
    }
  };

  const content = simplifyMode ? chapter.simplifiedContent : chapter.content.overview;
  const sections = chapter.content.sections;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen pb-16 sm:pb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#8A93B8] hover:text-white transition-colors text-sm"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>رجوع</span>
        </button>
        <span className="text-[#5A6388] text-xs sm:text-sm">فصل {chapter.number}</span>
      </div>

      {/* Content Card */}
      <div className="max-w-3xl mx-auto w-full">
        <div className="glass rounded-xl sm:rounded-[20px] p-4 sm:p-6 lg:p-10" onMouseUp={handleTextSelection}>
          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{chapter.title}</h1>
          <div className="w-10 sm:w-[60px] h-0.5 sm:h-[2px] bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] mb-4 sm:mb-6" />

          {/* Overview */}
          <div className="prose prose-invert max-w-none">
            {simplifyMode ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-[#E2E8F0] leading-relaxed sm:leading-[1.9] text-sm sm:text-base mb-5 sm:mb-8"
              >
                {chapter.simplifiedContent}
              </motion.div>
            ) : (
              <>
                <p className="text-[#E2E8F0] leading-relaxed sm:leading-[1.9] text-sm sm:text-base mb-5 sm:mb-8">{chapter.content.overview}</p>

                {/* Sections */}
                {sections.map((section, idx) => (
                  <div key={idx} className="mb-5 sm:mb-8">
                    <h2 className="text-base sm:text-xl font-semibold text-white mb-2 sm:mb-3 border-r-2 sm:border-r-4 border-[#7B5CFF] pr-2 sm:pr-3">
                      {section.title}
                    </h2>
                    <p className="text-[#8A93B8] leading-relaxed sm:leading-[1.9] text-sm sm:text-base mb-3 sm:mb-4 whitespace-pre-line">{section.content}</p>
                    {section.code && <CodeBlock code={section.code} language="C#" />}
                  </div>
                ))}
              </>
            )}

            {/* Analogy Card */}
            <div className="my-5 sm:my-8 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[rgba(123,92,255,0.08)] border border-[rgba(123,92,255,0.3)]">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-lg sm:text-2xl">💡</span>
                <span className="text-[#7B5CFF] text-xs sm:text-sm font-semibold">مثال من الحياة</span>
              </div>
              <p className="text-[#E2E8F0] text-sm sm:text-base leading-relaxed">{chapter.analogy}</p>
            </div>

          </div>

          {/* Quick Note from Selection */}
          {selectedText && !notePanelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[#00D4FF]/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Highlighter className="w-4 h-4 text-[#00D4FF]" />
                <span className="text-[#00D4FF] text-sm truncate max-w-[300px]">{selectedText}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setNotePanelOpen(true); setNoteText(selectedText); }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/30 transition-colors"
                >
                  احفظ كملاحظة
                </button>
                <button
                  onClick={() => setSelectedText('')}
                  className="text-[#5A6388] hover:text-white text-xs"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-8">
          {!isCompleted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMarkComplete(chapter.id)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] text-[#0B0E1A] font-bold text-sm hover:shadow-lg hover:shadow-[#00D4FF]/20 transition-all"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>علّمه مكتمل</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartQuiz(chapter.id)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border border-[#4A5CC7] text-[#00D4FF] font-semibold text-sm hover:bg-[rgba(0,212,255,0.1)] transition-all"
          >
            <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>اختبر نفسك</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setNotePanelOpen(!notePanelOpen)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border border-[#2A3260] text-[#8A93B8] font-semibold text-sm hover:bg-[rgba(255,255,255,0.05)] transition-all"
          >
            <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>أضف ملاحظة</span>
          </motion.button>
        </div>

        {/* Note Panel */}
        {notePanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 sm:mt-4 glass rounded-xl p-4 sm:p-6"
          >
            <h3 className="text-white font-semibold text-sm sm:text-base mb-2 sm:mb-3">أضف ملاحظة جديدة</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="اكتب ملاحظتك هنا..."
              className="w-full h-24 bg-[rgba(11,14,26,0.8)] border border-[#2A3260] rounded-xl p-4 text-white placeholder-[#5A6388] focus:border-[#4A5CC7] focus:outline-none resize-none text-sm"
              dir="rtl"
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] text-[#0B0E1A] font-semibold text-sm"
              >
                احفظ
              </button>
              <button
                onClick={() => { setNotePanelOpen(false); setNoteText(''); setSelectedText(''); }}
                className="px-4 py-2 rounded-lg text-[#8A93B8] hover:text-white text-sm"
              >
                إلغاء
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(ChapterDetail);
