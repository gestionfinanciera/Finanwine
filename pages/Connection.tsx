
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Connection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark p-6 md:p-12 animate-fade-in">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between mb-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <span className="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                <span className="font-black text-2xl">Finanwise</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-white dark:bg-card-dark px-4 py-2 rounded-full border border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                CIFRADO BANCARIO SSL
            </div>
        </header>

        <main className="max-w-4xl mx-auto w-full flex flex-col gap-12">
            <div className="text-center md:text-left flex flex-col gap-4">
                <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                    Conecta tus bancos con <span className="text-primary">seguridad total</span>
                </h1>
                <p className="text-lg text-text-sec-light max-w-2xl leading-relaxed">
                    Acceso de solo lectura. Tus datos están protegidos por encriptación AES-256 de grado militar. Nunca compartiremos tus datos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: 'shield_lock', title: 'Cifrado Total', desc: 'Protección de nivel bancario.' },
                    { icon: 'visibility_off', title: 'Solo Lectura', desc: 'No podemos mover tu dinero.' },
                    { icon: 'verified_user', title: 'Regulado', desc: 'Cumplimos con PSD2 y GDPR.' }
                ].map((f, i) => (
                    <div key={i} className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-8 rounded-2xl flex flex-col gap-4 shadow-sm">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">{f.icon}</span>
                        </div>
                        <h3 className="font-bold text-lg">{f.title}</h3>
                        <p className="text-sm text-text-sec-light">{f.desc}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-8 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-10 rounded-3xl shadow-xl">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold opacity-60 ml-1">Selecciona tu Entidad</label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">search</span>
                        <input type="text" placeholder="Ej: Santander, BBVA, Revolut..." className="w-full pl-12 pr-4 py-4 bg-background-light dark:bg-background-dark border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-primary transition-all font-bold text-sm">
                        <span className="size-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white">S</span>
                        Santander
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-background-dark border border-border-light dark:border-border-dark hover:border-primary transition-all font-bold text-sm">
                        <span className="size-6 bg-blue-700 rounded-full flex items-center justify-center text-[10px] text-white">B</span>
                        BBVA
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6 mt-4">
                    <button onClick={() => navigate('/')} className="w-full max-w-md h-14 bg-primary text-[#102216] font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <span className="material-symbols-outlined">link</span>
                        Conectar Cuenta Bancaria
                    </button>
                    <button onClick={() => navigate('/')} className="text-sm font-bold text-text-sec-light hover:text-text-main-light transition-colors underline underline-offset-4 decoration-primary/30">
                        Configurar manualmente por ahora
                    </button>
                </div>
            </div>
        </main>
    </div>
  );
};

export default Connection;
