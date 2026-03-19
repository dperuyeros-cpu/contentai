import z from "zod";
import { COOKIE_NAME } from "@shared/const";
import { notifyOwner } from "./_core/notification";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut } from "./storage";
import {
  getUserSubscription,
  getMonthlyUsage,
  canGenerate,
  incrementMonthlyUsage,
  saveGeneration,
  getUserGenerations,
  updateUserPlan,
  getAllUsersWithSubscriptions,
  getPlatformStats,
  toggleFavorite,
  updateBusinessProfile,
  getUserByEmail,
  createUserWithPassword,
  setPasswordResetToken,
  getUserByResetToken,
  clearPasswordResetToken,
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "./db";
import bcrypt from "bcryptjs";
import { PLANS, type PlanType } from "../drizzle/schema";
import { createCheckoutSession } from "./stripeRouter";
import type { StripePlanKey } from "./stripeProducts";
import { createKobraCheckoutSession, KOBRA_PLANS } from "./kobraPayRouter";
import type { KobraPlanKey } from "./kobraPayRouter";

// ─── Admin procedure ──────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Acceso denegado" });
  return next({ ctx });
});

// ─── Prompts especializados por tipo de contenido ─────────────────────────────
const CONTENT_PROMPTS: Record<string, { es: string; en: string }> = {
  // Redes Sociales
  instagram_post: {
    es: `Eres un experto en marketing digital. Crea un post de Instagram atractivo. Incluye: texto principal (máx 150 palabras), llamada a la acción y 10 hashtags relevantes. Separa cada sección con saltos de línea.`,
    en: `You are a digital marketing expert. Create an attractive Instagram post. Include: main text (max 150 words), call to action, and 10 relevant hashtags. Separate each section with line breaks.`,
  },
  instagram_story: {
    es: `Crea una secuencia de 5 Stories de Instagram para el siguiente tema. Cada story debe tener: texto corto (máx 20 palabras), sticker/encuesta sugerida y emoji relevante.`,
    en: `Create a sequence of 5 Instagram Stories for the following topic. Each story should have: short text (max 20 words), suggested sticker/poll, and relevant emoji.`,
  },
  instagram_carousel: {
    es: `Crea un carrusel de Instagram de 7 diapositivas. Slide 1: portada llamativa. Slides 2-6: contenido de valor (1 idea por slide, máx 30 palabras). Slide 7: llamada a la acción. Incluye 10 hashtags al final.`,
    en: `Create a 7-slide Instagram carousel. Slide 1: eye-catching cover. Slides 2-6: valuable content (1 idea per slide, max 30 words). Slide 7: call to action. Include 10 hashtags at the end.`,
  },
  instagram_reel: {
    es: `Crea un guión completo para un Reel de Instagram de 30 segundos. Incluye: gancho (0-3s), desarrollo (3-25s con descripción visual), cierre (25-30s con CTA). Especifica qué mostrar en pantalla en cada momento.`,
    en: `Create a complete script for a 30-second Instagram Reel. Include: hook (0-3s), development (3-25s with visual description), closing (25-30s with CTA). Specify what to show on screen at each moment.`,
  },
  tiktok_script: {
    es: `Crea un guión viral para TikTok de 60 segundos. Incluye: gancho impactante (primeros 3 segundos), desarrollo con puntos clave, tendencia o sonido sugerido, texto en pantalla y hashtags virales.`,
    en: `Create a viral TikTok script for 60 seconds. Include: impactful hook (first 3 seconds), development with key points, suggested trend or sound, on-screen text, and viral hashtags.`,
  },
  youtube_short: {
    es: `Crea un guión para YouTube Short de 60 segundos. Incluye: gancho (0-5s), contenido principal (5-50s), cierre con suscripción (50-60s). Describe las imágenes/acciones en pantalla.`,
    en: `Create a YouTube Short script for 60 seconds. Include: hook (0-5s), main content (5-50s), closing with subscription CTA (50-60s). Describe the images/actions on screen.`,
  },
  twitter_post: {
    es: `Crea un hilo de Twitter/X de 5 tweets impactantes. Cada tweet máx 280 caracteres. Numera cada uno (1/5, 2/5...). El primero debe ser el gancho más poderoso.`,
    en: `Create an impactful Twitter/X thread of 5 tweets. Each tweet max 280 characters. Number each one (1/5, 2/5...). The first must be the most powerful hook.`,
  },
  linkedin_post: {
    es: `Crea un post profesional para LinkedIn. Incluye: primera línea impactante (gancho), historia o dato relevante, 3 puntos de valor, reflexión final y llamada a la acción. Tono profesional pero cercano. Máx 300 palabras.`,
    en: `Create a professional LinkedIn post. Include: impactful first line (hook), relevant story or data, 3 value points, final reflection, and call to action. Professional but approachable tone. Max 300 words.`,
  },
  facebook_post: {
    es: `Crea un post de Facebook atractivo y conversacional. Incluye: apertura que genere curiosidad, contenido de valor, pregunta para generar comentarios y llamada a la acción. Máx 200 palabras.`,
    en: `Create an attractive and conversational Facebook post. Include: curiosity-generating opening, valuable content, question to generate comments, and call to action. Max 200 words.`,
  },
  // Anuncios Publicitarios
  facebook_ad: {
    es: `Crea un anuncio de Facebook Ads completo. Incluye: Headline (máx 40 caracteres), Texto principal (máx 125 caracteres), Descripción (máx 30 caracteres), Llamada a la acción y 3 variaciones del headline para prueba A/B.`,
    en: `Create a complete Facebook Ad. Include: Headline (max 40 chars), Primary text (max 125 chars), Description (max 30 chars), Call to action, and 3 headline variations for A/B testing.`,
  },
  google_ad: {
    es: `Crea un anuncio de Google Ads. Incluye: 3 Headlines (máx 30 caracteres cada uno), 2 Descriptions (máx 90 caracteres cada una), URL de visualización y extensiones de anuncio sugeridas.`,
    en: `Create a Google Ad. Include: 3 Headlines (max 30 chars each), 2 Descriptions (max 90 chars each), display URL, and suggested ad extensions.`,
  },
  instagram_ad: {
    es: `Crea un anuncio de Instagram Ads. Incluye: copy principal (máx 125 caracteres), descripción visual de la imagen/video, llamada a la acción y 3 variaciones para prueba A/B.`,
    en: `Create an Instagram Ad. Include: main copy (max 125 chars), visual description of image/video, call to action, and 3 variations for A/B testing.`,
  },
  tiktok_ad: {
    es: `Crea un anuncio para TikTok Ads de 15 segundos. Incluye: gancho (0-3s), propuesta de valor (3-12s), CTA (12-15s), texto en pantalla y descripción visual del video.`,
    en: `Create a 15-second TikTok Ad. Include: hook (0-3s), value proposition (3-12s), CTA (12-15s), on-screen text, and visual description of the video.`,
  },
  whatsapp_promo: {
    es: `Crea un mensaje de WhatsApp para promoción. Debe ser corto, directo y con emoji. Incluye: saludo, oferta principal, beneficio clave, urgencia y enlace/contacto. Máx 150 palabras.`,
    en: `Create a WhatsApp promotional message. Should be short, direct with emojis. Include: greeting, main offer, key benefit, urgency, and link/contact. Max 150 words.`,
  },
  radio_ad: {
    es: `Crea un guión de anuncio de radio de 30 segundos (aproximadamente 75 palabras). Incluye: jingle/apertura, mensaje principal, oferta especial, datos de contacto y cierre memorable.`,
    en: `Create a 30-second radio ad script (approximately 75 words). Include: jingle/opening, main message, special offer, contact information, and memorable closing.`,
  },
  tv_ad: {
    es: `Crea un guión de comercial de televisión de 30 segundos. Incluye: descripción de escena por escena, diálogos, voz en off, música sugerida y texto en pantalla. Formato profesional de guión.`,
    en: `Create a 30-second TV commercial script. Include: scene-by-scene description, dialogues, voice over, suggested music, and on-screen text. Professional script format.`,
  },
  flyer_copy: {
    es: `Crea el copy completo para un flyer digital. Incluye: título principal (impactante), subtítulo, 3-5 beneficios clave (bullets), oferta especial, datos de contacto y llamada a la acción. Listo para diseñar.`,
    en: `Create complete copy for a digital flyer. Include: main title (impactful), subtitle, 3-5 key benefits (bullets), special offer, contact information, and call to action. Ready to design.`,
  },
  email_campaign: {
    es: `Crea una campaña de email marketing completa. Incluye: Asunto (máx 60 chars), Preheader (máx 90 chars), Saludo personalizado, Cuerpo del mensaje (3 párrafos), CTA principal, Posdata y Firma profesional.`,
    en: `Create a complete email marketing campaign. Include: Subject (max 60 chars), Preheader (max 90 chars), Personalized greeting, Message body (3 paragraphs), Main CTA, Postscript, and Professional signature.`,
  },
  // Contenido Editorial
  blog_article: {
    es: `Escribe un artículo de blog completo optimizado para SEO. Incluye: Título SEO (60 chars), Meta descripción (160 chars), Introducción (2 párrafos), 4 secciones con H2 y contenido, Conclusión y CTA. Mínimo 800 palabras.`,
    en: `Write a complete SEO-optimized blog article. Include: SEO Title (60 chars), Meta description (160 chars), Introduction (2 paragraphs), 4 sections with H2 and content, Conclusion and CTA. Minimum 800 words.`,
  },
  news_article: {
    es: `Escribe una nota periodística profesional. Incluye: Titular (impactante, máx 80 chars), Subtítulo, Lead (primer párrafo con quién, qué, cuándo, dónde, por qué), Desarrollo (3-4 párrafos), Cita textual y Cierre.`,
    en: `Write a professional news article. Include: Headline (impactful, max 80 chars), Subheadline, Lead (first paragraph with who, what, when, where, why), Development (3-4 paragraphs), Direct quote, and Closing.`,
  },
  press_release: {
    es: `Redacta un comunicado de prensa profesional. Incluye: Titular, Ciudad y fecha, Primer párrafo (resumen ejecutivo), Cuerpo (2-3 párrafos), Cita del vocero, Boilerplate de la empresa y Datos de contacto.`,
    en: `Write a professional press release. Include: Headline, City and date, First paragraph (executive summary), Body (2-3 paragraphs), Spokesperson quote, Company boilerplate, and Contact information.`,
  },
  newsletter: {
    es: `Crea un newsletter completo. Incluye: Asunto atractivo, Saludo personalizado, Sección principal (artículo destacado), 3 noticias/tips breves, Oferta especial, Sección de comunidad y Despedida.`,
    en: `Create a complete newsletter. Include: Attractive subject, Personalized greeting, Main section (featured article), 3 brief news/tips, Special offer, Community section, and Farewell.`,
  },
  web_copy: {
    es: `Crea el copy completo para una página web. Incluye: Headline principal (propuesta de valor), Subheadline, Sección de beneficios (3 puntos), Sección "Cómo funciona" (3 pasos), Testimonial sugerido, FAQ (3 preguntas) y CTA final.`,
    en: `Create complete website copy. Include: Main headline (value proposition), Subheadline, Benefits section (3 points), "How it works" section (3 steps), Suggested testimonial, FAQ (3 questions), and final CTA.`,
  },
  // Video y Comerciales
  video_script: {
    es: `Crea un guión de video completo. Incluye: Gancho inicial (15s), Presentación del problema (30s), Solución propuesta (60s), Demostración/Beneficios (90s), Testimonial sugerido (30s), Oferta y CTA (30s). Total: ~4 minutos.`,
    en: `Create a complete video script. Include: Opening hook (15s), Problem presentation (30s), Proposed solution (60s), Demo/Benefits (90s), Suggested testimonial (30s), Offer and CTA (30s). Total: ~4 minutes.`,
  },
  commercial_script: {
    es: `Crea un guión de comercial de 60 segundos para redes sociales. Incluye: Escena por escena con timing, Diálogos o voz en off, Descripción visual detallada, Música sugerida y Texto en pantalla.`,
    en: `Create a 60-second commercial script for social media. Include: Scene by scene with timing, Dialogues or voice over, Detailed visual description, Suggested music, and On-screen text.`,
  },
  product_commercial: {
    es: `Crea un comercial de producto basado en la descripción proporcionada. Incluye: Gancho visual (0-5s), Presentación del producto (5-20s), Beneficios clave (20-45s), Precio/Oferta (45-55s), CTA final (55-60s). Describe cada escena visualmente.`,
    en: `Create a product commercial based on the description provided. Include: Visual hook (0-5s), Product presentation (5-20s), Key benefits (20-45s), Price/Offer (45-55s), Final CTA (55-60s). Describe each scene visually.`,
  },
  // Branding
  brand_identity: {
    es: `Crea una identidad de marca completa. Incluye: Nombre de marca (3 opciones), Slogan (3 opciones), Propuesta de valor única, Personalidad de marca (5 adjetivos), Paleta de colores sugerida (con códigos HEX), Tipografías recomendadas y Tono de comunicación.`,
    en: `Create a complete brand identity. Include: Brand name (3 options), Slogan (3 options), Unique value proposition, Brand personality (5 adjectives), Suggested color palette (with HEX codes), Recommended fonts, and Communication tone.`,
  },
  brand_slogan: {
    es: `Crea 10 opciones de slogan para la marca. Cada slogan debe ser memorable, máx 8 palabras, reflejar la propuesta de valor y ser fácil de pronunciar. Explica brevemente el concepto detrás de cada uno.`,
    en: `Create 10 slogan options for the brand. Each slogan should be memorable, max 8 words, reflect the value proposition, and be easy to pronounce. Briefly explain the concept behind each one.`,
  },
  brand_story: {
    es: `Escribe la historia de marca (Brand Story). Incluye: Origen e inspiración, Problema que resuelve, Misión y propósito, Valores fundamentales, Visión de futuro y Por qué elegir esta marca. Tono emotivo y auténtico.`,
    en: `Write the brand story. Include: Origin and inspiration, Problem it solves, Mission and purpose, Core values, Future vision, and Why choose this brand. Emotional and authentic tone.`,
  },
  mission_vision: {
    es: `Crea la Misión, Visión y Valores de la empresa. Misión: qué hacemos y para quién (2-3 oraciones). Visión: dónde queremos estar en 5 años (2-3 oraciones). Valores: 5 valores con descripción breve de cada uno.`,
    en: `Create the company's Mission, Vision, and Values. Mission: what we do and for whom (2-3 sentences). Vision: where we want to be in 5 years (2-3 sentences). Values: 5 values with brief description of each.`,
  },
  business_pitch: {
    es: `Crea un pitch de negocio completo para inversionistas. Incluye: Problema, Solución, Mercado objetivo, Modelo de negocio, Ventaja competitiva, Tracción/Métricas, Equipo y Llamada a la acción. Máx 500 palabras.`,
    en: `Create a complete business pitch for investors. Include: Problem, Solution, Target market, Business model, Competitive advantage, Traction/Metrics, Team, and Call to action. Max 500 words.`,
  },
  elevator_pitch: {
    es: `Crea 3 versiones de elevator pitch (30s, 60s, 2min). Cada versión debe incluir: quién eres, qué problema resuelves, cómo lo resuelves, por qué eres diferente y qué necesitas/ofreces.`,
    en: `Create 3 elevator pitch versions (30s, 60s, 2min). Each version should include: who you are, what problem you solve, how you solve it, why you're different, and what you need/offer.`,
  },
  // Especializado
  menu_description: {
    es: `Crea descripciones atractivas para menú de restaurante. Para cada platillo incluye: nombre creativo, descripción sensorial (ingredientes, sabores, texturas), alérgenos si aplica y precio sugerido. Tono apetitoso y profesional.`,
    en: `Create attractive restaurant menu descriptions. For each dish include: creative name, sensory description (ingredients, flavors, textures), allergens if applicable, and suggested price. Appetizing and professional tone.`,
  },
  property_listing: {
    es: `Crea una descripción completa para listado inmobiliario. Incluye: Título llamativo, Descripción principal (características, ubicación, amenidades), Puntos de venta únicos, Descripción del vecindario y Llamada a la acción para contacto.`,
    en: `Create a complete real estate listing description. Include: Catchy title, Main description (features, location, amenities), Unique selling points, Neighborhood description, and Call to action for contact.`,
  },
  beverage_brand: {
    es: `Crea el branding completo para una marca de bebidas (tequila, mezcal, cerveza, vino). Incluye: Historia de origen, Descripción de sabor y notas, Proceso de elaboración (storytelling), Perfil del consumidor ideal, Sugerencias de maridaje y Copy para etiqueta.`,
    en: `Create complete branding for a beverage brand (tequila, mezcal, beer, wine). Include: Origin story, Flavor description and notes, Production process (storytelling), Ideal consumer profile, Pairing suggestions, and Label copy.`,
  },
  event_promo: {
    es: `Crea el material promocional completo para un evento. Incluye: Título del evento, Descripción (qué, cuándo, dónde), Copy para redes sociales (Instagram, Facebook, WhatsApp), Email de invitación y Recordatorio del día.`,
    en: `Create complete promotional material for an event. Include: Event title, Description (what, when, where), Social media copy (Instagram, Facebook, WhatsApp), Invitation email, and Day-of reminder.`,
  },
  loyalty_campaign: {
    es: `Crea una campaña de fidelización de clientes. Incluye: Nombre del programa, Mecánica de puntos/beneficios, Mensaje de bienvenida al programa, Email de reactivación para clientes inactivos y Post de redes sociales para promocionar el programa.`,
    en: `Create a customer loyalty campaign. Include: Program name, Points/benefits mechanics, Welcome message to program, Reactivation email for inactive customers, and Social media post to promote the program.`,
  },
  review_response: {
    es: `Crea respuestas profesionales para reseñas de Google/Yelp. Genera: 3 respuestas para reseñas positivas (agradecimiento genuino), 2 respuestas para reseñas negativas (empático, solución ofrecida) y 2 respuestas para reseñas neutras.`,
    en: `Create professional responses for Google/Yelp reviews. Generate: 3 responses for positive reviews (genuine gratitude), 2 responses for negative reviews (empathetic, solution offered), and 2 responses for neutral reviews.`,
  },
  // Plan de contenido
  content_plan_30days: {
    es: `Crea un plan de contenido completo para 30 días. Para cada semana especifica: tema central, 3 posts de Instagram, 2 Reels/TikToks, 1 artículo de blog, 2 Stories, 1 email y los hashtags de la semana. Incluye calendario visual con fechas y horarios sugeridos.`,
    en: `Create a complete 30-day content plan. For each week specify: central theme, 3 Instagram posts, 2 Reels/TikToks, 1 blog article, 2 Stories, 1 email, and weekly hashtags. Include visual calendar with suggested dates and times.`,
  },
  business_analysis: {
    es: `Analiza el negocio descrito y proporciona: Industria detectada, Público objetivo (demografía, intereses, pain points), Plataformas de marketing recomendadas, Tono de comunicación ideal, 5 temas de contenido clave, Competidores típicos, Ventajas competitivas posibles y Plan de acción de 30 días.`,
    en: `Analyze the described business and provide: Detected industry, Target audience (demographics, interests, pain points), Recommended marketing platforms, Ideal communication tone, 5 key content topics, Typical competitors, Possible competitive advantages, and 30-day action plan.`,
  },
  // Asistente General
  chat_assistant: {
    es: `Eres un asistente de IA inteligente, útil y versátil. Responde de manera clara, precisa y útil. Si la pregunta es sobre negocios, marketing o contenido, da respuestas especialmente detalladas y accionables.`,
    en: `You are an intelligent, helpful, and versatile AI assistant. Respond clearly, accurately, and helpfully. If the question is about business, marketing, or content, give especially detailed and actionable responses.`,
  },
  email_writer: {
    es: `Eres un experto en comunicación empresarial. Redacta correos profesionales, formales e informales según se requiera. Incluye: Asunto, Saludo apropiado, Cuerpo del mensaje (claro y conciso), Despedida y Firma.`,
    en: `You are a business communication expert. Write professional, formal, and informal emails as required. Include: Subject, Appropriate greeting, Message body (clear and concise), Farewell, and Signature.`,
  },
  document_writer: {
    es: `Eres un experto en redacción de documentos formales. Redacta cartas, oficios, solicitudes, contratos simples y cualquier documento escrito con formato profesional, lenguaje apropiado y estructura correcta.`,
    en: `You are an expert in formal document writing. Write letters, official documents, requests, simple contracts, and any written document with professional format, appropriate language, and correct structure.`,
  },
  pdf_analyzer: {
    es: `Eres un experto analizador de documentos. Analiza el contenido proporcionado y ofrece: Resumen ejecutivo, Puntos clave, Cláusulas importantes (si es contrato), Riesgos o puntos de atención, Recomendaciones y Preguntas frecuentes sobre el documento.`,
    en: `You are an expert document analyzer. Analyze the provided content and offer: Executive summary, Key points, Important clauses (if contract), Risks or attention points, Recommendations, and FAQ about the document.`,
  },
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    // ─── Registro con email y contraseña ─────────────────────────────────────
    register: publicProcedure
      .input(z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(8).max(100),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Este email ya está registrado." });
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        const user = await createUserWithPassword({
          name: input.name,
          email: input.email,
          passwordHash,
        });
        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al crear usuario." });

        const { sdk } = await import("./_core/sdk");
        const token = await sdk.createSessionToken(user.openId, { name: user.name ?? input.name });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

        await notifyOwner({
          title: "🎉 Nuevo usuario registrado",
          content: `${input.name} (${input.email}) se registró en ContentAI.`,
        });

        return { success: true, user: { id: user.id, name: user.name, email: user.email } };
      }),

    // ─── Recuperar contraseña ──────────────────────────────────────────────────
    forgotPassword: publicProcedure
      .input(z.object({ email: z.string().email(), origin: z.string() }))
      .mutation(async ({ input }) => {
        const user = await getUserByEmail(input.email);
        // Siempre retornar éxito por seguridad (no revelar si el email existe)
        if (!user || !user.passwordHash) return { success: true };

        const crypto = await import("crypto");
        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
        await setPasswordResetToken(user.id, token, expiry);

        const resetUrl = `${input.origin}/reset-password?token=${token}`;

        // Notificar al owner (como canal de email provisional)
        await notifyOwner({
          title: `🔑 Solicitud de reset de contraseña`,
          content: `El usuario ${user.email} solicitó restablecer su contraseña.\n\nEnlace de reset (válido 1 hora):\n${resetUrl}\n\nSi no reconoces esta solicitud, ignora este mensaje.`,
        });

        return { success: true };
      }),

    resetPassword: publicProcedure
      .input(z.object({
        token: z.string().min(1),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        const user = await getUserByResetToken(input.token);
        if (!user || !user.passwordResetExpiry) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Token inválido o expirado." });
        }
        if (new Date() > user.passwordResetExpiry) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "El enlace de recuperación ha expirado. Solicita uno nuevo." });
        }
        const newHash = await bcrypt.hash(input.newPassword, 12);
        await clearPasswordResetToken(user.id, newHash);
        return { success: true };
      }),

    // ─── Login con email y contraseña ─────────────────────────────────────────
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email o contraseña incorrectos." });
        }
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email o contraseña incorrectos." });
        }

        const { sdk } = await import("./_core/sdk");
        const token = await sdk.createSessionToken(user.openId, { name: user.name ?? "" });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

        return { success: true, user: { id: user.id, name: user.name, email: user.email } };
      }),
  }),

  // ─── Suscripción ────────────────────────────────────────────────────────────
  subscription: router({
    masterPlan: protectedProcedure.query(async ({ ctx }) => {
      const { ENV } = await import("./_core/env");
      const isOwner = ctx.user.openId === ENV.ownerOpenId;
      if (isOwner) {
        await updateUserPlan(ctx.user.id, "enterprise");
        return { isOwner: true };
      }
      return { isOwner: false };
    }),
    get: protectedProcedure.query(async ({ ctx }) => {
      const sub = await getUserSubscription(ctx.user.id);
      const usage = await getMonthlyUsage(ctx.user.id);
      const plan = (sub?.plan ?? "free") as PlanType;
      const limit = PLANS[plan].limit;
      return {
        plan,
        status: sub?.status ?? "active",
        usage,
        limit,
        planInfo: PLANS[plan],
        remaining: limit === -1 ? -1 : Math.max(0, limit - usage),
        currentPeriodEnd: sub?.currentPeriodEnd ?? null,
      };
    }),
    upgrade: protectedProcedure
      .input(z.object({
        plan: z.enum(["starter", "pro", "team", "business", "enterprise"]),
        paymentMethod: z.enum(["stripe", "kobrapay"]),
        paymentId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserPlan(
          ctx.user.id,
          input.plan,
          input.paymentMethod === "stripe" ? input.paymentId : undefined,
          input.paymentMethod === "kobrapay" ? input.paymentId : undefined,
        );
        // Notificar al dueño
        await notifyOwner({
          title: `💰 Nuevo pago - Plan ${PLANS[input.plan].name}`,
          content: `El usuario ${ctx.user.name ?? ctx.user.email ?? ctx.user.openId} se suscribió al plan ${PLANS[input.plan].name} por $${PLANS[input.plan].price}/mes.`,
        });
        return { success: true, plan: input.plan };
      }),

    // ─── Crear sesión de checkout de Stripe ───────────────────────────────────────────────
    createCheckout: protectedProcedure
      .input(z.object({
        plan: z.enum(["starter", "pro", "team", "business", "enterprise"]),
        origin: z.string().url(),
      }))
      .mutation(async ({ ctx, input }) => {
        const checkoutUrl = await createCheckoutSession(
          ctx.user.id,
          ctx.user.email ?? "",
          ctx.user.name ?? "",
          input.plan as StripePlanKey,
          input.origin,
        );
        return { checkoutUrl };
      }),

    // ─── Crear sesión de checkout de KobraPay (MXN) ──────────────────────────
    createKobraCheckout: protectedProcedure
      .input(z.object({
        plan: z.enum(["starter", "pro", "team", "business", "enterprise"]),
        origin: z.string().url(),
      }))
      .mutation(async ({ ctx, input }) => {
        const checkoutUrl = await createKobraCheckoutSession(
          ctx.user.id,
          ctx.user.email ?? "",
          ctx.user.name ?? "",
          input.plan as KobraPlanKey,
          input.origin,
        );
        return { checkoutUrl, priceMXN: KOBRA_PLANS[input.plan as KobraPlanKey].priceMXN };
      }),
  }),

  // ─── Notificaciones ─────────────────────────────────────────────────────────
  notifications: router({
    newUserJoined: protectedProcedure.mutation(async ({ ctx }) => {
      await notifyOwner({
        title: "🎉 Nuevo usuario en ContentAI",
        content: `El usuario ${ctx.user.name ?? ctx.user.email ?? ctx.user.openId} acaba de registrarse en ContentAI.`,
      });
      return { success: true };
    }),
  }),

  // ─── Perfil de negocio ──────────────────────────────────────────────────────
  profile: router({
    updateBusiness: protectedProcedure
      .input(z.object({
        businessName: z.string().max(255).optional(),
        businessDescription: z.string().max(1000).optional(),
        businessIndustry: z.string().max(64).optional(),
        preferredLanguage: z.enum(["es", "en"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateBusinessProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // ─── Generador de contenido ─────────────────────────────────────────────────
  content: router({
    generate: protectedProcedure
      .input(z.object({
        type: z.string(),
        prompt: z.string().min(3).max(2000),
        language: z.enum(["es", "en"]).default("es"),
        tone: z.string().default("professional"),
        industry: z.string().default("general"),
        generateImage: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verificar límite de uso
        const sub = await getUserSubscription(ctx.user.id);
        const plan = (sub?.plan ?? "free") as PlanType;
        const allowed = await canGenerate(ctx.user.id, plan);
        if (!allowed) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: input.language === "es"
              ? `Has alcanzado el límite de tu plan ${PLANS[plan].name}. Actualiza para continuar generando contenido.`
              : `You've reached your ${PLANS[plan].name} plan limit. Upgrade to keep generating content.`,
          });
        }

        const toneMap: Record<string, { es: string; en: string }> = {
          professional: { es: "Usa un tono profesional y formal.", en: "Use a professional and formal tone." },
          casual: { es: "Usa un tono casual y amigable.", en: "Use a casual and friendly tone." },
          funny: { es: "Usa un tono divertido y con humor.", en: "Use a funny and humorous tone." },
          inspirational: { es: "Usa un tono inspiracional y motivador.", en: "Use an inspirational and motivating tone." },
          luxury: { es: "Usa un tono de lujo, exclusivo y sofisticado.", en: "Use a luxury, exclusive, and sophisticated tone." },
          urgent: { es: "Usa un tono urgente y persuasivo con sentido de escasez.", en: "Use an urgent and persuasive tone with scarcity." },
        };

        const industryContext: Record<string, { es: string; en: string }> = {
          restaurant: { es: "El negocio es un restaurante. Usa lenguaje apetitoso y enfocado en la experiencia gastronómica.", en: "The business is a restaurant. Use appetizing language focused on the gastronomic experience." },
          tequila_mezcal: { es: "El negocio es una marca de tequila o mezcal. Usa lenguaje premium, con historia y tradición mexicana.", en: "The business is a tequila or mezcal brand. Use premium language with Mexican history and tradition." },
          real_estate: { es: "El negocio es inmobiliario. Usa lenguaje que transmita confianza, inversión y calidad de vida.", en: "The business is real estate. Use language that conveys trust, investment, and quality of life." },
          construction: { es: "El negocio es construcción o arquitectura. Usa lenguaje técnico pero accesible, enfocado en calidad y solidez.", en: "The business is construction or architecture. Use technical but accessible language focused on quality and solidity." },
          gym: { es: "El negocio es un gimnasio o fitness. Usa lenguaje motivacional, energético y orientado a resultados.", en: "The business is a gym or fitness. Use motivational, energetic, results-oriented language." },
          jewelry: { es: "El negocio es joyería. Usa lenguaje elegante, emotivo y que transmita lujo y sentimientos especiales.", en: "The business is jewelry. Use elegant, emotional language that conveys luxury and special feelings." },
        };

        const basePrompt = CONTENT_PROMPTS[input.type]?.[input.language] ?? CONTENT_PROMPTS.chat_assistant[input.language];
        const toneNote = toneMap[input.tone]?.[input.language] ?? "";
        const industryNote = industryContext[input.industry]?.[input.language] ?? "";
        const systemPrompt = [basePrompt, toneNote, industryNote].filter(Boolean).join(" ");

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.prompt },
          ],
        });

        const rawContent = response.choices[0]?.message?.content;
        const result = typeof rawContent === "string"
          ? rawContent
          : Array.isArray(rawContent)
            ? rawContent.map((c: { type: string; text?: string }) => c.type === "text" ? c.text ?? "" : "").join("")
            : "";

        // Generar imagen si se solicitó
        let imageUrl: string | undefined;
        if (input.generateImage && result) {
          try {
            const imagePrompt = input.language === "es"
              ? `Imagen profesional de marketing para: ${input.prompt}. Estilo moderno, vibrante, para redes sociales.`
              : `Professional marketing image for: ${input.prompt}. Modern, vibrant style, for social media.`;
            const imgResult = await generateImage({ prompt: imagePrompt });
            imageUrl = imgResult.url;
          } catch {
            // Si falla la imagen, continúa sin ella
          }
        }

        await saveGeneration({
          userId: ctx.user.id,
          type: input.type,
          industry: input.industry,
          prompt: input.prompt,
          result,
          imageUrl,
          language: input.language,
          tone: input.tone,
        });
        await incrementMonthlyUsage(ctx.user.id);

        return { result, type: input.type, imageUrl };
      }),

    history: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(20),
        type: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        return getUserGenerations(ctx.user.id, input.limit, input.type);
      }),

    toggleFavorite: protectedProcedure
      .input(z.object({ generationId: z.number(), isFavorite: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        await toggleFavorite(ctx.user.id, input.generationId, input.isFavorite);
        return { success: true };
      }),

    // ─── Generador de imágenes standalone ─────────────────────────────────
    generateStandaloneImage: protectedProcedure
      .input(z.object({
        prompt: z.string().min(3).max(1000),
        style: z.string().default("realistic"),
      }))
      .mutation(async ({ ctx, input }) => {
        const sub = await getUserSubscription(ctx.user.id);
        const plan = (sub?.plan ?? "free") as PlanType;
        const allowed = await canGenerate(ctx.user.id, plan);
        if (!allowed) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Has alcanzado el límite de tu plan. Actualiza para continuar.",
          });
        }
        const stylePrompts: Record<string, string> = {
          realistic: "ultra-realistic, photographic quality, 8K resolution, professional lighting",
          artistic: "digital art, vibrant colors, artistic style, creative composition",
          minimalist: "minimalist design, clean lines, simple composition, white background",
          cartoon: "cartoon style, colorful, fun, animated look",
          cinematic: "cinematic lighting, dramatic composition, movie poster style",
          product: "product photography, studio lighting, white background, commercial quality",
        };
        const styleHint = stylePrompts[input.style] || stylePrompts.realistic;
        const enhancedPrompt = `${input.prompt}. Style: ${styleHint}`;
        const { url: imageUrl } = await generateImage({ prompt: enhancedPrompt });
        await incrementMonthlyUsage(ctx.user.id);
        await saveGeneration({
          userId: ctx.user.id,
          type: "image_generation",
          prompt: input.prompt,
          result: imageUrl ?? "",
          imageUrl: imageUrl ?? null,
        });
        return { imageUrl: imageUrl ?? "" };
      }),

    // ─── Generador de canciones/jingles ───────────────────────────────────
    generateSong: protectedProcedure
      .input(z.object({
        prompt: z.string().min(3).max(1000),
        genre: z.string().default("pop"),
        tone: z.string().default("alegre"),
        language: z.enum(["es", "en"]).default("es"),
      }))
      .mutation(async ({ ctx, input }) => {
        const sub = await getUserSubscription(ctx.user.id);
        const plan = (sub?.plan ?? "free") as PlanType;
        const allowed = await canGenerate(ctx.user.id, plan);
        if (!allowed) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Has alcanzado el límite de tu plan. Actualiza para continuar.",
          });
        }
        const systemPrompt = input.language === "es"
          ? `Eres un compositor profesional especializado en jingles y canciones comerciales para negocios latinoamericanos. Crea letras originales, pegadizas y memorables. Incluye: Título, Intro (4 versos), Coro (4 versos, repetible), Verso 1 (4 versos), Coro, Verso 2 (4 versos), Coro, Outro (2 versos). También incluye: Tempo sugerido (BPM), Instrumentos recomendados, Notas de producción.`
          : `You are a professional composer specializing in jingles and commercial songs for businesses. Create original, catchy and memorable lyrics. Include: Title, Intro (4 verses), Chorus (4 verses, repeatable), Verse 1 (4 verses), Chorus, Verse 2 (4 verses), Chorus, Outro (2 verses). Also include: Suggested tempo (BPM), Recommended instruments, Production notes.`;
        const userPrompt = input.language === "es"
          ? `Crea un jingle/canción para: ${input.prompt}. Género musical: ${input.genre}. Tono: ${input.tone}. La canción debe ser memorable, profesional y perfecta para marketing.`
          : `Create a jingle/song for: ${input.prompt}. Musical genre: ${input.genre}. Tone: ${input.tone}. The song should be memorable, professional and perfect for marketing.`;
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });
        const rawContent = response.choices[0]?.message?.content;
        const lyrics = typeof rawContent === "string"
          ? rawContent
          : Array.isArray(rawContent)
            ? rawContent.map((c: { type: string; text?: string }) => c.type === "text" ? c.text ?? "" : "").join("")
            : "No se pudo generar la canción.";
        await incrementMonthlyUsage(ctx.user.id);
        await saveGeneration({
          userId: ctx.user.id,
          type: "song_jingle",
          prompt: input.prompt,
          result: lyrics,
          imageUrl: null,
        });
        return { lyrics };
      }),

    // ─── Transcripción de voz ──────────────────────────────────────────────
    transcribeVoice: protectedProcedure
      .input(z.object({
        audioBase64: z.string(),
        language: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Decode base64 and upload to S3
        const buffer = Buffer.from(input.audioBase64, "base64");
        const fileKey = `voice/${ctx.user.id}-${Date.now()}.webm`;
        const { url: audioUrl } = await storagePut(fileKey, buffer, "audio/webm");
        // Transcribe
        const result = await transcribeAudio({
          audioUrl,
          language: input.language,
          prompt: "Transcribe el audio del usuario para generar contenido de marketing",
        });
        if ("error" in result) {
          throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
        }
        return { text: result.text, language: result.language };
      }),

    chat: protectedProcedure
      .input(z.object({
        message: z.string().min(1).max(4000),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).default([]),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verificar límite de uso
        const sub = await getUserSubscription(ctx.user.id);
        const plan = (sub?.plan ?? "free") as PlanType;
        const allowed = await canGenerate(ctx.user.id, plan);
        if (!allowed) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Has alcanzado el límite de tu plan. Actualiza para continuar.",
          });
        }

        const messages = [
          {
            role: "system" as const,
            content: `Eres ContentAI, un asistente de inteligencia artificial especializado en negocios, marketing, branding y estrategia empresarial para el mercado latinoamericano. Eres experto en: marketing digital, redes sociales, estrategia de negocios, redacción profesional, análisis de contratos, nutrición básica, productividad y emprendimiento. Responde siempre de forma clara, útil y profesional. Si el usuario escribe en inglés, responde en inglés. Si escribe en español, responde en español.`,
          },
          ...input.history.slice(-10).map(h => ({ role: h.role as "user" | "assistant", content: h.content })),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({ messages });
        const rawContent = response.choices[0]?.message?.content;
        const result = typeof rawContent === "string"
          ? rawContent
          : Array.isArray(rawContent)
            ? rawContent.map((c: { type: string; text?: string }) => c.type === "text" ? c.text ?? "" : "").join("")
            : "Lo siento, no pude procesar tu mensaje.";

        await incrementMonthlyUsage(ctx.user.id);
        return { response: result };
      }),
  }),

  // ─── Calendario Editorial ─────────────────────────────────────────────────────
  calendar: router({
    getEvents: protectedProcedure
      .input(z.object({ month: z.string().regex(/^\d{4}-\d{2}$/) }))
      .query(async ({ ctx, input }) => {
        return getCalendarEvents(ctx.user.id, input.month);
      }),

    createEvent: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        contentType: z.string().optional(),
        platform: z.string().optional(),
        scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        scheduledTime: z.string().optional(),
        status: z.enum(["draft", "scheduled", "published", "cancelled"]).optional(),
        generationId: z.number().optional(),
        color: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createCalendarEvent({ ...input, userId: ctx.user.id });
      }),

    updateEvent: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        contentType: z.string().optional(),
        platform: z.string().optional(),
        scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        scheduledTime: z.string().optional(),
        status: z.enum(["draft", "scheduled", "published", "cancelled"]).optional(),
        color: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateCalendarEvent(id, ctx.user.id, data);
      }),

    deleteEvent: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteCalendarEvent(input.id, ctx.user.id);
      }),
  }),

  // ─── Admin ──────────────────────────────────────────────────────────────────────
  admin: router({ users: adminProcedure.query(async () => {
      return getAllUsersWithSubscriptions();
    }),
    stats: adminProcedure.query(async () => {
      return getPlatformStats();
    }),
    updateUserPlan: adminProcedure
      .input(z.object({
        userId: z.number(),
        plan: z.enum(["free", "starter", "pro", "team", "business", "enterprise"]),
      }))
      .mutation(async ({ input }) => {
        await updateUserPlan(input.userId, input.plan);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
