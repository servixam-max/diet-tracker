import { useState, useCallback, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UserProfile {
  name?: string;
  dailyCalories?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
  weight?: number;
  height?: number;
  age?: number;
  activityLevel?: string;
}

interface UseAIChatOptions {
  userId?: string;
  userProfile?: UserProfile;
  userPlan?: {
    type?: string;
    duration?: number;
    preferences?: string[];
  };
  userGoals?: string[];
}

const QUICK_REPLIES = [
  "Dame una receta",
  "Cómo voy de macros?",
  "Motívame",
  "Qué como hoy?",
];

const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || "https://ollama.cloud";
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_TEXT_MODEL || "llama3.2";

export function useAIChat({ userProfile, userPlan, userGoals }: UseAIChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `¡Hola! Soy tu coach nutricional con IA 🤖. 

Veo que tu objetivo es ${userProfile?.dailyCalories || "mantener"} kcal diarias con ${userProfile?.proteinGoal || "0"}g de proteína.

Puedo analizar tu ingesta, sugerir recetas y darte consejos personalizados. ¿En qué puedo ayudarte hoy?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length, userProfile?.dailyCalories, userProfile?.proteinGoal]);

  const buildContextPrompt = useCallback(() => {
    const context = {
      userProfile: {
        name: userProfile?.name || "usuario",
        dailyCalories: userProfile?.dailyCalories || 2000,
        proteinGoal: userProfile?.proteinGoal || 120,
        carbsGoal: userProfile?.carbsGoal || 250,
        fatGoal: userProfile?.fatGoal || 65,
        weight: userProfile?.weight || 75,
        height: userProfile?.height || 175,
        age: userProfile?.age || 30,
        activityLevel: userProfile?.activityLevel || "moderado",
      },
      plan: userPlan || { type: "equilibrado", duration: 12, preferences: [] },
      goals: userGoals || ["perder peso", "ganar músculo", "mejorar energía"],
    };

    return `Eres un coach nutricional experto y empático. Responde en español de forma concisa y útil.

Contexto del usuario:
- Perfil: ${context.userProfile.name}, ${context.userProfile.age} años, ${context.userProfile.weight}kg, ${context.userProfile.height}cm
- Actividad: ${context.userProfile.activityLevel}
- Objetivos diarios: ${context.userProfile.dailyCalories} kcal, ${context.userProfile.proteinGoal}g proteína, ${context.userProfile.carbsGoal}g carbos, ${context.userProfile.fatGoal}g grasa
- Plan: ${context.plan.type} (${context.plan.duration} semanas)
- Metas: ${context.goals.join(", ")}

Da respuestas prácticas, con ejemplos concretos de comidas cuando sea relevante. Sé motivador pero realista.`;
  }, [userProfile, userPlan, userGoals]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const contextPrompt = buildContextPrompt();
      const conversationHistory = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

      const fullPrompt = `${contextPrompt}

Historial de conversación:
${conversationHistory}

Usuario: ${content}

Coach:`;

      const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error API: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.response || "Lo siento, no pude generar una respuesta. Intenta de nuevo.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);

      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "⚠️ Tuvimos un problema de conexión. Mientras tanto: mantente hidratado, prioriza proteínas en cada comida, y no olvides moverte hoy! 💪",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, buildContextPrompt]);

  const sendQuickReply = useCallback((reply: string) => {
    sendMessage(reply);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `¡Hola! Soy tu coach nutricional con IA 🤖. 

Veo que tu objetivo es ${userProfile?.dailyCalories || "mantener"} kcal diarias con ${userProfile?.proteinGoal || "0"}g de proteína.

Puedo analizar tu ingesta, sugerir recetas y darte consejos personalizados. ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, [userProfile]);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    sendQuickReply,
    clearChat,
    quickReplies: QUICK_REPLIES,
  };
}
