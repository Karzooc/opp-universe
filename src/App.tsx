import { useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppState } from '@/hooks/useAppState';
import { useChapters, useQuizzes, useAchievements } from '@/hooks/useData';
import AuroraBackground from '@/components/aurora/AuroraBackground';
import Sidebar from '@/components/ui-custom/Sidebar';
import Toast from '@/components/ui-custom/Toast';
import Dashboard from '@/pages/Dashboard';
import ChapterDetail from '@/pages/ChapterDetail';
import QuizPage from '@/pages/QuizPage';
import NotesPage from '@/pages/NotesPage';
import AchievementsPage from '@/pages/AchievementsPage';
import ComparisonPage from '@/pages/ComparisonPage';
import FocusPage from '@/pages/FocusPage';
import SearchPage from '@/pages/SearchPage';
import { WhatsAppFab, AppFooter } from '@/components/ui-custom/SiteCredits';
import type { PageType } from '@/types';

function App() {
  const {
    state,
    navigateTo,
    addXP,
    markChapterComplete,
    addNote,
    deleteNote,
    toggleSimplifyMode,
    unlockAchievement,
    saveQuizScore,
    clearToast,
  } = useAppState();

  const { chapters } = useChapters();
  const { quizzes, loading: quizzesLoading } = useQuizzes();
  const { achievements } = useAchievements();

  const unlockedChapters = useMemo(
    () => chapters.map(ch => ({ ...ch, status: 'unlocked' as const })),
    [chapters]
  );

  const currentChapter = useMemo(() => 
    chapters.find(c => c.id === state.currentChapterId),
    [chapters, state.currentChapterId]
  );

  const currentQuiz = useMemo(() => {
    if (state.currentChapterId == null) return undefined;
    return quizzes.find(q => q.chapterId === state.currentChapterId);
  }, [quizzes, state.currentChapterId]);

  const completedCount = useMemo(() =>
    Object.values(state.chaptersCompleted).filter(Boolean).length,
    [state.chaptersCompleted]
  );

  // Achievement checks
  useEffect(() => {
    if (completedCount >= 1) unlockAchievement('first_chapter');
    if (completedCount >= 5) unlockAchievement('chapter_hero');
    if (completedCount >= 10) unlockAchievement('oop_master');
    if (state.level >= 1) unlockAchievement('beginner');
    if (state.level >= 2) unlockAchievement('class_explorer');
    if (state.level >= 3) unlockAchievement('inheritance_master');
    if (state.level >= 4) unlockAchievement('architecture_wizard');
    if (state.notes.length >= 1) unlockAchievement('note_taker');
    if (state.notes.length >= 10) unlockAchievement('collector');
    if (state.simplifyMode) unlockAchievement('simplify_fan');
  }, [completedCount, state.level, state.notes.length, state.simplifyMode, unlockAchievement]);

  const handleNavigate = useCallback((page: PageType, chapterId?: number) => {
    navigateTo(page, chapterId);
  }, [navigateTo]);

  const handleMarkComplete = useCallback((chapterId: number) => {
    markChapterComplete(chapterId);
    unlockAchievement('first_chapter');
  }, [markChapterComplete, unlockAchievement]);

  const handleQuizComplete = useCallback((chapterId: number, score: number, total: number) => {
    saveQuizScore(chapterId, score, total);
    
    // Unlock quiz achievements
    const quizCount = Object.keys(state.quizScores).length;
    if (quizCount >= 0) unlockAchievement('quiz_rookie');
    if (quizCount >= 4) unlockAchievement('quiz_warrior');
    if (score === total) unlockAchievement('perfect_score');

    if (score === total) {
      addXP(50, 'Quiz مثالي! +50 XP');
    } else if (score >= total / 2) {
      addXP(20, 'Quiz منتهي! +20 XP');
    }
  }, [saveQuizScore, state.quizScores, unlockAchievement, addXP]);

  const isFocusMode = state.currentPage === 'focus';

  return (
    <div className="min-h-screen bg-[#0B0E1A] relative">
      {/* Aurora Background */}
      <AuroraBackground intensified={isFocusMode} />

      {/* Layout */}
      <div className="relative z-10 flex">
        {/* Sidebar */}
        {!isFocusMode && (
          <Sidebar
            currentPage={state.currentPage}
            onNavigate={handleNavigate}
            xp={state.xp}
            level={state.level}
            levelTitle={state.levelTitle}
            streak={state.streak}
            simplifyMode={state.simplifyMode}
            onToggleSimplify={toggleSimplifyMode}
            onSearch={() => {}}
            completedCount={completedCount}
          />
        )}

        {/* Main Content */}
        <main 
          className={`flex-1 min-h-screen w-full min-w-0 ${
            isFocusMode
              ? ''
              : 'lg:mr-[280px] max-lg:pt-[calc(3.25rem+env(safe-area-inset-top))] max-lg:pl-0'
          }`}
        >
          <div className="px-3 py-3 sm:px-4 sm:py-4 lg:p-8 pb-[calc(4.5rem+env(safe-area-inset-bottom))] max-w-[100vw] overflow-x-hidden">
            <AnimatePresence mode="wait">
              {state.currentPage === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Dashboard
                    chapters={unlockedChapters}
                    chaptersProgress={state.chaptersProgress}
                    chaptersCompleted={state.chaptersCompleted}
                    xp={state.xp}
                    level={state.level}
                    levelTitle={state.levelTitle}
                    streak={state.streak}
                    simplifyMode={state.simplifyMode}
                    onNavigate={handleNavigate}
                    onToggleSimplifyChapter={() => {}}
                  />
                </motion.div>
              )}

              {state.currentPage === 'chapter' && currentChapter && (
                <motion.div
                  key={`chapter-${currentChapter.id}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChapterDetail
                    chapter={currentChapter}
                    isCompleted={!!state.chaptersCompleted[currentChapter.id]}
                    simplifyMode={state.simplifyMode}
                    onBack={() => handleNavigate('dashboard')}
                    onMarkComplete={handleMarkComplete}
                    onStartQuiz={(id) => handleNavigate('quiz', id)}
                    onAddNote={addNote}
                  />
                </motion.div>
              )}

              {state.currentPage === 'quiz' && state.currentChapterId != null && (
                <motion.div
                  key={`quiz-${state.currentChapterId}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <QuizPage
                    quiz={currentQuiz}
                    loading={quizzesLoading}
                    chapterTitle={currentChapter?.title ?? `فصل ${state.currentChapterId}`}
                    chapterId={state.currentChapterId}
                    onBack={() => handleNavigate('chapter', state.currentChapterId!)}
                    onComplete={handleQuizComplete}
                    onAddXP={addXP}
                  />
                </motion.div>
              )}

              {state.currentPage === 'notes' && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NotesPage
                    notes={state.notes}
                    onBack={() => handleNavigate('dashboard')}
                    onDeleteNote={deleteNote}
                  />
                </motion.div>
              )}

              {state.currentPage === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AchievementsPage
                    achievements={achievements}
                    unlockedAchievements={state.achievements}
                    onBack={() => handleNavigate('dashboard')}
                  />
                </motion.div>
              )}

              {state.currentPage === 'comparison' && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ComparisonPage onBack={() => handleNavigate('dashboard')} />
                </motion.div>
              )}

              {state.currentPage === 'focus' && (
                <motion.div
                  key="focus"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FocusPage onBack={() => handleNavigate('dashboard')} />
                </motion.div>
              )}

              {state.currentPage === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SearchPage
                    chapters={chapters}
                    onNavigate={handleNavigate}
                    onBack={() => handleNavigate('dashboard')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {!isFocusMode && <AppFooter />}
          </div>
        </main>
      </div>

      {!isFocusMode && <WhatsAppFab />}

      {/* Toast */}
      <Toast toast={state.toast} onClose={clearToast} />
    </div>
  );
}

export default App;
