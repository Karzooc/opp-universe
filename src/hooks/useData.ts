import { useState, useEffect } from 'react';
import type { Chapter, Quiz, Achievement } from '@/types';
import { dataJsonUrl } from '@/lib/dataUrl';
import chaptersBundled from '@/data/chapters.json';
import quizzesBundled from '@/data/quizzes.json';
import achievementsBundled from '@/data/achievements.json';

async function fetchJson<T>(filename: string): Promise<T> {
  const res = await fetch(dataJsonUrl(filename));
  if (!res.ok) {
    throw new Error(`Failed to load ${filename}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function normalizeQuizzes(data: Quiz[]): Quiz[] {
  return data.map(q => ({
    ...q,
    chapterId: Number(q.chapterId),
    questions: Array.isArray(q.questions) ? q.questions : [],
  }));
}

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>(() => chaptersBundled as Chapter[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchJson<Chapter[]>('chapters.json')
      .then(data => {
        if (!cancelled) {
          setChapters(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setChapters(chaptersBundled as Chapter[]);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return { chapters, loading };
}

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() =>
    normalizeQuizzes(quizzesBundled as Quiz[])
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchJson<Quiz[]>('quizzes.json')
      .then(data => {
        if (!cancelled) {
          setQuizzes(normalizeQuizzes(data));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { quizzes, loading };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(
    () => achievementsBundled as Achievement[]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchJson<Achievement[]>('achievements.json')
      .then(data => {
        if (!cancelled) {
          setAchievements(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAchievements(achievementsBundled as Achievement[]);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return { achievements, loading };
}
