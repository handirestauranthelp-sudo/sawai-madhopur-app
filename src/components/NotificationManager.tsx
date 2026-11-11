import React, { useState } from 'react';
import { Bell, Send, CheckCheck, Trash2, Sparkles, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { NotificationItem } from '../types';
import { playSound } from '../utils/sound';

interface NotificationManagerProps {
  notifications: NotificationItem[];
  onSendNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  onClearAll: () => void;
  onMarkAllRead: () => void;
  onClose: () => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  notifications,
  onSendNotification,
  onClearAll,
  onMarkAllRead,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'inbox'>('send');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'update' | 'news' | 'alert' | 'general'>('update');
  const [sentSuccess, setSentSuccess] = useState(false);

  const presets = [
    {
      category: 'update' as const,
      title: 'Sawai Madhopur APK v3.2 Released',
      message: 'नया अपडेट उपलब्ध है! नए फीचर्स, बग फिक्स और तेज़ स्पीड के लिए अभी डाउनलोड करें।'
    },
    {
      category: 'news' as const,
      title: 'सवाई माधोपुर आज की ताज़ा ख़बर',
      message: 'जिले में नए विकास कार्यों का शुभारंभ एवं आज के मुख्य मंडी भाव जारी।'
    },
    {
      category: 'alert' as const,
      title: 'रणथंभौर सफारी बुकिंग अलर्ट',
      message: 'पर्यटकों के लिए ऑनलाइन सफारी बुकिंग की नई स्लॉट्स खुल गई हैं।'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    playSound.click();
    setTitle(p.title);
    setMessage(p.message);
    setCategory(p.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onSendNotification({
      title: title.trim(),
      message: message.trim(),
      type: category
    });

    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2500);
  };

  const handleRequestNativePermission = async () => {
    playSound.click();
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Sawai Madhopur WebView Pro', {
          body: 'पुश नोटिफिकेशन की अनुमति सक्रिय कर दी गई है!',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden text-white shadow-2xl animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">नोटिफिकेशन हब (Notification Hub)</h3>
              <p className="text-[10px] text-slate-400">भेजें और संदेश इतिहास देखें</p>
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

        {/* Segmented Tab Controls */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/50 border-b border-slate-800/80">
          <button
            onClick={() => {
              playSound.click();
              setActiveTab('send');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'send'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>नोटिफिकेशन भेजें (Send)</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              setActiveTab('inbox');
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'inbox'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>प्राप्त संदेश ({notifications.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {activeTab === 'send' ? (
            <div className="space-y-4">
              {/* Native Permission Helper */}
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-[11px]">ब्राउज़र पुश नोटिफिकेशन चालू करें</span>
                </div>
                <button
                  type="button"
                  onClick={handleRequestNativePermission}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold"
                >
                  Enable
                </button>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  त्वरित प्रीसेट (Quick Templates):
                </label>
                <div className="space-y-1.5">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="w-full text-left p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/30 transition-all text-xs"
                    >
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-amber-300 uppercase">
                          {p.category}
                        </span>
                        <span className="truncate">{p.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.message}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    शीर्षक (Notification Title) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="उदा. Sawai Madhopur APK Update..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    संदेश विवरण (Message Body) *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="नोटिफिकेशन का पूरा विवरण यहाँ लिखें..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    कैटेगरी (Category)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                    {(['update', 'news', 'alert', 'general'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          playSound.click();
                          setCategory(cat);
                        }}
                        className={`py-1.5 rounded-lg font-medium capitalize text-center transition-colors ${
                          category === cat
                            ? 'bg-amber-500/20 border border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!title.trim() || !message.trim()}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                  <span>तुरंत नोटिफिकेशन भेजें (Broadcast Now)</span>
                </button>

                {sentSuccess && (
                  <p className="text-xs font-bold text-emerald-400 text-center animate-in fade-in flex items-center justify-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>नोटिफिकेशन सफलतापूर्वक भेजा गया!</span>
                  </p>
                )}
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  कुल संदेश: {notifications.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSound.click();
                      onMarkAllRead();
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    सब पढ़ें
                  </button>
                  <span className="text-slate-600">·</span>
                  <button
                    onClick={() => {
                      playSound.click();
                      onClearAll();
                    }}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>खाली करें</span>
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>कोई नोटिफिकेशन नहीं है।</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    'नोटिफिकेशन भेजें' टैब से एक नया मैसेज टेस्ट करें।
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-colors ${
                      item.read
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                        : 'bg-slate-800/60 border-amber-500/40 text-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[11px]">
                      <span className="font-bold text-amber-400 capitalize">
                        {item.type || 'Alert'}
                      </span>
                      <span className="text-slate-500 text-[10px]">{item.timestamp}</span>
                    </div>
                    <h4 className="font-semibold text-xs text-white mb-0.5">{item.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-normal">{item.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
