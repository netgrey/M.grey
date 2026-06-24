import React, { useState } from "react";
import { Compass, Sparkles, ArrowRight, ArrowLeft, RotateCcw, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { AssessmentQuestion, AssessmentResult } from "../types";

const QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    text: "Quando algo importante dá errado na sua carreira ou rotina, qual é a sua reação mental imediata?",
    category: "autonomy",
    options: [
      { text: "Assumo 100% da responsabilidade, avalio onde falhei e desenho a rota de correção de forma imediata.", score: 100 },
      { text: "Espero a poeira baixar ou torço para que os envolvidos encontrem a solução sozinhos.", score: 60 },
      { text: "Analiso quem ou o que causou o problema externo primeiro, para poder me defender se necessário.", score: 30 },
      { text: "Fico frustrado e justifico que foi uma questão de azar ou circunstâncias totalmente alheias a mim.", score: 10 },
    ]
  },
  {
    id: 2,
    text: "Como você lida genuinamente com seus hábitos nocivos ou loops de autossabotagem (como procrastinação)?",
    category: "restructuring",
    options: [
      { text: "Mapeio cirurgicamente o gatilho, quebro o padrão comportamental na raiz e adoto uma resposta nova imediata.", score: 100 },
      { text: "Tento mudar pela força de vontade por alguns dias, mas acabo voltando ao mesmo comportamento de sempre.", score: 65 },
      { text: "Reconheço que preciso mudar, mas justifico que a correria e o cansaço atual me impedem de agir agora.", score: 35 },
      { text: "Ignoro as consequências ou racionalizo que esse padrão 'faz parte da minha personalidade' e pronto.", score: 10 },
    ]
  },
  {
    id: 3,
    text: "Qual é o nível real de blindagem e consistência do seu foco diário nas prioridades vitais?",
    category: "performance",
    options: [
      { text: "Inflexível. Bloqueio minha agenda, protejo minha energia e executo o planejado com precisão de cirurgião.", score: 100 },
      { text: "Sob pressão extrema. Só me concentro de verdade quando os prazos estão estourando e há risco real.", score: 70 },
      { text: "Disperso. Trabalho duro, mas me perco facilmente em notificações, demandas alheias ou tarefas de menor importância.", score: 40 },
      { text: "Nenhum. Sinto que passo o dia inteiro apagando incêndios improvisados e resolvendo demandas dos outros.", score: 15 },
    ]
  },
  {
    id: 4,
    text: "Quando você recebe uma crítica direta sobre um erro comportamental seu, qual é o seu reflexo?",
    category: "autonomy",
    options: [
      { text: "Espelho o comentário friamente, separo a emoção dos fatos e reestruturo minha postura com base na verdade.", score: 100 },
      { text: "Escuto calado e concordo por educação, mas internamente me sinto incompreendido e injustiçado.", score: 60 },
      { text: "Reajo com justificativas bem elaboradas e explico de imediato quais foram os meus 'bons motivos' por trás do erro.", score: 30 },
      { text: "Fico profundamente abalado, remoendo o fato por dias e permitindo que isso afete minha autoconfiança geral.", score: 10 },
    ]
  },
  {
    id: 5,
    text: "Com que frequência você audita suas desculpas mentais e confronta suas próprias contradições?",
    category: "restructuring",
    options: [
      { text: "Diariamente. Faço um escaneamento rigoroso, detecto desculpas baratas e as desintegro com ações concretas.", score: 100 },
      { text: "Semanalmente ou esporadicamente, geralmente quando percebo que os resultados estão começando a estagnar.", score: 65 },
      { text: "Sei exatamente quais são os meus erros e desculpas, mas escolho conviver confortavelmente com eles por conveniência.", score: 35 },
      { text: "Raramente. Prefiro focar em pensamentos positivos em vez de ficar procurando falhas internas em mim.", score: 15 },
    ]
  },
  {
    id: 6,
    text: "A arquitetura do seu dia a dia é desenhada por sua intenção ou pelas demandas do ambiente?",
    category: "performance",
    options: [
      { text: "100% Intencional. Minha rotina reflete rigorosamente meus objetivos estratégicos de alto valor.", score: 100 },
      { text: "Dividida. Consigo impor minhas prioridades na teoria, mas no fim do dia acabo engolido por demandas externas.", score: 60 },
      { text: "Totalmente reativa. Sigo o fluxo e o ritmo do que me pedem no momento, sem um plano claro ou blindagem.", score: 20 },
      { text: "Improvisada. Detesto rotina ou planejamento estruturado; prefiro deixar as coisas acontecerem naturalmente.", score: 10 },
    ]
  }
];

