import React from 'react';
import { Home, Bell, Gamepad2, Settings, LogOut } from 'lucide-react';
import { playSound } from '../utils/sound';

export type TabType = 'home' | 'notifications' | 'game' | 'settings';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onExitClick: () => void;
  unreadNotificationsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onExitClick,
  unreadNotificationsCount = 0
}) => {
  return (
    <div className="shrink-0 w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex flex-col z-30 select-none">
      {/* 5-Item Navigation Row */}
      <div className="grid grid-cols-5 items-center h-14 px-1">
        {/* 1. Home */}
        <button
          onClick={() => {
            playSound.click();
            onTabChange('home');
          }}
          className={`h-full flex flex-col items-center justify-center transition-colors ${
            activeTab === 'home'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">होम (Home)</span>
        </button>

        {/* 2. Notifications */}
        <button
          onClick={() => {
            playSound.click();
            onTabChange('notifications');
          }}
          className={`relative h-full flex flex-col items-center justify-center transition-colors ${
            activeTab === 'notifications'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-slate-950">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">अलर्ट्स</span>
        </button>

        {/* 3. Offline Game */}
        <button
          onClick={() => {
            playSound.click();
            onTabChange('game');
          }}
          className={`h-full flex flex-col items-center justify-center transition-colors ${
            activeTab === 'game'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">गेम (Run)</span>
        </button>

        {/* 4. Settings */}
        <button
          onClick={() => {
            playSound.click();
            onTabChange('settings');
          }}
          className={`h-full flex flex-col items-center justify-center transition-colors ${
            activeTab === 'settings'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">सेटिंग्स</span>
        </button>

        {/* 5. Exit Trigger */}
        <button
          onClick={() => {
            playSound.click();
            onExitClick();
          }}
          className="h-full flex flex-col items-center justify-center text-rose-400 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5 mb-0.5 stroke-[2]" />
          <span className="text-[10px] tracking-tight">एग्ज़िट (Exit)</span>
        </button>
      </div>

      {/* Android Gestures Navigation Bar Pill */}
      <div className="w-full h-3 flex items-center justify-center pb-1">
        <div className="w-28 h-1 bg-slate-600/60 rounded-full" />
      </div>
    </div>
  );
};
