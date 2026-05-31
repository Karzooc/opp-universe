import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, FlaskConical, StickyNote, 
  Trophy, GitCompareArrows, Search, BrainCircuit, 
  Lightbulb, Sparkles, X, Menu, Shield, Flame
} from 'lucide-react';
import type { PageType } from '@/types';

/** من 1024px فما فوق = لاب/كمبيوتر (سايدبار ثابت) */
const DESKTOP_MEDIA = '(min-width: 1024px)';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: PageType) => void;
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  simplifyMode: boolean;
  onToggleSimplify: () => void;
  onSearch: () => void;
  completedCount: number;
}

const navItems: { page: PageType; label: string; icon: React.ElementType }[] = [
  { page: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { page: 'dashboard', label: 'الفصول', icon: BookOpen },
  { page: 'dashboard', label: 'الاختبارات', icon: FlaskConical },
  { page: 'notes', label: 'ملاحظاتي', icon: StickyNote },
  { page: 'achievements', label: 'الإنجازات', icon: Trophy },
  { page: 'comparison', label: 'المقارنة', icon: GitCompareArrows },
  { page: 'search', label: 'البحث', icon: Search },
  { page: 'focus', label: 'وضع التركيز', icon: BrainCircuit },
];

const levelProgress = (xp: number): number => {
  const thresholds = [0, 500, 1200, 2500];
  const next = thresholds.find(t => t > xp) ?? 2500;
  const prev = thresholds.filter(t => t <= xp).pop() ?? 0;
  if (next === prev) return 100;
  return ((xp - prev) / (next - prev)) * 100;
};

const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  xp,
  level,
  levelTitle,
  streak,
  simplifyMode,
  onToggleSimplify,
  onSearch,
  completedCount,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MEDIA).matches : false
  );
  const progress = levelProgress(xp);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA);
    const onChange = () => {
      setIsDesktop(mq.matches);
      if (mq.matches) setMobileOpen(false);
    };
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen || isDesktop) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen, isDesktop]);

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const showMobileDrawer = !isDesktop && mobileOpen;

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2.5 px-4 py-4 lg:px-5 lg:py-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-[#00D4FF]" />
        </motion.div>
        <div>
          <h1 className="text-base lg:text-xl font-extrabold text-white leading-tight">OOP Mastery</h1>
          <p className="text-[10px] lg:text-xs text-[#5A6388]">تعلم OOP بالعربي</p>
        </div>
      </div>

      <div className="px-4 mb-4">
        <button
          type="button"
          onClick={() => { onSearch(); handleNav('search'); }}
          className="w-full glass rounded-xl px-4 py-3 flex items-center gap-3 text-right hover:border-[#4A5CC7] transition-colors"
        >
          <Search className="w-4 h-4 text-[#5A6388] flex-shrink-0" />
          <span className="text-[#5A6388] text-sm">دور على أي حاجة...</span>
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNav(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive 
                  ? 'bg-[rgba(0,212,255,0.1)] text-[#00D4FF] border-r-2 border-[#00D4FF]' 
                  : 'text-[#8A93B8] hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              {item.page === 'dashboard' && completedCount > 0 && (
                <span className="mr-auto text-xs bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-0.5 rounded-full">
                  {completedCount}/10
                </span>
              )}
            </button>
          );
        })}

        <div className="mt-4 pt-4 border-t border-[#2A3260]">
          <button
            type="button"
            onClick={onToggleSimplify}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-[#8A93B8] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
          >
            <Lightbulb className={`w-5 h-5 flex-shrink-0 ${simplifyMode ? 'text-[#FF6B9D]' : ''}`} />
            <span>الشرح المبسط</span>
            <div className={`mr-auto w-10 h-5 rounded-full relative transition-colors ${simplifyMode ? 'bg-[#FF6B9D]' : 'bg-[#2A3260]'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${simplifyMode ? 'left-5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-[#2A3260] mt-auto">
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#00D4FF] font-semibold">{xp} XP</span>
            <span className="text-[#5A6388]">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-[#2A3260] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B5CFF] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#FFD700]" />
            <span className="text-[#8A93B8]">المستوى {level}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#FF6B9D]" />
            <span className="text-[#FF6B9D]">{streak} أيام</span>
          </div>
        </div>
        <p className="text-[#5A6388] text-[10px] mt-1">{levelTitle}</p>
        <p className="text-[#5A6388] text-[10px] mt-2 text-center">
          © <span className="text-[#00D4FF]">KarzoCode</span>
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* زر القائمة — موبايل/تابلت صغير فقط (< 1024px) */}
      {!isDesktop && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] z-[60] glass p-2.5 rounded-lg text-white"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* خلفية عند فتح الدرج على الموبايل */}
      {showMobileDrawer && (
        <button
          type="button"
          className="fixed inset-0 bg-black/60 z-[45] lg:hidden border-0 cursor-default"
          onClick={() => setMobileOpen(false)}
          aria-label="إغلاق القائمة"
        />
      )}

      {/* سايدبار واحد: ثابت على الديسكتوب | درج على الموبايل */}
      <aside
        className={`
          fixed top-0 right-0 z-50 flex flex-col
          h-full w-[min(280px,88vw)] lg:w-[280px]
          glass-strong border-l border-[#2A3260]/30
          pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${showMobileDrawer ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
        aria-hidden={!isDesktop && !mobileOpen}
      >
        {!isDesktop && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-3 p-2 rounded-lg text-[#8A93B8] hover:text-white hover:bg-white/5 z-10"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {sidebarContent}
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
