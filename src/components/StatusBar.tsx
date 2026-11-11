import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Battery, Bell } from 'lucide-react';

interface StatusBarProps {
  isOnline: boolean;
  hasUnreadNotifications?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ isOnline, hasUnreadNotifications }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-30 h-7 w-full px-5 flex items-center justify-between text-[11px] font-medium text-slate-300 bg-slate-950/80 backdrop-blur-md select-none shrink-0 border-b border-white/5">
      {/* Left: Time & notification dot */}
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-tight">{time || '10:45 AM'}</span>
        {hasUnreadNotifications && (
          <span className="flex items-center gap-0.5 text-amber-400">
            <Bell className="w-2.5 h-2.5 fill-current" />
          </span>
        )}
      </div>

      {/* Center: Mobile camera punch hole */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner" />

      {/* Right: Network & Battery */}
      <div className="flex items-center gap-2">
        {/* Cell signal */}
        <div className="flex items-end gap-0.5 h-2.5" title="Cellular LTE">
          <div className="w-0.5 h-1 bg-slate-400 rounded-xs" />
          <div className="w-0.5 h-1.5 bg-slate-400 rounded-xs" />
          <div className="w-0.5 h-2 bg-slate-400 rounded-xs" />
          <div className={`w-0.5 h-2.5 ${isOnline ? 'bg-slate-200' : 'bg-slate-600'} rounded-xs`} />
        </div>

        {/* Wifi / Offline */}
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        )}

        {/* Battery */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="tabular-nums">98%</span>
          <div className="relative w-4 h-2.5 border border-slate-400 rounded-xs p-0.5 flex items-center">
            <div className="h-full w-full bg-emerald-400 rounded-xs" />
            <div className="absolute -right-0.5 top-0.5 w-0.5 h-1 bg-slate-400 rounded-r-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
