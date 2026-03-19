import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import {
  Instagram, Twitter, FileText, Mail, Video,
  Sparkles, Copy, Check, ArrowLeft, Zap, Lock
} from "lucide-react";

type ContentType = "instagram" | "twitter" | "blog" | "email" | "video_script";

const DEMO_EXAMPLES: Record<ContentType, { es: string; en: string }> = {
  instagram: {
    es: `✨ ¿Sabías que el 80% de los emprendedores exitosos usan IA para crear contenido? 🚀

Hoy te comparto el secreto que cambió mi negocio: generar posts de calidad en segundos, no en horas.

Con ContentAI puedo crear contenido para toda la semana en menos de 10 minutos. ¿El resultado? Más tiempo para lo que importa: mis clientes.

¿Tú también quieres escalar tu presencia digital sin sacrificar tu tiempo? 👇

#Emprendimiento #MarketingDigital #InteligenciaArtificial #ContentAI #NegociosOnline #Productividad #Emprendedor #Marketing #RedesSociales #Innovacion`,
    en: `✨ Did you know that 80% of successful entrepreneurs use AI to create content? 🚀

Today I share the secret that changed my business: generating quality posts in seconds, not hours.

With ContentAI I can create content for the whole week in less than 10 minutes. The result? More time for what matters: my clients.

Do you also want to scale your digital presence without sacrificing your time? 👇

#Entrepreneurship #DigitalMarketing #ArtificialIntelligence #ContentAI #OnlineBusiness #Productivity #Entrepreneur #Marketing #SocialMedia #Innovation`,
  },
  twitter: {
    es: `1/5 🧵 La IA está revolucionando el marketing de contenidos. Aquí te explico cómo usarla para multiplicar tu presencia digital:

2/5 El 73% de los marketers que usan IA reportan un aumento del 30% en su productividad. ¿Sigues creando contenido a mano?

3/5 Con las herramientas correctas puedes generar: posts de Instagram, hilos de Twitter, artículos de blog, emails y scripts de video en SEGUNDOS.

4/5 El secreto está en el prompt correcto. Sé específico: "Crea un post sobre [tema] para [audiencia] con tono [profesional/casual/divertido]"

5/5 ¿Listo para transformar tu estrategia de contenidos? Prueba ContentAI gratis hoy → contentai.com`,
    en: `1/5 🧵 AI is revolutionizing content marketing. Here's how to use it to multiply your digital presence:

2/5 73% of marketers using AI report a 30% increase in productivity. Are you still creating content manually?

3/5 With the right tools you can generate: Instagram posts, Twitter threads, blog articles, emails and video scripts in SECONDS.

4/5 The secret is in the right prompt. Be specific: "Create a post about [topic] for [audience] with [professional/casual/funny] tone"

5/5 Ready to transform your content strategy? Try ContentAI for free today → contentai.com`,
  },
  blog: {
    es: `# Cómo la Inteligencia Artificial Está Transformando el Marketing de Contenidos en 2025

## Introducción

El marketing de contenidos ha experimentado una revolución sin precedentes gracias a la inteligencia artificial. Las empresas que adoptan estas tecnologías están viendo resultados extraordinarios: mayor productividad, contenido de mayor calidad y una presencia digital más sólida.

En este artículo, exploraremos cómo la IA está cambiando las reglas del juego y cómo puedes aprovecharla para hacer crecer tu negocio.

## El Impacto Real de la IA en la Creación de Contenido

Según estudios recientes, los profesionales del marketing que utilizan herramientas de IA pueden crear hasta 5 veces más contenido en el mismo tiempo. Esto no significa sacrificar calidad; al contrario, la IA ayuda a mantener consistencia y relevancia en cada pieza de contenido.

### Beneficios Principales

La automatización inteligente permite a los equipos de marketing enfocarse en la estrategia y la creatividad, mientras la IA se encarga de las tareas repetitivas. El resultado es una combinación poderosa de eficiencia humana y capacidad computacional.

## Herramientas que Están Marcando la Diferencia

Plataformas como ContentAI están democratizando el acceso a estas tecnologías, permitiendo que pequeños emprendedores compitan con grandes corporaciones en términos de producción de contenido.

## Conclusión

La pregunta ya no es si deberías usar IA en tu estrategia de contenidos, sino cómo hacerlo de manera efectiva. Las empresas que adopten estas tecnologías hoy tendrán una ventaja competitiva significativa en los próximos años.

**Meta descripción:** Descubre cómo la inteligencia artificial está transformando el marketing de contenidos y cómo puedes aprovecharla para multiplicar tu productividad y presencia digital.`,
    en: `# How Artificial Intelligence Is Transforming Content Marketing in 2025

## Introduction

Content marketing has experienced an unprecedented revolution thanks to artificial intelligence. Companies adopting these technologies are seeing extraordinary results: higher productivity, better quality content, and a stronger digital presence.

In this article, we'll explore how AI is changing the rules of the game and how you can leverage it to grow your business.

## The Real Impact of AI on Content Creation

According to recent studies, marketing professionals using AI tools can create up to 5 times more content in the same time. This doesn't mean sacrificing quality; on the contrary, AI helps maintain consistency and relevance in every piece of content.

### Main Benefits

Intelligent automation allows marketing teams to focus on strategy and creativity, while AI handles repetitive tasks. The result is a powerful combination of human efficiency and computational capability.

## Tools Making a Difference

Platforms like ContentAI are democratizing access to these technologies, allowing small entrepreneurs to compete with large corporations in terms of content production.

## Conclusion

The question is no longer whether you should use AI in your content strategy, but how to do it effectively. Companies that adopt these technologies today will have a significant competitive advantage in the coming years.

**Meta description:** Discover how artificial intelligence is transforming content marketing and how you can leverage it to multiply your productivity and digital presence.`,
  },
  email: {
    es: `Asunto: 🚀 Genera contenido de calidad en segundos (no en horas)

Preheader: Descubre cómo los emprendedores más exitosos están usando IA para dominar las redes sociales

---

Hola [Nombre],

¿Cuántas horas a la semana pasas creando contenido para tus redes sociales?

Si eres como la mayoría de los emprendedores, probablemente más de las que quisieras. El problema no es la creatividad, es el tiempo.

Por eso creamos ContentAI: la plataforma que genera posts de Instagram, tweets, artículos de blog, emails y scripts de video en segundos, usando inteligencia artificial de última generación.

**¿Qué puedes hacer con ContentAI?**
- Generar 10 posts de Instagram en menos de 5 minutos
- Crear hilos de Twitter que generan engagement real
- Escribir artículos de blog SEO-optimizados automáticamente
- Diseñar campañas de email marketing en segundos

Empieza GRATIS hoy y genera tus primeras 3 piezas de contenido sin costo.

[COMENZAR GRATIS →]

Saludos,
El equipo de ContentAI`,
    en: `Subject: 🚀 Generate quality content in seconds (not hours)

Preheader: Discover how the most successful entrepreneurs are using AI to dominate social media

---

Hi [Name],

How many hours a week do you spend creating content for your social media?

If you're like most entrepreneurs, probably more than you'd like. The problem isn't creativity, it's time.

That's why we created ContentAI: the platform that generates Instagram posts, tweets, blog articles, emails and video scripts in seconds, using cutting-edge artificial intelligence.

**What can you do with ContentAI?**
- Generate 10 Instagram posts in less than 5 minutes
- Create Twitter threads that generate real engagement
- Write SEO-optimized blog articles automatically
- Design email marketing campaigns in seconds

Start FREE today and generate your first 3 pieces of content at no cost.

[START FREE →]

Best regards,
The ContentAI Team`,
  },
  video_script: {
    es: `🎬 GANCHO (0-15 segundos):
"¿Sabías que puedes crear contenido para toda tu semana en menos de 10 minutos? Hoy te voy a mostrar exactamente cómo lo hago con inteligencia artificial."

---

📌 DESARROLLO (15 segundos - 3 minutos):

**Punto 1: El problema del tiempo**
La mayoría de los emprendedores pasan entre 5 y 10 horas a la semana creando contenido. Eso es tiempo que podrías estar usando para hacer crecer tu negocio, atender clientes o simplemente descansar.

**Punto 2: La solución con IA**
Las herramientas de inteligencia artificial como ContentAI pueden generar posts de Instagram, tweets, artículos de blog, emails y scripts de video en segundos. No en horas, en SEGUNDOS.

**Punto 3: Cómo usarlo**
El proceso es simple: describes tu tema, eliges el tipo de contenido y el tono, y la IA genera el contenido listo para publicar. Puedes editarlo, personalizarlo y publicarlo.

---

🎯 CIERRE Y CTA (últimos 30 segundos):
"Si quieres probar esto por ti mismo, ve a contentai.com y empieza gratis hoy. Genera tus primeras 3 piezas de contenido sin costo. El link está en la descripción."

---

📝 DESCRIPCIÓN PARA YOUTUBE:
En este video te muestro cómo usar inteligencia artificial para generar contenido de calidad en segundos. Aprende a crear posts de Instagram, tweets, artículos de blog, emails y scripts de video con ContentAI.

🔗 Prueba ContentAI gratis: contentai.com
#InteligenciaArtificial #MarketingDigital #ContentAI #Emprendimiento`,
    en: `🎬 HOOK (0-15 seconds):
"Did you know you can create content for your entire week in less than 10 minutes? Today I'm going to show you exactly how I do it with artificial intelligence."

---

📌 DEVELOPMENT (15 seconds - 3 minutes):

**Point 1: The time problem**
Most entrepreneurs spend between 5 and 10 hours a week creating content. That's time you could be using to grow your business, serve clients, or simply rest.

**Point 2: The AI solution**
Artificial intelligence tools like ContentAI can generate Instagram posts, tweets, blog articles, emails and video scripts in seconds. Not hours, SECONDS.

**Point 3: How to use it**
The process is simple: describe your topic, choose the content type and tone, and AI generates ready-to-publish content. You can edit it, personalize it and publish it.

---

🎯 CLOSING & CTA (last 30 seconds):
"If you want to try this yourself, go to contentai.com and start free today. Generate your first 3 pieces of content at no cost. The link is in the description."

---

📝 YOUTUBE DESCRIPTION:
In this video I show you how to use artificial intelligence to generate quality content in seconds. Learn to create Instagram posts, tweets, blog articles, emails and video scripts with ContentAI.

🔗 Try ContentAI free: contentai.com
#ArtificialIntelligence #DigitalMarketing #ContentAI #Entrepreneurship`,
  },
};

