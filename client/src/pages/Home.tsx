import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  Instagram, Twitter, FileText, Mail, Video, Globe,
  Zap, Check, ArrowRight, Star, ChevronDown, Languages,
  BarChart3, Shield, Clock, Sparkles, MessageSquare,
  Building2, Utensils, Dumbbell, Stethoscope, Home as HomeIcon, ShoppingBag,
  Megaphone, Image, Download, Users, Crown, X, TrendingUp,
  Newspaper, Camera, Palette, Coffee, Wine, Hammer, Scissors,
  Heart, BookOpen, Plane, Car, Cpu, Music
} from "lucide-react";
import { useState } from "react";

const INDUSTRIES = [
  { icon: Utensils, label: { es: "Restaurantes & Bares", en: "Restaurants & Bars" }, color: "text-orange-500", bg: "bg-orange-50" },
  { icon: ShoppingBag, label: { es: "Joyería & Moda", en: "Jewelry & Fashion" }, color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Building2, label: { es: "Constructoras", en: "Construction" }, color: "text-gray-500", bg: "bg-gray-50" },
  { icon: Dumbbell, label: { es: "Gimnasios & Fitness", en: "Gyms & Fitness" }, color: "text-green-500", bg: "bg-green-50" },
  { icon: Stethoscope, label: { es: "Clínicas & Salud", en: "Clinics & Health" }, color: "text-blue-500", bg: "bg-blue-50" },
  { icon: HomeIcon, label: { es: "Inmobiliarias", en: "Real Estate" }, color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: Wine, label: { es: "Tequilas & Bebidas", en: "Spirits & Beverages" }, color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Scissors, label: { es: "Spas & Belleza", en: "Spas & Beauty" }, color: "text-purple-500", bg: "bg-purple-50" },
  { icon: Coffee, label: { es: "Cafeterías", en: "Coffee Shops" }, color: "text-yellow-700", bg: "bg-yellow-50" },
  { icon: Hammer, label: { es: "Ferreterías", en: "Hardware Stores" }, color: "text-red-500", bg: "bg-red-50" },
  { icon: Plane, label: { es: "Agencias de Viaje", en: "Travel Agencies" }, color: "text-cyan-500", bg: "bg-cyan-50" },
  { icon: Car, label: { es: "Automotriz", en: "Automotive" }, color: "text-slate-500", bg: "bg-slate-50" },
];

const CONTENT_TYPES = [
  { icon: Instagram, label: { es: "Posts Instagram", en: "Instagram Posts" }, color: "from-pink-500 to-rose-500" },
  { icon: Twitter, label: { es: "Tweets & Hilos", en: "Tweets & Threads" }, color: "from-sky-500 to-blue-500" },
  { icon: Video, label: { es: "Scripts de Reels", en: "Reel Scripts" }, color: "from-purple-500 to-violet-500" },
  { icon: Megaphone, label: { es: "Facebook Ads", en: "Facebook Ads" }, color: "from-blue-600 to-indigo-600" },
  { icon: Newspaper, label: { es: "Notas de Prensa", en: "Press Releases" }, color: "from-gray-600 to-gray-800" },
  { icon: FileText, label: { es: "Artículos de Blog", en: "Blog Articles" }, color: "from-green-500 to-emerald-500" },
  { icon: Mail, label: { es: "Email Marketing", en: "Email Marketing" }, color: "from-orange-500 to-amber-500" },
  { icon: Image, label: { es: "Imágenes con IA", en: "AI Images" }, color: "from-teal-500 to-cyan-500" },
  { icon: Palette, label: { es: "Branding Completo", en: "Full Branding" }, color: "from-rose-500 to-pink-600" },
  { icon: Globe, label: { es: "Copy para Web", en: "Web Copy" }, color: "from-blue-500 to-cyan-500" },
];

