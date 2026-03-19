import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useEffect, useRef } from "react";
import {
  Instagram, Twitter, FileText, Mail, Video, Sparkles,
  Copy, Check, History, CreditCard, LogOut, Crown,
  ArrowUpRight, Zap, Globe, LayoutDashboard, X, Languages,
  Image, Megaphone, Newspaper, BookOpen, Star, Building2,
  Coffee, Utensils, Dumbbell, Home, Gem, Beaker, Radio,
  Tv, MessageSquare, Send, ChevronRight, ChevronLeft,
  Download, Heart, Search, Filter, Plus, Briefcase,
  PenTool, BarChart3, Users, Settings, HelpCircle,
  Wand2, Target, TrendingUp, Package, Music, Camera,
  Mic, MicOff, StopCircle, CalendarDays
} from "lucide-react";
import { Streamdown } from "streamdown";
import { useExportContent } from "@/hooks/useExportContent";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Lang = "es" | "en";

interface ContentCategory {
  id: string;
  label: { es: string; en: string };
  icon: React.ElementType;
  color: string;
  types: ContentItem[];
}

interface ContentItem {
  id: string;
  label: { es: string; en: string };
  icon: React.ElementType;
  description: { es: string; en: string };
}

// ─── Categorías y tipos de contenido ─────────────────────────────────────────
const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    id: "social",
    label: { es: "Redes Sociales", en: "Social Media" },
    icon: Instagram,
    color: "text-pink-500",
    types: [
      { id: "instagram_post", label: { es: "Post Instagram", en: "Instagram Post" }, icon: Instagram, description: { es: "Post con texto, CTA y hashtags", en: "Post with text, CTA and hashtags" } },
      { id: "instagram_story", label: { es: "Story Instagram", en: "Instagram Story" }, icon: Camera, description: { es: "Secuencia de 5 stories", en: "Sequence of 5 stories" } },
      { id: "instagram_carousel", label: { es: "Carrusel Instagram", en: "Instagram Carousel" }, icon: Image, description: { es: "7 diapositivas de valor", en: "7 value slides" } },
      { id: "instagram_reel", label: { es: "Reel Instagram", en: "Instagram Reel" }, icon: Video, description: { es: "Guión de 30 segundos", en: "30-second script" } },
      { id: "tiktok_script", label: { es: "TikTok Script", en: "TikTok Script" }, icon: Music, description: { es: "Guión viral de 60s", en: "60s viral script" } },
      { id: "youtube_short", label: { es: "YouTube Short", en: "YouTube Short" }, icon: Video, description: { es: "Guión de 60 segundos", en: "60-second script" } },
      { id: "twitter_post", label: { es: "Hilo Twitter/X", en: "Twitter/X Thread" }, icon: Twitter, description: { es: "Hilo de 5 tweets", en: "Thread of 5 tweets" } },
      { id: "linkedin_post", label: { es: "Post LinkedIn", en: "LinkedIn Post" }, icon: Briefcase, description: { es: "Post profesional", en: "Professional post" } },
      { id: "facebook_post", label: { es: "Post Facebook", en: "Facebook Post" }, icon: Globe, description: { es: "Post conversacional", en: "Conversational post" } },
    ],
  },
  {
    id: "ads",
    label: { es: "Anuncios Publicitarios", en: "Advertising" },
    icon: Megaphone,
    color: "text-orange-500",
    types: [
      { id: "facebook_ad", label: { es: "Facebook Ads", en: "Facebook Ads" }, icon: Megaphone, description: { es: "Anuncio con variaciones A/B", en: "Ad with A/B variations" } },
      { id: "google_ad", label: { es: "Google Ads", en: "Google Ads" }, icon: Search, description: { es: "Headlines y descripciones", en: "Headlines and descriptions" } },
      { id: "instagram_ad", label: { es: "Instagram Ads", en: "Instagram Ads" }, icon: Instagram, description: { es: "Anuncio con copy y visual", en: "Ad with copy and visual" } },
      { id: "tiktok_ad", label: { es: "TikTok Ads", en: "TikTok Ads" }, icon: Video, description: { es: "Anuncio de 15 segundos", en: "15-second ad" } },
      { id: "whatsapp_promo", label: { es: "WhatsApp Promo", en: "WhatsApp Promo" }, icon: MessageSquare, description: { es: "Mensaje promocional", en: "Promotional message" } },
      { id: "radio_ad", label: { es: "Anuncio Radio", en: "Radio Ad" }, icon: Radio, description: { es: "Guión de 30 segundos", en: "30-second script" } },
      { id: "tv_ad", label: { es: "Comercial TV", en: "TV Commercial" }, icon: Tv, description: { es: "Guión escena por escena", en: "Scene-by-scene script" } },
      { id: "flyer_copy", label: { es: "Copy Flyer", en: "Flyer Copy" }, icon: FileText, description: { es: "Texto para flyer digital", en: "Digital flyer text" } },
      { id: "email_campaign", label: { es: "Email Marketing", en: "Email Marketing" }, icon: Mail, description: { es: "Campaña de email completa", en: "Complete email campaign" } },
    ],
  },
  {
    id: "editorial",
    label: { es: "Contenido Editorial", en: "Editorial Content" },
    icon: BookOpen,
    color: "text-green-500",
    types: [
      { id: "blog_article", label: { es: "Artículo Blog", en: "Blog Article" }, icon: FileText, description: { es: "Artículo SEO 800+ palabras", en: "SEO article 800+ words" } },
      { id: "news_article", label: { es: "Nota Periodística", en: "News Article" }, icon: Newspaper, description: { es: "Nota con estructura periodística", en: "Journalistic structure" } },
      { id: "press_release", label: { es: "Comunicado de Prensa", en: "Press Release" }, icon: Send, description: { es: "Comunicado profesional", en: "Professional press release" } },
      { id: "newsletter", label: { es: "Newsletter", en: "Newsletter" }, icon: Mail, description: { es: "Newsletter completo", en: "Complete newsletter" } },
      { id: "web_copy", label: { es: "Copy Página Web", en: "Website Copy" }, icon: Globe, description: { es: "Texto completo para web", en: "Complete website text" } },
    ],
  },
  {
    id: "video",
    label: { es: "Video y Comerciales", en: "Video & Commercials" },
    icon: Video,
    color: "text-purple-500",
    types: [
      { id: "video_script", label: { es: "Guión de Video", en: "Video Script" }, icon: Video, description: { es: "Guión completo ~4 minutos", en: "Complete script ~4 minutes" } },
      { id: "commercial_script", label: { es: "Comercial 60s", en: "60s Commercial" }, icon: Tv, description: { es: "Comercial para redes", en: "Social media commercial" } },
      { id: "product_commercial", label: { es: "Comercial de Producto", en: "Product Commercial" }, icon: Package, description: { es: "Comercial desde descripción", en: "Commercial from description" } },
    ],
  },
  {
    id: "branding",
    label: { es: "Branding e Identidad", en: "Branding & Identity" },
    icon: PenTool,
    color: "text-blue-500",
    types: [
      { id: "brand_identity", label: { es: "Identidad de Marca", en: "Brand Identity" }, icon: PenTool, description: { es: "Nombre, slogan, colores, tipografía", en: "Name, slogan, colors, fonts" } },
      { id: "brand_slogan", label: { es: "Slogans", en: "Slogans" }, icon: Zap, description: { es: "10 opciones de slogan", en: "10 slogan options" } },
      { id: "brand_story", label: { es: "Historia de Marca", en: "Brand Story" }, icon: BookOpen, description: { es: "Narrativa emotiva de la marca", en: "Emotional brand narrative" } },
      { id: "mission_vision", label: { es: "Misión y Visión", en: "Mission & Vision" }, icon: Target, description: { es: "Misión, visión y valores", en: "Mission, vision and values" } },
      { id: "business_pitch", label: { es: "Pitch de Negocio", en: "Business Pitch" }, icon: TrendingUp, description: { es: "Pitch para inversionistas", en: "Investor pitch" } },
      { id: "elevator_pitch", label: { es: "Elevator Pitch", en: "Elevator Pitch" }, icon: ArrowUpRight, description: { es: "3 versiones: 30s, 60s, 2min", en: "3 versions: 30s, 60s, 2min" } },
    ],
  },
  {
    id: "specialized",
    label: { es: "Especializado", en: "Specialized" },
    icon: Star,
    color: "text-amber-500",
    types: [
      { id: "menu_description", label: { es: "Menú Restaurante", en: "Restaurant Menu" }, icon: Utensils, description: { es: "Descripciones apetitosas", en: "Appetizing descriptions" } },
      { id: "property_listing", label: { es: "Listado Inmobiliario", en: "Property Listing" }, icon: Home, description: { es: "Descripción de propiedad", en: "Property description" } },
      { id: "beverage_brand", label: { es: "Marca de Bebidas", en: "Beverage Brand" }, icon: Beaker, description: { es: "Tequila, mezcal, cerveza, vino", en: "Tequila, mezcal, beer, wine" } },
      { id: "event_promo", label: { es: "Promoción de Evento", en: "Event Promo" }, icon: Star, description: { es: "Material completo de evento", en: "Complete event material" } },
      { id: "loyalty_campaign", label: { es: "Campaña de Fidelización", en: "Loyalty Campaign" }, icon: Heart, description: { es: "Programa de lealtad", en: "Loyalty program" } },
      { id: "review_response", label: { es: "Respuestas a Reseñas", en: "Review Responses" }, icon: MessageSquare, description: { es: "Google, Yelp, TripAdvisor", en: "Google, Yelp, TripAdvisor" } },
    ],
  },
  {
    id: "strategy",
    label: { es: "Estrategia", en: "Strategy" },
    icon: BarChart3,
    color: "text-indigo-500",
    types: [
      { id: "content_plan_30days", label: { es: "Plan 30 Días", en: "30-Day Plan" }, icon: BarChart3, description: { es: "Calendario de contenido completo", en: "Complete content calendar" } },
      { id: "business_analysis", label: { es: "Análisis de Negocio", en: "Business Analysis" }, icon: TrendingUp, description: { es: "Describe tu negocio → IA analiza todo", en: "Describe your business → AI analyzes" } },
    ],
  },
];

