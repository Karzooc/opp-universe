import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Search, GraduationCap } from 'lucide-react';
import type { UserNote } from '@/types';

interface NotesPageProps {
  notes: UserNote[];
  onBack: () => void;
  onDeleteNote: (id: string) => void;
}

const NotesPage: React.FC<NotesPageProps> = ({ notes, onBack, onDeleteNote }) => {
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(n => 
    n.text.toLowerCase().includes(search.toLowerCase()) ||
    n.chapterTitle.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'الآن';
    if (hours < 24) return `من ${hours} ساعة`;
    if (days < 7) return `من ${days} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[#8A93B8] hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span>رجوع</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">ملاحظاتي المهمة 📝</h1>
            <p className="text-[#5A6388] mt-1">{notes.length} ملاحظة محفوظة</p>
          </div>
        </div>

        {/* Search */}
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-[#5A6388] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="دور في ملاحظاتك..."
            className="bg-transparent text-white placeholder-[#5A6388] outline-none flex-1 text-sm"
            dir="rtl"
          />
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-16 h-16 text-[#5A6388]/30 mx-auto mb-4" />
            <p className="text-[#5A6388] text-lg">
              {search ? 'مفيش نتائج للبحث' : 'لسه مفيش ملاحظات...'}
            </p>
            {!search && (
              <p className="text-[#5A6388]/70 text-sm mt-2">
                ابدأ اقرأ وادوس على أي نص لتحفظه!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-xl p-5 border-r-4 border-[#7B5CFF] group hover:border-[#00D4FF] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white text-base italic leading-relaxed mb-3">"{note.text}"</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#00D4FF]">من فصل: {note.chapterTitle}</span>
                      <span className="text-[#5A6388]">{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-[#5A6388] hover:text-[#FF4757] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(NotesPage);
