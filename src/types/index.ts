export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: 'update' | 'news' | 'alert' | 'general';
}

export interface AppSettings {
  deviceMode: 'mobile' | 'fullscreen';
  theme: 'light' | 'dark';
  fontSize: number; // percentage, e.g. 100
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
