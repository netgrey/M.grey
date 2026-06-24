import React, { useState } from "react";
import { Milestone, Plus, CheckCircle, Circle, Trash2, Calendar, Sparkles, Lightbulb, CheckSquare } from "lucide-react";
import { ActionItem } from "../types";

interface ActionMapSectionProps {
  actions: ActionItem[];
  onAddAction: (text: string, category: 'autonomy' | 'restructuring' | 'performance', dueDate: string) => void;
  onToggleAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
}

export default function ActionMapSection({ actions, onAddAction, onToggleAction, onDeleteAction }: ActionMapSectionProps) {
  const [newText, setNewText] = useState("");
  const [category, setCategory] = useState<'autonomy' | 'restructuring' | 'performance'>('autonomy');
  const [dueDate, setDueDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddAction(newText.trim(), category, dueDate);
    setNewText("");
  };

  const dailyExercises = [
    {
      id: "ex-1",
      title: "O Espelhamento Crítico",
      pilar: "autonomy",
      pilarLabel: "Autonomia Absoluta",
      description: "Escreva em uma folha todas as desculpas que usou hoje para justificar sua falta de foco. Em seguida, risque-as e reescreva substituindo 'Não consegui fazer porque o dia foi corrido' por 'Escolhi voluntariamente colocar outra coisa como prioridade'. Assuma a autoria integral.",
      time: "10 minutos"
    },
    {
      id: "ex-2",
      title: "Corte de Gatilho (Quebra de Loop)",
      pilar: "restructuring",
      pilarLabel: "Reestruturação Cognitiva",
      description: "No instante em que identificar o impulso de procrastinar ou dispersar o foco, pare imediatamente. Levante-se, afaste-se da mesa por 10 segundos, beba um copo de água e retorne sentando-se com a postura reta para executar apenas uma única tarefa por 15 minutos sem interrupções.",
      time: "5 minutos"
    },
    {
      id: "ex-3",
      title: "Bloco de Execução Cega",
      pilar: "performance",
      pilarLabel: "Alta Performance",
      description: "Defina um período inegociável de 90 minutos hoje. Desligue completamente o celular ou coloque-o em outro cômodo. Feche todas as abas secundárias do navegador e dedique-se exclusivamente a trabalhar no seu projeto mais complexo de alto impacto.",
      time: "90 minutos"
    }
  ];

  const completedCount = actions.filter(a => a.completed).length;
  const progressPercent = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Commitments & Custom Action Planner */}
      <div className="lg:col-span-2 space-y-6">
        <div className="border border-[#1f2633] bg-[#0c1015]/40 p-6 rounded-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#1f2633] pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-gold-950/20 text-gold-400 border border-gold-500/10">
                <Milestone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-slate-100">Compromissos de Evolução</h3>
                <p className="text-xs text-slate-400">Traduza as provocações de M. Grey em ações práticas mensuráveis</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-gold-400">{completedCount}/{actions.length} Concluídos</span>
              <div className="w-24 bg-[#1f2633] h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-gold-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Form to Add New Action */}
          <form onSubmit={handleSubmit} className="bg-[#11151c]/60 p-4 rounded-lg border border-[#1f2633] space-y-4 mb-6">
            <div className="text-[10px] uppercase tracking-widest font-mono font-bold text-gold-400 flex items-center gap-1.5">
              <Plus className="w-3 h-3" />
              <span>Novo Plano de Ação Autônomo</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                id="action-text"
                type="text"
                required
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Ex: Ler 10 páginas e escrever 1 página de planejamento estratégico..."
                className="col-span-1 md:col-span-2 bg-[#0c1015] text-slate-100 placeholder-slate-500 border border-[#1f2633] focus:border-gold-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Pilar do Método</label>
                <select
                  id="action-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-[#0c1015] text-slate-300 border border-[#1f2633] focus:border-gold-500 rounded px-3 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="autonomy">Autonomia Radical</option>
                  <option value="restructuring">Reestruturação Comportamental</option>
                  <option value="performance">Alta Performance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Prazo de Execução</label>
                <div className="relative">
                  <input
                    id="action-due"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#0c1015] text-slate-300 border border-[#1f2633] focus:border-gold-500 rounded px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              id="add-action-btn"
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-[#0c0f12] font-semibold text-xs rounded transition-all cursor-pointer"
            >
              Assumir Compromisso de Ação
            </button>
          </form>

          {/* List of Commitments */}
          {actions.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-[#1f2633] rounded-lg">
              <CheckSquare className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-slate-400">Nenhum compromisso assumido ainda.</p>
              <p className="text-xs text-slate-500 mt-1">Converse com M. Grey ou adote um plano acima para começar.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {actions.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 transition-all ${
                    item.completed
                      ? 'bg-slate-900/10 border-slate-800/60 opacity-60'
                      : 'bg-[#11151c]/40 border-[#1f2633] hover:border-slate-700/60'
                  }`}
                >
                  <button
                    id={`toggle-${item.id}`}
                    onClick={() => onToggleAction(item.id)}
                    className="text-slate-400 hover:text-gold-400 mt-0.5 cursor-pointer flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {item.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border ${
                        item.category === 'autonomy'
                          ? 'border-blue-900/40 bg-blue-950/20 text-blue-400'
                          : item.category === 'restructuring'
                          ? 'border-amber-900/40 bg-amber-950/20 text-amber-400'
                          : 'border-emerald-900/40 bg-emerald-950/20 text-emerald-400'
                      }`}>
                        {item.category === 'autonomy' && "Autonomia"}
                        {item.category === 'restructuring' && "Reestruturação"}
                        {item.category === 'performance' && "Performance"}
                      </span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Limite: {new Date(item.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <button
                    id={`delete-${item.id}`}
                    onClick={() => onDeleteAction(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 cursor-pointer"
                    title="Excluir compromisso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exercises Sidebar - The M. Grey Daily Routine */}
      <div className="space-y-6">
        <div className="border border-[#1f2633] bg-[#0c1015]/40 p-6 rounded-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5 border-b border-[#1f2633] pb-4 mb-4">
            <Lightbulb className="w-5 h-5 text-gold-400" />
            <h3 className="font-display font-bold text-lg text-slate-100">Práticas Diárias</h3>
          </div>

          <div className="space-y-4">
            {dailyExercises.map((ex) => (
              <div
                key={ex.id}
                className="p-4 bg-[#11151c]/80 rounded-lg border border-[#1f2633] space-y-3 shadow-sm hover:border-gold-500/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                    ex.pilar === 'autonomy'
                      ? 'border-blue-900/40 bg-blue-950/20 text-blue-400'
                      : ex.pilar === 'restructuring'
                      ? 'border-amber-900/40 bg-amber-950/20 text-amber-400'
                      : 'border-emerald-900/40 bg-emerald-950/20 text-emerald-400'
                  }`}>
                    {ex.pilarLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-semibold">{ex.time}</span>
                </div>

                <h4 className="font-display font-bold text-slate-200 text-sm">{ex.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{ex.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-gold-950/10 border border-gold-500/10 rounded-lg">
            <div className="flex gap-2.5 items-start">
              <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-gold-300 font-bold">Conselho Silencioso</span>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "Conhecimento sem execução é apenas uma ilusão de progresso. Escolha uma das práticas acima e implemente-a hoje. Chega de palavras."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
