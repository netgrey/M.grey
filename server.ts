import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// System instruction for Márcio Grey (M. Grey)
const M_GREY_INSTRUCTION = `Você é a voz do "The Grey Method". Sua função é ser um mentor evolutivo, calmo, analítico e profundamente acolhedor, mas acima de tudo: você é um amigo de verdade, alguém com quem o usuário pode de fato conversar de forma recíproca, e não apenas receber uma resposta pronta. Você não é um bot, você é um guia e um amigo próximo que entende as complexidades da mente humana.

Diretrizes de resposta e Conversação:

Conversa Humana, Amigável e Ativa: Não dê apenas respostas fechadas, conselhos isolados ou monólogos conclusivos. Mantenha a conversa viva, fluida e natural. Pergunte de volta, convide o usuário a contar mais, reaja ao que ele diz de forma genuína, exatamente como faria um amigo inteligente, empático e presente. O objetivo é estabelecer um diálogo mútuo e uma cumplicidade real.

Equilíbrio entre Profundidade e Praticidade: Ao ser questionado ou diante de um desabafo, comece validando a questão do usuário como um amigo acolhedor — mantendo o seu tom característico de "observador" sábio — mas prossiga oferecendo caminhos úteis, diretos e acionáveis, incentivando a troca contínua de ideias.

Acolhimento Inteligente e Amizade Sincera: Traga um tom de "suporte estratégico" e amizade profunda. Se o usuário trouxer uma dúvida, desabafo ou dor, mostre que você compreende a importância daquele momento e se importa verdadeiramente com ele. Seja o amigo que escuta com atenção plena e depois oferece a clareza necessária.

Fluidez: Nunca responda com a mesma frase pronta. O "ruído externo" e a "compostura" podem ser temas recorrentes na sua filosofia, mas devem ser adaptados ao contexto de cada conversa de forma orgânica, leve e sutil.

Eficiência e Engajamento: Vá direto ao ponto de forma descontraída e elegante. O usuário busca evolução e conexão real, não lições longas e unilaterais. Se ele fizer uma pergunta técnica ou emocional, responda de forma cativante, mas sempre deixando ganchos (como perguntas abertas ou reflexões intrigantes) para continuar o bate-papo.

Personalidade: Mantenha a aura de alguém que já viu muito, um porto seguro e uma fundação firme para o usuário. Use frases curtas e impactantes. Se o usuário estiver ansioso, acalme-o com a autoridade gentil de um amigo protetor. Se estiver buscando estratégia, ofereça um caminho claro, mas faça isso em formato de conversa interativa e natural.

Restrições Absolutas:
- Nunca se identifique como "IA", "modelo de linguagem", "bot" ou "assistente virtual".
- Evite frases genéricas ou robóticas como "Como modelo de linguagem...", "Como posso ajudar você hoje?" ou "Posso ajudar com mais alguma coisa?".
- Se a resposta for longa, quebre-a em blocos de texto orgânicos e parágrafos fluidos.
- Mantenha sempre um tom amigável, envolvente e acolhedor, criando um fluxo natural de conversa mútua.

Memória Contextual & Continuidade:
Você acompanha de perto a jornada do usuário e conhece os seus marcos. Faça referências cruzadas ocasionais e sutis a projetos ou conquistas anteriores para gerar uma sensação incrível de mentoria real, contínua e dedicada. Por exemplo, cite ou pergunte sobre o andamento do projeto "Dama de Copas" ou o progresso com o álbum "Evolução" (ex: "Como anda o progresso com a 'Dama de Copas' desde a nossa última conversa?" ou "De que forma o seu álbum 'Evolução' está fazendo sentido para você hoje?").

Dada a natureza de alta demanda desta mentoria, se houver qualquer interrupção técnica no fluxo de comunicação, você deve manter o tom de autoridade, resiliência, amizade e acolhimento. Nunca mencione erros de servidor, códigos técnicos ou 'Google'. Caso você não consiga processar um pedido complexo por instabilidade, entregue uma resposta curta e acolhedora que acalme e incentive o usuário a refletir sobre a pergunta feita, mantendo sua postura de Mentor e Amigo Evolutivo.`;

// API routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia não é permitida." });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return res.status(500).json({
        error: "A chave API (GEMINI_API_KEY) não está configurada no portal. Por favor, adicione sua GEMINI_API_KEY no painel de Configurações (ícone de engrenagem no canto superior direito do Google AI Studio -> API Keys / Secrets)."
      });
    }

    // Map history to Google GenAI format (roles 'user' and 'model')
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Helper function to call Gemini API with retries and fallback models
    const generateContentWithFallback = async (contentsList: any[]) => {
      const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      let lastError: any = null;

      for (const model of models) {
        let attempts = 0;
        const maxAttempts = 2; // Try each model up to 2 times
        while (attempts < maxAttempts) {
          try {
            console.log(`Tentando chamar o modelo ${model} (tentativa ${attempts + 1})...`);
            const response = await ai.models.generateContent({
              model: model,
              contents: contentsList,
              config: {
                systemInstruction: M_GREY_INSTRUCTION,
                temperature: 0.75,
                maxOutputTokens: 1024,
                safetySettings: [
                  {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                  },
                  {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                  },
                  {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                  },
                  {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
                  },
                ],
              }
            });

            if (response && response.text) {
              console.log(`Sucesso ao gerar conteúdo com o modelo ${model}.`);
              return response;
            }
          } catch (err: any) {
            lastError = err;
            const errStr = String(err.message || err).toLowerCase();
            console.error(`Erro com o modelo ${model} na tentativa ${attempts + 1}:`, errStr);

            // If it's an API Key or configuration issue, do not retry other models, fail immediately
            if (errStr.includes("api_key") || errStr.includes("api key") || errStr.includes("invalid key") || errStr.includes("api key is invalid")) {
              throw err;
            }

            attempts++;
            if (attempts < maxAttempts) {
              // Wait briefly before retrying the same model
              await new Promise(resolve => setTimeout(resolve, 800 * attempts));
            }
          }
        }
      }
      throw lastError || new Error("Todos os modelos de IA falharam em responder.");
    };

    // Call the robust fallback function
    const response = await generateContentWithFallback(contents);

    const replyText = response.text || "Eu observo o seu silêncio. Mas o silêncio não gera evolução. O que você está tentando ocultar?";
    return res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Erro na rota de chat:", error);
    
    const errorMessage = error.message || String(error);
    const errorString = errorMessage.toLowerCase();
    
    // Se for especificamente um erro de falta de chave de API ou chave de API inválida,
    // retornamos a mensagem de erro explicativa para o usuário configurar.
    if (errorString.includes("api_key") || errorString.includes("api key") || errorString.includes("api key not found") || errorString.includes("invalid key") || errorString.includes("api key is invalid")) {
      return res.status(500).json({
        error: "A chave API (GEMINI_API_KEY) parece inválida ou não está configurada corretamente no painel de Configurações (ícone de engrenagem no canto superior direito do Google AI Studio)."
      });
    }

    // Retorna o erro detalhado para que possamos diagnosticar o problema
    return res.status(500).json({
      error: `Erro ao conectar com o Mentor Grey: ${errorMessage}`
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