const INDUSTRIES = [
  { id: "general", label: { es: "General", en: "General" }, icon: Globe },
  { id: "restaurant", label: { es: "Restaurante", en: "Restaurant" }, icon: Utensils },
  { id: "bar_nightclub", label: { es: "Bar / Antro", en: "Bar / Nightclub" }, icon: Music },
  { id: "coffee_shop", label: { es: "Cafetería", en: "Coffee Shop" }, icon: Coffee },
  { id: "bakery", label: { es: "Panadería / Pastelería", en: "Bakery" }, icon: Package },
  { id: "ice_cream_shop", label: { es: "Heladería", en: "Ice Cream Shop" }, icon: Star },
  { id: "jewelry", label: { es: "Joyería", en: "Jewelry" }, icon: Gem },
  { id: "clothing_store", label: { es: "Tienda de Ropa", en: "Clothing Store" }, icon: Package },
  { id: "beauty_salon", label: { es: "Salón de Belleza", en: "Beauty Salon" }, icon: Star },
  { id: "spa", label: { es: "Spa / Wellness", en: "Spa / Wellness" }, icon: Heart },
  { id: "gym", label: { es: "Gimnasio", en: "Gym" }, icon: Dumbbell },
  { id: "fitness_instructor", label: { es: "Instructor Fitness", en: "Fitness Instructor" }, icon: Dumbbell },
  { id: "pharmacy", label: { es: "Farmacia", en: "Pharmacy" }, icon: Plus },
  { id: "dental_clinic", label: { es: "Clínica Dental", en: "Dental Clinic" }, icon: Plus },
  { id: "medical_clinic", label: { es: "Clínica Médica", en: "Medical Clinic" }, icon: Plus },
  { id: "veterinary", label: { es: "Veterinaria", en: "Veterinary" }, icon: Heart },
  { id: "real_estate", label: { es: "Inmobiliaria", en: "Real Estate" }, icon: Home },
  { id: "construction", label: { es: "Constructora", en: "Construction" }, icon: Building2 },
  { id: "architecture", label: { es: "Arquitectura", en: "Architecture" }, icon: Building2 },
  { id: "hotel", label: { es: "Hotel / Hospedaje", en: "Hotel" }, icon: Building2 },
  { id: "travel_agency", label: { es: "Agencia de Viajes", en: "Travel Agency" }, icon: Globe },
  { id: "school", label: { es: "Escuela / Academia", en: "School / Academy" }, icon: BookOpen },
  { id: "tequila_mezcal", label: { es: "Tequila / Mezcal", en: "Tequila / Mezcal" }, icon: Beaker },
  { id: "craft_beer", label: { es: "Cerveza Artesanal", en: "Craft Beer" }, icon: Beaker },
  { id: "winery", label: { es: "Vino / Bodega", en: "Winery" }, icon: Beaker },
  { id: "tech_company", label: { es: "Empresa de Tecnología", en: "Tech Company" }, icon: Zap },
  { id: "ecommerce", label: { es: "E-commerce / Tienda Online", en: "E-commerce" }, icon: Package },
  { id: "marketing_agency", label: { es: "Agencia de Marketing", en: "Marketing Agency" }, icon: Megaphone },
  { id: "media", label: { es: "Medios de Comunicación", en: "Media" }, icon: Newspaper },
  { id: "hardware_store", label: { es: "Ferretería", en: "Hardware Store" }, icon: Settings },
  { id: "flower_shop", label: { es: "Floristería", en: "Flower Shop" }, icon: Heart },
  { id: "auto_shop", label: { es: "Taller Automotriz", en: "Auto Shop" }, icon: Settings },
  { id: "other", label: { es: "Otro", en: "Other" }, icon: Briefcase },
];

