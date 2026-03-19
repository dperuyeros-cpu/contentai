import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png";

const BENEFITS = [
  "5 generaciones gratis al mes",
  "40+ tipos de contenido con IA",
  "20+ industrias especializadas",
  "Sin tarjeta de crédito requerida",
];

export default function Register() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const utils = trpc.useUtils();
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("¡Cuenta creada! Bienvenido a ContentAI.");
      navigate("/dashboard");
    },
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("Este email ya está registrado. ¿Quieres iniciar sesión?");
      } else {
        toast.error(err.message || "Error al crear la cuenta.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Por favor completa todos los campos.");
      return;
    }
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    registerMutation.mutate({ name, email, password });
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel = ["", "Débil", "Regular", "Fuerte"];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={LOGO_URL} alt="ContentAI" className="h-12 w-auto" />
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          {/* Left — Benefits */}
          <div className="hidden md:block">
            <div className="mb-8">
              <img src={LOGO_URL} alt="ContentAI" className="h-14 w-auto mb-6" />
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                ✨ Gratis para siempre
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
              Tu agencia de marketing<br />
              <span className="text-blue-600">con inteligencia artificial</span>
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Genera posts, anuncios, artículos y branding en segundos. Sin agencia, sin diseñador, sin esperar.
            </p>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">
                "ContentAI me ahorra 15 horas a la semana. Antes pagaba $8,000 MXN a un community manager."
              </p>
              <p className="text-xs text-blue-600 mt-2">— Carlos M., Restaurante La Hacienda</p>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta gratis</h1>
              <p className="text-gray-500 text-sm">Sin tarjeta de crédito · Cancela cuando quieras</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nombre completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-200 focus:border-blue-500"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-gray-200 focus:border-blue-500 pr-10"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColor[passwordStrength] : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{strengthLabel[passwordStrength]}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`h-11 border-gray-200 focus:border-blue-500 ${confirmPassword && password !== confirmPassword ? "border-red-300 focus:border-red-400" : ""}`}
                  autoComplete="new-password"
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm shadow-blue-200/50 mt-2"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                ) : "Crear cuenta gratis →"}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Inicia sesión
                </button>
              </p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Al registrarte, aceptas nuestros{" "}
              <button onClick={() => navigate("/terms")} className="underline hover:text-gray-600">Términos</button>
              {" "}y{" "}
              <button onClick={() => navigate("/privacy")} className="underline hover:text-gray-600">Privacidad</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
