import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Globe, WifiOff, Bell, Sparkles, ChevronRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/sound';

interface SplashScreenProps {
  onComplete: () => void;
  targetUrl: string;
}

interface Slide {
  id: number;
  badge: string;
  badgeHi: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: React.ReactNode;
  accentColor: string;
  bgGradient: string;
  illustration: React.ReactNode;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, targetUrl }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const slides: Slide[] = [
    {
      id: 1,
      badge: 'Portal Welcome',
      badgeHi: 'स्वागतम्',
      title: 'Sawai Madhopur APK Portal',
      titleHi: 'सवाई माधोपुर का डिजिटल हब',
      description: 'Access the latest local apps, blogspot articles, updates, and community news in one unified experience.',
      descriptionHi: 'लेटेस्ट ऐप्स, ब्लॉग पोस्ट, ताज़ा ख़बरें और डाउनलोड्स सीधे अपने मोबाइल में देखें।',
      icon: <Globe className="w-8 h-8 text-amber-500" />,
      accentColor: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-orange-500/30 rounded-full blur-2xl animate-pulse" />
          <div className="relative z-10 w-36 h-36 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-xl shadow-orange-500/20">
            <div className="w-full h-full rounded-[22px] bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2 border border-amber-500/30">
                <Globe className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">Sawai Madhopur</span>
              <span className="text-[10px] text-slate-400 truncate max-w-[110px]">apk.blogspot.com</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      badge: 'Smart WebView',
      badgeHi: 'स्मार्ट वेब व्यू',
      title: 'Fast & Secure Browsing',
      titleHi: 'तेज़ लोडिंग और आसान नेविगेशन',
      description: 'Equipped with a real-time progress bar, back navigation safety, pull-to-refresh, and full-screen mobile viewing.',
      descriptionHi: 'प्रोग्रेस बार, रिफ्रेश, बैक एग्ज़िट कन्फर्मेशन और आरामदायक मोबाइल व्यू फ़ीचर्स।',
      icon: <Sparkles className="w-8 h-8 text-indigo-500" />,
      accentColor: 'from-indigo-500 to-blue-600',
      bgGradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-blue-500/30 rounded-full blur-2xl" />
          <div className="relative z-10 w-40 h-28 rounded-2xl bg-slate-900 border border-indigo-500/40 p-3 shadow-xl">
            <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-slate-800">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="ml-2 flex-1 h-3 rounded bg-slate-800 flex items-center px-2">
                <div className="w-8 h-1 rounded bg-indigo-400/60" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="w-full h-1.5 bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full animate-pulse" />
              <div className="w-3/4 h-2 bg-slate-800 rounded" />
              <div className="w-1/2 h-2 bg-slate-800 rounded" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: 'Offline + Alerts',
      badgeHi: 'ऑफलाइन गेम & अलर्ट',
      title: 'Offline Play & Push Alerts',
      titleHi: 'ऑफलाइन टाइगर गेम और अलर्ट्स',
      description: 'Lost internet? Play the offline Ranthambore Tiger Run game and receive instant push notifications anytime.',
      descriptionHi: 'इंटरनेट बंद होने पर मजेदार गेम खेलें और कोई भी ज़रूरी नोटिफिकेशन मिस ना करें।',
      icon: <WifiOff className="w-8 h-8 text-emerald-500" />,
      accentColor: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 rounded-full blur-2xl" />
          <div className="relative z-10 w-44 h-32 rounded-2xl bg-slate-900 border border-emerald-500/40 p-3 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span className="font-mono">OFFLINE RUNNER</span>
              <span className="font-bold">HI: 950</span>
            </div>
            {/* Mini Game preview graphic */}
            <div className="h-14 border-b border-emerald-500/40 relative flex items-end pb-1 overflow-hidden">
              <div className="text-xl animate-bounce">🐅</div>
              <div className="absolute right-6 bottom-1 text-sm">🌵</div>
              <div className="absolute right-16 bottom-1 text-xs">🪨</div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <Bell className="w-3 h-3 text-emerald-400" />
              <span>Instant Notification Sender Ready</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // Swiped left -> Next
      handleNext();
    } else if (diff < -50) {
      // Swiped right -> Prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleNext = () => {
    playSound.click();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    playSound.click();
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    playSound.score();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between bg-slate-950 text-white overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic ambient backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.bgGradient} transition-colors duration-500 pointer-events-none`} />

      {/* Top Header bar with Skip button */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xs">
            SM
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-300">
            Sawai Madhopur APK
          </span>
        </div>

        {currentSlide < slides.length - 1 ? (
          <button
            onClick={handleFinish}
            className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            छोड़ें (Skip)
          </button>
        ) : (
          <span className="text-[11px] font-mono text-emerald-400 font-medium">3 of 3</span>
        )}
      </div>

      {/* Main Slide Carousel Area - Click or Swipe to advance */}
      <div 
        onClick={handleNext}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4 cursor-pointer"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm flex flex-col items-center text-center"
          >
            {/* Visual Illustration */}
            <div className="mb-6">
              {slide.illustration}
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300/90 mb-3 tracking-wide">
              <span>{slide.badge}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{slide.badgeHi}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1 text-balance">
              {slide.titleHi}
            </h2>
            <p className="text-xs font-medium text-slate-400 mb-3">
              {slide.title}
            </p>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs mb-2">
              {slide.descriptionHi}
            </p>
            <p className="text-xs text-slate-500 leading-normal max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Minimal Swipe Indicators (No buttons) */}
      <div className="relative z-10 px-6 pb-8 pt-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col items-center">
        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {slides.map((s, index) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-7 bg-amber-500'
                  : 'w-2 bg-slate-750'
              }`}
            />
          ))}
        </div>

        {/* Swipe prompt */}
        <p className="text-[12px] text-center text-slate-400 font-medium tracking-wide">
          {currentSlide === slides.length - 1
            ? '← स्वाइप करें और वेबसाइट शुरू करें'
            : '← आगे बढ़ने के लिए स्वाइप करें'}
        </p>
      </div>
    </div>
  );
};
