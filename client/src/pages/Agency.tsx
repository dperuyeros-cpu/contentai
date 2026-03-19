import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import {
  ArrowLeft, Sparkles, CheckCircle2, Building2, Newspaper,
  Globe, Mail, MessageSquare, Zap, Crown, ArrowRight, Star
} from "lucide-react";

export default function Agency() {
  const { language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();
  const t = (es: string, en: string) => language === "es" ? es : en;

  const services = [
    {
      icon: Newspaper,
      color: "text-red-500",
      bg: "bg-red-50",
      title: { es: "Notas de Noticias", en: "News Articles" },
      desc: { es: "Notas periodísticas profesionales listas para publicar. Ideales para noticieros, portales de noticias y medios digitales.", en: "Professional news articles ready to publish. Ideal for news channels, news portals and digital media." },
      price: { es: "Desde $299/mes", en: "From $299/month" },
      features: {
        es: ["10 notas de noticias/mes", "Formato periodístico profesional", "Revisión y edición incluida", "Entrega en 24 horas"],
        en: ["10 news articles/month", "Professional journalistic format", "Review and editing included", "Delivery in 24 hours"],
      },
    },
    {
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-50",
      title: { es: "Páginas Web (Copy)", en: "Web Pages (Copy)" },
      desc: { es: "Textos completos y persuasivos para landing pages, páginas de servicios, páginas de ventas y sitios corporativos.", en: "Complete and persuasive texts for landing pages, service pages, sales pages and corporate sites." },
      price: { es: "Desde $499/proyecto", en: "From $499/project" },
      features: {
        es: ["Copy completo para toda la página", "SEO optimizado", "Llamadas a la acción efectivas", "Revisiones ilimitadas"],
        en: ["Complete copy for the entire page", "SEO optimized", "Effective calls to action", "Unlimited revisions"],
      },
    },
    {
      icon: Building2,
      color: "text-purple-500",
      bg: "bg-purple-50",
      title: { es: "Comunicados de Prensa", en: "Press Releases" },
      desc: { es: "Comunicados de prensa profesionales para lanzamientos de productos, eventos corporativos y anuncios importantes.", en: "Professional press releases for product launches, corporate events and important announcements." },
      price: { es: "Desde $199/comunicado", en: "From $199/release" },
      features: {
        es: ["Formato AP/Reuters", "Distribución a medios incluida", "Versión en español e inglés", "Entrega en 48 horas"],
        en: ["AP/Reuters format", "Media distribution included", "Spanish and English version", "Delivery in 48 hours"],
      },
    },
    {
      icon: Mail,
      color: "text-orange-500",
      bg: "bg-orange-50",
      title: { es: "Gestión de Redes Sociales", en: "Social Media Management" },
      desc: { es: "Generamos y gestionamos todo tu contenido de redes sociales: Instagram, Twitter/X, LinkedIn y Facebook.", en: "We generate and manage all your social media content: Instagram, Twitter/X, LinkedIn and Facebook." },
      price: { es: "Desde $799/mes", en: "From $799/month" },
      features: {
        es: ["30 posts/mes", "Calendario editorial", "Diseño de imágenes", "Reporte mensual de resultados"],
        en: ["30 posts/month", "Editorial calendar", "Image design", "Monthly results report"],
      },
    },
    {
      icon: MessageSquare,
      color: "text-green-500",
      bg: "bg-green-50",
      title: { es: "Newsletter Mensual", en: "Monthly Newsletter" },
      desc: { es: "Boletines informativos profesionales para mantener a tu audiencia informada y comprometida con tu marca.", en: "Professional informational newsletters to keep your audience informed and engaged with your brand." },
      price: { es: "Desde $399/mes", en: "From $399/month" },
      features: {
        es: ["4 newsletters/mes", "Diseño profesional", "Segmentación de audiencia", "Análisis de apertura"],
        en: ["4 newsletters/month", "Professional design", "Audience segmentation", "Open rate analysis"],
      },
    },
    {
      icon: Crown,
      color: "text-amber-500",
      bg: "bg-amber-50",
      title: { es: "Plan Agencia Completo", en: "Full Agency Plan" },
      desc: { es: "Todo incluido: redes sociales, noticias, comunicados, newsletters y páginas web. La solución completa para empresas.", en: "Everything included: social media, news, press releases, newsletters and web pages. The complete solution for businesses." },
      price: { es: "Desde $1,999/mes", en: "From $1,999/month" },
      features: {
        es: ["Todo lo anterior incluido", "Gerente de cuenta dedicado", "Reunión semanal de estrategia", "Soporte prioritario 24/7"],
        en: ["Everything above included", "Dedicated account manager", "Weekly strategy meeting", "Priority 24/7 support"],
      },
    },
  ];

  const mediaClients = [
    { es: "Portales de noticias digitales", en: "Digital news portals" },
    { es: "Canales de televisión y radio", en: "TV and radio channels" },
    { es: "Revistas y periódicos online", en: "Online magazines and newspapers" },
    { es: "Agencias de relaciones públicas", en: "Public relations agencies" },
    { es: "Empresas y corporativos", en: "Companies and corporations" },
    { es: "Startups y emprendedores", en: "Startups and entrepreneurs" },
    { es: "Agencias de marketing digital", en: "Digital marketing agencies" },
    { es: "Influencers y creadores de contenido", en: "Influencers and content creators" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              {t("Inicio", "Home")}
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png"
                alt="ContentAI"
                className="h-12 w-auto"
              />
              <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 bg-purple-50">Agencia</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLanguage(language === "es" ? "en" : "es")} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all">
              {language === "es" ? "EN" : "ES"}
            </button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 rounded-xl" onClick={() => navigate("/register")}>
              {t("Empezar", "Get Started")}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-0 px-4 py-2 text-sm">
            <Building2 className="w-4 h-4 mr-2" />
            {t("Servicios para Empresas y Medios", "Services for Businesses and Media")}
          </Badge>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {t(
              "Contenido profesional para tu empresa o medio de comunicación",
              "Professional content for your business or media outlet"
            )}
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            {t(
              "Generamos notas de noticias, comunicados de prensa, páginas web, newsletters y gestión completa de redes sociales con IA de última generación.",
              "We generate news articles, press releases, web pages, newsletters and complete social media management with cutting-edge AI."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 border-0 font-bold rounded-xl px-8" onClick={() => window.open("mailto:support@contentai.com?subject=Servicios de Agencia ContentAI")}>
              <Mail className="w-5 h-5 mr-2" />
              {t("Contactar Ahora", "Contact Now")}
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8" onClick={() => navigate("/demo")}>
              {t("Ver Demo", "See Demo")}
            </Button>
          </div>
        </div>
      </section>

      {/* ¿Para quién es? */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("¿Para quién es ContentAI Agencia?", "Who is ContentAI Agency for?")}</h2>
            <p className="text-gray-500">{t("Trabajamos con todo tipo de organizaciones que necesitan contenido de calidad", "We work with all types of organizations that need quality content")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {mediaClients.map((client, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{client[language]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("Nuestros Servicios", "Our Services")}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t(
                "Desde notas de noticias para medios hasta gestión completa de redes sociales para empresas.",
                "From news articles for media outlets to complete social media management for businesses."
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-100 transition-all">
                <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title[language]}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{service.desc[language]}</p>
                <div className="space-y-2 mb-5">
                  {service.features[language].map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-bold text-blue-600">{service.price[language]}</span>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={() => window.open(`mailto:support@contentai.com?subject=${service.title[language]}`)}>
                    {t("Cotizar", "Quote")}
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("Lo que dicen nuestros clientes", "What our clients say")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Carlos Mendoza",
                role: { es: "Director Editorial, Noticias MX", en: "Editorial Director, Noticias MX" },
                text: { es: "ContentAI nos ayuda a publicar 3x más noticias al día sin aumentar nuestro equipo. La calidad es excelente.", en: "ContentAI helps us publish 3x more news per day without increasing our team. The quality is excellent." },
              },
              {
                name: "María González",
                role: { es: "CEO, Agencia Digital Pro", en: "CEO, Digital Agency Pro" },
                text: { es: "Usamos ContentAI para todos nuestros clientes. Ahorramos 40 horas semanales en creación de contenido.", en: "We use ContentAI for all our clients. We save 40 hours per week in content creation." },
              },
              {
                name: "Roberto Silva",
                role: { es: "Fundador, StartupMX", en: "Founder, StartupMX" },
                text: { es: "Los comunicados de prensa que genera ContentAI son tan buenos que los medios los publican sin modificaciones.", en: "The press releases ContentAI generates are so good that media outlets publish them without modifications." },
              },
            ].map((t_item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-gray-700 mb-4 italic">"{t_item.text[language]}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t_item.name}</p>
                  <p className="text-xs text-gray-500">{t_item.role[language]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-10 text-center text-white">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">{t("¿Listo para escalar tu contenido?", "Ready to scale your content?")}</h2>
          <p className="text-blue-200 mb-6">
            {t(
              "Contáctanos hoy y recibe una propuesta personalizada para tu empresa o medio de comunicación.",
              "Contact us today and receive a personalized proposal for your company or media outlet."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 border-0 font-bold rounded-xl px-8" onClick={() => window.open("mailto:support@contentai.com?subject=Quiero información sobre los servicios de agencia")}>
              <Mail className="w-5 h-5 mr-2" />
              support@contentai.com
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8" onClick={() => navigate("/register")}>
              {t("Probar la plataforma", "Try the platform")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
