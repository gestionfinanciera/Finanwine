
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini, analyzeImage, analyzeVideo } from '../services/geminiService';
import { Message } from '../types';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'video'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente de Finanwise. ¿En qué puedo ayudarte hoy? Puedo analizar tus gastos, ayudarte con un presupuesto o explicarte conceptos complejos.', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatWithGemini(inputText);
      const modelMessage: Message = { role: 'model', text: response || 'Lo siento, hubo un error.', timestamp: new Date() };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error al conectar con la IA.', timestamp: new Date() }]);
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
    setAnalysisResult('Analizando con Gemini...');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        let res = '';
        if (activeTab === 'image') {
          res = await analyzeImage(base64, selectedFile.type, '');
        } else {
          res = await analyzeVideo(base64, selectedFile.type, '');
        }
        setAnalysisResult(res);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setAnalysisResult('Error durante el análisis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen max-w-5xl mx-auto w-full p-4 md:p-8 animate-fade-in">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <span className="p-2 bg-primary/20 text-primary rounded-xl">
            <span className="material-symbols-outlined">psychology</span>
          </span>
          Finanwise Intelligence
        </h1>
        <p className="text-text-sec-light dark:text-text-sec-dark text-sm font-medium">
          Potenciando tus finanzas con Gemini Pro 3
        </p>
      </header>

      <div className="flex bg-card-light dark:bg-card-dark rounded-xl p-1 mb-6 border border-border-light dark:border-border-dark w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-primary text-[#102216]' : 'hover:bg-background-light dark:hover:bg-background-dark/30'}`}
        >
          Chat
        </button>
        <button 
          onClick={() => setActiveTab('image')} 
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'image' ? 'bg-primary text-[#102216]' : 'hover:bg-background-light dark:hover:bg-background-dark/30'}`}
        >
          Análisis de Recibos
        </button>
        <button 
          onClick={() => setActiveTab('video')} 
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'video' ? 'bg-primary text-[#102216]' : 'hover:bg-background-light dark:hover:bg-background-dark/30'}`}
        >
          Análisis de Videos
        </button>
      </div>

      <div className="flex-1 min-h-0 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-xl overflow-hidden flex flex-col relative">
        {activeTab === 'chat' ? (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-primary text-[#102216] font-medium rounded-tr-none' 
                      : 'bg-background-light dark:bg-background-dark/50 border border-border-light dark:border-border-dark rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-background-light dark:bg-background-dark/50 border border-border-light dark:border-border-dark rounded-2xl rounded-tl-none p-4 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border-light dark:border-border-dark bg-background-light/30 dark:bg-background-dark/30 flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pregunta algo sobre tus finanzas..."
                className="flex-1 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
              />
              <button disabled={isLoading} className="bg-primary text-[#102216] p-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center gap-8 no-scrollbar">
            <div className="flex flex-col items-center gap-4 text-center max-w-lg">
                <div className={`size-20 rounded-full flex items-center justify-center ${activeTab === 'image' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                    <span className="material-symbols-outlined text-4xl">{activeTab === 'image' ? 'add_a_photo' : 'video_library'}</span>
                </div>
                <h2 className="text-xl font-bold">
                    {activeTab === 'image' ? 'Analiza tus Documentos' : 'Entiende videos educativos'}
                </h2>
                <p className="text-sm text-text-sec-light dark:text-text-sec-dark">
                    Sube un archivo y Gemini lo analizará por ti en segundos.
                </p>
            </div>

            <div className="w-full max-w-xl flex flex-col gap-6">
                <div className="relative group">
                    <input 
                        type="file" 
                        accept={activeTab === 'image' ? "image/*" : "video/*"}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl p-10 flex flex-col items-center gap-4 group-hover:border-primary transition-colors bg-background-light/30 dark:bg-background-dark/30">
                        {previewUrl ? (
                            activeTab === 'image' ? (
                                <img src={previewUrl} className="max-h-48 rounded-lg shadow-md" alt="Preview" />
                            ) : (
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Video Cargado
                                </div>
                            )
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-4xl opacity-30">upload_file</span>
                                <span className="text-sm font-bold opacity-50">Click para seleccionar archivo</span>
                            </>
                        )}
                    </div>
                </div>

                {selectedFile && (
                    <button 
                        onClick={handleAnalyze} 
                        disabled={isLoading}
                        className="w-full bg-primary text-[#102216] font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                             <span className="w-5 h-5 border-2 border-[#102216] border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <span className="material-symbols-outlined">auto_awesome</span>
                        )}
                        Comenzar Análisis IA
                    </button>
                )}

                {analysisResult && (
                    <div className="bg-background-light dark:bg-background-dark/50 border border-border-light dark:border-border-dark rounded-2xl p-6 animate-fade-in">
                        <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-sm">robot_2</span>
                            Resultado del Análisis
                        </h4>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {analysisResult}
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
