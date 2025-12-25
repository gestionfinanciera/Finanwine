
import React, { useState } from 'react';
import { useApp } from '../App';
import { Goal } from '../types';

const GoalModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (g: Goal) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    category: 'Ahorro',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target) return;
    
    onSave({
      id: Math.random().toString(36).substring(2, 11),
      title: formData.title,
      description: '',
      target: parseFloat(formData.target),
      current: 0,
      priority: formData.priority,
      category: formData.category
    });
    
    setFormData({ title: '', target: '', category: 'Ahorro', priority: 'Medium' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/90 backdrop-blur-md animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark w-full max-w-md rounded-3xl border border-border-light dark:border-border-dark p-8 shadow-2xl scale-in">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black">Nueva Meta</h2>
            <p className="text-xs font-bold text-text-sec-light uppercase tracking-widest">Define tu objetivo</p>
          </div>
          <button onClick={onClose} className="size-10 flex items-center justify-center hover:bg-background-light dark:hover:bg-background-dark rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase opacity-50 ml-1 tracking-tighter">¿Qué quieres lograr?</label>
            <input 
              autoFocus required type="text" placeholder="Ej: Comprar Laptop, Fondo de Emergencia..." 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-background-light dark:bg-background-dark border-2 border-transparent focus:border-primary/50 rounded-2xl px-5 py-4 outline-none transition-all text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase opacity-50 ml-1 tracking-tighter">Monto Objetivo</label>
            <input 
              required type="number" placeholder="0.00" 
              value={formData.target}
              onChange={e => setFormData({...formData, target: e.target.value})}
              className="w-full bg-background-light dark:bg-background-dark border-2 border-transparent focus:border-primary/50 rounded-2xl px-5 py-4 outline-none transition-all text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase opacity-50 ml-1 tracking-tighter">Prioridad de Ahorro</label>
            <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((p) => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({...formData, priority: p as any})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                            formData.priority === p 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-background-light dark:bg-background-dark border-transparent opacity-50'
                        }`}
                    >
                        {p === 'Low' ? 'Baja' : p === 'Medium' ? 'Media' : 'Alta'}
                    </button>
                ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-[#102216] font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
            Guardar Meta de Ahorro
          </button>
        </form>
      </div>
    </div>
  );
};

const Goals = () => {
  const { settings, goals, addGoal, deleteGoal } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currencySymbol = settings.currency === 'ARS' ? '$' : settings.currency === 'EUR' ? '€' : '$';

  const handleDelete = (id: string) => {
    if (window.confirm('¿Confirmas que quieres eliminar esta meta?')) {
      deleteGoal(id);
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full flex flex-col gap-10 animate-fade-in min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Tus Metas</h1>
          <p className="text-text-sec-light dark:text-text-sec-dark font-medium">Visualiza y alcanza tus objetivos financieros.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-primary text-[#102216] font-black px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
            <span className="material-symbols-outlined">add_circle</span>
            Nueva Meta de Ahorro
        </button>
      </header>

      {goals.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-32 opacity-40">
              <div className="size-32 rounded-full bg-card-light dark:bg-card-dark border-4 border-dashed border-border-light dark:border-border-dark flex items-center justify-center text-text-sec-light">
                  <span className="material-symbols-outlined text-6xl">track_changes</span>
              </div>
              <div className="text-center flex flex-col gap-3 max-w-sm">
                  <h2 className="text-2xl font-black">Aún no tienes metas</h2>
                  <p className="text-sm font-bold text-text-sec-light uppercase tracking-widest leading-relaxed">
                      Tus metas de ahorro aparecerán aquí una vez que crees la primera.
                  </p>
              </div>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map((goal) => {
                const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                
                return (
                    <div key={goal.id} className="bg-card-light dark:bg-card-dark rounded-3xl border border-border-light dark:border-border-dark p-8 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="size-14 rounded-2xl flex items-center justify-center bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-3xl icon-fill">savings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                    goal.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                    goal.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                                    'bg-primary/10 text-primary border-primary/20'
                                }`}>
                                    Prio: {goal.priority === 'High' ? 'Alta' : goal.priority === 'Medium' ? 'Media' : 'Baja'}
                                </span>
                                <button 
                                    onClick={() => handleDelete(goal.id)}
                                    className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
                                    title="Borrar meta"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-2xl font-black mb-1 truncate">{goal.title}</h3>
                            <p className="text-xs text-text-sec-light font-bold uppercase tracking-wider">
                                {goal.current >= goal.target ? '¡Meta Completada! 🏆' : `Falta ${currencySymbol}${(goal.target - goal.current).toLocaleString()}`}
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-black">{currencySymbol}{goal.current.toLocaleString()}</span>
                                <span className="text-xs font-bold text-text-sec-light opacity-50">de {currencySymbol}{goal.target.toLocaleString()}</span>
                            </div>
                            
                            <div className="h-4 w-full bg-background-light dark:bg-background-dark rounded-full overflow-hidden p-1">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                        goal.priority === 'High' ? 'bg-red-500' : goal.priority === 'Medium' ? 'bg-orange-500' : 'bg-primary'
                                    }`} 
                                    style={{ width: `${Math.max(percent, 5)}%` }}
                                ></div>
                            </div>
                            
                            <div className="flex justify-between text-[10px] font-black text-text-sec-light uppercase tracking-widest">
                                <span>{percent}% Logrado</span>
                                <button className="text-primary hover:underline transition-all">Ver detalles</button>
                            </div>
                        </div>
                    </div>
                );
            })}
          </div>
      )}

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(g) => addGoal(g)} 
      />
    </div>
  );
};

export default Goals;
