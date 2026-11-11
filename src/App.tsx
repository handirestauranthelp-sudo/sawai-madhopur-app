/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { WebViewContainer } from './components/WebViewContainer';
import { ExitConfirmationModal } from './components/ExitConfirmationModal';
import { AppClosedScreen } from './components/AppClosedScreen';

const TARGET_URL = 'https://sawaimadhopurapk.blogspot.com/';

export default function App() {
  // 1. Splash Screen State (3 swipeable screens on opening)
  const [hasCompletedSplash, setHasCompletedSplash] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sm_splash_done') === 'true';
    } catch {
      return false;
    }
  });

  // 2. Real-time Internet Connectivity State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // 3. Exit Confirmation Modal State
  const [showExitModal, setShowExitModal] = useState(false);
  const [isAppClosed, setIsAppClosed] = useState(false);

  // Monitor real-time online / offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Request browser Notification permission silently in background
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Native Mobile Back Button & PopState interception
  useEffect(() => {
    // Push dummy history entry so the device back button triggers popstate instead of immediately closing the tab
    window.history.pushState({ app: 'sawaimadhopur_webview' }, '', window.location.href);

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      // Keep state intact so back button keeps prompting
      window.history.pushState({ app: 'sawaimadhopur_webview' }, '', window.location.href);
      setShowExitModal(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape or Android hardware back simulation
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Splash complete handler
  const handleSplashComplete = () => {
    setHasCompletedSplash(true);
    try {
      localStorage.setItem('sm_splash_done', 'true');
    } catch {
      // Ignore
    }
  };

  // Exit handlers
  const handleConfirmExit = () => {
    setShowExitModal(false);
    setIsAppClosed(true);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleReopenApp = () => {
    setIsAppClosed(false);
  };

  const handleRetryConnection = () => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-950 overflow-hidden select-none flex flex-col font-sans">
      {!hasCompletedSplash ? (
        // 1. App open: 3 Swipeable Splash Screens
        <SplashScreen
          targetUrl={TARGET_URL}
          onComplete={handleSplashComplete}
        />
      ) : isAppClosed ? (
        // 2. App Closed Screen on confirmed Exit
        <AppClosedScreen onReopen={handleReopenApp} />
      ) : (
        // 3. 100% Clean Full-Screen WebView (Zero buttons, zero clutter)
        <main className="w-full h-full flex-1 relative overflow-hidden bg-white">
          <WebViewContainer
            targetUrl={TARGET_URL}
            isOnline={isOnline}
            onRetryConnection={handleRetryConnection}
          />
        </main>
      )}

      {/* Device Back Button Exit Confirmation Modal (Yes / No) */}
      <ExitConfirmationModal
        isOpen={showExitModal}
        onConfirmExit={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </div>
  );
}
