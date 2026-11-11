import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, ArrowUpRight } from 'lucide-react';
import { NotificationItem } from '../types';
import { playSound } from '../utils/sound';

interface PushBannerProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onOpenInbox: () => void;
}

export const PushBanner: React.FC<PushBannerProps> = ({
  notification,
  onDismiss,
  onOpenInbox
}) => {
  useEffect(() => {
    if (notification) {
      playSound.notification();
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="absolute top-8 left-3 right-3 z-50 bg-slate-900/95 border border-amber-500/40 backdrop-blur-md rounded-2xl p-3 shadow-2xl shadow-black/60 flex items-start justify-between gap-2.5 text-white cursor-pointer select-none"
          onClick={() => {
            playSound.click();
            onOpenInbox();
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Bell className="w-4 h-4 fill-current" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-0.5">
              <span>Sawai Madhopur APK</span>
              <span className="text-slate-400 font-normal">Now</span>
            </div>
            <h4 className="text-xs font-bold text-white truncate">{notification.title}</h4>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight mt-0.5">
              {notification.message}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