const COMPARISON = [
  { feature: { es: "Chat con IA", en: "AI Chat" }, contentai: true, chatgpt: true, jasper: true },
  { feature: { es: "Leer PDFs y contratos", en: "Read PDFs & contracts" }, contentai: true, chatgpt: true, jasper: false },
  { feature: { es: "Especializado por industria", en: "Industry-specialized" }, contentai: true, chatgpt: false, jasper: false },
  { feature: { es: "40+ tipos de contenido", en: "40+ content types" }, contentai: true, chatgpt: false, jasper: true },
  { feature: { es: "Branding completo con IA", en: "Full AI branding" }, contentai: true, chatgpt: false, jasper: false },
  { feature: { es: "Generación de imágenes", en: "Image generation" }, contentai: true, chatgpt: true, jasper: false },
  { feature: { es: "Comerciales desde foto", en: "Ads from product photo" }, contentai: true, chatgpt: false, jasper: false },
  { feature: { es: "Plan de contenido 30 días", en: "30-day content plan" }, contentai: true, chatgpt: false, jasper: false },
  { feature: { es: "Pagos en MXN (KobraPay)", en: "MXN payments (KobraPay)" }, contentai: true, chatgpt: false, jasper: false },
  { feature: { es: "Interfaz en español nativo", en: "Native Spanish interface" }, contentai: true, chatgpt: false, jasper: false },
  { feature: { es: "Plan de equipos", en: "Team plans" }, contentai: true, chatgpt: true, jasper: true },
  { feature: { es: "Precio mensual", en: "Monthly price" }, contentai: "$9", chatgpt: "$20", jasper: "$49" },
];

const TESTIMONIALS = [
  {
    name: "Carlos Mendoza",
    role: { es: "Dueño de Restaurante, CDMX", en: "Restaurant Owner, Mexico City" },
    avatar: "CM",
    color: "bg-orange-100 text-orange-700",
    text: { es: "ContentAI me ahorra 15 horas a la semana. Antes pagaba $8,000 MXN a un community manager, ahora genero todo yo mismo en minutos.", en: "ContentAI saves me 15 hours a week. I used to pay $500 to a community manager, now I generate everything myself in minutes." },
    stars: 5,
  },
  {
    name: "Sofía Ramírez",
    role: { es: "Directora de Marketing, Tequila Artesanal", en: "Marketing Director, Artisan Tequila" },
    avatar: "SR",
    color: "bg-amber-100 text-amber-700",
    text: { es: "Nuestras ventas aumentaron 40% en 3 meses. El contenido que genera para nuestra marca de tequila es exactamente el tono premium que necesitamos.", en: "Our sales increased 40% in 3 months. The content it generates for our tequila brand is exactly the premium tone we need." },
    stars: 5,
  },
  {
    name: "Miguel Torres",
    role: { es: "Agencia de Marketing Digital, Monterrey", en: "Digital Marketing Agency, Monterrey" },
    avatar: "MT",
    color: "bg-blue-100 text-blue-700",
    text: { es: "Manejo 12 clientes con ContentAI. Lo que antes tomaba 3 días ahora lo hago en 2 horas. Mi agencia creció 3x en 6 meses.", en: "I manage 12 clients with ContentAI. What used to take 3 days now takes 2 hours. My agency grew 3x in 6 months." },
    stars: 5,
  },
  {
    name: "Ana Gutiérrez",
    role: { es: "Constructora Inmobiliaria, Guadalajara", en: "Real Estate Developer, Guadalajara" },
    avatar: "AG",
    color: "bg-indigo-100 text-indigo-700",
    text: { es: "Generamos comunicados de prensa, posts y anuncios para nuestros desarrollos en minutos. El ROI es increíble comparado con una agencia tradicional.", en: "We generate press releases, posts and ads for our developments in minutes. The ROI is incredible compared to a traditional agency." },
    stars: 5,
  },
];

