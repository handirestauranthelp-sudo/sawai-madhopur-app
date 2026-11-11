import React from 'react';
import { Settings, RotateCcw, Wifi, WifiOff, Volume2, VolumeX, Smartphone, Info, X, ExternalLink } from 'lucide-react';
import { playSound } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSplash: () => void;
  isSimulatedOffline: boolean;
  onToggleOffline: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClearCache: () => void;
  deviceMode: 'mobile' | 'fullscreen';
  onToggleDeviceMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetSplash,
  isSimulatedOffline,
  onToggleOffline,
  soundEnabled,
  onToggleSound,
  onClearCache,
  deviceMode,
  onToggleDeviceMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">ऐप सेटिंग्स (App Settings)</h3>
              <p className="text-[10px] text-slate-400">WebView & Simulation Preferences</p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-3 text-xs">
          {/* Test Offline Mode Toggle */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isSimulatedOffline ? (
                <WifiOff className="w-4 h-4 text-rose-500" />
              ) : (
                <Wifi className="w-4 h-4 text-emerald-400" />
              )}
              <div>
                <p className="font-semibold text-slate-200">
                  {isSimulatedOffline ? 'सिम्युलेटेड ऑफलाइन मोड (ON)' : 'इंटरनेट कनेक्शन स्थिति'}
                </p>
                <p className="text-[10px] text-slate-400">
                  ऑफलाइन गेम और नो-इंटरनेट स्क्रीन टेस्ट करने के लिए
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.click();
                onToggleOffline();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                isSimulatedOffline
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isSimulatedOffline ? 'Disable' : 'Test Offline'}
            </button>
          </div>

          {/* Reset 3 Splash Screens */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <div>
                <p className="font-semibold text-slate-200">3 स्प्लैश स्क्रीन (Splash Screens)</p>
                <p className="text-[10px] text-slate-400">
                  ओपनिंग 3 स्वाइप स्क्रीन फिर से चलाएं
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.click();
                onResetSplash();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors"
            >
              रीसेट करें
            </button>
          </div>

          {/* Switch Phone Mockup / Full Window */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="font-semibold text-slate-200">स्क्रीन व्यू मोड</p>
                <p className="text-[10px] text-slate-400">
                  {deviceMode === 'mobile' ? 'मोबाइल फोन फ्रेम मोड' : 'फुलस्क्रीन एज-टू-एज मोड'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.click();
                onToggleDeviceMode();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition-colors"
            >
              {deviceMode === 'mobile' ? 'Fullscreen' : 'Phone Frame'}
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <p className="font-semibold text-slate-200">साउंड इफेक्ट्स (Sound)</p>
                <p className="text-[10px] text-slate-400">
                  बटन क्लिक, जंप और नोटिफिकेशन ध्वनियाँ
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.click();
                onToggleSound();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                soundEnabled
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Clear Cache */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-sky-400" />
              <div>
                <p className="font-semibold text-slate-200">वेब कैश साफ करें</p>
                <p className="text-[10px] text-slate-400">
                  Clear temporary browsing data
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.click();
                onClearCache();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] transition-colors"
            >
              Clear Cache
            </button>
          </div>
        </div>

        {/* Portal info footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Sawai Madhopur APK Official WebView Pro
          </p>
          <a
            href="https://sawaimadhopurapk.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-amber-400 hover:underline inline-flex items-center gap-1 mt-0.5"
          >
            <span>sawaimadhopurapk.blogspot.com</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
