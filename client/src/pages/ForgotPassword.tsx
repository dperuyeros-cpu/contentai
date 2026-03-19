import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png";

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      setSent(true);
    },
    onError: (err) => {
      toast.error(err.message || (language === "es" ? "Error al enviar el correo" : "Error sending email"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    forgotMutation.mutate({ email: email.trim(), origin: window.location.origin });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <img src={LOGO_URL} alt="ContentAI" className="h-12 w-auto" />
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "es" ? "Volver al login" : "Back to login"}
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {!sent ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">
                  {language === "es" ? "¿Olvidaste tu contraseña?" : "Forgot your password?"}
                </h1>
                <p className="text-gray-500 text-sm">
                  {language === "es"
                    ? "Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla."
                    : "Enter your email address and we'll send you a link to reset it."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    {language === "es" ? "Correo electrónico" : "Email address"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === "es" ? "tu@correo.com" : "your@email.com"}
                    required
                    className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={forgotMutation.isPending || !email.trim()}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm"
                >
                  {forgotMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === "es" ? "Enviando..." : "Sending..."}</>
                  ) : (
                    language === "es" ? "Enviar enlace de recuperación" : "Send recovery link"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                {language === "es" ? "¿Recuerdas tu contraseña?" : "Remember your password?"}{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {language === "es" ? "Inicia sesión" : "Sign in"}
                </button>
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">
                {language === "es" ? "¡Correo enviado!" : "Email sent!"}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {language === "es"
                  ? `Si existe una cuenta con el correo ${email}, recibirás un enlace para restablecer tu contraseña en los próximos minutos.`
                  : `If an account exists with ${email}, you'll receive a password reset link in the next few minutes.`}
              </p>
              <p className="text-gray-400 text-xs mb-8">
                {language === "es"
                  ? "Revisa también tu carpeta de spam o correo no deseado."
                  : "Also check your spam or junk folder."}
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8"
              >
                {language === "es" ? "Volver al login" : "Back to login"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
