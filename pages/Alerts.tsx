
import React from 'react';
import { useApp } from '../App';

const Alerts = () => {
  const { settings, notifications, dismissNotification } = useApp();
  const currencySymbol = settings.currency === 'ARS' ? '$' : settings.currency === 'EUR' ? '€' : '$';

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1200px] mx-auto w-full flex flex-col gap-10 animate-fade-in">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black">Notificaciones</h1>
        <p className="text-text-sec-light dark:text-text-sec-dark font-medium">Mantente informado de tus movimientos importantes.</p>
      </header>

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {notifications.map((alert) => (
            <div key={alert.id} className={`flex items-start gap-5 p-8 rounded-[2.5rem] border bg-card-light dark:bg-card-dark shadow-sm hover:shadow-xl transition-all ${
              alert.type === 'danger' ? 'border-l-[6px] border-l-red-500 border-border-light dark:border-border-dark' : 
              alert.type === 'warning' ? 'border-l-[6px] border-l-orange-500 border-border-light dark:border-border-dark' : 
              alert.type === 'success' ? 'border-l-[6px] border-l-primary border-border-light dark:border-border-dark' : 
              'border-l-[6px] border-l-blue-500 border-border-light dark:border-border-dark'
            }`}>
              <div className={`p-4 rounded-2xl shrink-0 ${
                alert.type === 'danger' ? 'bg-red-500/10 text-red-500' : 
                alert.type === 'warning' ? 'bg-orange-500/10 text-orange-500' : 
                alert.type === 'success' ? 'bg-primary/10 text-primary' : 
                'bg-blue-500/10 text-blue-500'
              }`}>
                <span className="material-symbols-outlined text-3xl">{alert.icon}</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black tracking-tight">{alert.title}</h3>
                      <span className="text-[10px] text-text-sec-light font-black uppercase tracking-widest">{alert.time}</span>
                  </div>
                  <p className="text-sm text-text-sec-light leading-relaxed font-medium">{alert.msg}</p>
                  <div className="flex gap-6 mt-4">
                      <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Ver detalles</button>
                      <button 
                        onClick={() => dismissNotification(alert.id)}
                        className="text-xs font-black text-text-sec-light hover:text-text-main-light uppercase tracking-widest"
                      >
                        Descartar
                      </button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 py-32 opacity-30">
          <span className="material-symbols-outlined text-8xl">notifications_off</span>
          <div className="text-center">
            <p className="text-xl font-black uppercase tracking-widest">Sin notificaciones</p>
            <p className="text-sm font-medium">Estás al día. No hay alertas nuevas.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