const PLANS = [
  {
    key: "free",
    name: { es: "Gratis", en: "Free" },
    price: 0,
    period: { es: "/mes", en: "/mo" },
    limit: { es: "5 generaciones/mes", en: "5 generations/month" },
    users: { es: "1 usuario", en: "1 user" },
    popular: false,
    color: "border-gray-200",
    btnClass: "bg-gray-900 hover:bg-gray-800 text-white",
    features: {
      es: ["5 generaciones al mes", "Chat con IA básico", "Español e Inglés", "Historial de 7 días"],
      en: ["5 generations per month", "Basic AI chat", "Spanish and English", "7-day history"],
    },
  },
  {
    key: "pro",
    name: { es: "Pro", en: "Pro" },
    price: 9,
    period: { es: "/mes", en: "/mo" },
    limit: { es: "100 generaciones/mes", en: "100 generations/month" },
    users: { es: "1 usuario", en: "1 user" },
    popular: true,
    color: "border-blue-500",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
    features: {
      es: ["100 generaciones al mes", "40+ tipos de contenido", "Generación de imágenes IA", "Chat IA ilimitado", "Exportar PDF y Word", "Historial completo"],
      en: ["100 generations per month", "40+ content types", "AI image generation", "Unlimited AI chat", "Export PDF and Word", "Full history"],
    },
  },
  {
    key: "professional",
    name: { es: "Profesional", en: "Professional" },
    price: 29,
    period: { es: "/mes", en: "/mo" },
    limit: { es: "Generaciones ilimitadas", en: "Unlimited generations" },
    users: { es: "3 usuarios", en: "3 users" },
    popular: false,
    color: "border-gray-200",
    btnClass: "bg-gray-900 hover:bg-gray-800 text-white",
    features: {
      es: ["Generaciones ilimitadas", "3 usuarios del equipo", "Branding completo con IA", "Plan de contenido 30 días", "Análisis de negocio IA", "Soporte prioritario"],
      en: ["Unlimited generations", "3 team users", "Full AI branding", "30-day content plan", "AI business analysis", "Priority support"],
    },
  },
  {
    key: "enterprise",
    name: { es: "Empresarial", en: "Enterprise" },
    price: 99,
    period: { es: "/mes", en: "/mo" },
    limit: { es: "Generaciones ilimitadas", en: "Unlimited generations" },
    users: { es: "Usuarios ilimitados", en: "Unlimited users" },
    popular: false,
    color: "border-gray-200",
    btnClass: "bg-gray-900 hover:bg-gray-800 text-white",
    features: {
      es: ["Todo lo de Profesional", "Usuarios ilimitados", "API access", "Manager dedicado", "Onboarding personalizado", "SLA garantizado"],
      en: ["Everything in Professional", "Unlimited users", "API access", "Dedicated manager", "Custom onboarding", "Guaranteed SLA"],
    },
  },
];

