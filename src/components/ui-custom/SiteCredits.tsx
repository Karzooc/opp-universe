import React from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '201208568067';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WhatsAppFab: React.FC = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] transition-colors
      bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))]
      px-3 py-2.5 sm:px-4 sm:py-3 max-[428px]:px-2.5 max-[428px]:py-2"
    aria-label="تواصل عبر واتساب — Made by Kariem Tamer"
  >
    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
    <span className="text-[11px] sm:text-xs font-semibold leading-tight">
      Made by Kariem Tamer
    </span>
  </a>
);

export const AppFooter: React.FC = () => (
  <footer className="mt-8 pt-4 border-t border-[#2A3260]/50 text-center pb-2">
    <p className="text-[#5A6388] text-[10px] sm:text-xs">
      جميع الحقوق محفوظة لـ{' '}
      <span className="text-[#00D4FF] font-semibold">KarzoCode</span>
    </p>
  </footer>
);
