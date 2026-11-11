import React from 'react';
import { Power, RotateCcw, Smartphone } from 'lucide-react';
import { playSound } from '../utils/sound';

interface AppClosedScreenProps {
  onReopen: () => void;
}

export const AppClosedScreen: React.FC<AppClosedScreenProps> = ({ onReopen }) => {
  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white select-none">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-500 mb-4 shadow-xl">
        <Power className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-bold text-white mb-1">
        ऐप बंद कर दिया गया है
      </h2>
      <p className="text-xs text-amber-400 font-semibold mb-3">
        Sawai Madhopur APK Session Ended
      </p>

      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
        आपने सफलतापूर्वक ऐप से एग्ज़िट कर लिया है। सवाई माधोपुर पोर्टल पर दोबारा जाने के लिए नीचे दिए गए बटन पर क्लिक करें।
      </p>

      <button
        onClick={() => {
          playSound.score();
          onReopen();
        }}
        className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-xl shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4 stroke-[2.5]" />
        <span>ऐप फिर से खोलें (Reopen App)</span>
      </button>
    </div>
  );
};
