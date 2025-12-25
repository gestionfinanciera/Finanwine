
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

const Budget = () => {
  const { settings, transactions, addTransaction, deleteTransaction } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const available = income - expense;
  const currencySymbol = settings.currency === 'ARS' ? '$' : settings.currency === 'EUR' ? '€' : '$';

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full flex flex-col gap-10 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tight">Tu Presupuesto</h1>
          <p className="text-text-sec-light dark:text-text-sec-dark font-medium">Control total de tus finanzas en tiempo real.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-2xl h-14 px-8 bg-primary text-[#102216] text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Nuevo Movimiento</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary p-8 rounded-3xl text-[#102216] flex flex-col gap-1 shadow-xl shadow-primary/10 transition-transform hover:scale-[1.02]">
          <p className="text-xs font-black uppercase tracking-widest opacity-70">Balance Disponible</p>
          <p className="text-4xl font-black tracking-tighter">{currencySymbol} {available.toLocaleString()}</p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl border border-border-light dark:border-border-dark flex flex-col gap-1 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-xs font-black uppercase tracking-widest text-text-sec-light">Total Ingresos</p>
          <p className="text-4xl font-black tracking-tighter text-primary">{currencySymbol} {income.toLocaleString()}</p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl border border-border-light dark:border-border-dark flex flex-col gap-1 shadow-sm transition-transform hover:scale-[1.02]">
          <p className="text-xs font-black uppercase tracking-widest text-text-sec-light">Total Gastos</p>
          <p className="text-4xl font-black tracking-tighter text-red-500">{currencySymbol} {expense.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <section className="bg-card-light dark:bg-card-dark rounded-[2.5rem] border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-8 border-b border-border-light dark:border-border-dark font-black text-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary icon-fill">list_alt</span>
            Historial de Movimientos
          </div>
          <div className="p-0">
             {transactions.length > 0 ? [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item, idx) => (
               <div key={item.id} className="p-6 border-b border-border-light dark:border-border-dark last:border-none flex justify-between items-center hover:bg-background-light dark:hover:bg-background-dark/30 transition-all group">
                  <div className="flex items-center gap-5">
                      <div className={`size-14 rounded-2xl flex items-center justify-center transition-colors ${item.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                          <span className="material-symbols-outlined text-2xl">{item.type === 'income' ? 'arrow_downward' : 'arrow_upward'}</span>
                      </div>
                      <div className="flex flex-col">
                          <span className="font-black text-lg tracking-tight">{item.description}</span>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{item.category}</span>
                             <span className="text-[10px] font-bold text-text-sec-light opacity-60 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                {new Date(item.date).toLocaleDateString()}
                             </span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className={`text-2xl font-black tracking-tighter ${item.type === 'income' ? 'text-primary' : 'text-red-500'}`}>
                        {item.type === 'income' ? '+' : '-'} {currencySymbol}{item.amount.toLocaleString()}
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Eliminar movimiento"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
               </div>
             )) : (
               <div className="p-24 text-center flex flex-col items-center gap-6 opacity-30">
                  <span className="material-symbols-outlined text-8xl animate-pulse">receipt_long</span>
                  <div className="flex flex-col gap-2">
                    <p className="text-xl font-black uppercase tracking-[0.2em]">Sin actividad reciente</p>
                    <p className="text-sm font-medium">Tus transacciones aparecerán aquí automáticamente.</p>
                  </div>
               </div>
             )}
          </div>
        </section>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(t) => addTransaction(t)} 
      />
    </div>
  );
};

export default Budget;
