
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { chatWithGemini, analyzeFinancialDocument } from '../services/geminiService';
import { Message, Transaction } from '../types';

const AIAssistant = () => {
  const { transactions, goals, addTransaction } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente inteligente de Finanwise. Conozco tus movimientos recientes y tus metas. ¿Quieres que analicemos tus gastos de este mes o te ayude con un plan de ahorro?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText;
    const userMessage: Message = { role: 'user', text: userMsg, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Pasamos las transacciones y metas actuales para que la IA tenga contexto real
      const response = await chatWithGemini(userMsg, { transactions, goals });
      const modelMessage: Message = { role: 'model', text: response || 'Lo siento, tuve un problema analizando tus datos.', timestamp: new Date() };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Hubo un error de conexión con la red de Finanwise. Por favor, intenta de nuevo.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || isLoading) return;
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await analyzeFinancialDocument(base64, selectedFile.type);
        if (res) {
          const parsed = JSON.parse(res);
          setAnalysisResult(parsed);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      alert('Error analizando el documento.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveAnalyzedTransaction = () => {
    if (analysisResult) {
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        ...analysisResult,
        date: new Date(analysisResult.date + 'T12:00:00'),
        amount: parseFloat(analysisResult.amount)
      };
      addTransaction(newTx);
      setAnalysisResult(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      alert('Transacción guardada exitosamente en tu presupuesto.');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto w-full p-4 md:p-8 animate-fade-in overflow-hidden">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <span className="p-2 bg-primary/20 text-primary rounded-xl">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </span>
            Finanwise Intelligence
          </h1>
          <p className="text-text-sec-light dark:text-text-sec-dark text-xs font-bold uppercase tracking-widest opacity-60">
            Desarrollado por Gemini 3 Pro
          </p>
        </div>
        
        <div className="flex bg-card-light dark:bg-card-dark rounded-2xl p-1.5 border border-border-light dark:border-border-dark shadow-sm">
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'chat' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-sec-light hover:text-text-main-light'}`}
          >
            Chat Experto
          </button>
          <button 
            onClick={() => setActiveTab('image')} 
            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'image' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-sec-light hover:text-text-main-light'}`}
          >
            Escanear Recibos
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 bg-card-light dark:bg-card-dark rounded-[2.5rem] border border-border-light dark:border-border-dark shadow-2xl overflow-hidden flex flex-col relative transition-colors duration-500">
        {activeTab === 'chat' ? (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6 no-scrollbar scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-[2rem] p-6 shadow-sm leading-relaxed text-sm md:text-base ${
                    m.role === 'user' 
                      ? 'bg-primary text-black font-bold rounded-tr-none' 
                      : 'bg-background-light dark:bg-background-dark/50 border border-border-light dark:border-border-dark rounded-tl-none font-medium'
                  }`}>
                    {m.text}
                    <div className={`text-[10px] mt-2 opacity-40 font-black uppercase ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-background-light dark:bg-background-dark/50 border border-border-light dark:border-border-dark rounded-[2rem] rounded-tl-none p-6 flex gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-6 md:p-8 border-t border-border-light dark:border-border-dark bg-background-light/30 dark:bg-background-dark/30 flex gap-4 items-center">
              <div className="flex-1 relative group">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Pregunta sobre tus gastos, ahorros o pide un consejo..."
                    className="w-full bg-white dark:bg-background-dark border-2 border-transparent focus:border-primary/30 rounded-2xl px-6 py-4 outline-none transition-all text-sm md:text-base font-bold shadow-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-30 group-focus-within:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-xl">mic</span>
                  </div>
              </div>
              <button disabled={isLoading || !inputText.trim()} className="size-14 bg-primary text-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-110 active:scale-90 transition-all disabled:opacity-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-black">send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center gap-12 no-scrollbar">
            <div className="flex flex-col items-center gap-6 text-center max-w-xl">
                <div className="size-24 rounded-[2rem] flex items-center justify-center bg-primary/10 text-primary shadow-inner">
                    <span className="material-symbols-outlined text-5xl">document_scanner</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black mb-2">Asistente de Recibos</h2>
                    <p className="text-sm font-medium text-text-sec-light leading-relaxed">
                        Sube una foto de tu ticket o factura. Gemini extraerá automáticamente el monto, la fecha y la categoría para tu presupuesto.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-8">
                <div className="relative group cursor-pointer">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-3 border-dashed border-border-light dark:border-border-dark rounded-[2.5rem] p-16 flex flex-col items-center gap-6 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all bg-background-light/30 dark:bg-background-dark/30">
                        {previewUrl ? (
                            <div className="relative">
                                <img src={previewUrl} className="max-h-64 rounded-2xl shadow-2xl border-4 border-white dark:border-background-dark" alt="Preview" />
                                <div className="absolute -top-4 -right-4 size-10 bg-primary text-black rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined">check</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-6xl opacity-20">cloud_upload</span>
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-lg font-black opacity-60">Arrastra tu recibo aquí</span>
                                    <span className="text-xs font-bold opacity-30 uppercase tracking-widest">o haz clic para buscar</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {selectedFile && !analysisResult && (
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-black py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                             <span className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                                <span>Extraer Datos con IA</span>
                            </>
                        )}
                    </button>
                )}

                {analysisResult && (
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-[2rem] p-8 animate-scale-in flex flex-col gap-8 shadow-sm">
                        <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                            <h4 className="font-black flex items-center gap-2 text-primary uppercase tracking-widest text-xs">
                                <span className="material-symbols-outlined text-lg">verified</span>
                                Datos Detectados
                            </h4>
                            <span className="text-[10px] font-black opacity-40 uppercase">Gemini Vision Pro</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase opacity-40">Concepto</label>
                                <span className="text-lg font-black truncate">{analysisResult.description}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase opacity-40">Monto Total</label>
                                <span className="text-2xl font-black text-primary">${analysisResult.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase opacity-40">Categoría Sugerida</label>
                                <span className="text-sm font-bold bg-primary/20 text-primary px-3 py-1 rounded-lg w-fit">{analysisResult.category}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black uppercase opacity-40">Fecha del Ticket</label>
                                <span className="text-sm font-bold opacity-80">{analysisResult.date}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={saveAnalyzedTransaction}
                                className="flex-1 bg-primary text-black font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                Guardar en Presupuesto
                            </button>
                            <button 
                                onClick={() => { setAnalysisResult(null); setSelectedFile(null); setPreviewUrl(null); }}
                                className="px-6 border-2 border-border-light dark:border-border-dark text-text-sec-light font-black rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