const TONES = [
  { id: "professional", label: { es: "Profesional", en: "Professional" } },
  { id: "casual", label: { es: "Casual / Amigable", en: "Casual / Friendly" } },
  { id: "funny", label: { es: "Divertido / Humor", en: "Funny / Humor" } },
  { id: "inspirational", label: { es: "Inspiracional", en: "Inspirational" } },
  { id: "luxury", label: { es: "Lujo / Premium", en: "Luxury / Premium" } },
  { id: "urgent", label: { es: "Urgente / Persuasivo", en: "Urgent / Persuasive" } },
];

const PLAN_CONFIG: Record<string, { name: { es: string; en: string }; color: string; badge: string }> = {
  free:       { name: { es: "Gratis", en: "Free" }, color: "bg-gray-100 text-gray-600", badge: "gray" },
  starter:    { name: { es: "Starter", en: "Starter" }, color: "bg-blue-50 text-blue-600", badge: "blue" },
  pro:        { name: { es: "Pro", en: "Pro" }, color: "bg-violet-50 text-violet-600", badge: "violet" },
  team:       { name: { es: "Team", en: "Team" }, color: "bg-emerald-50 text-emerald-600", badge: "emerald" },
  business:   { name: { es: "Business", en: "Business" }, color: "bg-amber-50 text-amber-600", badge: "amber" },
  enterprise: { name: { es: "Enterprise", en: "Enterprise" }, color: "bg-rose-50 text-rose-600", badge: "rose" },
};

