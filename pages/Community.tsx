
import React from 'react';

const Community = () => {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1200px] mx-auto w-full flex flex-col gap-8 animate-fade-in">
      <header className="relative w-full rounded-3xl overflow-hidden min-h-[300px] flex items-end p-8 md:p-12 shadow-2xl">
        <img src="https://picsum.photos/seed/community/1200/400" className="absolute inset-0 w-full h-full object-cover" alt="Community Header" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-1.5 rounded-full text-primary text-xs font-black uppercase tracking-widest w-fit">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Oficial Finanwise
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Juntos por la Libertad Financiera</h1>
            <p className="text-lg font-medium text-white/80">Aprende de las estrategias de otros usuarios y celebra tus logros.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex gap-4">
                    <div className="size-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">person</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <textarea className="w-full bg-background-light dark:bg-background-dark border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none" placeholder="¡Comparte un hito hoy! Ej: 'Logré ahorrar mi primer 10%...'"></textarea>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4 text-text-sec-light">
                                <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">image</span></button>
                                <button className="hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">mood</span></button>
                            </div>
                            <button className="bg-primary text-[#102216] font-bold py-2 px-8 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm">
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {[
                    { user: 'Ahorrador_Pro', text: '¡Por fin completé mi fondo de emergencia! 6 meses de disciplina pagaron la pena. #LibertadFinanciera', likes: 24, time: '2h', avatar: 'https://picsum.photos/seed/user1/100/100' },
                    { user: 'Inversora_Luz', text: 'Hoy invertí mis primeros 50€ en un ETF. Empieza pequeño, piensa en grande.', likes: 56, time: '5h', avatar: 'https://picsum.photos/seed/user2/100/100' }
                ].map((post, i) => (
                    <div key={i} className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <img src={post.avatar} className="size-10 rounded-full object-cover" alt={post.user} />
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-sm">{post.user}</h3>
                                    <span className="text-[10px] text-text-sec-light font-medium uppercase tracking-widest">{post.time} ago</span>
                                </div>
                            </div>
                            <button className="text-text-sec-light"><span className="material-symbols-outlined">more_horiz</span></button>
                        </div>
                        <p className="text-sm leading-relaxed mb-6">{post.text}</p>
                        <div className="flex gap-6 border-t border-border-light dark:border-border-dark pt-4">
                            <button className="flex items-center gap-1.5 text-xs font-bold text-text-sec-light hover:text-red-500 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">favorite</span>
                                {post.likes}
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-bold text-text-sec-light hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">comment</span>
                                Comentar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark shadow-sm">
                <h3 className="font-bold mb-6">Tendencias</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-primary uppercase">#InversionPasiva</span>
                        <span className="text-[10px] text-text-sec-light">1.2k personas hablando</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-primary uppercase">#Reto30Dias</span>
                        <span className="text-[10px] text-text-sec-light">800 personas participando</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl p-6 border border-white/10 flex flex-col gap-4">
                <h4 className="font-bold">Desafío del Mes</h4>
                <p className="text-xs opacity-70">Ahorra un 10% extra y consigue el emblema de "Eficiencia Máxima".</p>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: '45%'}}></div>
                </div>
                <span className="text-[10px] font-black uppercase text-center">450 Usuarios lo han logrado</span>
            </div>
        </aside>
      </div>
    </div>
  );
};

export default Community;
