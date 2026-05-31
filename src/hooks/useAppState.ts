import { useState, useCallback, useEffect } from 'react';
import type { AppState, ToastMessage, UserNote, PageType } from '@/types';

const LEVEL_TITLES = ['OOP Beginner', 'Class Explorer', 'Inheritance Master', 'Architecture Wizard'];
const LEVEL_THRESHOLDS = [0, 500, 1200, 2500];

const DEFAULT_STATE: AppState = {
  currentPage: 'dashboard',
  currentChapterId: null,
  chaptersProgress: { 1: 0 },
  chaptersCompleted: {},
  xp: 0,
  level: 1,
  levelTitle: 'OOP Beginner',
  streak: 0,
  lastVisitDate: '',
  notes: [],
  simplifyMode: false,
  achievements: {},
  searchQuery: '',
  focusModeTime: 25,
  quizScores: {},
  toast: null,
};

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('oop_mastery_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STATE, ...parsed, toast: null };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_STATE };
}

function saveState(state: AppState) {
  try {
    const { toast, ...toSave } = state;
    localStorage.setItem('oop_mastery_state', JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

function calculateLevel(xp: number): { level: number; title: string } {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return { level, title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const navigateTo = useCallback((page: PageType, chapterId?: number) => {
    setState(prev => ({
      ...prev,
      currentPage: page,
      currentChapterId: chapterId ?? prev.currentChapterId,
    }));
  }, []);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setState(prev => ({ ...prev, toast: { ...toast, id } }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toast: null }));
    }, 4000);
  }, []);

  const addXP = useCallback((amount: number, reason?: string) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const { level, title } = calculateLevel(newXP);
      const prevLevel = prev.level;
      
      if (level > prevLevel) {
        // Level up!
        return {
          ...prev,
          xp: newXP,
          level,
          levelTitle: title,
        };
      }
      
      return {
        ...prev,
        xp: newXP,
        level,
        levelTitle: title,
      };
    });

    if (reason) {
      showToast({
        type: 'success',
        title: `+${amount} XP`,
        message: reason,
      });
    }
  }, [showToast]);

  const markChapterComplete = useCallback((chapterId: number) => {
    setState(prev => {
      const alreadyCompleted = prev.chaptersCompleted[chapterId];
      const newCompleted = { ...prev.chaptersCompleted, [chapterId]: true };
      const newProgress = { ...prev.chaptersProgress, [chapterId]: 100 };
      
      // Unlock next chapter
      const nextChapter = chapterId + 1;
      if (nextChapter <= 10) {
        newProgress[nextChapter] = newProgress[nextChapter] ?? 0;
      }

      const newState = {
        ...prev,
        chaptersCompleted: newCompleted,
        chaptersProgress: newProgress,
      };

      if (!alreadyCompleted) {
        const { level, title } = calculateLevel(prev.xp + 100);
        newState.xp = prev.xp + 100;
        newState.level = level;
        newState.levelTitle = title;
      }

      return newState;
    });

    showToast({
      type: 'success',
      title: 'فصل مكتمل! 🎉',
      message: 'كسبت 100 XP! إنت رهيب يا نجم!',
    });
  }, [showToast]);

  const updateChapterProgress = useCallback((chapterId: number, progress: number) => {
    setState(prev => ({
      ...prev,
      chaptersProgress: { ...prev.chaptersProgress, [chapterId]: progress },
    }));
  }, []);

  const addNote = useCallback((text: string, chapterId: number, chapterTitle: string) => {
    const note: UserNote = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      chapterId,
      chapterTitle,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      notes: [note, ...prev.notes],
    }));
    showToast({
      type: 'success',
      title: 'ملاحظة محفوظة! 📝',
      message: 'اتحفظت في دفتر ملاحظاتك يا يسطا!',
    });
  }, [showToast]);

  const deleteNote = useCallback((noteId: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== noteId),
    }));
  }, []);

  const toggleSimplifyMode = useCallback(() => {
    setState(prev => ({ ...prev, simplifyMode: !prev.simplifyMode }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.achievements[achievementId]) return prev;
      return {
        ...prev,
        achievements: { ...prev.achievements, [achievementId]: true },
      };
    });
  }, []);

  const saveQuizScore = useCallback((chapterId: number, score: number, total: number) => {
    setState(prev => {
      const existing = prev.quizScores[chapterId];
      const bestScore = existing ? Math.max(existing.bestScore, score) : score;
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [chapterId]: { score, total, bestScore },
        },
      };
    });
  }, []);

  const clearToast = useCallback(() => {
    setState(prev => ({ ...prev, toast: null }));
  }, []);

  // Track visit for streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastVisitDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      setState(prev => ({
        ...prev,
        streak: prev.lastVisitDate === yesterdayStr ? prev.streak + 1 : 1,
        lastVisitDate: today,
      }));
    }
  }, []);

  return {
    state,
    navigateTo,
    showToast,
    addXP,
    markChapterComplete,
    updateChapterProgress,
    addNote,
    deleteNote,
    toggleSimplifyMode,
    setSearchQuery,
    unlockAchievement,
    saveQuizScore,
    clearToast,
  };
}
