import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  Send, Bot, User, Sparkles, ArrowLeft, Paperclip,
  FileText, X, Loader2, MessageSquare, Lightbulb,
  Briefcase, Heart, Utensils, TrendingUp, Scale,
  RefreshCw, Copy, Check
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS_ES = [
  { icon: Briefcase, label: "Estrategia de negocio", prompt: "Dame 5 estrategias para hacer crecer mi negocio este año" },
  { icon: TrendingUp, label: "Plan de marketing", prompt: "Crea un plan de marketing de 30 días para mi negocio" },
  { icon: FileText, label: "Redactar correo", prompt: "Redacta un correo profesional para presentar mis servicios a un cliente potencial" },
  { icon: Scale, label: "Revisar contrato", prompt: "Explícame qué debo revisar antes de firmar un contrato de servicios" },
  { icon: Heart, label: "Nutrición", prompt: "Dame un plan de alimentación saludable para una semana" },
  { icon: Utensils, label: "Menú para restaurante", prompt: "Crea un menú atractivo con descripciones para un restaurante mexicano" },
  { icon: Lightbulb, label: "Ideas de negocio", prompt: "Dame 10 ideas de negocio innovadoras para emprender con poco capital" },
  { icon: MessageSquare, label: "Script de ventas", prompt: "Crea un script de ventas para convencer a un cliente de comprar mi producto" },
];

const QUICK_PROMPTS_EN = [
  { icon: Briefcase, label: "Business strategy", prompt: "Give me 5 strategies to grow my business this year" },
  { icon: TrendingUp, label: "Marketing plan", prompt: "Create a 30-day marketing plan for my business" },
  { icon: FileText, label: "Write email", prompt: "Write a professional email to present my services to a potential client" },
  { icon: Scale, label: "Review contract", prompt: "Explain what I should check before signing a service contract" },
  { icon: Heart, label: "Nutrition", prompt: "Give me a healthy meal plan for a week" },
  { icon: Utensils, label: "Restaurant menu", prompt: "Create an attractive menu with descriptions for a Mexican restaurant" },
  { icon: Lightbulb, label: "Business ideas", prompt: "Give me 10 innovative business ideas to start with little capital" },
  { icon: MessageSquare, label: "Sales script", prompt: "Create a sales script to convince a customer to buy my product" },
];

export default function ChatAI() {
  const { isAuthenticated, user } = useAuth();
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.content.chat.useMutation();

  const quickPrompts = language === "es" ? QUICK_PROMPTS_ES : QUICK_PROMPTS_EN;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    const userMsg: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const result = await chatMutation.mutateAsync({ message: messageText, history });
      const assistantMsg: Message = { role: "assistant", content: result.response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      toast.error(language === "es" ? "Error al enviar mensaje" : "Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    toast.success(language === "es" ? "Copiado" : "Copied");
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "es" ? "Chat con IA" : "AI Chat"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {language === "es" ? "Inicia sesión para usar el chat con IA" : "Sign in to use the AI chat"}
          </p>
          <Button onClick={() => window.location.href = "/login"} className="bg-blue-600 hover:bg-blue-700 text-white">
            {language === "es" ? "Iniciar sesión" : "Sign in"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </button>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png"
            alt="ContentAI"
            className="h-12 w-auto"
          />
          <div className="h-5 w-px bg-gray-200" />
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">
              {language === "es" ? "Asistente IA" : "AI Assistant"}
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">
                {language === "es" ? "En línea" : "Online"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs">
            {language === "es" ? "IA Avanzada" : "Advanced AI"}
          </Badge>
          {messages.length > 0 && (
            <button onClick={clearChat} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title={language === "es" ? "Limpiar chat" : "Clear chat"}>
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            {/* Welcome */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                {language === "es" ? `Hola, ${user?.name?.split(" ")[0] || ""}` : `Hello, ${user?.name?.split(" ")[0] || ""}`}
              </h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                {language === "es"
                  ? "Soy tu asistente de IA. Puedo ayudarte con estrategia de negocio, marketing, redacción, análisis y mucho más."
                  : "I'm your AI assistant. I can help you with business strategy, marketing, writing, analysis and much more."}
              </p>
            </div>

            {/* Quick prompts */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {language === "es" ? "Sugerencias rápidas" : "Quick suggestions"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(qp.prompt)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                      <qp.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{qp.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "assistant" ? "bg-blue-600" : "bg-gray-200"
                }`}>
                  {msg.role === "assistant"
                    ? <Bot className="w-4 h-4 text-white" />
                    : <User className="w-4 h-4 text-gray-600" />
                  }
                </div>

                {/* Bubble */}
                <div className={`group max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-sm"
                  }`}>
                    {msg.role === "assistant"
                      ? <Streamdown>{msg.content}</Streamdown>
                      : msg.content
                    }
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyMessage(msg.content, i)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        {copiedIdx === i
                          ? <Check className="w-3 h-3 text-green-500" />
                          : <Copy className="w-3 h-3 text-gray-400" />
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === "es" ? "Escribe tu mensaje... (Enter para enviar)" : "Type your message... (Enter to send)"}
                rows={1}
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-12"
                style={{ maxHeight: "120px", overflowY: "auto" }}
              />
            </div>
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 w-11 p-0 flex-shrink-0 disabled:opacity-40"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            {language === "es"
              ? "ContentAI puede cometer errores. Verifica información importante."
              : "ContentAI can make mistakes. Verify important information."}
          </p>
        </div>
      </div>
    </div>
  );
}