interface AssessmentSectionProps {
  onSaveResult: (result: AssessmentResult) => void;
  savedResult: AssessmentResult | null;
  onSendResultToChat: (result: AssessmentResult) => void;
  onClearResult: () => void;
}

export default function AssessmentSection({ onSaveResult, savedResult, onSendResultToChat, onClearResult }: AssessmentSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleSelectOption = (questionId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate final scores
      const autonomyScores = QUESTIONS.filter(q => q.category === 'autonomy').map(q => answers[q.id] || 0);
      const restructuringScores = QUESTIONS.filter(q => q.category === 'restructuring').map(q => answers[q.id] || 0);
      const performanceScores = QUESTIONS.filter(q => q.category === 'performance').map(q => answers[q.id] || 0);

      const autonomyAvg = Math.round(autonomyScores.reduce((a, b) => a + b, 0) / autonomyScores.length);
      const restructuringAvg = Math.round(restructuringScores.reduce((a, b) => a + b, 0) / restructuringScores.length);
      const performanceAvg = Math.round(performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length);

      // Determine Archetype
      let archetype = "";
      let feedback = "";

      if (autonomyAvg < 50) {
        archetype = "O Vitimista Reativo";
        feedback = "Você está vivendo no banco de trás da sua própria existência. Suas falhas são sempre justificadas por eventos externos, terceiros ou pela escassez de tempo. O Método M. Grey exige que você retome as rédeas imediatamente. Pare de procurar culpados e tome sua primeira decisão com autonomia radical hoje.";
      } else if (performanceAvg < 50) {
        archetype = "O Inconsistente de Alta Energia";
        feedback = "Sua postura é bem-intencionada e você assume a responsabilidade, mas sua energia é dispersa. Você se sabota ao não blindar seu foco e permitir que as urgências alheias engulam seu tempo valioso. A excelência se constrói no detalhe chato da rotina diária, e não em surtos temporários de motivação.";
      } else if (restructuringAvg < 50) {
        archetype = "O Intelectual Estagnado";
        feedback = "Você possui clareza mental e sabe exatamente o que precisa ser feito, mas está viciado no conforto das suas velhas desculpas. Identificar seus erros não tem valor se você não quebrar os padrões comportamentais de imediato. A mente mente; somente a ação estruturada cura.";
      } else {
        archetype = "O Realizador Autônomo";
        feedback = "Parabéns. Você possui as fundações necessárias para a maestria comportamental: assume a autoria, reestrutura seus ciclos de procrastinação e executa com blindagem intencional. No entanto, o verdadeiro teste reside na consistência sob estresse extremo. Não relaxe sua vigilância.";
      }

      const result: AssessmentResult = {
        scores: {
          autonomy: autonomyAvg,
          restructuring: restructuringAvg,
          performance: performanceAvg
        },
        archetype,
        feedback,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      };

      onSaveResult(result);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    onClearResult();
  };

  const activeQuestion = QUESTIONS[currentStep];
  const isOptionSelected = answers[activeQuestion?.id] !== undefined;

  // Render Result view if result already exists
  if (savedResult) {
    const { autonomy, restructuring, performance } = savedResult.scores;

    // SVG coordinates for radar chart
    // Center is (100, 100), max radius is 75
    // Top is Autonomy (theta = -PI/2)
    // Bottom Right is Performance (theta = PI/6)
    // Bottom Left is Restructuring (theta = 5*PI/6)
    const getX = (score: number, angle: number) => {
      const radius = (score / 100) * 75;
      return 100 + radius * Math.cos(angle);
    };
    const getY = (score: number, angle: number) => {
      const radius = (score / 100) * 75;
      return 100 + radius * Math.sin(angle);
    };

    const angleAutonomy = -Math.PI / 2;
    const anglePerformance = Math.PI / 6;
    const angleRestructuring = (5 * Math.PI) / 6;

    const pAutonomy = { x: getX(autonomy, angleAutonomy), y: getY(autonomy, angleAutonomy) };
    const pPerformance = { x: getX(performance, anglePerformance), y: getY(performance, anglePerformance) };
    const pRestructuring = { x: getX(restructuring, angleRestructuring), y: getY(restructuring, angleRestructuring) };

    const gridLevels = [25, 50, 75, 100];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border border-[#1f2633] bg-[#0c1015]/40 p-6 rounded-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Visual Radar / Tri-axial Chart Container */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 bg-[#11151c]/80 rounded-xl border border-[#1f2633] shadow-inner">
              <span className="text-[10px] text-gold-400 uppercase tracking-widest font-mono font-bold mb-2">
                Arquitetura Mental
              </span>
              
              <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-[0_0_15px_rgba(170,127,56,0.15)]">
                {/* Background Grid Lines (Triangles) */}
                {gridLevels.map((level) => {
                  const r = (level / 100) * 75;
                  const pt1 = { x: 100 + r * Math.cos(angleAutonomy), y: 100 + r * Math.sin(angleAutonomy) };
                  const pt2 = { x: 100 + r * Math.cos(anglePerformance), y: 100 + r * Math.sin(anglePerformance) };
                  const pt3 = { x: 100 + r * Math.cos(angleRestructuring), y: 100 + r * Math.sin(angleRestructuring) };
                  return (
                    <polygon
                      key={level}
                      points={`${pt1.x},${pt1.y} ${pt2.x},${pt2.y} ${pt3.x},${pt3.y}`}
                      fill="none"
                      stroke="#1f2633"
                      strokeWidth="1"
                      strokeDasharray={level === 100 ? "0" : "3,3"}
                    />
                  );
                })}

                {/* Axes lines from center */}
                <line x1="100" y1="100" x2="100" y2="25" stroke="#1f2633" strokeWidth="1.5" />
                <line x1="100" y1="100" x2={100 + 75 * Math.cos(anglePerformance)} y2={100 + 75 * Math.sin(anglePerformance)} stroke="#1f2633" strokeWidth="1.5" />
                <line x1="100" y1="100" x2={100 + 75 * Math.cos(angleRestructuring)} y2={100 + 75 * Math.sin(angleRestructuring)} stroke="#1f2633" strokeWidth="1.5" />

                {/* User Score Polygon Fill & Stroke */}
                <polygon
                  points={`${pAutonomy.x},${pAutonomy.y} ${pPerformance.x},${pPerformance.y} ${pRestructuring.x},${pRestructuring.y}`}
                  fill="rgba(170, 127, 56, 0.15)"
                  stroke="#aa7f38"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Markers at score points */}
                <circle cx={pAutonomy.x} cy={pAutonomy.y} r="4" fill="#f5eedf" stroke="#aa7f38" strokeWidth="1.5" />
                <circle cx={pPerformance.x} cy={pPerformance.y} r="4" fill="#f5eedf" stroke="#aa7f38" strokeWidth="1.5" />
                <circle cx={pRestructuring.x} cy={pRestructuring.y} r="4" fill="#f5eedf" stroke="#aa7f38" strokeWidth="1.5" />

                {/* Center marker */}
                <circle cx="100" cy="100" r="2" fill="#aa7f38" />

                {/* Axis Labels */}
                <text x="100" y="16" fill="#f1f5f9" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-sans)">
                  AUTONOMIA
                </text>
                <text x={100 + 82 * Math.cos(anglePerformance)} y={100 + 82 * Math.sin(anglePerformance) + 2} fill="#f1f5f9" fontSize="8" fontWeight="bold" textAnchor="start" fontFamily="var(--font-sans)">
                  PERFORMANCE
                </text>
                <text x={100 + 82 * Math.cos(angleRestructuring)} y={100 + 82 * Math.sin(angleRestructuring) + 2} fill="#f1f5f9" fontSize="8" fontWeight="bold" textAnchor="end" fontFamily="var(--font-sans)">
                  CONDIÇÃO
                </text>
              </svg>

              <div className="mt-4 w-full grid grid-cols-3 text-center text-[10px] font-mono gap-1 border-t border-[#1f2633] pt-3">
                <div>
                  <div className="text-slate-400">Autonomia</div>
                  <div className="font-bold text-gold-300 text-sm mt-0.5">{autonomy}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Restrut.</div>
                  <div className="font-bold text-gold-300 text-sm mt-0.5">{restructuring}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Perform.</div>
                  <div className="font-bold text-gold-300 text-sm mt-0.5">{performance}%</div>
                </div>
              </div>
            </div>

            {/* Assessment Feedback Report */}
            <div className="flex-1 space-y-5">
              <div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-[#11151c] text-slate-400 border border-[#1f2633]">
                  Resultado Avaliado em {savedResult.date}
                </span>
                <h2 className="font-display text-3xl font-bold text-white tracking-tight mt-3">
                  {savedResult.archetype}
                </h2>
                <div className="h-0.5 w-16 bg-gradient-to-r from-gold-500 to-transparent mt-2" />
              </div>

              <div className="p-4 bg-[#11151c]/60 border-l-2 border-gold-500 text-slate-300 text-sm leading-relaxed space-y-2 italic font-serif">
                <p>"{savedResult.feedback}"</p>
                <p className="text-right text-xs font-sans not-italic font-bold text-gold-400/80 mt-1">— Márcio Grey de Oliveira</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#11151c]/40 p-3 rounded-lg border border-[#1f2633] flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Autonomia</div>
                    <div className="text-xs text-slate-300 font-mono">
                      {autonomy >= 75 ? "Radical e Plena" : autonomy >= 45 ? "Parcial e Vacilante" : "Ausente / Dependente"}
                    </div>
                  </div>
                </div>

                <div className="bg-[#11151c]/40 p-3 rounded-lg border border-[#1f2633] flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Reestruturação</div>
                    <div className="text-xs text-slate-300 font-mono">
                      {restructuring >= 75 ? "Consciência Ativa" : restructuring >= 45 ? "Racionalizada" : "Adormecida"}
                    </div>
                  </div>
                </div>

                <div className="bg-[#11151c]/40 p-3 rounded-lg border border-[#1f2633] flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Alta Performance</div>
                    <div className="text-xs text-slate-300 font-mono">
                      {performance >= 75 ? "Execução Cirúrgica" : performance >= 45 ? "Esporádica / Instável" : "Reativa e Caótica"}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="send-result-btn"
                  onClick={() => onSendResultToChat(savedResult)}
                  className="flex-1 px-5 py-3 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-[#0c0f12] font-semibold text-sm hover:from-gold-500 hover:to-gold-400 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Confrontar Padrões no Chat</span>
                </button>
                
                <button
                  id="reset-assessment-btn"
                  onClick={handleReset}
                  className="px-5 py-3 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm border border-slate-700/50 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer Avaliação</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Questionnaire Step View
  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto border border-[#1f2633] bg-[#0c1015]/40 rounded-xl overflow-hidden backdrop-blur-md">
      {/* Step Header */}
      <div className="bg-[#11151c]/60 p-6 border-b border-[#1f2633] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-gold-950/20 border border-gold-500/20 text-gold-400">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100">Auditoria Comportamental</h3>
            <p className="text-xs text-slate-400">Método M. Grey — Passo {currentStep + 1} de {QUESTIONS.length}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-gold-400">{progressPercent}%</div>
          <div className="w-20 bg-[#1f2633] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-gold-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-8 space-y-6">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-950/20 text-gold-400 uppercase tracking-widest font-bold border border-gold-500/10">
            {activeQuestion.category === 'autonomy' && "Pilar I: Autonomia Absoluta"}
            {activeQuestion.category === 'restructuring' && "Pilar II: Reestruturação Cognitiva"}
            {activeQuestion.category === 'performance' && "Pilar III: Alta Performance"}
          </span>
          <h4 className="font-display text-xl font-bold text-slate-100 mt-3 leading-snug">
            {activeQuestion.text}
          </h4>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {activeQuestion.options.map((option, idx) => {
            const isSelected = answers[activeQuestion.id] === option.score;
            return (
              <button
                key={idx}
                id={`option-${idx}`}
                onClick={() => handleSelectOption(activeQuestion.id, option.score)}
                className={`w-full p-4 text-left text-sm rounded-lg border transition-all flex items-start gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gold-500/10 border-gold-500/60 text-slate-100'
                    : 'bg-[#11151c]/40 border-[#1f2633] text-slate-300 hover:bg-[#11151c] hover:border-[#2e3747]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isSelected ? 'border-gold-500 bg-gold-500/20 text-gold-400' : 'border-[#2e3747]'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />}
                </div>
                <span className="leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-[#11151c]/60 p-4 border-t border-[#1f2633] flex justify-between">
        <button
          id="prev-btn"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-transparent border border-transparent rounded hover:bg-slate-800/30 transition-all flex items-center gap-1.5 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          id="next-btn"
          onClick={handleNext}
          disabled={!isOptionSelected}
          className="px-5 py-2.5 rounded bg-gold-500 hover:bg-gold-400 disabled:opacity-35 disabled:hover:bg-gold-500 text-[#0c0f12] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{currentStep === QUESTIONS.length - 1 ? "Ver Diagnóstico" : "Avançar"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
