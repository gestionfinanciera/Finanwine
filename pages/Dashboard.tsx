
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Transaction } from '../types';

const TransactionModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (t: Transaction) => void }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Vivienda',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: new Date(formData.date + 'T12:00:00') 
    });
    setFormData({ description: '', amount: '', category: 'Vivienda', type: 'expense', date: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark w-full max-w-md rounded-3xl border border-border-light dark:border-border-dark p-8 shadow-2xl scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Nuevo Movimiento</h2>
          <button onClick={onClose} className="p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex bg-background-light dark:bg-background-dark p-1 rounded-xl">
            <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'expense'})}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${formData.type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'opacity-50'}`}
            >
                Gasto
            </button>
            <button 
                type="button"
                onClick={() => setFormData({...formData, type: 'income'})}
                className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${formData.type === 'income' ? 'bg-primary text-[#102216] shadow-lg' : 'opacity-50'}`}
            >
                Ingreso
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase opacity-50 ml-1">Descripción</label>
            <input 
              autoFocus required type="text" placeholder="Ej: Supermercado, Sueldo..." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-background-light dark:bg-background-dark border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase opacity-50 ml-1">Monto</label>
            <input 
              required type="number" placeholder="0.00" 
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              className="w-full bg-background-light dark:bg-background-dark border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase opacity-50 ml-1">Categoría</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-background-light dark:bg-background-dark border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold appearance-none"
                >
                  <option value="Vivienda">Vivienda</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Ocio">Ocio</option>
                  <option value="Salud">Salud</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase opacity-50 ml-1">Fecha</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-background-light dark:bg-background-dark border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                />
              </div>
          </div>

          <button type="submit" className="w-full bg-primary text-[#102216] font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
            Registrar Movimiento
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { settings, transactions, addTransaction } = useApp();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netWorth = totalIncome - totalExpenses;

  const currencySymbol = settings.currency === 'ARS' ? '$' : settings.currency === 'EUR' ? '€' : '$';

  return (
    <div className="p-6 md:p-12 lg:p-16 flex flex-col gap-12 max-w-[1500px] mx-auto w-full animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-3xl">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-5 py-2 rounded-full w-fit">
            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Estado: Optimizado</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
            Hola, <span className="text-primary italic">Inversor</span> 👋
          </h1>
          <p className="text-text-sec-light dark:text-text-sec-dark text-xl md:text-2xl font-medium leading-relaxed">
            Tu patrimonio consolidado al día de hoy. Gestiona tus finanzas con precisión.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-[#102216] font-black px-12 py-6 rounded-3xl shadow-[0_20px_40px_rgba(19,236,91,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
        >
          <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add_circle</span>
          <span className="text-xl">Nuevo Movimiento</span>
        </button>
      </header>

      {/* Tarjetas de Resumen de Impacto */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { 
            label: 'Patrimonio Neto', 
            val: netWorth, 
            icon: 'account_balance', 
            col: 'text-primary', 
            bg: 'bg-primary/10',
            desc: 'Balance total consolidado' 
          },
          { 
            label: 'Flujo de Ingresos', 
            val: totalIncome, 
            icon: 'trending_up', 
            col: 'text-primary', 
            bg: 'bg-primary/10',
            desc: 'Capital entrante acumulado' 
          },
          { 
            label: 'Salidas de Capital', 
            val: totalExpenses, 
            icon: 'trending_down', 
            col: 'text-red-500', 
            bg: 'bg-red-500/10',
            desc: 'Gastos y pasivos liquidados' 
          }
        ].map((card, i) => (
          <div 
            key={i}
            onClick={() => navigate('/budget')}
            className="cursor-pointer group flex flex-col gap-8 rounded-[3rem] p-12 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm hover:border-primary/40 transition-all hover:shadow-2xl active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-[1.5rem] ${card.bg} ${card.col} group-hover:bg-primary group-hover:text-black transition-colors`}>
                <span className="material-symbols-outlined text-4xl icon-fill">{card.icon}</span>
              </div>
              <div className="flex flex-col">
                <p className="text-text-sec-light dark:text-text-sec-dark text-xs font-black uppercase tracking-[0.25em]">{card.label}</p>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{card.desc}</p>
              </div>
            </div>
            <p className={`text-5xl md:text-6xl font-black tracking-tighter ${card.col === 'text-red-500' ? 'text-red-500' : 'text-text-main-light dark:text-text-main-dark'}`}>
              {currencySymbol}{Math.abs(card.val).toLocaleString()}
            </p>
          </div>
        ))}
      </section>

      {/* Sección de Accesos Rápidos o Información Adicional */}
      <div className="bg-card-light dark:bg-card-dark rounded-[4rem] border border-border-light dark:border-border-dark p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-xl">
              <h2 className="text-3xl font-black tracking-tight">Presupuesto en Detalle</h2>
              <p className="text-text-sec-light dark:text-text-sec-dark font-medium text-lg leading-relaxed">
                  Para ver el historial completo de tus movimientos, tendencias detalladas y análisis de categorías, visita la sección de presupuesto.
              </p>
          </div>
          <button 
            onClick={() => navigate('/budget')}
            className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-black px-10 py-5 rounded-[2rem] border border-border-light dark:border-border-dark hover:border-primary transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined">payments</span>
            Ir a Presupuesto
          </button>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(t) => addTransaction(t)} 
      />
    </div>
  );
};

export default Dashboard;
