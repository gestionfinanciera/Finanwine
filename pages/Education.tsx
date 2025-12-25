
import React from 'react';
// Import Link from react-router-dom to fix "Cannot find name 'Link'" error
import { Link } from 'react-router-dom';

const Education = () => {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full flex flex-col gap-10 animate-fade-in">
      <section className="rounded-3xl bg-primary/10 p-8 md:p-12 relative overflow-hidden group">
        <span className="material-symbols-outlined text-primary text-[200px] absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">school</span>
        <div className="relative z-10 max-w-2xl flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Domina el arte del <span className="text-primary">Dinero Inteligente</span>
            </h1>
            <p className="text-lg font-medium opacity-80 leading-relaxed">
                Estás al 65% del módulo 'Inversión Pasiva'. ¡Sigue así para desbloquear el siguiente nivel!
            </p>
            <button className="w-fit bg-primary text-[#102216] font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">play_circle</span>
                Continuar Aprendiendo
            </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 flex flex-col gap-8">
            <h2 className="text-2xl font-bold">Cursos para Ti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                    { title: 'Interés Compuesto 101', duration: '45 min', category: 'Inversión', img: 'https://picsum.photos/seed/learn1/400/250' },
                    { title: 'Impuestos para Freelancers', duration: '1.5h', category: 'Fiscalidad', img: 'https://picsum.photos/seed/learn2/400/250' },
                    { title: 'Psicología del Gasto', duration: '30 min', category: 'Conducta', img: 'https://picsum.photos/seed/learn3/400/250' },
                    { title: 'Bitcoin y Cripto', duration: '2h', category: 'Emergente', img: 'https://picsum.photos/seed/learn4/400/250' }
                ].map((course, idx) => (
                    <div key={idx} className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                        <div className="aspect-video relative overflow-hidden">
                            <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-background-light/90 dark:bg-background-dark/90 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {course.category}
                            </div>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{course.title}</h3>
                            <div className="flex items-center gap-4 text-xs font-bold text-text-sec-light">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                    {course.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">equalizer</span>
                                    Básico
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <aside className="flex flex-col gap-8">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
                <h3 className="font-bold mb-6 flex items-center justify-between">
                    Tus Logros
                    <span className="material-symbols-outlined text-primary">military_tech</span>
                </h3>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">savings</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Ahorrador Novato</span>
                            <span className="text-[10px] text-text-sec-light">Nivel 1</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 grayscale opacity-40">
                        <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Inversor Maestro</span>
                            <span className="text-[10px] text-text-sec-light">Bloqueado</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-background-dark text-white rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-6xl text-primary animate-pulse">psychology</span>
                </div>
                <h4 className="font-bold mb-2 relative z-10">¿Dudas con el contenido?</h4>
                <p className="text-xs opacity-70 mb-4 relative z-10">Pregunta a nuestra IA sobre cualquier concepto del curso.</p>
                <Link to="/ai" className="relative z-10 w-full py-2 bg-primary text-[#102216] font-bold rounded-lg text-xs flex items-center justify-center gap-2">
                    Preguntar a Gemini
                </Link>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default Education;
