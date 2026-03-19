import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect } from "react";
import {
  User, ArrowLeft, Crown, Sparkles, CreditCard,
  Calendar, BarChart3, LogOut, Shield, Mail, Clock
} from "lucide-react";

const PLAN_CONFIG: Record<string, { name: { es: string; en: string }; color: string; bg: string; icon: React.ElementType }> = {
  free: { name: { es: "Gratis", en: "Free" }, color: "text-gray-600", bg: "bg-gray-100", icon: Sparkles },
  pro: { name: { es: "Pro", en: "Pro" }, color: "text-blue-600", bg: "bg-blue-100", icon: Zap },
  professional: { name: { es: "Profesional", en: "Professional" }, color: "text-purple-600", bg: "bg-purple-100", icon: Crown },
  enterprise: { name: { es: "Empresarial", en: "Enterprise" }, color: "text-amber-600", bg: "bg-amber-100", icon: Crown },
};

import { Zap } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();

  const { data: subscription } = trpc.subscription.get.useQuery(undefined, { enabled: isAuthenticated });
  const { data: history } = trpc.content.history.useQuery({ limit: 50 }, { enabled: isAuthenticated });

  const t = (es: string, en: string) => language === "es" ? es : en;

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/");
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-500 text-sm">{t("Cargando...", "Loading...")}</p>
        </div>
      </div>
    );
  }

  const plan = (subscription?.plan ?? "free") as string;
  const planConfig = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;
  const PlanIcon = planConfig.icon;

  const contentTypeCounts = history?.reduce((acc: Record<string, number>, item: { type: string }) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};

  const typeLabels: Record<string, { es: string; en: string }> = {
    instagram: { es: "Instagram", en: "Instagram" },
    twitter: { es: "Twitter/X", en: "Twitter/X" },
    blog: { es: "Blog", en: "Blog" },
    email: { es: "Email", en: "Email" },
    video_script: { es: "Video Script", en: "Video Script" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("Dashboard", "Dashboard")}
            </button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-gray-900">ContentAI</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("Salir", "Logout")}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Encabezado de perfil */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name ?? t("Usuario", "User")}</h1>
                <Badge className={`${planConfig.bg} ${planConfig.color} border-0 px-3 py-1`}>
                  <PlanIcon className="w-3.5 h-3.5 mr-1.5" />
                  {planConfig.name[language]}
                </Badge>
                {user?.role === "admin" && (
                  <Badge className="bg-red-100 text-red-600 border-0 px-3 py-1">
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    Admin
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {user?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {t("Miembro desde", "Member since")} {new Date(user?.createdAt ?? Date.now()).toLocaleDateString(language === "es" ? "es-MX" : "en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 rounded-xl"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t("Generar Contenido", "Generate Content")}
            </Button>
          </div>
        </div>

        {/* Estadísticas de uso */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: t("Generaciones este mes", "Generations this month"),
              value: subscription?.usage ?? 0,
              icon: Sparkles,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: t("Límite del plan", "Plan limit"),
              value: subscription?.limit === -1 ? "∞" : (subscription?.limit ?? 3),
              icon: BarChart3,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: t("Total generaciones", "Total generations"),
              value: history?.length ?? 0,
              icon: Clock,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: t("Tipos usados", "Types used"),
              value: Object.keys(contentTypeCounts).length,
              icon: User,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Distribución por tipo de contenido */}
        {Object.keys(contentTypeCounts).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-5">{t("Contenido generado por tipo", "Content generated by type")}</h2>
            <div className="space-y-3">
              {Object.entries(contentTypeCounts).map(([type, count]) => {
                const total = history?.length ?? 1;
                const pct = Math.round(((count as number) / total) * 100);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-700">{typeLabels[type]?.[language] ?? type}</span>
                      <span className="text-sm font-semibold text-gray-900">{count as number} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Suscripción actual */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">{t("Tu Suscripción", "Your Subscription")}</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${planConfig.bg} flex items-center justify-center`}>
                <PlanIcon className={`w-6 h-6 ${planConfig.color}`} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{t("Plan", "Plan")} {planConfig.name[language]}</p>
                <p className="text-sm text-gray-500">
                  {subscription?.limit === -1
                    ? t("Generaciones ilimitadas", "Unlimited generations")
                    : t(`${subscription?.remaining ?? 0} generaciones restantes este mes`, `${subscription?.remaining ?? 0} generations remaining this month`)}
                </p>
              </div>
            </div>
            {plan === "free" && (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 rounded-xl"
              >
                <Crown className="w-4 h-4 mr-2" />
                {t("Mejorar Plan", "Upgrade Plan")}
              </Button>
            )}
            {plan !== "free" && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                <CreditCard className="w-4 h-4" />
                {t("Suscripción activa", "Active subscription")}
              </div>
            )}
          </div>

          {/* Barra de uso */}
          {subscription?.limit !== -1 && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{t("Uso este mes", "Usage this month")}</span>
                <span>{subscription?.usage ?? 0} / {subscription?.limit ?? 3}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (subscription?.usage ?? 0) >= (subscription?.limit ?? 3)
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-blue-500 to-blue-600"
                  }`}
                  style={{ width: `${Math.min(100, ((subscription?.usage ?? 0) / (subscription?.limit ?? 3)) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Links útiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: t("Términos y Condiciones", "Terms & Conditions"), href: "/terms", icon: Shield },
            { label: t("Aviso de Privacidad", "Privacy Notice"), href: "/privacy", icon: Shield },
            { label: t("Servicios de Agencia", "Agency Services"), href: "/agency", icon: Crown },
          ].map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.href)}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-left"
            >
              <link.icon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
