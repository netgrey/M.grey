import React, { useState, useRef, useEffect } from "react";
import { 
  Smartphone, Code2, Clipboard, Check, Play, BookOpen, AlertCircle, 
  Send, User, BrainCircuit, ArrowLeft, Star, Battery, Wifi, ShieldAlert, CheckCircle2 
} from "lucide-react";
import { KOTLIN_PROJECT_FILES, KotlinFile } from "../data/kotlinCode";
import { ChatMessage } from "../types";

interface AndroidSimulatorProps {
  onSendChatMessage: (text: string) => Promise<string>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AndroidSimulator({ onSendChatMessage, chatMessages, setChatMessages }: AndroidSimulatorProps) {
  // Mobile Simulator States
  const [phoneScreen, setPhoneScreen] = useState<'login' | 'chat' | 'plans'>('login');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("netgrey@hotmail.com");
  const [passwordInput, setPasswordInput] = useState("123456");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("123456");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [mobileMessageInput, setMobileMessageInput] = useState("");
  const [isMobileLoading, setIsMobileLoading] = useState(false);
  const [lastUpgradeAlert, setLastUpgradeAlert] = useState("");
  const [isAdVisible, setIsAdVisible] = useState(true);

  // Code Panel States
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PROJECT_FILES[1]); // LoginScreen.kt by default
  const [copiedState, setCopiedState] = useState(false);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'code' | 'guide'>('code');

