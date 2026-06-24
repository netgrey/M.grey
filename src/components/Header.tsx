import { Compass, MessageSquare, ShieldCheck, Milestone, Smartphone } from "lucide-react";

interface HeaderProps {
  activeTab: 'simulator' | 'chat' | 'assessment' | 'actions';
  setActiveTab: (tab: 'simulator' | 'chat' | 'assessment' | 'actions') => void;
  hasCompletedAssessment: boolean;
  archetype?: string;
}

export default function Header({ activeTab, setActiveTab, hasCompletedAssessment, archetype }: HeaderProps) {
  return (
    <header className="border-b border-[#1f2633] bg-[#0c0f12]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Logo/Identity */}
        <div className="flex flex-col text-center lg:text-left">
          <span className="font-display text-2xl font-bold tracking-tight text-white flex items-center justify-center lg:justify-start gap-2">
            Márcio Grey de Oliveira
            <span className="text-xs font-sans px-2 py-0.5 rounded-full border border-gold-500/30 bg-gold-950/20 text-gold-400 font-medium">
              M. Grey
            </span>
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-widest font-sans mt-0.5">
            Central do Desenvolvedor & Simulador Android KOTLIN
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap justify-center items-center gap-1 bg-[#11151c] p-1 rounded-lg border border-[#1f2633]">
          <button
            id="tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-gold-500/10 text-gold-300 border border-gold-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 border border-transparent'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulador & Código Android</span>
          </button>

          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gold-500/10 text-gold-300 border border-gold-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 border border-transparent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>O Diálogo Web</span>
          </button>

          <button
            id="tab-assessment"
            onClick={() => setActiveTab('assessment')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'assessment'
                ? 'bg-gold-500/10 text-gold-300 border border-gold-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Perfil de Autonomia</span>
            {hasCompletedAssessment && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Avaliação concluída" />
            )}
          </button>

          <button
            id="tab-actions"
            onClick={() => setActiveTab('actions')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'actions'
                ? 'bg-gold-500/10 text-gold-300 border border-gold-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20 border border-transparent'
            }`}
          >
            <Milestone className="w-3.5 h-3.5" />
            <span>Mapa de Ação</span>
          </button>
        </nav>

        {/* Profile indicator */}
        <div className="hidden xl:flex items-center gap-3 bg-[#11151c] px-4 py-2 rounded-lg border border-[#1f2633]">
          <div className="p-1 rounded bg-gold-950/30 text-gold-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Mindset Atual</div>
            <div className="text-xs font-semibold text-slate-200 font-display">
              {archetype || "Membro Autônomo"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