const CONTENT_TYPES: { key: ContentType; icon: React.ElementType; color: string; bg: string }[] = [
  { key: "instagram", icon: Instagram, color: "text-pink-500", bg: "bg-pink-50 border-pink-200" },
  { key: "twitter", icon: Twitter, color: "text-sky-500", bg: "bg-sky-50 border-sky-200" },
  { key: "blog", icon: FileText, color: "text-green-500", bg: "bg-green-50 border-green-200" },
  { key: "email", icon: Mail, color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
  { key: "video_script", icon: Video, color: "text-purple-500", bg: "bg-purple-50 border-purple-200" },
];

const TYPE_LABELS: Record<ContentType, { es: string; en: string }> = {
  instagram: { es: "Post Instagram", en: "Instagram Post" },
  twitter: { es: "Hilo Twitter", en: "Twitter Thread" },
  blog: { es: "Artículo Blog", en: "Blog Article" },
  email: { es: "Email Marketing", en: "Marketing Email" },
  video_script: { es: "Script de Video", en: "Video Script" },
};

export default function Demo() {
  const { language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();
  const [selectedType, setSelectedType] = useState<ContentType>("instagram");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(DEMO_EXAMPLES.instagram.es);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(true);
  const [demoCount, setDemoCount] = useState(0);

  const t = (es: string, en: string) => language === "es" ? es : en;

  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    setResult(DEMO_EXAMPLES[type][language]);
    setGenerated(true);
  };

  const handleGenerate = () => {
    if (demoCount >= 2) {
      toast.info(t(
        "Has usado la demo. Regístrate gratis para generar contenido ilimitado.",
        "You've used the demo. Sign up free to generate unlimited content."
      ));
      navigate("/register");
      return;
    }
    if (!prompt.trim()) {
      setResult(DEMO_EXAMPLES[selectedType][language]);
      setGenerated(true);
      setDemoCount(prev => prev + 1);
      return;
    }
    // Simular generación con el ejemplo
    setGenerated(false);
    setTimeout(() => {
      setResult(DEMO_EXAMPLES[selectedType][language]);
      setGenerated(true);
      setDemoCount(prev => prev + 1);
      toast.success(t("¡Contenido generado! (Demo)", "Content generated! (Demo)"));
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t("¡Copiado al portapapeles!", "Copied to clipboard!"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <nav className="glass border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("Volver", "Back")}
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-gray-900">ContentAI</span>
              <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 bg-blue-50">Demo</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
            <Button size="sm" className="gradient-brand text-white border-0" onClick={() => navigate("/register")}>
              {t("Empezar Gratis", "Start Free")}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero de la demo */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-0 px-4 py-1.5">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            {t("Demo Interactiva", "Interactive Demo")}
          </Badge>
          <h1 className="text-4xl font-display font-black text-gray-900 mb-4">
            {t("Prueba ContentAI ahora mismo", "Try ContentAI right now")}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t(
              "Sin registro. Sin tarjeta. Solo elige el tipo de contenido, escribe tu tema y ve la magia.",
              "No signup. No credit card. Just choose the content type, write your topic and see the magic."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel izquierdo: Configuración */}
          <div className="space-y-6">
            {/* Selector de tipo */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                {t("1. Elige el tipo de contenido", "1. Choose content type")}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {CONTENT_TYPES.map(({ key, icon: Icon, color, bg }) => (
                  <button
                    key={key}
                    onClick={() => handleTypeSelect(key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedType === key
                        ? `${bg} border-current shadow-sm`
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedType === key ? bg : "bg-gray-100"}`}>
                      <Icon className={`w-4 h-4 ${selectedType === key ? color : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selectedType === key ? "text-gray-900" : "text-gray-600"}`}>
                        {TYPE_LABELS[key][language]}
                      </p>
                      <p className="text-xs text-gray-400">
                        {key === "instagram" && t("Posts con hashtags", "Posts with hashtags")}
                        {key === "twitter" && t("Hilos de 5 tweets", "5-tweet threads")}
                        {key === "blog" && t("Artículos SEO", "SEO articles")}
                        {key === "email" && t("Emails persuasivos", "Persuasive emails")}
                        {key === "video_script" && t("Scripts para YouTube", "YouTube scripts")}
                      </p>
                    </div>
                    {selectedType === key && (
                      <div className={`ml-auto w-2 h-2 rounded-full ${color.replace("text-", "bg-")}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Input del tema */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-display font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                {t("2. Describe tu tema", "2. Describe your topic")}
              </h3>
              <Textarea
                placeholder={t(
                  "Ej: Cómo usar inteligencia artificial para hacer crecer mi negocio...",
                  "E.g: How to use artificial intelligence to grow my business..."
                )}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] resize-none border-gray-200 rounded-xl text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                {t(
                  "Tip: Sé específico para mejores resultados. Ej: 'Marketing digital para restaurantes en México'",
                  "Tip: Be specific for better results. E.g: 'Digital marketing for restaurants in Mexico'"
                )}
              </p>
            </div>

            {/* Botón de generar */}
            <Button
              onClick={handleGenerate}
              className="w-full gradient-brand text-white border-0 rounded-xl h-12 text-base font-semibold shadow-lg shadow-blue-200"
              disabled={!generated}
            >
              {!generated ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("Generando...", "Generating...")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {t("Generar Contenido", "Generate Content")}
                </span>
              )}
            </Button>

            {/* Contador de demos */}
            <div className="flex items-center gap-2 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i < demoCount ? "w-8 bg-blue-500" : "w-4 bg-gray-200"}`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">
                {t(`${demoCount}/3 demos usadas`, `${demoCount}/3 demos used`)}
              </span>
            </div>
          </div>

          {/* Panel derecho: Resultado */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                {(() => {
                  const ct = CONTENT_TYPES.find(c => c.key === selectedType);
                  const Icon = ct?.icon ?? Sparkles;
                  return <Icon className={`w-4 h-4 ${ct?.color ?? "text-blue-500"}`} />;
                })()}
                <span className="text-sm font-semibold text-gray-700">{TYPE_LABELS[selectedType][language]}</span>
                <Badge variant="outline" className="text-xs ml-1 border-green-200 text-green-600 bg-green-50">
                  {t("Generado", "Generated")}
                </Badge>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t("¡Copiado!", "Copied!") : t("Copiar", "Copy")}
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[500px]">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {result}
              </pre>
            </div>
          </div>
        </div>

        {/* CTA para registrarse */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lock className="w-5 h-5 opacity-80" />
            <span className="text-blue-200 text-sm font-medium">
              {t("Versión completa disponible", "Full version available")}
            </span>
          </div>
          <h2 className="text-3xl font-display font-black mb-3">
            {t("¿Te gustó? Empieza gratis hoy", "Did you like it? Start free today")}
          </h2>
          <p className="text-blue-200 mb-6 max-w-xl mx-auto">
            {t(
              "Regístrate y obtén 3 generaciones gratis al mes. Sin tarjeta de crédito. Sin compromisos.",
              "Sign up and get 3 free generations per month. No credit card. No commitments."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 border-0 font-bold rounded-xl px-8"
              onClick={() => navigate("/register")}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t("Crear cuenta gratis", "Create free account")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8"
              onClick={() => navigate("/#pricing")}
            >
              {t("Ver planes y precios", "View plans and pricing")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
