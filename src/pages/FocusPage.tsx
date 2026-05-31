import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, RotateCcw, BrainCircuit } from 'lucide-react';

interface FocusPageProps {
  onBack: () => void;
}

const MOTIVATIONAL_MESSAGES = [
  'ركز يا نجم… انت قربت تفهم الدنيا دي كلها ✨',
  'كمل يا بطل… كل فصل بيوصلك للقمة 🏔️',
  'مستحيل حاجة توقفك… انت قوي 💪',
  'خد نفس عميق وركز… انت هتكسر الدنيا 🔥',
  'اللي بيجتهد بيوصل… وإنت مجتهد أوي! 🌟',
  'فكر في الهدف مش في الصعوبة… إنت هتقدر! 🎯',
];

const FocusPage: React.FC<FocusPageProps> = ({ onBack }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);

  // Cycle messages every 30 seconds
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setMessageIndex(i => (i + 1) % MOTIVATIONAL_MESSAGES.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Timer
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsRunning(false);
          setSessionComplete(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const reset = useCallback(() => {
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setSessionComplete(false);
    setMessageIndex(0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center"
    >
      {/* Intensified Aurora */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute animate-aurora-1"
          style={{
            width: '1000px', height: '1000px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%)',
            filter: 'blur(100px)', top: '-30%', left: '-20%',
          }}
        />
        <div
          className="absolute animate-aurora-2"
          style={{
            width: '900px', height: '900px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123, 92, 255, 0.35) 0%, transparent 70%)',
            filter: 'blur(100px)', bottom: '-30%', right: '-20%',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-0 right-0 flex items-center gap-2 text-[#8A93B8] hover:text-white transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>خروج</span>
        </button>

        <div className="glass rounded-3xl p-10 text-center">
          {/* Icon */}
          <BrainCircuit className="w-12 h-12 text-[#00D4FF] mx-auto mb-6" />

          <h2 className="text-2xl font-bold text-white mb-8">وضع التركيز 🧘</h2>

          {sessionComplete ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#00D4FF] mb-2">جلسة مكتملة!</h3>
              <p className="text-[#8A93B8] mb-6">إنت رهيب يا نجم! خد بريك 5 دقايق!</p>
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] text-[#0B0E1A] font-bold"
              >
                جلسة جديدة
              </button>
            </motion.div>
          ) : (
            <>
              {/* Timer */}
              <div className="text-8xl font-mono text-white mb-8 tracking-wider">
                {formatTime(timeLeft)}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsRunning(!isRunning)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    isRunning ? 'bg-[#FFB84D] hover:bg-[#FFB84D]/80' : 'bg-[#00D4A0] hover:bg-[#00D4A0]/80'
                  } transition-colors`}
                >
                  {isRunning ? <Pause className="w-6 h-6 text-[#0B0E1A]" /> : <Play className="w-6 h-6 text-[#0B0E1A] ml-1" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={reset}
                  className="w-10 h-10 rounded-full bg-[#1C2140] flex items-center justify-center hover:bg-[#2A3260] transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[#8A93B8]" />
                </motion.button>
              </div>

              {/* Motivational Message */}
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-[#00D4FF] italic leading-relaxed min-h-[60px]"
              >
                {MOTIVATIONAL_MESSAGES[messageIndex]}
              </motion.p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(FocusPage);
