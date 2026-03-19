import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Shield } from "lucide-react";

export default function Terms() {
  const { language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();
  const t = (es: string, en: string) => language === "es" ? es : en;
  const lastUpdated = "14 de marzo de 2025 / March 14, 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1 as any)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              {t("Regresar", "Back")}
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-gray-900">ContentAI</span>
            </div>
          </div>
          <button onClick={() => setLanguage(language === "es" ? "en" : "es")} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all">
            {language === "es" ? "EN" : "ES"}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("Términos y Condiciones", "Terms and Conditions")}</h1>
              <p className="text-sm text-gray-500">{t("Última actualización:", "Last updated:")} {lastUpdated}</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("1. Aceptación de los Términos", "1. Acceptance of Terms")}</h2>
              <p>{t(
                "Al acceder y utilizar ContentAI (en adelante 'la Plataforma'), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio. ContentAI se reserva el derecho de modificar estos términos en cualquier momento.",
                "By accessing and using ContentAI (hereinafter 'the Platform'), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service. ContentAI reserves the right to modify these terms at any time."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("2. Descripción del Servicio", "2. Description of Service")}</h2>
              <p>{t(
                "ContentAI es una plataforma de generación de contenido impulsada por inteligencia artificial que permite a los usuarios crear posts de Instagram, tweets, artículos de blog, emails de marketing y scripts de video de manera automática. El servicio se ofrece bajo un modelo de suscripción con diferentes planes.",
                "ContentAI is an AI-powered content generation platform that allows users to automatically create Instagram posts, tweets, blog articles, marketing emails, and video scripts. The service is offered under a subscription model with different plans."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("3. Planes y Pagos", "3. Plans and Payments")}</h2>
              <p>{t(
                "ContentAI ofrece los siguientes planes de suscripción: Plan Gratis (3 generaciones/mes sin costo), Plan Pro ($9 USD/mes, 100 generaciones), Plan Profesional ($29 USD/mes, ilimitado) y Plan Empresarial ($99 USD/mes, ilimitado con soporte dedicado). Los pagos se procesan a través de Stripe (tarjetas internacionales) y KobraPay (México/Latinoamérica). Las suscripciones se renuevan automáticamente al inicio de cada período de facturación.",
                "ContentAI offers the following subscription plans: Free Plan (3 generations/month at no cost), Pro Plan ($9 USD/month, 100 generations), Professional Plan ($29 USD/month, unlimited) and Enterprise Plan ($99 USD/month, unlimited with dedicated support). Payments are processed through Stripe (international cards) and KobraPay (Mexico/Latin America). Subscriptions renew automatically at the start of each billing period."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("4. Uso Aceptable", "4. Acceptable Use")}</h2>
              <p>{t(
                "El usuario se compromete a utilizar ContentAI únicamente para fines lícitos y de conformidad con estos términos. Está prohibido: generar contenido ilegal, difamatorio, obsceno o que infrinja derechos de terceros; intentar acceder sin autorización a sistemas de la plataforma; revender o redistribuir el servicio sin autorización expresa; usar el servicio para generar spam o contenido engañoso.",
                "The user agrees to use ContentAI only for lawful purposes and in accordance with these terms. The following are prohibited: generating illegal, defamatory, obscene content or content that infringes third-party rights; attempting unauthorized access to platform systems; reselling or redistributing the service without express authorization; using the service to generate spam or misleading content."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("5. Propiedad Intelectual", "5. Intellectual Property")}</h2>
              <p>{t(
                "El contenido generado por ContentAI mediante inteligencia artificial es propiedad del usuario que lo generó. ContentAI se reserva todos los derechos sobre la plataforma, su diseño, código fuente y tecnología subyacente. El usuario otorga a ContentAI una licencia limitada para procesar sus solicitudes con el fin de prestar el servicio.",
                "Content generated by ContentAI through artificial intelligence is the property of the user who generated it. ContentAI reserves all rights over the platform, its design, source code and underlying technology. The user grants ContentAI a limited license to process their requests for the purpose of providing the service."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("6. Limitación de Responsabilidad", "6. Limitation of Liability")}</h2>
              <p>{t(
                "ContentAI no garantiza que el contenido generado sea completamente preciso, libre de errores o adecuado para todos los propósitos. El usuario es responsable de revisar y verificar el contenido antes de publicarlo. ContentAI no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso del servicio.",
                "ContentAI does not guarantee that generated content will be completely accurate, error-free, or suitable for all purposes. The user is responsible for reviewing and verifying content before publishing it. ContentAI shall not be liable for direct, indirect, incidental, or consequential damages arising from the use of the service."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("7. Cancelación y Reembolsos", "7. Cancellation and Refunds")}</h2>
              <p>{t(
                "El usuario puede cancelar su suscripción en cualquier momento desde el panel de control. Al cancelar, el acceso al plan de pago continuará hasta el final del período de facturación actual. ContentAI ofrece reembolsos completos dentro de los primeros 7 días de suscripción si el usuario no está satisfecho con el servicio.",
                "The user may cancel their subscription at any time from the control panel. Upon cancellation, access to the paid plan will continue until the end of the current billing period. ContentAI offers full refunds within the first 7 days of subscription if the user is not satisfied with the service."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("8. Contacto", "8. Contact")}</h2>
              <p>{t(
                "Para cualquier pregunta sobre estos Términos y Condiciones, puede contactarnos en: support@contentai.com",
                "For any questions about these Terms and Conditions, you can contact us at: support@contentai.com"
              )}</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">
              {t("Volver al inicio", "Back to home")}
            </Button>
            <Button onClick={() => navigate("/privacy")} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 rounded-xl">
              {t("Ver Aviso de Privacidad", "View Privacy Notice")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
