
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION_ITEMS } from './constants';
import Dashboard from './pages/Dashboard';
import Trends from './pages/Trends';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Education from './pages/Education';
import Community from './pages/Community';
import Alerts from './pages/Alerts';
import AIAssistant from './pages/AIAssistant';
import Connection from './pages/Connection';
import Settings from './pages/Settings';
import { UserSettings, Transaction, Goal, Notification } from './types';

const AppContext = createContext<{
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  goals: Goal[];
  addGoal: (g: Goal) => void;
  deleteGoal: (id: string) => void;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  clearData: () => void;
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 hidden lg:flex flex-col h-screen bg-card-light dark:bg-card-dark border-r border-[#e0e0e0] dark:border-[#2a4034] p-4 justify-between shrink-0 sticky top-0 transition-colors duration-200">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-10 flex items-center justify-center bg-primary/20 text-primary rounded-xl">
             <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-text-main-light dark:text-text-main-dark text-lg font-black leading-tight">Finanwise</h1>
            <p className="text-text-sec-light dark:text-text-sec-dark text-[10px] font-bold uppercase tracking-widest">Gestión Proactiva</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.id}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-background-light dark:hover:bg-background-dark/30 text-text-sec-light dark:text-text-sec-dark'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'icon-fill' : 'group-hover:text-primary'}`}>
                  {item.icon}
                </span>
                <p className={`text-sm font-bold ${isActive ? 'text-text-main-light dark:text-text-main-dark' : 'group-hover:text-text-main-light dark:group-hover:text-text-main-dark'}`}>
                  {item.label}
                </p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Snippet */}
      <div 
        onClick={() => navigate('/settings')}
        className="flex items-center gap-3 px-3 py-3 rounded-2xl border border-gray-100 dark:border-[#2a4034] bg-background-light dark:bg-background-dark cursor-pointer hover:border-primary/40 transition-all shadow-sm"
      >
        <div className="size-10 rounded-full bg-cover bg-center" style={{backgroundImage: `url('https://api.dicebear.com/7.x/avataaars/svg?seed=Alex')`}}></div>
        <div className="flex flex-col min-w-0">
          <p className="text-text-main-light dark:text-text-main-dark text-sm font-black truncate">Alex Morgan</p>
          <p className="text-text-sec-light dark:text-text-sec-dark text-[10px] font-bold uppercase tracking-tighter">Plan Premium</p>
        </div>
      </div>
    </aside>
  );
};

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="lg:hidden sticky top-0 z-50">
            <div className="flex items-center justify-between p-4 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                    <span className="font-black text-lg">Finanwise</span>
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                    <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
                </button>
            </div>
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark p-4 shadow-xl flex flex-col gap-2">
                    {NAVIGATION_ITEMS.map((item) => (
                        <Link 
                            key={item.id} 
                            to={item.path} 
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-lg ${location.pathname === item.path ? 'bg-primary/10 text-primary' : ''}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="font-bold">{item.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

const App = () => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('finanwise_settings');
    return saved ? JSON.parse(saved) : { currency: 'ARS', theme: 'system' };
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finanwise_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('finanwise_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'danger', icon: 'error', title: 'Gasto Inusual Detectado', msg: 'Se ha registrado un cargo de $125.000,00 en un comercio no habitual.', time: 'Hace 10 min', read: false },
    { id: '2', type: 'warning', icon: 'warning', title: 'Factura Próxima', msg: 'Tu recibo de electricidad vence en 3 días. Asegúrate de tener saldo suficiente.', time: 'Hace 2 horas', read: false },
    { id: '3', type: 'info', icon: 'info', title: 'Meta Alcanzada 75%', msg: '¡Estás muy cerca de completar tu Fondo de Emergencia! Sigue así.', time: 'Ayer', read: false },
    { id: '4', type: 'success', icon: 'check_circle', title: 'Ingreso Programado', msg: 'Se ha recibido la transferencia de nómina con éxito.', time: 'Ayer', read: false }
  ]);

  useEffect(() => {
    localStorage.setItem('finanwise_settings', JSON.stringify(settings));
    const root = window.document.documentElement;
    const applyTheme = (t: string) => {
      if (t === 'dark') root.classList.add('dark');
      else if (t === 'light') root.classList.remove('dark');
      else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };
    applyTheme(settings.theme);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('finanwise_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finanwise_goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (t: Transaction) => setTransactions(prev => [...prev, t]);
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));
  
  const addGoal = (g: Goal) => setGoals(prev => [...prev, g]);
  const deleteGoal = (id: string) => setGoals(prev => prev.filter(g => g.id !== id));

  const dismissNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  
  const clearData = () => {
    setTransactions([]);
    setGoals([]);
    localStorage.removeItem('finanwise_transactions');
    localStorage.removeItem('finanwise_goals');
  };

  return (
    <AppContext.Provider value={{ settings, setSettings, transactions, addTransaction, deleteTransaction, goals, addGoal, deleteGoal, notifications, dismissNotification, clearData }}>
      <Router>
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <MobileNav />
            <main className="flex-1 overflow-y-auto no-scrollbar">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/education" element={<Education />} />
                <Route path="/community" element={<Community />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/connect" element={<Connection />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
