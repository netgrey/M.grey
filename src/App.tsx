import { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatSection from "./components/ChatSection";
import AssessmentSection from "./components/AssessmentSection";
import ActionMapSection from "./components/ActionMapSection";
import AndroidSimulator from "./components/AndroidSimulator";
import { ChatMessage, AssessmentResult, ActionItem } from "./types";
import { Compass, MessageSquare, Milestone, Smartphone } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'chat' | 'assessment' | 'actions'>('simulator');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem("mgrey_messages");
      if (storedMessages) setMessages(JSON.parse(storedMessages));

      const storedResult = localStorage.getItem("mgrey_assessment_result");
      if (storedResult) setAssessmentResult(JSON.parse(storedResult));

      const storedActions = localStorage.getItem("mgrey_actions");
      if (storedActions) setActions(JSON.parse(storedActions));
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage:", e);
    }
  }, []);

  // Save states to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("mgrey_messages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("mgrey_messages");
    }
  }, [messages]);

  useEffect(() => {
    if (assessmentResult) {
      localStorage.setItem("mgrey_assessment_result", JSON.stringify(assessmentResult));
    } else {
      localStorage.removeItem("mgrey_assessment_result");
    }
  }, [assessmentResult]);

  useEffect(() => {
    localStorage.setItem("mgrey_actions", JSON.stringify(actions));
  }, [actions]);

  // Handle sending a message to M. Grey
  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const startTime = Date.now();
    try {
      // Send chat request to backend Express /api/chat route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          // Only send last 15 messages to optimize token usage and context relevance
          history: messages.slice(-15)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao conectar com o servidor.");
      }

      const data = await response.json();

      // Artificial "human pause" to feel organic (minimum of 1500ms total duration)
      const elapsedTime = Date.now() - startTime;
      const minDelay = 1500;
      if (elapsedTime < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
      }

      const mentorMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'mentor',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, mentorMessage]);

    } catch (error: any) {
      console.error("Erro no chat:", error);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'mentor',
        text: `**Observação de Sistema:** Ocorreu um problema ao tentar acessar o Mentor Grey.\n\n_Erro:_ ${error.message || error}\n\nPor favor, certifique-se de que a sua **GEMINI_API_KEY** está devidamente configurada na aba **Settings > Secrets** do AI Studio e tente novamente.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMobileChatMessage = async (text: string): Promise<string> => {
    const startTime = Date.now();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-15)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao conectar com o servidor.");
      }

      const data = await response.json();

      // Artificial "human pause" to feel organic (minimum of 1500ms total duration)
      const elapsedTime = Date.now() - startTime;
      const minDelay = 1500;
      if (elapsedTime < minDelay) {
        await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
      }

      return data.reply;
    } catch (error: any) {
      console.error("Erro no chat móvel:", error);
      throw new Error(error.message || error);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Você quer mesmo apagar todo o histórico deste diálogo com o Mentor Grey?")) {
      setMessages([]);
    }
  };

  // Assessment results handlers
  const handleSaveAssessmentResult = (result: AssessmentResult) => {
    setAssessmentResult(result);
  };

  const handleClearAssessmentResult = () => {
    setAssessmentResult(null);
  };

  const handleSendResultToChat = async (result: AssessmentResult) => {
    setActiveTab('chat');
    const promptText = `Olá Márcio, realizei minha Auditoria Comportamental do Método M. Grey. Meus resultados foram os seguintes:
- **Autonomia Radical**: ${result.scores.autonomy}%
- **Reestruturação Cognitiva**: ${result.scores.restructuring}%
- **Alta Performance Consistente**: ${result.scores.performance}%

O arquétipo que meu perfil acusou foi: **${result.archetype}**. 

Quero que você avalie as minhas contradições comportamentais com rigor extremo e me diga qual é o meu exato primeiro passo para quebrar esses loops de autossabotagem.`;

    await handleSendMessage(promptText);
  };

  // Action Items handlers
  const handleAddAction = (text: string, category: 'autonomy' | 'restructuring' | 'performance', dueDate: string) => {
    const newAction: ActionItem = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      category,
      completed: false,
      dueDate,
      createdAt: new Date().toISOString()
    };
    setActions(prev => [newAction, ...prev]);
  };

  const handleToggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleDeleteAction = (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0c0f12] text-slate-100 flex flex-col font-sans">
      {/* Sleek Header & Navigation Tab Controller */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasCompletedAssessment={!!assessmentResult}
        archetype={assessmentResult?.archetype}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'simulator' && (
          <div className="animate-fade-in">
            <AndroidSimulator
              onSendChatMessage={handleSendMobileChatMessage}
              chatMessages={messages}
              setChatMessages={setMessages}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="animate-fade-in">
            <ChatSection
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="animate-fade-in">
            <AssessmentSection
              onSaveResult={handleSaveAssessmentResult}
              savedResult={assessmentResult}
              onSendResultToChat={handleSendResultToChat}
              onClearResult={handleClearAssessmentResult}
            />
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="animate-fade-in">
            <ActionMapSection
              actions={actions}
              onAddAction={handleAddAction}
              onToggleAction={handleToggleAction}
              onDeleteAction={handleDeleteAction}
            />
          </div>
        )}
      </main>

      {/* Elegant, humble, single-line footer, avoiding any telemetry or online badges */}
      <footer className="border-t border-[#1f2633] py-4 bg-[#0a0d10] mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
            M. Grey Method © 2026. Assuma a responsabilidade integral por sua evolução.
          </p>
        </div>
      </footer>
    </div>
  );
}
