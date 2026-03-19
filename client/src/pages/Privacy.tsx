import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Shield, Lock } from "lucide-react";

export default function Privacy() {
  const { language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();
  const t = (es: string, en: string) => language === "es" ? es : en;

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
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("Aviso de Privacidad", "Privacy Notice")}</h1>
              <p className="text-sm text-gray-500">{t("Última actualización: 14 de marzo de 2025", "Last updated: March 14, 2025")}</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("1. Responsable del Tratamiento de Datos", "1. Data Controller")}</h2>
              <p>{t(
                "ContentAI es responsable del tratamiento de sus datos personales. Para cualquier consulta relacionada con el tratamiento de sus datos, puede contactarnos en: support@contentai.com",
                "ContentAI is responsible for the processing of your personal data. For any queries related to the processing of your data, you can contact us at: support@contentai.com"
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("2. Datos Personales que Recopilamos", "2. Personal Data We Collect")}</h2>
              <p>{t(
                "Recopilamos los siguientes datos personales: nombre completo, dirección de correo electrónico, información de pago (procesada de forma segura por Stripe o KobraPay, sin almacenar datos de tarjeta en nuestros servidores), historial de contenido generado, datos de uso de la plataforma e información del dispositivo y navegador.",
                "We collect the following personal data: full name, email address, payment information (securely processed by Stripe or KobraPay, without storing card data on our servers), history of generated content, platform usage data, and device and browser information."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("3. Finalidad del Tratamiento", "3. Purpose of Processing")}</h2>
              <p>{t(
                "Sus datos personales son utilizados para: prestar el servicio de generación de contenido con IA, gestionar su cuenta y suscripción, procesar pagos, enviar comunicaciones relacionadas con el servicio, mejorar la plataforma mediante análisis de uso, y cumplir con obligaciones legales aplicables.",
                "Your personal data is used to: provide the AI content generation service, manage your account and subscription, process payments, send service-related communications, improve the platform through usage analysis, and comply with applicable legal obligations."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("4. Compartición de Datos", "4. Data Sharing")}</h2>
              <p>{t(
                "ContentAI no vende ni alquila sus datos personales a terceros. Podemos compartir datos con: proveedores de servicios de pago (Stripe, KobraPay) para procesar transacciones, proveedores de servicios de IA para generar contenido (los prompts se procesan de forma anónima), y autoridades competentes cuando sea requerido por ley.",
                "ContentAI does not sell or rent your personal data to third parties. We may share data with: payment service providers (Stripe, KobraPay) to process transactions, AI service providers to generate content (prompts are processed anonymously), and competent authorities when required by law."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("5. Seguridad de los Datos", "5. Data Security")}</h2>
              <p>{t(
                "Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales, incluyendo cifrado SSL/TLS, almacenamiento seguro en bases de datos protegidas, acceso restringido a datos personales, y monitoreo continuo de seguridad.",
                "We implement technical and organizational security measures to protect your personal data, including SSL/TLS encryption, secure storage in protected databases, restricted access to personal data, and continuous security monitoring."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("6. Sus Derechos (ARCO)", "6. Your Rights (ARCO)")}</h2>
              <p>{t(
                "Usted tiene derecho a: Acceder a sus datos personales, Rectificar datos inexactos, Cancelar el tratamiento de sus datos, y Oponerse al tratamiento. Para ejercer estos derechos, envíe una solicitud a support@contentai.com con su nombre, correo registrado y el derecho que desea ejercer. Responderemos en un plazo máximo de 20 días hábiles.",
                "You have the right to: Access your personal data, Rectify inaccurate data, Cancel the processing of your data, and Object to processing. To exercise these rights, send a request to support@contentai.com with your name, registered email and the right you wish to exercise. We will respond within a maximum of 20 business days."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("7. Cookies", "7. Cookies")}</h2>
              <p>{t(
                "ContentAI utiliza cookies esenciales para el funcionamiento de la plataforma (autenticación y sesión) y cookies analíticas para mejorar el servicio. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar el funcionamiento de la plataforma.",
                "ContentAI uses essential cookies for platform operation (authentication and session) and analytical cookies to improve the service. You can configure your browser to reject cookies, although this may affect platform functionality."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("8. Retención de Datos", "8. Data Retention")}</h2>
              <p>{t(
                "Conservamos sus datos personales mientras mantenga una cuenta activa en ContentAI. Al eliminar su cuenta, sus datos serán eliminados en un plazo de 30 días, excepto aquellos que debamos conservar por obligaciones legales.",
                "We retain your personal data as long as you maintain an active account on ContentAI. Upon account deletion, your data will be deleted within 30 days, except for data we must retain due to legal obligations."
              )}</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t("9. Contacto", "9. Contact")}</h2>
              <p>{t(
                "Para cualquier consulta sobre este Aviso de Privacidad o el tratamiento de sus datos personales, contáctenos en: support@contentai.com",
                "For any queries about this Privacy Notice or the processing of your personal data, contact us at: support@contentai.com"
              )}</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">
              {t("Volver al inicio", "Back to home")}
            </Button>
            <Button onClick={() => navigate("/terms")} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 rounded-xl">
              {t("Ver Términos y Condiciones", "View Terms and Conditions")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
