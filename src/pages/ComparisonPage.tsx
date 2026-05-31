import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Layers, Shield, Eye, FileCode, Puzzle, Lock, GitBranch } from 'lucide-react';

interface ComparisonPageProps {
  onBack: () => void;
}

interface ComparisonData {
  id: string;
  title: string;
  left: { title: string; icon: React.ElementType; points: string[]; color: string };
  right: { title: string; icon: React.ElementType; points: string[]; color: string };
}

const comparisons: ComparisonData[] = [
  {
    id: 'class-vs-object',
    title: 'Class vs Object',
    left: {
      title: 'Class (الكلاس)',
      icon: FileCode,
      color: '#00D4FF',
      points: [
        'هو القالب أو الـ Blueprint',
        'بيحدد الصفات (Attributes) والسلوكيات (Methods)',
        'مش موجود في الميموري كـ Instance',
        'زي مخطط البيت 🏠',
        'بيتعرف مرة واحدة',
        'مثال: class Car { string color; }',
      ],
    },
    right: {
      title: 'Object (الأوبجكت)',
      icon: Box,
      color: '#7B5CFF',
      points: [
        'هو النسخة الحقيقية من الكلاس',
        'بياخد قيم فعلية للـ Attributes',
        'موجود في الميموري (Heap)',
        'زي البيت اللي اتبني 🏡',
        'ممكن تعمل منه كتير',
        'مثال: Car myCar = new Car();',
      ],
    },
  },
  {
    id: 'inheritance-vs-composition',
    title: 'Inheritance vs Composition',
    left: {
      title: 'Inheritance (الوراثة)',
      icon: GitBranch,
      color: '#00D4FF',
      points: [
        'علاقة "is-a" (هو)',
        'الابن بيرث كل حاجة من الأب',
        'م coupling عالي بين الكلاسات',
        'صعب التغيير في المستقبل',
        'زي: Cat is an Animal 🐱',
        'بنستخدم : (class Cat : Animal)',
      ],
    },
    right: {
      title: 'Composition (التكوين)',
      icon: Puzzle,
      color: '#7B5CFF',
      points: [
        'علاقة "has-a" (لديه)',
        'الكلاس بيحتوي على أوبجكتات تانية',
        'loose coupling - مرونة أعلى',
        'سهل التغيير والتبديل',
        'زي: Car has an Engine 🚗',
        'بنستخدم Fields من نوع الكلاس التاني',
      ],
    },
  },
  {
    id: 'encapsulation-vs-abstraction',
    title: 'Encapsulation vs Abstraction',
    left: {
      title: 'Encapsulation (التغليف)',
      icon: Lock,
      color: '#00D4FF',
      points: [
        'إخفاء البيانات الداخلية',
        'التحكم في الوصول (private/public)',
        'حماية البيانات من التعديل العشوائي',
        'زي الكبسولة 💊',
        '"إزاي نحمي البيانات؟"',
        'بتستخدم Properties و Access Modifiers',
      ],
    },
    right: {
      title: 'Abstraction (التجريد)',
      icon: Eye,
      color: '#7B5CFF',
      points: [
        'إظهار الجوهر وإخفاء التفاصيل',
        'بينشئ واجهة بسيطة للاستخدام',
        'بيقلل التعقيد على المستخدم',
        'زي زرار التشغيل ▶️',
        '"إيه اللي مهم نظهره؟"',
        'بتستخدم Abstract Classes و Interfaces',
      ],
    },
  },
];

const ComparisonPage: React.FC<ComparisonPageProps> = ({ onBack }) => {
  const [activeId, setActiveId] = useState(comparisons[0].id);
  const active = comparisons.find(c => c.id === activeId)!;

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
        <h1 className="text-3xl font-bold text-white mb-2">مقارنة المفاهيم ⚖️</h1>
        <p className="text-[#5A6388] mb-8">قارن بين المفاهيم المختلفة عشان تفهم الفروقات بوضوح</p>

        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {comparisons.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeId === c.id
                  ? 'bg-[#00D4FF] text-[#0B0E1A]'
                  : 'border border-[#2A3260] text-[#8A93B8] hover:border-[#4A5CC7]'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Comparison Cards */}
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-start"
        >
          {/* Left Card */}
          <div className="glass rounded-2xl p-6 border-t-4" style={{ borderTopColor: active.left.color }}>
            <div className="text-center mb-6">
              <active.left.icon className="w-8 h-8 mx-auto mb-2" style={{ color: active.left.color }} />
              <h2 className="text-xl font-bold text-white">{active.left.title}</h2>
            </div>
            <ul className="space-y-3">
              {active.left.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#8A93B8]">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: active.left.color }} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VS Badge */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B5CFF] flex items-center justify-center text-[#0B0E1A] font-bold text-sm">
              VS
            </div>
          </div>

          {/* Right Card */}
          <div className="glass rounded-2xl p-6 border-t-4" style={{ borderTopColor: active.right.color }}>
            <div className="text-center mb-6">
              <active.right.icon className="w-8 h-8 mx-auto mb-2" style={{ color: active.right.color }} />
              <h2 className="text-xl font-bold text-white">{active.right.title}</h2>
            </div>
            <ul className="space-y-3">
              {active.right.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#8A93B8]">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: active.right.color }} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 glass rounded-2xl p-6 text-center"
        >
          <p className="text-[#8A93B8] leading-relaxed">
            كل مفهوم ليه استخدامه المناسب. المهم تفهم الفرق وتستخدم الصح في المكان الصح! 
            <span className="text-[#00D4FF]"> "الصح مش الأحسن دايماً — الأحسن هو اللي يناسب الموقف"</span> 🎯
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(ComparisonPage);
