
import React, { useMemo, useState } from 'react';
import { useApp } from '../App';

const Trends = () => {
  const { transactions, settings } = useApp();
  const [activeFilter, setActiveFilter] = useState('Este Año');
  const currencySymbol = settings.currency === 'ARS' ? '$' : settings.currency === 'EUR' ? '€' : '$';

  // Cálculos dinámicos
  const stats = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const incomes = transactions.filter(t => t.type === 'income');
    
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
    const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);
    
    // Promedio mensual (aproximado por meses con transacciones)
    const months = new Set(transactions.map(t => new Date(t.date).getMonth())).size || 1;
    const avgExpense = totalExpense / months;

    // Agrupar gastos por categoría para el donut
    const expenseByCategory = expenses.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const incomeByCategory = incomes.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return { 
      totalIncome, 
      totalExpense, 
      netWorth: totalIncome - totalExpense, 
      avgExpense,
      expenseByCategory,
      incomeByCategory
    };
  }, [transactions]);

  const exportReport = () => {
    alert("Generando reporte financiero en PDF... Estará listo en unos segundos.");
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full p-6 md:p-8 flex flex-col gap-8 animate-fade-in">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">Análisis Detallado de Tendencias</h1>
          <p className="text-text-sec-light dark:text-text-sec-dark text-base md:text-lg font-medium leading-normal">
            Visualiza tus patrones y toma el control de tu futuro financiero.
          </p>
        </div>
        <button 
          onClick={exportReport}
          className="md:flex items-center gap-2 bg-text-main-light dark:bg-white text-white dark:text-text-main-light px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          Exportar Reporte
        </button>
      </header>

      {/* Filtros */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['Este Año', 'Últimos 30 días', 'Este Trimestre'].map(filter => (
          <button 
            key={filter} 
            onClick={() => setActiveFilter(filter)}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-6 transition-all active:scale-95 shadow-sm font-bold text-sm ${
              activeFilter === filter 
                ? 'bg-text-main-light dark:bg-primary text-white dark:text-black' 
                : 'bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-text-sec-light hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark px-6 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors font-medium text-sm">
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          Personalizado
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Evolución de Egresos */}
        <div className="flex flex-col p-8 rounded-3xl bg-card-light dark:bg-card-dark shadow-sm border border-gray-100 dark:border-[#2a4034] h-[350px]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-text-sec-light dark:text-text-sec-dark text-xs font-black uppercase tracking-widest">Evolución de Egresos</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-text-main-light dark:text-text-main-dark text-3xl font-black">{currencySymbol}{Math.round(stats.avgExpense).toLocaleString()}</span>
                <span className="text-[10px] font-bold text-text-sec-light uppercase tracking-tighter">promedio/mes</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[16px]">trending_down</span>
              <span className="text-[10px] font-black">-5% vs mes anterior</span>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M0,80 Q50,70 100,75 T200,60 T300,40 V100 H0 Z" fill="url(#grad1)" className="opacity-10" />
              <path d="M0,80 Q50,70 100,75 T200,60 T300,40" fill="none" stroke="#13ec5b" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black uppercase opacity-40">
            <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        {/* Gráfico 2: Patrimonio Neto */}
        <div className="flex flex-col p-8 rounded-3xl bg-card-light dark:bg-card-dark shadow-sm border border-gray-100 dark:border-[#2a4034] h-[350px]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-text-sec-light dark:text-text-sec-dark text-xs font-black uppercase tracking-widest">Patrimonio Neto</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-text-main-light dark:text-text-main-dark text-3xl font-black">{currencySymbol}{stats.netWorth.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-text-sec-light uppercase tracking-tighter">total actual</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="text-[10px] font-black">+12% anual</span>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M0,90 C50,85 100,80 150,60 S250,40 300,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-80" />
              <circle cx="300" cy="20" r="5" fill="#13ec5b" />
            </svg>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black uppercase opacity-40">
            <span>2022</span><span>2023</span><span>2024 (YTD)</span>
          </div>
        </div>

        {/* Gráfico 3: Distribución de Gastos */}
        <div className="flex flex-col p-8 rounded-3xl bg-card-light dark:bg-card-dark shadow-sm border border-gray-100 dark:border-[#2a4034] h-[350px]">
          <h3 className="text-lg font-black mb-1">Distribución de Gastos</h3>
          <p className="text-xs font-bold text-text-sec-light uppercase tracking-widest mb-8">Desglose por categoría este mes</p>
          <div className="flex flex-1 items-center gap-10">
            <div className="relative size-40 shrink-0">
              <svg className="-rotate-90" viewBox="0 0 32 32">
                 <circle cx="16" cy="16" r="16" fill="transparent" stroke="#13ec5b" strokeWidth="8" strokeDasharray="40 60" pathLength="100" />
                 <circle cx="16" cy="16" r="16" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="25 75" strokeDashoffset="-40" pathLength="100" className="opacity-80" />
                 <circle cx="16" cy="16" r="16" fill="transparent" stroke="#87a893" strokeWidth="8" strokeDasharray="35 65" strokeDashoffset="-65" pathLength="100" />
                 <circle cx="16" cy="16" r="12" className="fill-card-light dark:fill-card-dark" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black opacity-40 uppercase">Total</span>
                <span className="text-xl font-black">{currencySymbol}{Math.round(stats.totalExpense / 1000)}k</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
              {Object.keys(stats.expenseByCategory).length > 0 ? Object.entries(stats.expenseByCategory).map(([cat, val]: any, i) => (
                <div key={cat} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${i === 0 ? 'bg-[#13ec5b]' : i === 1 ? 'bg-text-main-light dark:bg-white' : 'bg-[#87a893]'}`} />
                    <span className="font-bold opacity-80">{cat}</span>
                  </div>
                  <span className="font-black">{Math.round((val / stats.totalExpense) * 100)}%</span>
                </div>
              )) : (
                <p className="text-xs opacity-50 italic">Registra gastos para ver el desglose.</p>
              )}
            </div>
          </div>
        </div>

        {/* Gráfico 4: Fuentes de Ingresos */}
        <div className="flex flex-col p-8 rounded-3xl bg-card-light dark:bg-card-dark shadow-sm border border-gray-100 dark:border-[#2a4034] h-[350px]">
          <h3 className="text-lg font-black mb-1">Fuentes de Ingresos</h3>
          <p className="text-xs font-bold text-text-sec-light uppercase tracking-widest mb-8">Diversificación de entradas</p>
          <div className="flex flex-1 items-center gap-10">
            <div className="relative size-40 shrink-0">
              <svg className="-rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="65 35" pathLength="100" className="opacity-80" />
                <circle cx="16" cy="16" r="16" fill="transparent" stroke="#13ec5b" strokeWidth="8" strokeDasharray="35 65" strokeDashoffset="-65" pathLength="100" />
                <circle cx="16" cy="16" r="12" className="fill-card-light dark:fill-card-dark" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black opacity-40 uppercase">Total</span>
                <span className="text-xl font-black">{currencySymbol}{Math.round(stats.totalIncome / 1000)}k</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
              {Object.keys(stats.incomeByCategory).length > 0 ? Object.entries(stats.incomeByCategory).map(([cat, val]: any, i) => (
                <div key={cat} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full ${i === 0 ? 'bg-text-main-light dark:bg-white' : 'bg-[#13ec5b]'}`} />
                    <span className="font-bold opacity-80">{cat}</span>
                  </div>
                  <span className="font-black">{Math.round((val / (stats.totalIncome || 1)) * 100)}%</span>
                </div>
              )) : (
                <p className="text-xs opacity-50 italic">Registra ingresos para ver el desglose.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <div className="w-full bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 mb-8 border border-primary/10">
        <div className="bg-primary rounded-2xl p-3 text-black shrink-0 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-3xl">psychology</span>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-black">Insight Proactivo</h4>
          <p className="text-sm font-medium opacity-80 max-w-2xl leading-relaxed">
            {stats.netWorth > 0 
              ? `¡Buen trabajo! Estás manteniendo un patrimonio neto positivo de ${currencySymbol}${stats.netWorth.toLocaleString()}. Tu salud financiera es robusta comparada con el promedio.`
              : `Alerta: Tu patrimonio neto actual es negativo. Te recomendamos revisar tus gastos de este mes y priorizar el ahorro.`}
          </p>
        </div>
        <button className="md:ml-auto text-sm font-black text-primary hover:underline uppercase tracking-widest">
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default Trends;
