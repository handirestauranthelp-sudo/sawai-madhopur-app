import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, LogOut, X } from 'lucide-react';
import { playSound } from '../utils/sound';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onConfirmExit: () => void;
  onCancel: () => void;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isOpen,
  onConfirmExit,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-3xl p-5 text-center text-white shadow-2xl relative"
          >
            {/* Close 'X' icon */}
            <button
              onClick={() => {
                playSound.click();
                onCancel();
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-7 h-7" />
            </div>

            {/* Title in Hindi & English */}
            <h3 className="text-lg font-bold text-white mb-1">
              ऐप से बाहर निकलें?
            </h3>
            <p className="text-xs font-semibold text-amber-300/90 mb-2">
              Exit Sawai Madhopur App?
            </p>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              क्या आप सच में ऐप बंद करना चाहते हैं? आपकी वर्तमान ब्राउज़िंग प्रगति रुक जाएगी।
            </p>

            {/* Action Buttons: Yes / No */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  playSound.click();
                  onConfirmExit();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>हाँ, बाहर निकलें (Yes, Exit)</span>
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  onCancel();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs active:scale-98 transition-all"
              >
                नहीं, ऐप में रहें (No, Stay)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
