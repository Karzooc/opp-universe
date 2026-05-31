export interface ChapterContentSection {
  title: string;
  content: string;
  code?: string;
}

export interface ChapterContent {
  overview: string;
  sections: ChapterContentSection[];
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  number: number;
  icon: string;
  status: 'unlocked' | 'locked';
  keyPoints: string[];
  progress: number;
  summary: string;
  simplifiedSummary: string;
  content: ChapterContent;
  simplifiedContent: string;
  analogy: string;
  funnyNote: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  chapterId: number;
  questions: QuizQuestion[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'quiz' | 'special';
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserNote {
  id: string;
  text: string;
  chapterId: number;
  chapterTitle: string;
  createdAt: string;
}

export interface AppState {
  currentPage: string;
  currentChapterId: number | null;
  chaptersProgress: Record<number, number>;
  chaptersCompleted: Record<number, boolean>;
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  lastVisitDate: string;
  notes: UserNote[];
  simplifyMode: boolean;
  achievements: Record<string, boolean>;
  searchQuery: string;
  focusModeTime: number;
  quizScores: Record<number, { score: number; total: number; bestScore: number }>;
  toast: ToastMessage | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export type PageType = 
  | 'dashboard' 
  | 'chapter' 
  | 'quiz' 
  | 'notes' 
  | 'achievements' 
  | 'comparison' 
  | 'focus' 
  | 'search';