const UPGRADE_PLANS = [
  { key: "starter",    price: 9,   limit: 50,   maxUsers: 1,  label: "Starter" },
  { key: "pro",        price: 29,  limit: 200,  maxUsers: 1,  label: "Pro" },
  { key: "team",       price: 79,  limit: 500,  maxUsers: 5,  label: "Team" },
  { key: "business",   price: 149, limit: 1500, maxUsers: 10, label: "Business" },
  { key: "enterprise", price: 299, limit: -1,   maxUsers: -1, label: "Enterprise" },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();

  const [activeTab, setActiveTab] = useState<"generate" | "history" | "subscription" | "chat" | "images" | "songs">("generate");
  const [selectedCategory, setSelectedCategory] = useState<string>("social");
  const [selectedType, setSelectedType] = useState<string>("instagram_post");
  const [tone, setTone] = useState<string>("professional");
  const [industry, setIndustry] = useState<string>("general");
  const [genLang, setGenLang] = useState<Lang>("es");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "kobrapay">("stripe");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [generateImage, setGenerateImage] = useState(false);

  // Image generator state
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [imageStyle, setImageStyle] = useState("realistic");

  // Song/jingle generator state
  const [songPrompt, setSongPrompt] = useState("");
  const [songTone, setSongTone] = useState("alegre");
  const [songGenre, setSongGenre] = useState("pop");
  const [songResult, setSongResult] = useState("");

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [voiceTarget, setVoiceTarget] = useState<"prompt" | "chat">("prompt");

  const { exportToPDF, exportToWord } = useExportContent();

  const { data: subscription, refetch: refetchSub } = trpc.subscription.get.useQuery(undefined, { enabled: isAuthenticated });
  const { data: history, refetch: refetchHistory } = trpc.content.history.useQuery({ limit: 50 }, { enabled: isAuthenticated });

  const generateMutation = trpc.content.generate.useMutation({
    onSuccess: (data) => {
      setResult(data.result);
      refetchHistory();
      refetchSub();
    },
    onError: (err) => {
      if (err.message.includes("límite") || err.message.includes("limit")) {
        setShowUpgrade(true);
      } else {
        toast.error(err.message);
      }
    },
  });

  const chatMutation = trpc.content.chat.useMutation({
    onSuccess: (data) => {
      setChatMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      refetchSub();
    },
    onError: (err) => {
      if (err.message.includes("límite") || err.message.includes("limit")) {
        setShowUpgrade(true);
      } else {
        toast.error(err.message);
      }
    },
  });

  const upgradeMutation = trpc.subscription.upgrade.useMutation({
    onSuccess: () => {
      toast.success(language === "es" ? "¡Plan actualizado exitosamente!" : "Plan upgraded successfully!");
      setShowUpgrade(false);
      refetchSub();
    },
    onError: (err) => toast.error(err.message),
  });

  const favoriteMutation = trpc.content.toggleFavorite.useMutation();

  const generateImageMutation = trpc.content.generateStandaloneImage.useMutation({
    onSuccess: (data) => {
      setGeneratedImageUrl(data.imageUrl);
      toast.success(language === "es" ? "¡Imagen generada!" : "Image generated!");
      refetchSub();
    },
    onError: (err) => {
      if (err.message.includes("límite") || err.message.includes("limit")) {
        setShowUpgrade(true);
      } else {
        toast.error(err.message);
      }
    },
  });

  const generateSongMutation = trpc.content.generateSong.useMutation({
    onSuccess: (data) => {
      setSongResult(data.lyrics);
      toast.success(language === "es" ? "¡Canción/jingle generado!" : "Song/jingle generated!");
      refetchSub();
    },
    onError: (err) => {
      if (err.message.includes("límite") || err.message.includes("limit")) {
        setShowUpgrade(true);
      } else {
        toast.error(err.message);
      }
    },
  });

  const transcribeMutation = trpc.content.transcribeVoice.useMutation({
    onSuccess: (data) => {
      if (voiceTarget === "prompt") {
        setPrompt(prev => prev ? prev + " " + data.text : data.text);
        toast.success(language === "es" ? "Voz transcrita al prompt" : "Voice transcribed to prompt");
      } else {
        setChatInput(prev => prev ? prev + " " + data.text : data.text);
        toast.success(language === "es" ? "Voz transcrita al chat" : "Voice transcribed to chat");
      }
      setIsTranscribing(false);
    },
    onError: (err) => {
      toast.error(language === "es" ? "Error al transcribir voz" : "Error transcribing voice");
      setIsTranscribing(false);
    },
  });

  const startRecording = async (target: "prompt" | "chat") => {
    try {
      setVoiceTarget(target);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioBlob.size > 0) {
          setIsTranscribing(true);
          // Convert to base64 and send to server
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            transcribeMutation.mutate({ audioBase64: base64, language: language === "es" ? "es" : "en" });
          };
          reader.readAsDataURL(audioBlob);
        }
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info(language === "es" ? "Grabando... Haz clic en detener" : "Recording... Click stop");
    } catch {
      toast.error(language === "es" ? "No se pudo acceder al micrófono" : "Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const checkoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      toast.success(language === "es" ? "Redirigiendo al pago (USD)..." : "Redirecting to payment (USD)...");
      window.open(data.checkoutUrl, "_blank");
      setShowUpgrade(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const kobraCheckoutMutation = trpc.subscription.createKobraCheckout.useMutation({
    onSuccess: (data) => {
      toast.success(language === "es" ? `Redirigiendo al pago en MXN ($${data.priceMXN} MXN)...` : `Redirecting to MXN payment ($${data.priceMXN} MXN)...`);
      window.open(data.checkoutUrl, "_blank");
      setShowUpgrade(false);
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  const currentCategory = CONTENT_CATEGORIES.find(c => c.id === selectedCategory);
  const currentType = currentCategory?.types.find(t => t.id === selectedType);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error(language === "es" ? "Escribe un tema o descripción" : "Write a topic or description");
      return;
    }
    setResult("");
    generateMutation.mutate({
      type: selectedType,
      prompt,
      language: genLang,
      tone,
      industry,
      generateImage,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success(language === "es" ? "¡Copiado al portapapeles!" : "Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contentai-${selectedType}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(language === "es" ? "¡Archivo descargado!" : "File downloaded!");
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    const newMessages = [...chatMessages, { role: "user" as const, content: userMsg }];
    setChatMessages(newMessages);
    setChatInput("");
    chatMutation.mutate({
      message: userMsg,
      history: chatMessages.slice(-10),
    });
  };

  const plan = subscription?.plan ?? "free";
  const planConfig = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;
  const usage = subscription?.usage ?? 0;
  const limit = subscription?.limit ?? 10;
  const usagePercent = limit === -1 ? 0 : Math.min(100, (usage / limit) * 100);

  const filteredHistory = history?.filter(h =>
    !historySearch || h.prompt.toLowerCase().includes(historySearch.toLowerCase()) || h.type.includes(historySearch.toLowerCase())
  ) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-gray-500">{language === "es" ? "Cargando..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 h-screen sticky top-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png" alt="ContentAI" className="h-14 w-auto" />
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 flex items-center justify-center mx-auto">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/logo-option-b-ddgx8JM6HHoktavsgh37nA.png" alt="ContentAI" className="h-10 w-10 object-contain" />
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors ml-auto"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: "generate", icon: Wand2, label: { es: "Generar Texto", en: "Generate Text" } },
            { id: "images", icon: Image, label: { es: "Generar Imagen", en: "Generate Image" } },
            { id: "songs", icon: Music, label: { es: "Canciones/Jingles", en: "Songs/Jingles" } },
            { id: "chat", icon: MessageSquare, label: { es: "Chat IA", en: "AI Chat" } },
            { id: "history", icon: History, label: { es: "Historial", en: "History" } },
            { id: "subscription", icon: CreditCard, label: { es: "Suscripción", en: "Subscription" } },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label[language as Lang]}</span>}
            </button>
          ))}

          {/* Marketplace de Plantillas */}
          <button
            onClick={() => navigate("/templates")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <Package className="w-4 h-4 flex-shrink-0 text-amber-500" />
            {!sidebarCollapsed && <span>{language === "es" ? "Plantillas" : "Templates"}</span>}
          </button>

          {/* Calendario Editorial */}
          <button
            onClick={() => navigate("/calendar")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <CalendarDays className="w-4 h-4 flex-shrink-0 text-teal-500" />
            {!sidebarCollapsed && <span>{language === "es" ? "Calendario" : "Calendar"}</span>}
          </button>

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{language === "es" ? "Admin" : "Admin"}</span>}
            </button>
          )}
        </nav>

        {/* Plan badge + User */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planConfig.color}`}>
                  {planConfig.name[language as Lang]}
                </span>
                {limit !== -1 && (
                  <span className="text-xs text-gray-400">{usage}/{limit}</span>
                )}
              </div>
              {limit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${usagePercent > 80 ? "bg-red-500" : "bg-blue-500"}`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              )}
              {limit !== -1 && usagePercent > 70 && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="mt-2 w-full text-xs text-blue-600 font-medium hover:underline text-left"
                >
                  {language === "es" ? "Actualizar plan →" : "Upgrade plan →"}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-blue-700">
                {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
              </span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{user?.name ?? user?.email ?? "Usuario"}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title={language === "es" ? "Cerrar sesión" : "Sign out"}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {activeTab === "generate" && (language === "es" ? "Generador de Contenido" : "Content Generator")}
              {activeTab === "chat" && (language === "es" ? "Chat con IA" : "AI Chat")}
              {activeTab === "history" && (language === "es" ? "Historial" : "History")}
              {activeTab === "subscription" && (language === "es" ? "Suscripción" : "Subscription")}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {language === "es"
                ? `Hola, ${user?.name?.split(" ")[0] ?? "usuario"} 👋`
                : `Hello, ${user?.name?.split(" ")[0] ?? "user"} 👋`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === "es" ? "EN" : "ES"}
            </button>
            {plan === "free" && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Crown className="w-3.5 h-3.5" />
                {language === "es" ? "Actualizar" : "Upgrade"}
              </button>
            )}
          </div>
        </header>

        <div className="p-6">
          {/* ── TAB: GENERATE ──────────────────────────────────────────────── */}
          {activeTab === "generate" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left: Category + Type selector */}
              <div className="xl:col-span-1 space-y-4">
                {/* Category selector */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {language === "es" ? "Categoría" : "Category"}
                  </h3>
                  <div className="space-y-1">
                    {CONTENT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedType(cat.types[0].id);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === cat.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <cat.icon className={`w-4 h-4 flex-shrink-0 ${selectedCategory === cat.id ? "text-blue-600" : cat.color}`} />
                        <span className="truncate">{cat.label[language as Lang]}</span>
                        <Badge className="ml-auto text-xs px-1.5 py-0 bg-gray-100 text-gray-500 border-0 font-normal">
                          {cat.types.length}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type selector */}
                {currentCategory && (
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      {language === "es" ? "Tipo de Contenido" : "Content Type"}
                    </h3>
                    <div className="space-y-1">
                      {currentCategory.types.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                            selectedType === type.id
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <type.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="truncate text-sm">{type.label[language as Lang]}</div>
                            <div className="text-xs text-gray-400 truncate">{type.description[language as Lang]}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Center + Right: Generator */}
              <div className="xl:col-span-2 space-y-4">
                {/* Options row */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                        {language === "es" ? "Industria" : "Industry"}
                      </label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="h-9 text-sm border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {INDUSTRIES.map(ind => (
                            <SelectItem key={ind.id} value={ind.id} className="text-sm">
                              {ind.label[language as Lang]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                        {language === "es" ? "Tono" : "Tone"}
                      </label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="h-9 text-sm border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TONES.map(t => (
                            <SelectItem key={t.id} value={t.id} className="text-sm">
                              {t.label[language as Lang]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                        {language === "es" ? "Idioma" : "Language"}
                      </label>
                      <Select value={genLang} onValueChange={(v) => setGenLang(v as Lang)}>
                        <SelectTrigger className="h-9 text-sm border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es" className="text-sm">🇲🇽 Español</SelectItem>
                          <SelectItem value="en" className="text-sm">🇺🇸 English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                        {language === "es" ? "Imagen IA" : "AI Image"}
                      </label>
                      <button
                        onClick={() => setGenerateImage(!generateImage)}
                        className={`w-full h-9 flex items-center justify-center gap-2 rounded-md border text-sm font-medium transition-all ${
                          generateImage
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <Image className="w-3.5 h-3.5" />
                        {generateImage ? (language === "es" ? "Activado" : "On") : (language === "es" ? "Desactivado" : "Off")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Prompt input */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {currentType && <currentType.icon className="w-4 h-4 text-blue-600" />}
                    <h3 className="text-sm font-semibold text-gray-900">
                      {currentType?.label[language as Lang]}
                    </h3>
                    <span className="text-xs text-gray-400 ml-auto">
                      {currentType?.description[language as Lang]}
                    </span>
                  </div>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      language === "es"
                        ? "Describe tu negocio, producto o tema. Ej: 'Joyería en Guadalajara que vende anillos de compromiso para parejas jóvenes'"
                        : "Describe your business, product or topic. E.g: 'Jewelry store in Miami selling engagement rings for young couples'"
                    }
                    className="min-h-[120px] text-sm border-gray-200 resize-none focus:ring-1 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
                    }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {language === "es" ? "Ctrl+Enter para generar" : "Ctrl+Enter to generate"}
                      </span>
                      {/* Botón de micrófono */}
                      <button
                        onClick={() => isRecording && voiceTarget === "prompt" ? stopRecording() : startRecording("prompt")}
                        disabled={isTranscribing || (isRecording && voiceTarget !== "prompt")}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          isRecording && voiceTarget === "prompt"
                            ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                            : isTranscribing && voiceTarget === "prompt"
                            ? "bg-blue-50 border-blue-200 text-blue-600"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                        title={language === "es" ? "Dictar por voz" : "Voice input"}
                      >
                        {isTranscribing && voiceTarget === "prompt" ? (
                          <><Sparkles className="w-3.5 h-3.5 animate-spin" />{language === "es" ? "Transcribiendo..." : "Transcribing..."}</>
                        ) : isRecording && voiceTarget === "prompt" ? (
                          <><StopCircle className="w-3.5 h-3.5" />{language === "es" ? "Detener" : "Stop"}</>
                        ) : (
                          <><Mic className="w-3.5 h-3.5" />{language === "es" ? "Voz" : "Voice"}</>
                        )}
                      </button>
                    </div>
                    <Button
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending || !prompt.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 h-9 rounded-lg"
                    >
                      {generateMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          {language === "es" ? "Generando..." : "Generating..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          {language === "es" ? "Generar" : "Generate"}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Result */}
                {result && (
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        {language === "es" ? "Resultado" : "Result"}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => exportToPDF(result, selectedType.replace(/_/g, " "), language as "es" | "en")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
                          title="Exportar PDF"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          PDF
                        </button>
                        <button
                          onClick={() => exportToWord(result, selectedType.replace(/_/g, " "), language as "es" | "en")}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors border border-blue-200"
                          title="Exportar Word"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Word
                        </button>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? (language === "es" ? "¡Copiado!" : "Copied!") : (language === "es" ? "Copiar" : "Copy")}
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-lg p-4 text-sm leading-relaxed">
                      <Streamdown>{result}</Streamdown>
                    </div>
                  </div>
                )}

                {/* Usage warning */}
                {limit !== -1 && limit - usage <= 1 && limit - usage >= 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        {language === "es"
                          ? `Te queda ${limit - usage} generación este mes`
                          : `You have ${limit - usage} generation left this month`}
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        {language === "es" ? "Actualiza para continuar sin límites" : "Upgrade to continue without limits"}
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowUpgrade(true)}
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                    >
                      {language === "es" ? "Actualizar" : "Upgrade"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: CHAT ──────────────────────────────────────────────────── */}
          {activeTab === "chat" && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-100 flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">ContentAI Assistant</h3>
                    <p className="text-xs text-gray-400">
                      {language === "es" ? "Pregúntame cualquier cosa sobre marketing, negocios o contenido" : "Ask me anything about marketing, business or content"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {language === "es" ? "¿En qué puedo ayudarte?" : "How can I help you?"}
                      </p>
                      <p className="text-xs text-gray-400 max-w-sm">
                        {language === "es"
                          ? "Puedo ayudarte con marketing, estrategia de negocio, redacción de correos, análisis de documentos y mucho más."
                          : "I can help you with marketing, business strategy, email writing, document analysis and much more."}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-sm">
                        {[
                          { es: "¿Cómo promociono mi restaurante?", en: "How do I promote my restaurant?" },
                          { es: "Redacta un correo profesional", en: "Write a professional email" },
                          { es: "¿Qué es el marketing de contenidos?", en: "What is content marketing?" },
                          { es: "Dame ideas para mi negocio", en: "Give me ideas for my business" },
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => setChatInput(suggestion[language as Lang])}
                            className="text-left p-2.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 hover:border-blue-200 transition-all"
                          >
                            {suggestion[language as Lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        ) : msg.content}
                      </div>
                    </div>
                  ))}
                  {chatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mr-2">
                        <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                      </div>
                      <div className="bg-gray-100 rounded-xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
                      placeholder={language === "es" ? "Escribe tu pregunta..." : "Type your question..."}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                    />
                    {/* Botón de micrófono en chat */}
                    <button
                      onClick={() => isRecording && voiceTarget === "chat" ? stopRecording() : startRecording("chat")}
                      disabled={isTranscribing || (isRecording && voiceTarget !== "chat")}
                      className={`px-3 rounded-xl border transition-all ${
                        isRecording && voiceTarget === "chat"
                          ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                      title={language === "es" ? "Dictar por voz" : "Voice input"}
                    >
                      {isTranscribing && voiceTarget === "chat" ? (
                        <Sparkles className="w-4 h-4 animate-spin" />
                      ) : isRecording && voiceTarget === "chat" ? (
                        <StopCircle className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                    <Button
                      onClick={handleChatSend}
                      disabled={chatMutation.isPending || !chatInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: IMAGES ───────────────────────────────────────────────────── */}
          {activeTab === "images" && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{language === "es" ? "Generador de Imágenes IA" : "AI Image Generator"}</h2>
                    <p className="text-xs text-gray-500">{language === "es" ? "Crea imágenes únicas para tu marca" : "Create unique images for your brand"}</p>
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    {language === "es" ? "Describe la imagen que quieres crear" : "Describe the image you want to create"}
                  </label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={3}
                    placeholder={language === "es" ? "Ej: Logo minimalista para café artesanal con colores tierra y café..." : "E.g: Minimalist logo for artisan coffee shop with earth tones..."}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                {/* Style selector */}
                <div className="mb-5">
                  <label className="text-xs font-medium text-gray-500 mb-2 block">{language === "es" ? "Estilo" : "Style"}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "realistic", label: { es: "Fotorrealista", en: "Photorealistic" }, emoji: "📸" },
                      { id: "artistic", label: { es: "Artístico", en: "Artistic" }, emoji: "🎨" },
                      { id: "minimalist", label: { es: "Minimalista", en: "Minimalist" }, emoji: "⬜" },
                      { id: "cartoon", label: { es: "Caricatura", en: "Cartoon" }, emoji: "🎭" },
                      { id: "cinematic", label: { es: "Cinemático", en: "Cinematic" }, emoji: "🎥" },
                      { id: "product", label: { es: "Producto", en: "Product" }, emoji: "📦" },
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setImageStyle(s.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          imageStyle === s.id ? "border-purple-300 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-base block mb-0.5">{s.emoji}</span>
                        {s.label[language as Lang]}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => generateImageMutation.mutate({ prompt: imagePrompt, style: imageStyle })}
                  disabled={generateImageMutation.isPending || !imagePrompt.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl font-semibold"
                >
                  {generateImageMutation.isPending ? (
                    <><Sparkles className="w-4 h-4 mr-2 animate-spin" />{language === "es" ? "Generando imagen (10-20s)..." : "Generating image (10-20s)..."}</>
                  ) : (
                    <><Image className="w-4 h-4 mr-2" />{language === "es" ? "Generar Imagen" : "Generate Image"}</>
                  )}
                </Button>
              </div>

              {/* Result */}
              {generatedImageUrl && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{language === "es" ? "Imagen Generada" : "Generated Image"}</h3>
                    <a
                      href={generatedImageUrl}
                      download="contentai-image.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {language === "es" ? "Descargar" : "Download"}
                    </a>
                  </div>
                  <img
                    src={generatedImageUrl}
                    alt="Generated"
                    className="w-full rounded-xl border border-gray-100 shadow-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* ── TAB: SONGS ────────────────────────────────────────────────────── */}
          {activeTab === "songs" && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center">
                    <Music className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{language === "es" ? "Generador de Canciones y Jingles" : "Song & Jingle Generator"}</h2>
                    <p className="text-xs text-gray-500">{language === "es" ? "Letras originales y pegadizas para tu marca" : "Original catchy lyrics for your brand"}</p>
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    {language === "es" ? "Describe tu negocio o el tema de la canción" : "Describe your business or song topic"}
                  </label>
                  <textarea
                    value={songPrompt}
                    onChange={(e) => setSongPrompt(e.target.value)}
                    rows={3}
                    placeholder={language === "es" ? "Ej: Pizzería artesanal en Guadalajara, especialidad en pizzas napolitanas, ambiente familiar..." : "E.g: Artisan pizzeria in Guadalajara, specialty in Neapolitan pizzas, family atmosphere..."}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  {/* Genre */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">{language === "es" ? "Género Musical" : "Musical Genre"}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "pop", label: "Pop" },
                        { id: "rock", label: "Rock" },
                        { id: "cumbia", label: "Cumbia" },
                        { id: "reggaeton", label: "Reggaetón" },
                        { id: "banda", label: "Banda" },
                        { id: "jingle", label: "Jingle" },
                      ].map(g => (
                        <button
                          key={g.id}
                          onClick={() => setSongGenre(g.id)}
                          className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                            songGenre === g.id ? "border-pink-300 bg-pink-50 text-pink-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">{language === "es" ? "Tono" : "Tone"}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "alegre", label: { es: "Alegre", en: "Happy" } },
                        { id: "emotivo", label: { es: "Emotivo", en: "Emotional" } },
                        { id: "energico", label: { es: "Enérgico", en: "Energetic" } },
                        { id: "romantico", label: { es: "Romántico", en: "Romantic" } },
                        { id: "inspirador", label: { es: "Inspirador", en: "Inspiring" } },
                        { id: "divertido", label: { es: "Divertido", en: "Fun" } },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSongTone(t.id)}
                          className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                            songTone === t.id ? "border-pink-300 bg-pink-50 text-pink-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {t.label[language as Lang]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => generateSongMutation.mutate({ prompt: songPrompt, genre: songGenre, tone: songTone, language: genLang })}
                  disabled={generateSongMutation.isPending || !songPrompt.trim()}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white h-11 rounded-xl font-semibold"
                >
                  {generateSongMutation.isPending ? (
                    <><Sparkles className="w-4 h-4 mr-2 animate-spin" />{language === "es" ? "Componiendo..." : "Composing..."}</>
                  ) : (
                    <><Music className="w-4 h-4 mr-2" />{language === "es" ? "Generar Canción/Jingle" : "Generate Song/Jingle"}</>
                  )}
                </Button>
              </div>

              {/* Result */}
              {songResult && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{language === "es" ? "Tu Canción/Jingle" : "Your Song/Jingle"}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { navigator.clipboard.writeText(songResult); toast.success(language === "es" ? "¡Copiado!" : "Copied!"); }}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {language === "es" ? "Copiar" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
                    {songResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: HISTORY ───────────────────────────────────────────────────── */}
          {activeTab === "history" && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      placeholder={language === "es" ? "Buscar en historial..." : "Search history..."}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                    {filteredHistory.length} {language === "es" ? "resultados" : "results"}
                  </Badge>
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <History className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {language === "es" ? "No hay generaciones aún" : "No generations yet"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {language === "es" ? "Tus contenidos generados aparecerán aquí" : "Your generated content will appear here"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((gen) => (
                    <div key={gen.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-100 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-0 font-medium">
                              {gen.type.replace(/_/g, " ")}
                            </Badge>
                            <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 border-0">
                              {gen.language?.toUpperCase()}
                            </Badge>
                            {gen.industry && gen.industry !== "general" && (
                              <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 border-0">
                                {gen.industry.replace(/_/g, " ")}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">
                              {new Date(gen.createdAt).toLocaleDateString(language === "es" ? "es-MX" : "en-US")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-2">{gen.prompt}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{gen.result.slice(0, 200)}...</p>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(gen.result);
                              toast.success(language === "es" ? "¡Copiado!" : "Copied!");
                            }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => favoriteMutation.mutate({ generationId: gen.id, isFavorite: !gen.isFavorite })}
                            className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${gen.isFavorite ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
                            title={language === "es" ? "Favorito" : "Favorite"}
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => exportToPDF(gen.result, gen.type.replace(/_/g, " "), language as "es" | "en")}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            title="PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => exportToWord(gen.result, gen.type.replace(/_/g, " "), language as "es" | "en")}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Word"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: SUBSCRIPTION ──────────────────────────────────────────── */}
          {activeTab === "subscription" && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Current plan */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {language === "es" ? "Tu Plan Actual" : "Your Current Plan"}
                  </h3>
                  <Badge className={`${planConfig.color} border-0 font-semibold px-3 py-1`}>
                    {planConfig.name[language as Lang]}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{usage}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{language === "es" ? "Usadas" : "Used"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{limit === -1 ? "∞" : limit}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{language === "es" ? "Límite" : "Limit"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">{limit === -1 ? "∞" : Math.max(0, limit - usage)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{language === "es" ? "Restantes" : "Remaining"}</p>
                  </div>
                </div>
                {limit !== -1 && (
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${usagePercent > 80 ? "bg-red-500" : "bg-blue-500"}`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Plans */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  {language === "es" ? "Planes Disponibles" : "Available Plans"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {UPGRADE_PLANS.map((p) => (
                    <div
                      key={p.key}
                      className={`bg-white rounded-xl border p-5 transition-all ${
                        p.key === "pro" ? "border-blue-300 ring-1 ring-blue-200" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {p.key === "pro" && (
                        <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-3">
                          {language === "es" ? "Más Popular" : "Most Popular"}
                        </div>
                      )}
                      <h4 className="font-semibold text-gray-900 text-base">{p.label}</h4>
                      <div className="mt-2 mb-4">
                        <span className="text-3xl font-bold text-gray-900">${p.price}</span>
                        <span className="text-sm text-gray-400">/mes</span>
                      </div>
                      <ul className="space-y-2 mb-4 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {p.limit === -1 ? (language === "es" ? "Generaciones ilimitadas" : "Unlimited generations") : `${p.limit} ${language === "es" ? "generaciones/mes" : "generations/month"}`}
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {p.maxUsers === -1 ? (language === "es" ? "Usuarios ilimitados" : "Unlimited users") : `${p.maxUsers} ${language === "es" ? "usuario(s)" : "user(s)"}`}
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {language === "es" ? "40+ tipos de contenido" : "40+ content types"}
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                          {language === "es" ? "Generación de imágenes IA" : "AI image generation"}
                        </li>
                      </ul>
                      {plan !== p.key ? (
                        <Button
                          onClick={() => { setSelectedPlan(p.key); setShowUpgrade(true); }}
                          className={`w-full text-sm h-9 ${p.key === "pro" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"}`}
                        >
                          {language === "es" ? "Seleccionar" : "Select"}
                        </Button>
                      ) : (
                        <div className="w-full h-9 flex items-center justify-center text-sm text-green-600 font-medium bg-green-50 rounded-lg">
                          <Check className="w-4 h-4 mr-1" />
                          {language === "es" ? "Plan Actual" : "Current Plan"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Modal de Upgrade ─────────────────────────────────────────────────── */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {language === "es" ? "Actualizar Plan" : "Upgrade Plan"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {language === "es" ? "Desbloquea todo el potencial" : "Unlock full potential"}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowUpgrade(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 mb-2 block">
                {language === "es" ? "Selecciona un plan" : "Select a plan"}
              </label>
              <div className="space-y-2">
                {UPGRADE_PLANS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setSelectedPlan(p.key)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                      selectedPlan === p.key ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium text-gray-900">{p.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">
                        {p.limit === -1 ? "∞" : p.limit} {language === "es" ? "gen/mes" : "gen/mo"}
                      </span>
                      <span className="font-bold text-gray-900">${p.price}/mo</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pago con Stripe (USD) */}
            <Button
              onClick={() => checkoutMutation.mutate({
                plan: selectedPlan as "starter" | "pro" | "team" | "business" | "enterprise",
                origin: window.location.origin,
              })}
              disabled={checkoutMutation.isPending || kobraCheckoutMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold"
            >
              {checkoutMutation.isPending
                ? (language === "es" ? "Preparando pago..." : "Preparing payment...")
                : `💳 ${language === "es" ? "Pagar con tarjeta (USD)" : "Pay with card (USD)"} — $${UPGRADE_PLANS.find(p => p.key === selectedPlan)?.price}/mo`}
            </Button>

            {/* Separador */}
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">{language === "es" ? "o paga en pesos" : "or pay in MXN"}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Pago con KobraPay (MXN) */}
            <Button
              onClick={() => kobraCheckoutMutation.mutate({
                plan: selectedPlan as "starter" | "pro" | "team" | "business" | "enterprise",
                origin: window.location.origin,
              })}
              disabled={checkoutMutation.isPending || kobraCheckoutMutation.isPending}
              variant="outline"
              className="w-full h-11 rounded-xl font-semibold border-green-200 text-green-700 hover:bg-green-50 bg-white"
            >
              {kobraCheckoutMutation.isPending
                ? (language === "es" ? "Preparando pago..." : "Preparing payment...")
                : `🇲🇽 ${language === "es" ? "Pagar en MXN (OXXO/SPEI/Tarjeta)" : "Pay in MXN (OXXO/SPEI/Card)"}`}
            </Button>

            <div className="flex items-center gap-2 justify-center mt-3">
              <span className="text-xs text-gray-400">🔒 {language === "es" ? "Pago seguro con Stripe & KobraPay" : "Secure payment by Stripe & KobraPay"}</span>
            </div>
            <p className="text-xs text-gray-400 text-center mt-1">
              {language === "es" ? "Cancela cuando quieras. Sin compromisos." : "Cancel anytime. No commitments."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
