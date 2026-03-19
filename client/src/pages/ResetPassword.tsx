import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Lock, CheckCircle, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { language } = useLanguage();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      toast.success(language === "es" ? "¡Contraseña actualizada!" : "Password updated!");
    },
    onError: (err) => {
      toast.error(err.message || (language === "es" ? "Error al restablecer la contraseña" : "Error resetting password"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(language === "es" ? "Las contraseñas no coinciden" : "Passwords don't match");
      return;
    }
    if (password.length < 8) {
      toast.error(language === "es" ? "La contraseña debe tener al menos 8 caracteres" : "Password must be at least 8 characters");
      return;
    }
    resetMutation.mutate({ token, newPassword: password });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-3">
            {language === "es" ? "Enlace inválido" : "Invalid link"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {language === "es"
              ? "Este enlace de recuperación no es válido o ha expirado."
              : "This recovery link is invalid or has expired."}
          </p>
          <Button onClick={() => navigate("/forgot-password")} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            {language === "es" ? "Solicitar nuevo enlace" : "Request new link"}
          </Button>
        </div>
      </div>
    );
  }

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
          {!success ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">
                  {language === "es" ? "Nueva contraseña" : "New password"}
                </h1>
                <p className="text-gray-500 text-sm">
                  {language === "es"
                    ? "Elige una contraseña segura de al menos 8 caracteres."
                    : "Choose a secure password of at least 8 characters."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    {language === "es" ? "Nueva contraseña" : "New password"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === "es" ? "Mínimo 8 caracteres" : "Minimum 8 characters"}
                      required
                      minLength={8}
                      className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                    {language === "es" ? "Confirmar contraseña" : "Confirm password"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={language === "es" ? "Repite la contraseña" : "Repeat password"}
                      required
                      className="h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-100 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {language === "es" ? "Las contraseñas no coinciden" : "Passwords don't match"}
                    </p>
                  )}
                </div>

                {/* Strength indicator */}
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            password.length >= i * 2
                              ? password.length >= 12 ? "bg-green-500"
                                : password.length >= 8 ? "bg-yellow-500"
                                : "bg-red-400"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {password.length < 8
                        ? (language === "es" ? "Muy corta" : "Too short")
                        : password.length < 12
                        ? (language === "es" ? "Aceptable" : "Acceptable")
                        : (language === "es" ? "Segura" : "Strong")}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={resetMutation.isPending || password.length < 8 || password !== confirmPassword}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm"
                >
                  {resetMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === "es" ? "Actualizando..." : "Updating..."}</>
                  ) : (
                    language === "es" ? "Actualizar contraseña" : "Update password"
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">
                {language === "es" ? "¡Contraseña actualizada!" : "Password updated!"}
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                {language === "es"
                  ? "Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña."
                  : "Your password has been successfully reset. You can now sign in with your new password."}
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8"
              >
                {language === "es" ? "Ir al login" : "Go to login"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
