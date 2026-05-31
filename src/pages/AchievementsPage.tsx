import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Footprints, Trophy, Crown, Sprout, Search as SearchIcon, GitBranch, Wand2, Sparkles, Target, Sword, Star, BookOpen, Library, BrainCircuit, Compass, Moon, Zap, Lightbulb, Scale, Flame } from 'lucide-react';
import type { Achievement } from '@/types';

interface AchievementsPageProps {
  achievements: Achievement[];
  unlockedAchievements: Record<string, boolean>;
  onBack: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Footprints, Trophy, Crown, Sprout, SearchIcon, GitBranch, Wand2, Sparkles, Target, Sword, Star, BookOpen, Library, BrainCircuit, Compass, Moon, Zap, Lightbulb, Scale, Flame,
};

const categoryLabels: Record<string, string> = {
  progress: 'التقدم',
  quiz: 'الاختبارات',
  special: 'مميز',
};

const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  unlockedAchievements,
  onBack,
}) => {
  const unlockedCount = Object.values(unlockedAchievements).filter(Boolean).length;
  const totalCount = achievements.length;

  const grouped = achievements.reduce((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {} as Record<string, typeof achievements>);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="min-h-screen"
    >
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A93B8] hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span>رجوع</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">إنجازاتك 🏆</h1>
          <p className="text-[#5A6388]">{unlockedCount} من {totalCount} إنجاز</p>
          <div className="mt-4 h-2 bg-[#2A3260] rounded-full max-w-md mx-auto overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] rounded-full"
            />
          </div>
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-[#8A93B8] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
              {categoryLabels[category]}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((achievement, idx) => {
                const isUnlocked = unlockedAchievements[achievement.id];
                const Icon = iconMap[achievement.icon] || Sparkles;

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative group rounded-2xl p-5 text-center transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-[rgba(0,212,255,0.15)] to-[rgba(123,92,255,0.15)] border-2 border-[#00D4FF] glow-pulse'
                        : 'bg-[rgba(21,25,41,0.4)] border border-[#2A3260]'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                      isUnlocked ? 'bg-[#00D4FF]/20' : 'bg-[#2A3260]'
                    }`}>
                      {isUnlocked ? (
                        <Icon className="w-7 h-7 text-[#00D4FF]" />
                      ) : (
                        <Lock className="w-5 h-5 text-[#5A6388]" />
                      )}
                    </div>
                    <h3 className={`text-sm font-semibold mb-1 ${isUnlocked ? 'text-white' : 'text-[#5A6388]'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-xs ${isUnlocked ? 'text-[#8A93B8]' : 'text-[#5A6388]/60'}`}>
                      {achievement.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(AchievementsPage);
