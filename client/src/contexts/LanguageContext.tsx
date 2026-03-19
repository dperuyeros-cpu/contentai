import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

const translations = {
  es: {
    // Nav
    nav_features: "Características",
    nav_pricing: "Precios",
    nav_howItWorks: "Cómo funciona",
    nav_login: "Iniciar sesión",
    nav_dashboard: "Dashboard",
    nav_logout: "Cerrar sesión",
    nav_admin: "Admin",

    // Hero
    hero_badge: "✨ Impulsado por Inteligencia Artificial",
    hero_title: "Genera contenido increíble en",
    hero_title_highlight: "segundos",
    hero_subtitle: "Crea posts de Instagram, tweets, artículos de blog, emails y scripts de video automáticamente con IA. Sin esfuerzo, sin bloqueos creativos.",
    hero_cta_primary: "Empezar gratis",
    hero_cta_secondary: "Ver demo",
    hero_stat1: "Tipos de contenido",
    hero_stat2: "Idiomas",
    hero_stat3: "Siempre disponible",

    // Features
    features_title: "Todo lo que necesitas para crear contenido",
    features_subtitle: "Una plataforma completa para generar contenido de alta calidad con inteligencia artificial",
    feature1_title: "Posts de Instagram",
    feature1_desc: "Captions atractivos, hashtags optimizados y llamadas a la acción que convierten seguidores en clientes.",
    feature2_title: "Hilos de Twitter/X",
    feature2_desc: "Hilos virales de 5 tweets con estructura perfecta para maximizar el alcance y engagement.",
    feature3_title: "Artículos de Blog",
    feature3_desc: "Artículos SEO optimizados con estructura profesional que posicionan tu marca como experta.",
    feature4_title: "Emails de Marketing",
    feature4_desc: "Emails persuasivos con asuntos irresistibles, cuerpo convincente y CTAs que generan conversiones.",
    feature5_title: "Scripts de Video",
    feature5_desc: "Guiones completos para YouTube con gancho inicial, desarrollo y cierre que retienen a la audiencia.",
    feature6_title: "Bilingüe",
    feature6_desc: "Genera contenido en español e inglés para alcanzar audiencias globales sin barreras idiomáticas.",

    // How it works
    how_title: "¿Cómo funciona?",
    how_subtitle: "En 3 simples pasos tienes contenido listo para publicar",
    step1_title: "Elige el tipo",
    step1_desc: "Selecciona qué tipo de contenido necesitas: Instagram, Twitter, Blog, Email o Video.",
    step2_title: "Describe tu idea",
    step2_desc: "Escribe el tema o idea principal. La IA entiende el contexto y genera contenido relevante.",
    step3_title: "Copia y publica",
    step3_desc: "Obtén tu contenido listo en segundos. Cópialo, ajústalo si quieres y publícalo.",

    // Pricing
    pricing_title: "Planes para cada necesidad",
    pricing_subtitle: "Empieza gratis y escala cuando lo necesites",
    plan_free: "Gratis",
    plan_pro: "Pro",
    plan_professional: "Profesional",
    plan_enterprise: "Empresarial",
    plan_month: "/mes",
    plan_popular: "Más popular",
    plan_cta_free: "Empezar gratis",
    plan_cta_paid: "Comenzar ahora",
    plan_feature_generations: "generaciones/mes",
    plan_feature_unlimited: "Generaciones ilimitadas",
    plan_feature_types: "Todos los tipos de contenido",
    plan_feature_languages: "Español e inglés",
    plan_feature_history: "Historial de generaciones",
    plan_feature_priority: "Generación prioritaria",
    plan_feature_support: "Soporte dedicado",
    plan_feature_api: "Acceso API (próximamente)",

    // Dashboard
    dash_welcome: "Bienvenido",
    dash_generate: "Generar contenido",
    dash_history: "Historial",
    dash_subscription: "Suscripción",
    dash_usage: "Uso este mes",
    dash_of: "de",
    dash_unlimited: "Ilimitado",
    dash_upgrade: "Actualizar plan",
    dash_content_type: "Tipo de contenido",
    dash_tone: "Tono",
    dash_language: "Idioma",
    dash_prompt: "Describe tu tema",
    dash_prompt_placeholder: "Ej: Beneficios del ejercicio matutino para emprendedores",
    dash_generate_btn: "Generar",
    dash_generating: "Generando...",
    dash_result: "Resultado",
    dash_copy: "Copiar",
    dash_copied: "¡Copiado!",
    dash_new: "Nuevo",
    dash_no_history: "Aún no tienes generaciones. ¡Crea tu primer contenido!",
    dash_history_empty: "Tu historial aparecerá aquí",
    dash_limit_reached: "Has alcanzado tu límite mensual",
    dash_limit_msg: "Actualiza tu plan para seguir generando contenido ilimitado.",

    // Content types
    type_instagram: "Instagram",
    type_twitter: "Twitter / X",
    type_blog: "Artículo de Blog",
    type_email: "Email de Marketing",
    type_video_script: "Script de Video",

    // Tones
    tone_professional: "Profesional",
    tone_casual: "Casual",
    tone_funny: "Divertido",
    tone_inspirational: "Inspiracional",

    // Admin
    admin_title: "Panel de Administración",
    admin_users: "Usuarios",
    admin_stats: "Estadísticas",
    admin_total_users: "Total de usuarios",
    admin_total_generations: "Total de generaciones",
    admin_plan_breakdown: "Distribución por plan",
    admin_user_name: "Nombre",
    admin_user_email: "Email",
    admin_user_plan: "Plan",
    admin_user_joined: "Registro",
    admin_change_plan: "Cambiar plan",

    // Payments
    pay_title: "Actualizar plan",
    pay_select_method: "Selecciona método de pago",
    pay_stripe: "Stripe (Internacional)",
    pay_kobrapay: "KobraPay (México/Latam)",
    pay_stripe_desc: "Paga con tarjeta de crédito/débito internacional",
    pay_kobrapay_desc: "Paga con OXXO, transferencia o tarjeta mexicana",
    pay_confirm: "Confirmar pago",
    pay_success: "¡Plan actualizado exitosamente!",
    pay_processing: "Procesando...",

    // General
    loading: "Cargando...",
    error: "Error",
    success: "¡Éxito!",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    back: "Volver",

    // Footer
    footer_desc: "La plataforma de generación de contenido con IA más completa para creadores y empresas.",
    footer_product: "Producto",
    footer_company: "Empresa",
    footer_support: "Soporte",
    footer_features: "Características",
    footer_pricing: "Precios",
    footer_blog: "Blog",
    footer_about: "Acerca de",
    footer_contact: "Contacto",
    footer_privacy: "Privacidad",
    footer_terms: "Términos",
    footer_help: "Centro de ayuda",
    footer_email: "Email de soporte",
    footer_rights: "Todos los derechos reservados.",

    // Onboarding
    onboard_title: "¡Bienvenido a ContentAI! 🎉",
    onboard_subtitle: "Estás a 3 pasos de crear contenido increíble",
    onboard_step1: "Selecciona el tipo de contenido que necesitas",
    onboard_step2: "Escribe el tema o idea en el campo de texto",
    onboard_step3: "Haz clic en 'Generar' y obtén tu contenido en segundos",
    onboard_cta: "¡Empezar ahora!",
  },
  en: {
    nav_features: "Features",
    nav_pricing: "Pricing",
    nav_howItWorks: "How it works",
    nav_login: "Sign in",
    nav_dashboard: "Dashboard",
    nav_logout: "Sign out",
    nav_admin: "Admin",

    hero_badge: "✨ Powered by Artificial Intelligence",
    hero_title: "Generate amazing content in",
    hero_title_highlight: "seconds",
    hero_subtitle: "Automatically create Instagram posts, tweets, blog articles, emails and video scripts with AI. No effort, no creative blocks.",
    hero_cta_primary: "Start for free",
    hero_cta_secondary: "See demo",
    hero_stat1: "Content types",
    hero_stat2: "Languages",
    hero_stat3: "Always available",

    features_title: "Everything you need to create content",
    features_subtitle: "A complete platform to generate high-quality content with artificial intelligence",
    feature1_title: "Instagram Posts",
    feature1_desc: "Attractive captions, optimized hashtags and calls to action that convert followers into customers.",
    feature2_title: "Twitter/X Threads",
    feature2_desc: "Viral threads of 5 tweets with perfect structure to maximize reach and engagement.",
    feature3_title: "Blog Articles",
    feature3_desc: "SEO-optimized articles with professional structure that position your brand as an expert.",
    feature4_title: "Marketing Emails",
    feature4_desc: "Persuasive emails with irresistible subjects, convincing body and CTAs that generate conversions.",
    feature5_title: "Video Scripts",
    feature5_desc: "Complete scripts for YouTube with opening hook, development and closing that retain the audience.",
    feature6_title: "Bilingual",
    feature6_desc: "Generate content in Spanish and English to reach global audiences without language barriers.",

    how_title: "How does it work?",
    how_subtitle: "In 3 simple steps you have content ready to publish",
    step1_title: "Choose the type",
    step1_desc: "Select what type of content you need: Instagram, Twitter, Blog, Email or Video.",
    step2_title: "Describe your idea",
    step2_desc: "Write the main topic or idea. The AI understands the context and generates relevant content.",
    step3_title: "Copy and publish",
    step3_desc: "Get your content ready in seconds. Copy it, adjust if you want and publish it.",

    pricing_title: "Plans for every need",
    pricing_subtitle: "Start free and scale when you need it",
    plan_free: "Free",
    plan_pro: "Pro",
    plan_professional: "Professional",
    plan_enterprise: "Enterprise",
    plan_month: "/month",
    plan_popular: "Most popular",
    plan_cta_free: "Start for free",
    plan_cta_paid: "Get started",
    plan_feature_generations: "generations/month",
    plan_feature_unlimited: "Unlimited generations",
    plan_feature_types: "All content types",
    plan_feature_languages: "Spanish and English",
    plan_feature_history: "Generation history",
    plan_feature_priority: "Priority generation",
    plan_feature_support: "Dedicated support",
    plan_feature_api: "API access (coming soon)",

    dash_welcome: "Welcome",
    dash_generate: "Generate content",
    dash_history: "History",
    dash_subscription: "Subscription",
    dash_usage: "Usage this month",
    dash_of: "of",
    dash_unlimited: "Unlimited",
    dash_upgrade: "Upgrade plan",
    dash_content_type: "Content type",
    dash_tone: "Tone",
    dash_language: "Language",
    dash_prompt: "Describe your topic",
    dash_prompt_placeholder: "E.g.: Benefits of morning exercise for entrepreneurs",
    dash_generate_btn: "Generate",
    dash_generating: "Generating...",
    dash_result: "Result",
    dash_copy: "Copy",
    dash_copied: "Copied!",
    dash_new: "New",
    dash_no_history: "No generations yet. Create your first content!",
    dash_history_empty: "Your history will appear here",
    dash_limit_reached: "You've reached your monthly limit",
    dash_limit_msg: "Upgrade your plan to keep generating unlimited content.",

    type_instagram: "Instagram",
    type_twitter: "Twitter / X",
    type_blog: "Blog Article",
    type_email: "Marketing Email",
    type_video_script: "Video Script",

    tone_professional: "Professional",
    tone_casual: "Casual",
    tone_funny: "Funny",
    tone_inspirational: "Inspirational",

    admin_title: "Admin Panel",
    admin_users: "Users",
    admin_stats: "Statistics",
    admin_total_users: "Total users",
    admin_total_generations: "Total generations",
    admin_plan_breakdown: "Plan breakdown",
    admin_user_name: "Name",
    admin_user_email: "Email",
    admin_user_plan: "Plan",
    admin_user_joined: "Joined",
    admin_change_plan: "Change plan",

    pay_title: "Upgrade plan",
    pay_select_method: "Select payment method",
    pay_stripe: "Stripe (International)",
    pay_kobrapay: "KobraPay (Mexico/Latam)",
    pay_stripe_desc: "Pay with international credit/debit card",
    pay_kobrapay_desc: "Pay with OXXO, bank transfer or Mexican card",
    pay_confirm: "Confirm payment",
    pay_success: "Plan updated successfully!",
    pay_processing: "Processing...",

    loading: "Loading...",
    error: "Error",
    success: "Success!",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    back: "Back",

    footer_desc: "The most complete AI content generation platform for creators and businesses.",
    footer_product: "Product",
    footer_company: "Company",
    footer_support: "Support",
    footer_features: "Features",
    footer_pricing: "Pricing",
    footer_blog: "Blog",
    footer_about: "About",
    footer_contact: "Contact",
    footer_privacy: "Privacy",
    footer_terms: "Terms",
    footer_help: "Help center",
    footer_email: "Support email",
    footer_rights: "All rights reserved.",

    onboard_title: "Welcome to ContentAI! 🎉",
    onboard_subtitle: "You're 3 steps away from creating amazing content",
    onboard_step1: "Select the type of content you need",
    onboard_step2: "Write the topic or idea in the text field",
    onboard_step3: "Click 'Generate' and get your content in seconds",
    onboard_cta: "Get started!",
  },
} as const;

type TranslationKey = keyof typeof translations.es;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("contentai_lang");
    return (saved as Language) ?? "es";
  });

  useEffect(() => {
    localStorage.setItem("contentai_lang", language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] ?? translations.es[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
