import React, { useState, useEffect, useRef } from 'react';
import { OfflineGame } from './OfflineGame';

interface WebViewContainerProps {
  targetUrl: string;
  isOnline: boolean;
  onRetryConnection: () => void;
}

export const WebViewContainer: React.FC<WebViewContainerProps> = ({
  targetUrl,
  isOnline,
  onRetryConnection
}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Smooth loading progress bar simulation on page load
  useEffect(() => {
    if (isOnline) {
      setIsLoading(true);
      setLoadingProgress(15);

      const t1 = setTimeout(() => setLoadingProgress(45), 250);
      const t2 = setTimeout(() => setLoadingProgress(75), 700);
      const t3 = setTimeout(() => setLoadingProgress(95), 1200);
      const t4 = setTimeout(() => {
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setLoadingProgress(0);
        }, 300);
      }, 1600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [isOnline, targetUrl]);

  // If internet is disconnected: hide website and show offline message + offline game
  if (!isOnline) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-950 overflow-y-auto no-scrollbar">
        <div className="flex-1 flex flex-col items-center justify-center p-3">
          <OfflineGame onRetryConnection={onRetryConnection} isOfflineMode={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-white overflow-hidden flex flex-col">
      {/* Sleek Top Loading Progress Bar (like Android Chrome / WebView) */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-transparent z-40 overflow-hidden pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-300 ease-out shadow-xs shadow-orange-500/50"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* 100% Full-bleed, Clean WebView iframe with zero artificial UI clutter */}
      <iframe
        ref={iframeRef}
        src={targetUrl}
        title="Sawai Madhopur APK"
        className="w-full h-full border-0 outline-none flex-1 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        onLoad={() => {
          setLoadingProgress(100);
          setTimeout(() => {
            setIsLoading(false);
            setLoadingProgress(0);
          }, 200);
        }}
      />
    </div>
  );
};