  const phoneChatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll mobile chat
  useEffect(() => {
    if (phoneScreen === 'chat') {
      phoneChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, phoneScreen, isMobileLoading]);

  // Handle Login Click inside Phone
  const handleMobileLogin = () => {
    if (isRegisterMode) {
      if (!nameInput.trim()) {
        setAuthError("Insira o nome do discípulo.");
        return;
      }
      if (!emailInput.trim() || !emailInput.includes("@")) {
        setAuthError("Insira um endereço de e-mail válido.");
        return;
      }
      if (passwordInput.length < 6) {
        setAuthError("A senha deve conter no mínimo 6 dígitos.");
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setAuthError("As senhas não coincidem.");
        return;
      }
    } else {
      if (!emailInput.trim() || !emailInput.includes("@")) {
        setAuthError("Insira um endereço de e-mail válido.");
        return;
      }
      if (passwordInput.length < 6) {
        setAuthError("A senha deve conter no mínimo 6 dígitos.");
        return;
      }
    }

    setAuthError("");
    setIsLoggingIn(true);
    
    setTimeout(() => {
      setIsLoggingIn(false);
      setPhoneScreen('chat');
      // Add welcome message if chat is empty
      if (chatMessages.length === 0) {
        setChatMessages([
          {
            id: "welcome",
            sender: 'mentor',
            text: `Bem-vindo ao Portal de Autonomia, ${isRegisterMode ? nameInput : "Discípulo"}. Eu observo o seu silêncio. Mas o silêncio não gera evolução. O que você está tentando ocultar hoje?`,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }, 1200);
  };

  // Handle Send Message inside Phone (connected to real Express API)
  const handleSendMobileMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mobileMessageInput.trim() || isMobileLoading) return;

    const textToSend = mobileMessageInput.trim();
    setMobileMessageInput("");

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsMobileLoading(true);

    try {
      const reply = await onSendChatMessage(textToSend);
      
      const mentorMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'mentor',
        text: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, mentorMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'mentor',
        text: `**Erro de Conexão:** ${err.message || err}. Certifique-se de configurar a GEMINI_API_KEY.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsMobileLoading(false);
    }
  };

  // Handle copy to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const handleSimulateUpgrade = (planName: string) => {
    setLastUpgradeAlert(`Compromisso de evolução assumido! Upgrade para "${planName}" simulado com sucesso. Anúncios AdMob desativados.`);
    setIsAdVisible(false);
    setTimeout(() => setLastUpgradeAlert(""), 4000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: The Interactive Smartphone Simulator (4 Cols) */}
      <div className="xl:col-span-5 flex flex-col items-center justify-center">
        <div className="mb-4 text-center">
          <h2 className="font-display text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <Smartphone className="w-5 h-5 text-gold-400" />
            Simulador Android Live
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toque e interaja. Chat conectado em tempo real com o Mentor Grey.
          </p>
        </div>

        {/* Physical phone shell frame */}
        <div className="relative w-[340px] h-[680px] bg-[#1a1f29] rounded-[48px] p-3.5 shadow-2xl border-4 border-[#2b3547] ring-8 ring-[#161a22]">
          
          {/* Speaker, camera notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#1a1f29] rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
            <div className="w-10 h-1 bg-[#2e3747] rounded-full" />
            <div className="w-2.5 h-2.5 bg-[#10141d] rounded-full border border-slate-700" />
          </div>

          {/* Android Status Bar inside phone screen */}
          <div className="absolute top-3.5 left-3.5 right-3.5 h-7 bg-[#0c0f12] text-slate-300 px-5 flex items-center justify-between text-[11px] font-mono z-40 rounded-t-[32px] border-b border-[#141a24]">
            <span className="font-semibold select-none">11:26</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Inner Screen Canvas */}
          <div className="w-full h-full bg-[#0c0f12] rounded-[32px] overflow-hidden pt-7 relative flex flex-col">
            
            {/* ----------------- SCREEN: LOGIN ----------------- */}
            {phoneScreen === 'login' && (
              <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#0c0f12] to-[#121822] overflow-y-auto scrollbar-none">
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 mt-2">
                  <div className="w-12 h-12 rounded-full border border-gold-500/30 bg-gold-950/10 flex items-center justify-center text-gold-400">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-gold-300">M. GREY</h3>
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5 font-semibold">
                      Portal de Autonomia
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed px-2">
                    {isRegisterMode 
                      ? "Crie sua conta no portal para iniciar seu caminho de reestruturação cognitiva."
                      : "A autonomia não é herdada. Ela é assumida. Acesse seu portal."
                    }
                  </p>

                  <div className="w-full space-y-2 pt-1">
                    {/* Campo de Nome completo no modo cadastro */}
                    {isRegisterMode && (
                      <div className="text-left space-y-0.5">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Nome do Discípulo</label>
                        <input 
                          type="text" 
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="w-full bg-[#11151c] text-xs text-slate-200 border border-[#1f2633] focus:border-gold-500 rounded-lg px-3 py-2 focus:outline-none"
                          placeholder="Ex: Márcio Grey"
                        />
                      </div>
                    )}

                    <div className="text-left space-y-0.5">
                      <label className="text-[9px] text-slate-500 uppercase font-bold">E-mail do Discípulo</label>
                      <input 
                        type="text" 
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-[#11151c] text-xs text-slate-200 border border-[#1f2633] focus:border-gold-500 rounded-lg px-3 py-2 focus:outline-none"
                        placeholder="Ex: seu@email.com"
                      />
                    </div>

                    <div className="text-left space-y-0.5">
                      <label className="text-[9px] text-slate-500 uppercase font-bold">Senha de Autonomia</label>
                      <input 
                        type="password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-[#11151c] text-xs text-slate-200 border border-[#1f2633] focus:border-gold-500 rounded-lg px-3 py-2 focus:outline-none"
                      />
                    </div>

                    {/* Campo de confirmação de senha no modo cadastro */}
                    {isRegisterMode && (
                      <div className="text-left space-y-0.5">
                        <label className="text-[9px] text-slate-500 uppercase font-bold">Confirmar Senha</label>
                        <input 
                          type="password" 
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          className="w-full bg-[#11151c] text-xs text-slate-200 border border-[#1f2633] focus:border-gold-500 rounded-lg px-3 py-2 focus:outline-none"
                        />
                      </div>
                    )}

                    {authError && (
                      <p className="text-[10px] text-rose-400 text-left font-sans">{authError}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 pb-2">
                  <button
                    onClick={handleMobileLogin}
                    disabled={isLoggingIn}
                    className="w-full py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-[#0c0f12] font-bold text-xs transition-all tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isLoggingIn ? (
                      <span className="w-4 h-4 border-2 border-[#0c0f12] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isRegisterMode ? "CADASTRAR E ADENTRAR" : "ACESSAR CONTRAPONTO"}</span>
                        <Play className="w-3 h-3 fill-current" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setIsRegisterMode(!isRegisterMode);
                        setAuthError("");
                      }}
                      className="text-[10px] text-gold-400 font-semibold hover:underline cursor-pointer"
                    >
                      {isRegisterMode ? "Já possui autonomia? Faça o login" : "Criar uma nova conta de discípulo"}
                    </button>
                  </div>

                  <button
                    onClick={() => setPhoneScreen('plans')}
                    className="w-full text-center text-[9px] text-slate-500 font-medium hover:underline cursor-pointer"
                  >
                    Ver Planos de Mentoria VIP
                  </button>
                </div>
              </div>
            )}

            {/* ----------------- SCREEN: CHAT ----------------- */}
            {phoneScreen === 'chat' && (
              <div className="flex-1 flex flex-col bg-[#0c0f12]">
                {/* Phone screen header */}
                <div className="bg-[#11151c] px-4 py-3 border-b border-[#1f2633] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPhoneScreen('login')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="font-display font-bold text-xs text-white">M. GREY</div>
                      <div className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        Online
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setPhoneScreen('plans')}
                    className="text-gold-400 hover:text-gold-300 cursor-pointer p-1 rounded bg-gold-950/20"
                    title="Planos VIP"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Mobile Messages body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
                  {chatMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                          isUser 
                            ? 'bg-[#1f2633] text-slate-100 rounded-tr-none'
                            : 'bg-[#11151c] text-slate-200 border border-gold-500/10 rounded-tl-none'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text.replace(/\*\*/g, "")}</p>
                          <span className="block text-[8px] text-slate-500 text-right mt-1 font-mono">{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}

                  {isMobileLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#11151c]/60 border border-[#1f2633] rounded-lg rounded-tl-none px-3 py-2 max-w-[80%] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" />
                        <span className="text-[10px] text-slate-400">Grey analisando desculpas...</span>
                      </div>
                    </div>
                  )}
                  <div ref={phoneChatEndRef} />
                </div>

                {/* Mobile Prompt assist chips */}
                {chatMessages.length <= 1 && (
                  <div className="px-3 py-1 bg-[#11151c]/30 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <button 
                      onClick={() => { setMobileMessageInput("Sinto que procrastino muito."); }}
                      className="px-2.5 py-1 text-[9px] bg-[#11151c] text-slate-300 border border-[#1f2633] rounded-full hover:border-gold-500/20"
                    >
                      Procrastinação
                    </button>
                    <button 
                      onClick={() => { setMobileMessageInput("Quero ter alta performance."); }}
                      className="px-2.5 py-1 text-[9px] bg-[#11151c] text-slate-300 border border-[#1f2633] rounded-full hover:border-gold-500/20"
                    >
                      Alta Performance
                    </button>
                  </div>
                )}

                {/* Mobile Input form */}
                <form onSubmit={handleSendMobileMessage} className="p-2 border-t border-[#1f2633] bg-[#11151c] flex gap-1.5">
                  <input 
                    type="text"
                    value={mobileMessageInput}
                    onChange={(e) => setMobileMessageInput(e.target.value)}
                    placeholder="Confronte seu ego..."
                    className="flex-1 bg-[#0c0f12] text-xs text-slate-200 border border-[#1f2633] rounded-md px-2.5 py-2 focus:outline-none focus:border-gold-500"
                  />
                  <button 
                    type="submit"
                    className="p-2 rounded-md bg-gold-500 text-[#0c0f12] hover:bg-gold-400 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* ----------------- SCREEN: PLANS ----------------- */}
            {phoneScreen === 'plans' && (
              <div className="flex-1 flex flex-col bg-[#0c0f12] overflow-y-auto">
                <div className="bg-[#11151c] px-4 py-3 border-b border-[#1f2633] flex items-center gap-2">
                  <button 
                    onClick={() => setPhoneScreen('chat')}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="font-display font-bold text-xs text-white">UPGRADES</span>
                </div>

                <div className="p-4 space-y-4">
                  <div className="text-center">
                    <span className="text-[8px] font-bold text-gold-400 uppercase tracking-widest">Nível de Compromisso</span>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Evolução real exige investimento intencional. Menos desculpas, mais autonomia.
                    </p>
                  </div>

                  {/* Plan 1 card */}
                  <div className="p-3 bg-[#11151c] rounded-xl border border-[#1f2633] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">Membro Autônomo</span>
                      <span className="text-[9px] text-slate-400">R$ 49,90/mês</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      Diálogos diários ilimitados com M. Grey e mapas de ação personalizados.
                    </p>
                    <button 
                      onClick={() => handleSimulateUpgrade("Membro Autônomo")}
                      className="w-full py-1.5 rounded bg-slate-800 text-slate-300 font-bold text-[9px] hover:bg-slate-700 cursor-pointer"
                    >
                      ASSUMIR AUTONOMIA
                    </button>
                  </div>

                  {/* Plan 2 card (Highlight) */}
                  <div className="p-3 bg-[#111520] rounded-xl border border-gold-500/40 space-y-2 relative">
                    <span className="absolute -top-2 right-3 px-1.5 py-0.5 bg-gold-500 text-[#0c0f12] text-[7px] font-black rounded">
                      RECOMENDADO
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gold-300">Mentoria Direta Grey</span>
                      <span className="text-[9px] text-gold-400">R$ 299,90/mês</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      Tudo do plano Autônomo + reuniões de Alinhamento Coletivas e Grupo VIP fechado.
                    </p>
                    <button 
                      onClick={() => handleSimulateUpgrade("Mentoria Direta Grey")}
                      className="w-full py-1.5 rounded bg-gold-500 text-[#0c0f12] font-bold text-[9px] hover:bg-gold-400 cursor-pointer"
                    >
                      UPGRADE DE ALTA PERFORMANCE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification simulated toast inside screen */}
            {lastUpgradeAlert && (
              <div className="absolute bottom-4 left-4 right-4 bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-lg text-[9px] flex items-center gap-2 shadow-lg animate-bounce z-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="leading-tight font-medium">{lastUpgradeAlert}</p>
              </div>
            )}

            {/* Simulated Google AdMob Banner */}
            {isAdVisible && (
              <div className="w-full bg-[#11151c] border-y border-[#1f2633]/80 px-3 py-2 flex flex-col gap-1 select-none animate-fade-in relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#aa7f38]/10 text-[#d6be8a] border border-[#aa7f38]/30 text-[7px] font-bold px-1 py-0.25 rounded uppercase tracking-wider scale-90">
                      AdMob Banner
                    </span>
                    <span className="font-mono text-slate-500 text-[8px] truncate max-w-[130px]" title="ID do Bloco de Anúncio">
                      Bloco 1: ...5647761119
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setLastUpgradeAlert("Anúncios ocultados temporariamente. Faça upgrade para remover permanentemente!");
                      setIsAdVisible(false);
                      setTimeout(() => setLastUpgradeAlert(""), 4000);
                    }}
                    className="text-[8px] text-slate-500 hover:text-gold-400 font-semibold hover:underline cursor-pointer transition-colors"
                  >
                    Ocultar
                  </button>
                </div>
                <div className="bg-[#0c0f12] border border-[#1f2633]/50 rounded p-1.5 flex items-center justify-between gap-2 hover:border-gold-500/20 transition-all">
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-slate-200 tracking-tight">O Método M. Grey VIP</p>
                    <p className="text-[8px] text-slate-400 leading-tight">Bloco Ativo: ca-app-pub-2768032584424253/5647761119</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPhoneScreen('plans')}
                    className="px-2 py-0.5 bg-gold-500 text-[#0c0f12] text-[8px] font-black rounded uppercase hover:bg-gold-400 transition-colors"
                  >
                    Ver
                  </button>
                </div>
              </div>
            )}

            {/* Phone Home button pill */}
            <div className="h-5 bg-[#0c0f12] flex items-center justify-center pb-1 rounded-b-[32px] border-t border-[#141a24]">
              <div className="w-16 h-1 bg-slate-700 rounded-full" />
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Android Studio Integration Center (7 Cols) */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Title / Description info bar */}
        <div className="border border-[#1f2633] bg-[#11151c]/60 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gold-950/20 text-gold-400 border border-gold-500/15">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Central Jetpack Compose</h3>
              <p className="text-xs text-slate-400">Código-fonte Kotlin 100% pronto para compilar no Android Studio</p>
            </div>
          </div>

          <div className="flex bg-[#0c0f12] p-1 rounded-lg border border-[#1f2633]">
            <button
              onClick={() => setActiveInstructionTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-all ${
                activeInstructionTab === 'code' 
                  ? 'bg-gold-500/10 text-gold-300' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Ver Códigos</span>
            </button>
            <button
              onClick={() => setActiveInstructionTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-all ${
                activeInstructionTab === 'guide' 
                  ? 'bg-gold-500/10 text-gold-300' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guia de Setup</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Code Viewer */}
        {activeInstructionTab === 'code' && (
          <div className="border border-[#1f2633] bg-[#0c1015]/40 rounded-xl overflow-hidden backdrop-blur-md">
            
            {/* Horizontal Kotlin File Selector Tab list */}
            <div className="bg-[#11151c] border-b border-[#1f2633] px-4 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none">
              {KOTLIN_PROJECT_FILES.map((file) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`px-4 py-3.5 text-xs font-mono font-medium border-b-2 transition-all cursor-pointer ${
                    selectedFile.name === file.name
                      ? 'border-gold-500 text-gold-300 bg-gold-950/5 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/10'
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </div>

            {/* File Path indicator and copy action bar */}
            <div className="bg-[#11151c]/60 px-5 py-3 border-b border-[#1f2633] flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 text-[11px] truncate" title={selectedFile.path}>
                Caminho: <span className="text-slate-300">{selectedFile.path}</span>
              </span>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c2230] text-slate-200 hover:bg-[#252e41] border border-slate-700/50 hover:text-white transition-all cursor-pointer font-sans text-[11px]"
              >
                {copiedState ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Box container */}
            <div className="p-4 bg-[#0a0d12]/90 font-mono text-xs overflow-auto max-h-[460px] leading-relaxed text-slate-300 relative">
              <pre className="p-2 rounded select-text text-left">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: Guide & Integration Instructions */}
        {activeInstructionTab === 'guide' && (
          <div className="border border-[#1f2633] bg-[#0c1015]/40 p-6 rounded-xl backdrop-blur-md space-y-6">
            <div>
              <h4 className="font-display text-lg font-bold text-white">Manual de Implementação no Android Studio</h4>
              <p className="text-xs text-slate-400 mt-1">Siga este roteiro cirúrgico para rodar o app nativamente no seu celular.</p>
            </div>

            <div className="space-y-4">
              
              {/* Step 1 */}
              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gold-950/40 text-gold-400 border border-gold-500/20 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-slate-200">Criar Projeto no Android Studio</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Abra o <strong>Android Studio Koala</strong> (ou superior) e crie um novo projeto escolhendo o modelo <strong>Empty Activity</strong> (com Jetpack Compose). Defina o nome do pacote como <code>com.mgrey.mentor</code> e certifique-se de que a linguagem de desenvolvimento selecionada é <strong>Kotlin</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gold-950/40 text-gold-400 border border-gold-500/20 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-slate-200">Atualizar Dependências Gradle</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Copie as dependências listadas em <code>build.gradle.kts</code> (no seletor de códigos ao lado) e adicione no arquivo <code>app/build.gradle.kts</code> do seu projeto. Elas incluem o <strong>Jetpack Navigation</strong> para o fluxo de telas e o <strong>SDK do Gemini</strong> nativo para Android.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gold-950/40 text-gold-400 border border-gold-500/20 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-slate-200">Adicionar os Arquivos das Telas</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No diretório correspondente da sua pasta <code>src/main/java/com/mgrey/mentor/</code>, crie o subpacote <code>ui/screens/</code> e adicione três arquivos Kotlin: <code>LoginScreen.kt</code>, <code>ChatScreen.kt</code> e <code>PlansScreen.kt</code>. Cole os respectivos códigos copiados do painel.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gold-950/40 text-gold-400 border border-gold-500/20 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-slate-200">Chave API e Permissões do Sistema</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Não se esqueça de adicionar a permissão de internet e de rede no seu arquivo <code>AndroidManifest.xml</code>:<br />
                    <code className="text-gold-400 block p-1.5 bg-[#11151c] rounded mt-1 text-[10px] select-all">{"<uses-permission android:name=\"android.permission.INTERNET\" />"}</code>
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-3.5">
                <div className="w-6 h-6 rounded-full bg-gold-950/40 text-gold-400 border border-gold-500/20 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                  5
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-slate-200">Google AdMob & IDs de Anúncios</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No seu arquivo <code>AndroidManifest.xml</code>, configure o ID do aplicativo AdMob fornecido: <code className="text-gold-400 select-all">ca-app-pub-2768032584424253~1491069856</code> dentro do elemento <code>{"<meta-data>"}</code> correspondente. Em seguida, adicione o Composable <code>AdMobBanner()</code> nas suas telas de visualização (ex: na parte inferior do <code>ChatScreen.kt</code> ou <code>PlansScreen.kt</code>) para monetização e visualização dos anúncios.
                  </p>
                </div>
              </div>

            </div>

            <div className="p-4 bg-[#1c120c] border border-amber-900/30 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h6 className="text-xs font-bold text-amber-300">Aviso Sobre Integração de API</h6>
                <p className="text-[11px] text-amber-400/90 leading-relaxed">
                  Para que o app realize chamadas de IA autônomas diretamente no Android sem um servidor intermediário, você pode usar a dependência do <strong>GenerativeAI</strong> da Google incluída em nosso Gradle. Lembre-se de nunca deixar sua chave API exposta em repositórios públicos (utilize local.properties ou segredos criptografados).
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
