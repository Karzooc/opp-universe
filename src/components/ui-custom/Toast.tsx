import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { ToastMessage } from '@/types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: 'text-[#00D4A0]',
  error: 'text-[#FF4757]',
  info: 'text-[#00D4FF]',
};

const borderMap = {
  success: 'border-[#00D4A0]/30',
  error: 'border-[#FF4757]/30',
  info: 'border-[#00D4FF]/30',
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-6 z-[100]"
        >
          <div 
            className={`glass-strong rounded-[14px] p-4 pr-5 pl-5 max-w-[380px] border ${borderMap[toast.type]} shadow-lg`}
          >
            <div className="flex items-start gap-3">
              {React.createElement(iconMap[toast.type], {
                className: `w-5 h-5 mt-0.5 flex-shrink-0 ${colorMap[toast.type]}`,
              })}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{toast.title}</p>
                <p className="text-[#8A93B8] text-sm mt-0.5">{toast.message}</p>
              </div>
              <button
                onClick={onClose}
                className="text-[#5A6388] hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Toast);
