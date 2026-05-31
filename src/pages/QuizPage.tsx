import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { Quiz } from '@/types';

interface QuizPageProps {
  quiz: Quiz | undefined;
  chapterTitle: string;
  chapterId: number;
  loading?: boolean;
  onBack: () => void;
  onComplete: (chapterId: number, score: number, total: number) => void;
  onAddXP: (amount: number, reason: string) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({
  quiz,
  chapterTitle,
  chapterId,
  loading = false,
  onBack,
  onComplete,
  onAddXP,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = quiz?.questions ?? [];
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  useEffect(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setScore(0);
    setTimeLeft(300);
    setQuizFinished(false);
    setAnswers([]);
  }, [chapterId]);

  const finishQuiz = useCallback((finalScore: number) => {
    setQuizFinished(true);
    let actualScore = 0;
    const allAnswers = [...answers];
    if (submitted && selectedAnswer !== null && !answers.includes(selectedAnswer)) {
      allAnswers.push(selectedAnswer);
    }

    questions.forEach((q, idx) => {
      if (allAnswers[idx] === q.correct) actualScore++;
    });

    onComplete(chapterId, actualScore, totalQuestions);
  }, [answers, submitted, selectedAnswer, questions, chapterId, totalQuestions, onComplete]);

  useEffect(() => {
    if (loading || quizFinished || totalQuestions === 0) return;
    if (timeLeft <= 0) {
      finishQuiz(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizFinished, score, loading, totalQuestions, finishQuiz]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !question) return;
    
    setSubmitted(true);
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (selectedAnswer === question.correct) {
      setScore(s => s + 1);
      onAddXP(10, 'إجابة صحيحة! +10 XP');
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setSubmitted(false);
    } else {
      const finalScore = selectedAnswer === question.correct ? score + (submitted ? 0 : 1) : score;
      const actualScore = submitted 
        ? (selectedAnswer === question.correct ? score : score) 
        : score + (selectedAnswer === question.correct ? 1 : 0);
      finishQuiz(submitted ? score + (selectedAnswer === question.correct ? 0 : 0) : actualScore);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
        <div className="inline-block w-10 h-10 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#8A93B8] text-sm">جاري تحميل الأسئلة...</p>
      </motion.div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 px-4">
        <p className="text-[#8A93B8] text-sm sm:text-base">مفيش أسئلة متاحة للفصل ده حالياً.</p>
        <p className="text-[#5A6388] text-xs mt-2">تأكد من اتصال الإنترنت أو أعد تحميل الصفحة.</p>
        <button onClick={onBack} className="mt-4 text-[#00D4FF] hover:underline text-sm">رجوع</button>
      </motion.div>
    );
  }

  if (!question) {
    return null;
  }

  if (quizFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPerfect = percentage === 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto py-6 sm:py-12 w-full"
      >
        <div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {isPerfect ? (
              <Trophy className="w-20 h-20 text-[#FFD700] mx-auto mb-4" />
            ) : (
              <CheckCircle className="w-20 h-20 text-[#00D4A0] mx-auto mb-4" />
            )}
          </motion.div>
          
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">
            {isPerfect ? 'نتيجة مثالية! 🏆' : percentage >= 60 ? 'أداء رائع! 👏' : 'كمل يا نجم! 💪'}
          </h2>
          <p className="text-[#8A93B8] mb-6">{chapterTitle}</p>
          
          <div className="text-3xl sm:text-5xl font-bold text-gradient-cyan mb-2">
            {score}/{totalQuestions}
          </div>
          <p className="text-[#8A93B8]">{percentage}%</p>
          
          <div className="mt-8 space-y-3">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={idx} className={`p-4 rounded-xl text-right ${isCorrect ? 'bg-[#00D4A0]/10 border border-[#00D4A0]/20' : 'bg-[#FF4757]/10 border border-[#FF4757]/20'}`}>
                  <div className="flex items-start gap-3">
                    {isCorrect ? <CheckCircle className="w-5 h-5 text-[#00D4A0] flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-[#FF4757] flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-white text-sm font-medium">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-[#8A93B8] text-xs mt-1">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={onBack}
            className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] text-[#0B0E1A] font-bold"
          >
            رجوع للفصول
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="max-w-3xl mx-auto py-2 sm:py-6 w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-6 gap-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#8A93B8] hover:text-white transition-colors text-sm">
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>رجوع</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
            timeLeft < 30 ? 'bg-[#FFB84D]/15 text-[#FFB84D] animate-pulse' : 'bg-[#FFB84D]/15 text-[#FFB84D]'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <span className="text-[#8A93B8] text-xs sm:text-sm">النتيجة: {score}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-6">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              idx < currentQuestion ? 'bg-[#00D4A0]' : idx === currentQuestion ? 'bg-[#00D4FF]' : 'bg-[#2A3260]'
            }`}
          />
        ))}
      </div>

      {/* Question Card */}
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#00D4FF] text-[#0B0E1A] text-[10px] sm:text-xs font-bold mb-2 sm:mb-4">
            سؤال {currentQuestion + 1} من {totalQuestions}
          </span>
          <h2 className="text-base sm:text-xl font-semibold text-white leading-relaxed">{question.question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-2 sm:space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correct;
            const showCorrect = submitted && isCorrect;
            const showWrong = submitted && isSelected && !isCorrect;

            return (
              <motion.button
                key={idx}
                whileHover={!submitted ? { scale: 1.01 } : undefined}
                whileTap={!submitted ? { scale: 0.99 } : undefined}
                onClick={() => !submitted && setSelectedAnswer(idx)}
                disabled={submitted}
                className={`w-full text-right p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-xs sm:text-sm ${
                  showCorrect
                    ? 'border-[#00D4A0] bg-[#00D4A0]/10'
                    : showWrong
                    ? 'border-[#FF4757] bg-[#FF4757]/10'
                    : isSelected
                    ? 'border-[#00D4FF] bg-[#00D4FF]/8'
                    : 'border-[#2A3260] bg-[rgba(21,25,41,0.6)] hover:border-[#4A5CC7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    showCorrect ? 'bg-[#00D4A0]/20 text-[#00D4A0]' : showWrong ? 'bg-[#FF4757]/20 text-[#FF4757]' : isSelected ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-[#2A3260] text-[#8A93B8]'
                  }`}>
                    {showCorrect ? <CheckCircle className="w-4 h-4" /> : showWrong ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-white">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-4 p-4 rounded-xl ${
                selectedAnswer === question.correct ? 'bg-[#00D4A0]/10 border border-[#00D4A0]/20' : 'bg-[#FF4757]/10 border border-[#FF4757]/20'
              }`}
            >
              <p className={selectedAnswer === question.correct ? 'text-[#00D4A0]' : 'text-[#FF4757]'}>
                {selectedAnswer === question.correct ? '✓ صح!' : '✗ غلط!'}
              </p>
              <p className="text-[#8A93B8] text-sm mt-1">{question.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] text-[#0B0E1A] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              تأكيد الإجابة
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] text-[#0B0E1A] font-bold"
            >
              {currentQuestion < totalQuestions - 1 ? 'السؤال اللي جاي' : 'شوف النتيجة'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(QuizPage);
