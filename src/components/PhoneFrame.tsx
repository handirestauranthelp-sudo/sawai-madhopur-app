import React from 'react';
import { Smartphone, Monitor, Wifi, WifiOff, Bell, RotateCcw, ExternalLink, ShieldCheck } from 'lucide-react';
import { playSound } from '../utils/sound';

interface PhoneFrameProps {
  children: React.ReactNode;
  mode: 'mobile' | 'fullscreen';
  onToggleMode: () => void;
  isOnline: boolean;
  onToggleSimulatedOffline: () => void;
  onResetSplash: () => void;
  onOpenNotificationModal: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  mode,
  onToggleMode,
  isOnline,
  onToggleSimulatedOffline,
  onResetSplash,
  onOpenNotificationModal
}) => {
  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-start text-white">
      {/* Top Applet Header Bar for controlling simulation */}
      <header className="w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
            SM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm tracking-tight">
                Sawai Madhopur APK
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono">
                WEBVIEW PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
              https://sawaimadhopurapk.blogspot.com/
            </p>
          </div>
        </div>

        {/* Quick Simulation Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Internet Toggle Simulator */}
          <button
            onClick={() => {
              playSound.click();
              onToggleSimulatedOffline();
            }}
            title={isOnline ? 'Simulate Internet Loss' : 'Restore Internet Connection'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isOnline
                ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-rose-950/90 border border-rose-500/50 text-rose-300 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-rose-400" />}
            <span className="hidden sm:inline">{isOnline ? 'Internet: Connected' : 'Internet: Disconnected'}</span>
          </button>

          {/* Send Notification Button */}
          <button
            onClick={() => {
              playSound.click();
              onOpenNotificationModal();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">नोटिफिकेशन भेजें</span>
          </button>

          {/* Reset 3 Splash Screens */}
          <button
            onClick={() => {
              playSound.click();
              onResetSplash();
            }}
            title="Restart 3 Splash Screens"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">स्प्लैश स्क्रीन (Splash)</span>
          </button>

          {/* Device Mockup Toggle */}
          <button
            onClick={() => {
              playSound.click();
              onToggleMode();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {mode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Fullscreen Mode</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <div className={`w-full flex-1 flex items-center justify-center ${mode === 'mobile' ? 'p-3 sm:p-6' : 'p-0'}`}>
        {mode === 'mobile' ? (
          // Smartphone Bezel Frame
          <div className="relative w-full max-w-[420px] h-[844px] max-h-[calc(100vh-80px)] rounded-[44px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-[5px] border-slate-700/80 shadow-2xl shadow-black/80 flex flex-col overflow-hidden ring-1 ring-white/10">
            {/* Phone Speaker ear piece slit */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-600 rounded-full z-40" />

            {/* Inner Phone Screen */}
            <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-slate-950 flex flex-col">
              {children}
            </div>
          </div>
        ) : (
          // Full Screen Edge-to-Edge
          <div className="w-full h-[calc(100vh-49px)] flex flex-col bg-slate-950">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