const FAQS_ES = [
  { q: "¿Cómo funciona ContentAI?", a: "ContentAI usa inteligencia artificial avanzada para generar contenido de alta calidad en segundos. Describes tu negocio o tema, eliges el tipo de contenido (post, anuncio, artículo, etc.), seleccionas tu industria y la IA genera contenido profesional personalizado para ti." },
  { q: "¿Necesito conocimientos técnicos para usarlo?", a: "No. ContentAI está diseñado para ser tan fácil como WhatsApp. Si puedes escribir un mensaje, puedes usar ContentAI. No necesitas saber de marketing ni programación." },
  { q: "¿Puedo cancelar mi suscripción en cualquier momento?", a: "Sí, puedes cancelar en cualquier momento desde tu dashboard. No hay contratos ni penalizaciones. Si cancelas, mantienes acceso hasta el final del período pagado." },
  { q: "¿El contenido generado es único y original?", a: "Sí, cada generación produce contenido 100% único. La IA crea contenido nuevo cada vez basándose en tu prompt específico. No hay plantillas fijas ni contenido repetido." },
  { q: "¿Funciona para mi tipo de negocio?", a: "ContentAI está especializado en 20+ industrias: restaurantes, bares, joyerías, constructoras, tequilas, gimnasios, clínicas, spas, inmobiliarias, cafeterías, ferreterías, agencias de viaje y muchas más. Si tu industria no está en la lista, el modo general funciona perfectamente." },
  { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos Stripe (tarjetas de crédito/débito internacionales, Visa, Mastercard, Amex) y KobraPay (OXXO, transferencias SPEI, tarjetas mexicanas). Puedes pagar en MXN o USD." },
  { q: "¿Puedo usar ContentAI desde cualquier país?", a: "Sí, ContentAI funciona desde cualquier país del mundo. La plataforma está disponible en español e inglés, con planes de agregar portugués próximamente." },
  { q: "¿Puedo compartir mi cuenta con mi equipo?", a: "Sí. El plan Profesional incluye 3 usuarios y el plan Empresarial incluye usuarios ilimitados. Cada miembro del equipo tiene su propio acceso y el uso se comparte entre todos." },
];

const FAQS_EN = [
  { q: "How does ContentAI work?", a: "ContentAI uses advanced artificial intelligence to generate high-quality content in seconds. You describe your business or topic, choose the content type (post, ad, article, etc.), select your industry and the AI generates professional content personalized for you." },
  { q: "Do I need technical knowledge to use it?", a: "No. ContentAI is designed to be as easy as WhatsApp. If you can write a message, you can use ContentAI. You don't need to know marketing or programming." },
  { q: "Can I cancel my subscription at any time?", a: "Yes, you can cancel at any time from your dashboard. No contracts or penalties. If you cancel, you keep access until the end of the paid period." },
  { q: "Is the generated content unique and original?", a: "Yes, each generation produces 100% unique content. The AI creates new content each time based on your specific prompt. No fixed templates or repeated content." },
  { q: "Does it work for my type of business?", a: "ContentAI is specialized in 20+ industries: restaurants, bars, jewelry, construction, spirits, gyms, clinics, spas, real estate, coffee shops, hardware stores, travel agencies and many more." },
  { q: "What payment methods do you accept?", a: "We accept Stripe (international credit/debit cards, Visa, Mastercard, Amex) and KobraPay (OXXO, SPEI transfers, Mexican cards). You can pay in MXN or USD." },
  { q: "Can I use ContentAI from any country?", a: "Yes, ContentAI works from any country in the world. The platform is available in Spanish and English, with plans to add Portuguese soon." },
  { q: "Can I share my account with my team?", a: "Yes. The Professional plan includes 3 users and the Enterprise plan includes unlimited users. Each team member has their own access and usage is shared among all." },
];

type Lang = "es" | "en";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = language === "es" ? FAQS_ES : FAQS_EN;
  const lang = language as Lang;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png" alt="ContentAI" className="h-24 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{language === "es" ? "Funciones" : "Features"}</a>
            <a href="#industries" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{language === "es" ? "Industrias" : "Industries"}</a>
            <a href="#compare" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{language === "es" ? "Comparar" : "Compare"}</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{language === "es" ? "Precios" : "Pricing"}</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === "es" ? "EN" : "ES"}
            </button>
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4">
                {language === "es" ? "Dashboard" : "Dashboard"}
              </Button>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  {language === "es" ? "Iniciar sesión" : "Sign in"}
                </button>
                <Button size="sm" onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4">
                  {language === "es" ? "Empezar gratis" : "Start free"}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white" />
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          {/* Logo centrado en el hero */}
          <div className="flex justify-center mb-6">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png"
              alt="ContentAI"
              className="h-28 w-auto drop-shadow-lg"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {language === "es" ? "La plataforma de IA #1 para tu negocio" : "The #1 AI platform for your business"}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-[1.05] tracking-tight">
            {language === "es" ? (
              <>Tu agencia de marketing<br /><span className="text-blue-600">con inteligencia artificial</span></>
            ) : (
              <>Your marketing agency<br /><span className="text-blue-600">powered by AI</span></>
            )}
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            {language === "es"
              ? "Genera posts, anuncios, artículos, branding y comerciales en segundos. Especializado para 20+ industrias. Sin agencia, sin diseñador, sin esperar."
              : "Generate posts, ads, articles, branding and commercials in seconds. Specialized for 20+ industries. No agency, no designer, no waiting."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 h-12 rounded-xl shadow-lg shadow-blue-200/50">
                {language === "es" ? "Ir al Dashboard" : "Go to Dashboard"} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 h-12 rounded-xl shadow-lg shadow-blue-200/50">
                {language === "es" ? "Empezar gratis" : "Start for free"} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
            <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 rounded-xl border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600">
              <a href="#features">{language === "es" ? "Ver cómo funciona" : "See how it works"}</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12">
            {[
              { value: "40+", label: language === "es" ? "Tipos de contenido" : "Content types" },
              { value: "20+", label: language === "es" ? "Industrias" : "Industries" },
              { value: "2", label: language === "es" ? "Idiomas" : "Languages" },
              { value: "24/7", label: language === "es" ? "Disponible siempre" : "Always available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content type cards */}
        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-5 gap-3">
          {CONTENT_TYPES.slice(0, 5).map((item) => (
            <div key={item.label.es} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-700">{item.label[lang]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-100 text-sm">
              {language === "es" ? "Funciones" : "Features"}
            </Badge>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              {language === "es" ? "Todo lo que necesitas para crecer" : "Everything you need to grow"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {language === "es"
                ? "No es solo un generador de texto. Es tu equipo completo de marketing con IA."
                : "It's not just a text generator. It's your complete AI marketing team."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles, color: "bg-blue-600",
                title: { es: "Generador de Contenido", en: "Content Generator" },
                desc: { es: "40+ tipos: posts, reels, anuncios, artículos, emails, scripts, notas de prensa y más. Listo para publicar.", en: "40+ types: posts, reels, ads, articles, emails, scripts, press releases and more. Ready to publish." },
              },
              {
                icon: MessageSquare, color: "bg-indigo-600",
                title: { es: "Chat IA General", en: "General AI Chat" },
                desc: { es: "Pregunta cualquier cosa: estrategia, marketing, contratos, nutrición, psicología de negocios. Como ChatGPT pero especializado.", en: "Ask anything: strategy, marketing, contracts, nutrition, business psychology. Like ChatGPT but specialized." },
              },
              {
                icon: Camera, color: "bg-pink-600",
                title: { es: "Comerciales desde Foto", en: "Ads from Photo" },
                desc: { es: "Sube foto de tu producto y la IA genera el script del comercial, el anuncio de Facebook y el Reel de Instagram.", en: "Upload a product photo and AI generates the commercial script, Facebook ad and Instagram Reel." },
              },
              {
                icon: Palette, color: "bg-purple-600",
                title: { es: "Branding Completo", en: "Full Branding" },
                desc: { es: "Logo, colores, slogan, misión, visión y manual de marca generados por IA. Tu identidad corporativa en minutos.", en: "Logo, colors, slogan, mission, vision and brand manual generated by AI. Your corporate identity in minutes." },
              },
              {
                icon: TrendingUp, color: "bg-green-600",
                title: { es: "Plan de Contenido 30 Días", en: "30-Day Content Plan" },
                desc: { es: "Describe tu negocio y la IA genera un plan completo de contenido para 30 días con posts, reels y anuncios.", en: "Describe your business and AI generates a complete 30-day content plan with posts, reels and ads." },
              },
              {
                icon: Image, color: "bg-teal-600",
                title: { es: "Generación de Imágenes IA", en: "AI Image Generation" },
                desc: { es: "Genera imágenes profesionales para tus posts, anuncios y branding. Sin Photoshop, sin diseñador.", en: "Generate professional images for your posts, ads and branding. No Photoshop, no designer." },
              },
              {
                icon: FileText, color: "bg-orange-600",
                title: { es: "Lector de Documentos", en: "Document Reader" },
                desc: { es: "Sube PDFs, contratos o documentos y la IA los analiza, resume y da su opinión experta.", en: "Upload PDFs, contracts or documents and AI analyzes them, summarizes and gives expert opinion." },
              },
              {
                icon: Download, color: "bg-red-600",
                title: { es: "Exportar PDF y Word", en: "Export PDF & Word" },
                desc: { es: "Descarga todo tu contenido en PDF profesional o Word. Listo para imprimir o compartir con clientes.", en: "Download all your content in professional PDF or Word. Ready to print or share with clients." },
              },
              {
                icon: Users, color: "bg-slate-600",
                title: { es: "Plan de Equipos", en: "Team Plans" },
                desc: { es: "Hasta usuarios ilimitados en el plan Empresarial. Perfecto para agencias y equipos de marketing.", en: "Up to unlimited users on the Enterprise plan. Perfect for agencies and marketing teams." },
              },
            ].map((feat) => (
              <div key={feat.title.es} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all group">
                <div className={`w-11 h-11 rounded-xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feat.title[lang]}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ─────────────────────────────────────────────────────── */}
      <section id="industries" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-50 text-green-700 border-green-100 text-sm">
              {language === "es" ? "Industrias" : "Industries"}
            </Badge>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              {language === "es" ? "Especializado para tu negocio" : "Specialized for your business"}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {language === "es"
                ? "ContentAI conoce tu industria. Genera contenido con el tono, vocabulario y estilo específico de tu sector."
                : "ContentAI knows your industry. Generates content with the specific tone, vocabulary and style of your sector."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {INDUSTRIES.map((ind) => (
              <div key={ind.label.es} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-default group">
                <div className={`w-10 h-10 rounded-xl ${ind.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <ind.icon className={`w-5 h-5 ${ind.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{ind.label[lang]}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {language === "es" ? "+ Moda, Educación, Tecnología, Música, Veterinaria y muchas más" : "+ Fashion, Education, Technology, Music, Veterinary and many more"}
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section id="how" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-50 text-purple-700 border-purple-100 text-sm">
              {language === "es" ? "Cómo funciona" : "How it works"}
            </Badge>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              {language === "es" ? "En 3 pasos, listo para publicar" : "In 3 steps, ready to publish"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                icon: Building2,
                title: { es: "Describe tu negocio", en: "Describe your business" },
                desc: { es: "Escribe 2-3 oraciones sobre tu negocio. ContentAI detecta tu industria, público objetivo y tono ideal automáticamente.", en: "Write 2-3 sentences about your business. ContentAI detects your industry, target audience and ideal tone automatically." },
              },
              {
                num: "02",
                icon: Sparkles,
                title: { es: "Elige el tipo de contenido", en: "Choose content type" },
                desc: { es: "Selecciona entre 40+ tipos: post de Instagram, anuncio de Facebook, artículo de blog, email, script de video y más.", en: "Select from 40+ types: Instagram post, Facebook ad, blog article, email, video script and more." },
              },
              {
                num: "03",
                icon: ArrowRight,
                title: { es: "Genera y publica", en: "Generate and publish" },
                desc: { es: "La IA genera contenido profesional en segundos. Cópialo, descárgalo o compártelo directamente. Sin editar nada.", en: "AI generates professional content in seconds. Copy it, download it or share it directly. No editing needed." },
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
                  <div className="text-5xl font-black text-blue-100 mb-4">{step.num}</div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title[lang]}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc[lang]}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 z-10 w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ───────────────────────────────────────────────── */}
      <section id="compare" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-50 text-amber-700 border-amber-100 text-sm">
              {language === "es" ? "Comparativa" : "Comparison"}
            </Badge>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              {language === "es" ? "ContentAI vs la competencia" : "ContentAI vs the competition"}
            </h2>
            <p className="text-lg text-gray-500">
              {language === "es" ? "Más funciones, mejor precio, en tu idioma." : "More features, better price, in your language."}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 w-1/2">{language === "es" ? "Función" : "Feature"}</th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center mb-1">
                        <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png" alt="ContentAI" className="h-7 w-auto" />
                      </div>
                      <span className="text-sm font-bold text-blue-600">ContentAI</span>
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">ChatGPT</span>
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center mb-1">
                        <FileText className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">Jasper AI</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="p-4 text-sm text-gray-700">{row.feature[lang]}</td>
                    <td className="p-4 text-center">
                      {typeof row.contentai === "boolean" ? (
                        row.contentai ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-sm font-bold text-blue-600">{row.contentai}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.chatgpt === "boolean" ? (
                        row.chatgpt ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-sm font-semibold text-gray-500">{row.chatgpt}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.jasper === "boolean" ? (
                        row.jasper ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-sm font-semibold text-gray-500">{row.jasper}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-rose-50 text-rose-700 border-rose-100 text-sm">
              {language === "es" ? "Testimonios" : "Testimonials"}
            </Badge>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              {language === "es" ? "Lo que dicen nuestros clientes" : "What our customers say"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.text[lang]}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role[lang]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-100 text-sm">
              {language === "es" ? "Precios" : "Pricing"}
            </Badge>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              {language === "es" ? "Planes para cada negocio" : "Plans for every business"}
            </h2>
            <p className="text-lg text-gray-500">
              {language === "es" ? "Empieza gratis. Escala cuando lo necesites." : "Start free. Scale when you need it."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.key}
                className={`relative rounded-2xl border-2 p-6 flex flex-col ${plan.color} ${plan.popular ? "shadow-lg shadow-blue-100" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {language === "es" ? "Más Popular" : "Most Popular"}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name[lang]}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                    <span className="text-sm text-gray-400">{plan.period[lang]}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{plan.limit[lang]}</p>
                  <p className="text-xs text-gray-400">{plan.users[lang]}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features[lang].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button onClick={() => navigate("/register")} className={`w-full h-10 rounded-xl text-sm font-semibold ${plan.btnClass}`}>
                  {plan.price === 0
                    ? (language === "es" ? "Empezar gratis" : "Start free")
                    : (language === "es" ? "Seleccionar plan" : "Select plan")}
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            {language === "es"
              ? "Acepta Stripe (tarjetas internacionales) y KobraPay (OXXO, SPEI, tarjetas mexicanas)"
              : "Accepts Stripe (international cards) and KobraPay (OXXO, SPEI, Mexican cards)"}
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gray-100 text-gray-700 border-gray-200 text-sm">FAQ</Badge>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              {language === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            {language === "es" ? "¿Listo para hacer crecer tu negocio?" : "Ready to grow your business?"}
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            {language === "es"
              ? "Únete a miles de negocios que ya usan ContentAI para generar contenido profesional en segundos."
              : "Join thousands of businesses already using ContentAI to generate professional content in seconds."}
          </p>
          <Button size="lg" onClick={() => navigate("/register")} className="bg-white text-blue-600 hover:bg-blue-50 text-base px-10 h-12 rounded-xl font-bold shadow-lg">
            {language === "es" ? "Empezar gratis ahora" : "Start free now"} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <p className="text-blue-200 text-sm mt-4">
            {language === "es" ? "Sin tarjeta de crédito. Sin compromisos." : "No credit card. No commitments."}
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png" alt="ContentAI" className="h-8 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                {language === "es"
                  ? "La plataforma de IA para marketing y branding. Genera contenido profesional en segundos."
                  : "The AI platform for marketing and branding. Generate professional content in seconds."}
              </p>
              <p className="text-xs mt-4">support@contentai.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{language === "es" ? "Producto" : "Product"}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">{language === "es" ? "Funciones" : "Features"}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{language === "es" ? "Precios" : "Pricing"}</a></li>
                <li><a href="/demo" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="/agency" className="hover:text-white transition-colors">{language === "es" ? "Para Agencias" : "For Agencies"}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">{language === "es" ? "Legal" : "Legal"}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/terms" className="hover:text-white transition-colors">{language === "es" ? "Términos de Uso" : "Terms of Use"}</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">{language === "es" ? "Privacidad" : "Privacy"}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2026 ContentAI. {language === "es" ? "Todos los derechos reservados." : "All rights reserved."}</p>
            <div className="flex items-center gap-4 text-xs">
              <span>🇲🇽 México</span>
              <span>🌎 Latinoamérica</span>
              <span>🌍 {language === "es" ? "Mundo" : "World"}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
