import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Flame, CheckCircle, PlayCircle, Box, Users, Hammer, Shuffle, SlidersHorizontal, PlusCircle, GitFork, Sparkles, ListOrdered, Link } from 'lucide-react';
import type { Chapter } from '@/types';
import ProgressRing from '@/components/ui-custom/ProgressRing';

interface DashboardProps {
  chapters: Chapter[];
  chaptersProgress: Record<number, number>;
  chaptersCompleted: Record<number, boolean>;
  simplifyMode: boolean;
  onNavigate: (page: 'chapter', chapterId: number) => void;
  onToggleSimplifyChapter: (chapterId: number) => void;
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
}

const iconMap: Record<string, React.ElementType> = {
  Box, Users, Hammer, Shuffle, SlidersHorizontal, PlusCircle, GitFork, Sparkles, ListOrdered, Link,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const Dashboard: React.FC<DashboardProps> = ({
  chapters,
  chaptersProgress,
  chaptersCompleted,
  xp,
  level,
  levelTitle,
  streak,
  onNavigate,
}) => {
  const completedCount = Object.values(chaptersCompleted).filter(Boolean).length;
  const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-4 sm:mb-6 lg:mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">مرحباً يا نجم! 🌟</h1>
            <p className="text-[#5A6388] text-[11px] sm:text-sm mt-0.5">{today}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="glass rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#00D4FF]" />
              <span className="text-white font-semibold text-xs sm:text-base">{xp} XP</span>
            </div>
            <div className="glass rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#FFD700]" />
              <span className="text-white font-semibold text-xs sm:text-base">المستوى {level}</span>
            </div>
            <div className="glass rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#FF6B9D]" />
              <span className="text-[#FF6B9D] font-semibold text-xs sm:text-base">{streak} أيام 🔥</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="glass-card p-3 sm:p-5 lg:p-6 mb-4 sm:mb-6 lg:mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm sm:text-lg font-semibold text-white">مسار التعلم 🎯</h2>
            <p className="text-[#5A6388] text-[10px] sm:text-sm">{levelTitle} — أكملت {completedCount} من 10 فصول</p>
          </div>
          <span className="text-[#00D4FF] font-bold text-sm sm:text-base">{Math.round((completedCount / 10) * 100)}%</span>
        </div>
        <div className="h-2 sm:h-3 bg-[#2A3260] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / 10) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] rounded-full"
          />
        </div>
      </motion.div>

      {/* Chapter Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
      >
        {chapters.map((chapter) => {
          const isCompleted = chaptersCompleted[chapter.id] || false;
          const progress = chaptersProgress[chapter.id] || 0;
          const Icon = iconMap[chapter.icon] || Box;

          return (
            <motion.div
              key={chapter.id}
              variants={item}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('chapter', chapter.id)}
              className={`glass-card p-3.5 sm:p-5 lg:p-7 relative overflow-hidden transition-all duration-200 glass-card-hover cursor-pointer
                ${isCompleted ? 'border-[#00D4A0]/30' : ''}`}
            >
              {/* Chapter Number */}
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-[#00D4A0]/20' : 'bg-[#00D4FF]/20'
                  }`}>
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isCompleted ? 'text-[#00D4A0]' : 'text-[#00D4FF]'
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[#5A6388] text-[10px] sm:text-xs">فصل {chapter.number}</span>
                    <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg leading-tight truncate">{chapter.title}</h3>
                  </div>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                <div className="scale-[0.85] sm:scale-100 origin-center">
                  <ProgressRing progress={isCompleted ? 100 : progress} size={64} strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0 hidden min-[360px]:block">
                  <p className="text-[#8A93B8] text-[11px] sm:text-sm line-clamp-2">{chapter.simplifiedSummary}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                {isCompleted ? (
                  <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#00D4A0]/15 text-[#00D4A0] flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> مكتمل
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#00D4FF]/15 text-[#00D4FF] flex items-center gap-1">
                    <PlayCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> قيد التقدم
                  </span>
                )}
              </div>

              {/* Key Points Preview */}
              <div className="mt-2 sm:mt-3 space-y-0.5">
                {chapter.keyPoints.slice(0, 2).map((point, i) => (
                  <p key={i} className="text-[#5A6388] text-[10px] sm:text-xs truncate">• {point}</p>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default React.memo(Dashboard);
