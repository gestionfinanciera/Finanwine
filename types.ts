
export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  description: string;
}

export interface UserSettings {
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  icon: string;
  title: string;
  msg: string;
  time: string;
  read: boolean;
}
