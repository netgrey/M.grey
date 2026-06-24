import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, BrainCircuit, RefreshCw, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatSectionProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearHistory: () => void;
}

// Inline renderer to format the mentor's responses beautifully
function FormattedResponse({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-3 text-slate-200 text-sm leading-relaxed">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        // Empty lines
        if (!trimmed) {
          return <div key={index} className="h-1" />;
        }

        // Bullet point lines starting with - or *
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          const content = trimmed.substring(1).trim();
          return (
            <div key={index} className="flex gap-3 pl-2 py-0.5">
              <span className="text-gold-500 font-bold select-none">•</span>
              <p className="flex-1">{parseBoldText(content)}</p>
            </div>
          );
        }

        // Standard line
        return (
          <p key={index} className="indent-0">
            {parseBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper function to turn **text** into <strong>text</strong>
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gold-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function ChatSection({ messages, onSendMessage, isLoading, onClearHistory }: ChatSectionProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  // Pre-configured evolutionary provocations to trigger interaction
  const prompts = [
    "Sinto que estou procrastinando meus projetos vitais.",
    "Não sei como liderar minha própria carreira ou rotina.",
    "Sempre coloco a culpa de minhas falhas no cansaço e no tempo.",
    "Quero entender as regras de Autonomia do seu Método."
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] max-w-4xl mx-auto border border-[#1f2633] bg-[#0c1015]/40 rounded-xl overflow-hidden backdrop-blur-md">
      {/* Chat header */}
      <div className="border-b border-[#1f2633] bg-[#11151c]/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold-500/20 bg-gradient-to-br from-gold-950/40 to-slate-900 flex items-center justify-center text-gold-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-slate-100 flex items-center gap-1.5">
              Márcio Grey de Oliveira
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">
              Especialista em Reestruturação Comportamental
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 transition-colors rounded hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 cursor-pointer"
            title="Reiniciar diálogo"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Zerar Diálogo</span>
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full border border-gold-500/30 bg-gold-950/10 flex items-center justify-center text-gold-400 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                "A autonomia não é dada; ela é assumida."
              </h3>
              <p className="text-sm text-slate-400">
                A maioria das pessoas passa a vida inteira terceirizando a responsabilidade de suas falhas. Elas culpam as circunstâncias, o tempo, o cansaço. Eu estou aqui para espelhar as suas desculpas e reorganizar seus padrões mentais.
              </p>
            </div>

            <div className="w-full space-y-3">
              <div className="text-[10px] uppercase tracking-wider text-gold-400/80 font-semibold">
                Toque em uma provocação para começar o confronto evolutivo:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {prompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(p)}
                    className="p-3 text-xs text-slate-300 bg-[#11151c] hover:bg-gold-950/20 rounded-lg border border-[#1f2633] hover:border-gold-500/30 transition-all text-left flex items-start gap-2.5 cursor-pointer"
                  >
                    <span className="text-gold-500 mt-0.5 select-none font-bold">›</span>
                    <span className="flex-1 leading-normal">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar for Mentor */}
                {msg.sender === "mentor" && (
                  <div className="w-9 h-9 rounded-full border border-gold-500/30 bg-gold-950/30 flex items-center justify-center text-gold-400 flex-shrink-0 self-start">
                    <BrainCircuit className="w-4.5 h-4.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl px-5 py-4 ${
                    msg.sender === "user"
                      ? "bg-slate-800/40 border border-slate-700/50 text-slate-100 rounded-tr-none"
                      : "bg-gradient-to-b from-[#111622] to-[#0c0f14] border border-gold-500/10 rounded-tl-none shadow-lg shadow-black/10"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedResponse text={msg.text} />
                  )}
                  <div className={`text-[9px] text-slate-500 mt-2 font-mono ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {/* Avatar for User */}
                {msg.sender === "user" && (
                  <div className="w-9 h-9 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0 self-start">
                    <User className="w-4.5 h-4.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Mentor typing indicator */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-9 h-9 rounded-full border border-gold-500/20 bg-gold-950/20 flex items-center justify-center text-gold-400 flex-shrink-0 self-start animate-spin">
                  <BrainCircuit className="w-4.5 h-4.5" />
                </div>
                <div className="bg-[#111622]/40 border border-[#1f2633]/50 rounded-xl rounded-tl-none px-5 py-4 max-w-[80%] flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-gold-500/80 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-gold-500/80 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-gold-500/80 animate-bounce" />
                  </div>
                  <span className="text-xs text-slate-400 font-sans font-medium">
                    Márcio Grey analisando seus loops psicológicos...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[#1f2633] bg-[#11151c]/40 p-4">
        {messages.length === 0 && (
          <div className="mb-3 flex items-center gap-2 bg-[#1c120c] border border-amber-900/40 p-3 rounded-lg text-xs text-amber-300/90">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>
              <strong>Atenção:</strong> O Mentor M. Grey exige respostas honestas e cruas. Mentir para si mesmo ou responder superficialmente limitará a eficácia do método.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Aguardando análise..." : "Responda com verdade absoluta. Mantenha a guarda aberta..."}
            className="flex-1 bg-[#11151c] text-slate-100 placeholder-slate-500 border border-[#1f2633] focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded-lg px-4 py-3 text-sm focus:outline-none disabled:opacity-50"
          />
          <button
            id="send-button"
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-[#0c0f12] font-semibold text-sm hover:from-gold-500 hover:to-gold-400 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="hidden md:inline">Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
