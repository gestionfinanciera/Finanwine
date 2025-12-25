
import React from 'react';
import { useApp } from '../App';

const Settings = () => {
  const { settings, setSettings, clearData } = useApp();

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar TODOS tus datos? Esta acción es irreversible y reiniciará la aplicación.')) {
        clearData();
        // Recargar para limpiar todo el estado de la memoria y el almacenamiento
        window.location.reload();
    }
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-3xl mx-auto w-full flex flex-col gap-10 animate-fade-in">
      <header>
        <h1 className="text-4xl font-black mb-2">Configuración</h1>
        <p className="text-text-sec-light dark:text-text-sec-dark font-medium">Personaliza tu experiencia financiera.</p>
      </header>

      <div className="flex flex-col gap-6">
        <section className="bg-card-light dark:bg-card-dark rounded-3xl border border-border-light dark:border-border-dark p-8 shadow-sm">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Moneda Principal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { id: 'ARS', label: 'Pesos Argentinos' },
                    { id: 'USD', label: 'Dólares (USD)' },
                    { id: 'EUR', label: 'Euros (EUR)' },
                    { id: 'CLP', label: 'Pesos Chilenos' },
                    { id: 'BRL', label: 'Reales (BRL)' }
                ].map(curr => (
                    <button 
                        key={curr.id}
                        onClick={() => setSettings({ ...settings, currency: curr.id })}
                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                            settings.currency === curr.id 
                                ? 'bg-primary/10 border-primary text-primary font-black shadow-sm' 
                                : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark hover:border-primary/50'
                        }`}
                    >
                        <span className="text-sm">{curr.label}</span>
                        <span className="text-[10px] font-black opacity-60">{curr.id}</span>
                    </button>
                ))}
            </div>
        </section>

        <section className="bg-card-light dark:bg-card-dark rounded-3xl border border-border-light dark:border-border-dark p-8 shadow-sm">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">contrast</span>
                Apariencia
            </h2>
            <div className="flex flex-col gap-3">
                {[
                    { id: 'light', label: 'Modo Claro', icon: 'light_mode' },
                    { id: 'dark', label: 'Modo Oscuro', icon: 'dark_mode' },
                    { id: 'system', label: 'Preferencia del Dispositivo', icon: 'settings_brightness' }
                ].map(theme => (
                    <button 
                        key={theme.id}
                        onClick={() => setSettings({ ...settings, theme: theme.id as any })}
                        className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                            settings.theme === theme.id 
                                ? 'bg-primary/10 border-primary text-primary font-black shadow-sm' 
                                : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark hover:border-primary/50'
                        }`}
                    >
                        <span className="material-symbols-outlined">{theme.icon}</span>
                        <span className="text-sm">{theme.label}</span>
                        {settings.theme === theme.id && <span className="material-symbols-outlined ml-auto text-sm">check_circle</span>}
                    </button>
                ))}
            </div>
        </section>

        <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
            <h2 className="text-lg font-black text-red-500 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">delete_forever</span>
                Zona de Peligro
            </h2>
            <p className="text-xs text-text-sec-light font-bold mb-6">Esta acción borrará todas tus transacciones, metas y configuraciones guardadas de forma permanente.</p>
            <button 
                onClick={handleReset}
                className="w-full sm:w-auto bg-red-500 text-white font-black py-4 px-10 rounded-2xl hover:bg-red-600 transition-all text-sm active:scale-95 shadow-lg shadow-red-500/20"
            >
                Restablecer todos los datos
            </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
