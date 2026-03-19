import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect } from "react";
import {
  Users, BarChart3, Sparkles, ArrowLeft, Crown,
  TrendingUp, Zap, Shield
} from "lucide-react";

const PLAN_COLORS: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  pro: "bg-blue-100 text-blue-700",
  professional: "bg-purple-100 text-purple-700",
  enterprise: "bg-amber-100 text-amber-700",
};

const PLAN_NAMES: Record<string, string> = {
  free: "Gratis",
  pro: "Pro",
  professional: "Profesional",
  enterprise: "Empresarial",
};

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();

  const { data: users, refetch: refetchUsers } = trpc.admin.users.useQuery();
  const { data: stats } = trpc.admin.stats.useQuery();

  const updatePlanMutation = trpc.admin.updateUserPlan.useMutation({
    onSuccess: () => {
      toast.success(language === "es" ? "Plan actualizado" : "Plan updated");
      refetchUsers();
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/");
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center animate-pulse">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
    );
  }

  const planBreakdown = stats?.planBreakdown ?? {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gray-900">
                {t("admin_title")}
              </span>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-700 border-0">
            <Crown className="w-3 h-3 mr-1" /> Admin
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">{t("admin_total_users")}</span>
            </div>
            <div className="text-3xl font-display font-black text-gray-900">{stats?.totalUsers ?? 0}</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">{t("admin_total_generations")}</span>
            </div>
            <div className="text-3xl font-display font-black text-gray-900">{stats?.totalGenerations ?? 0}</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                {language === "es" ? "Usuarios Pro+" : "Pro+ Users"}
              </span>
            </div>
            <div className="text-3xl font-display font-black text-gray-900">
              {(planBreakdown.pro ?? 0) + (planBreakdown.professional ?? 0) + (planBreakdown.enterprise ?? 0)}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">{t("admin_plan_breakdown")}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(planBreakdown).map(([plan, count]) => (
                <Badge key={plan} className={`text-xs ${PLAN_COLORS[plan]}`}>
                  {PLAN_NAMES[plan]}: {count as number}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Plan breakdown visual */}
        {stats && stats.totalUsers > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
            <h3 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              {t("admin_plan_breakdown")}
            </h3>
            <div className="space-y-3">
              {Object.entries(planBreakdown).map(([plan, count]) => {
                const pct = stats.totalUsers > 0 ? Math.round(((count as number) / stats.totalUsers) * 100) : 0;
                return (
                  <div key={plan}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{PLAN_NAMES[plan]}</span>
                      <span className="text-gray-500">{count as number} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="gradient-brand h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Users table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              {t("admin_users")} ({users?.length ?? 0})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin_user_name")}</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin_user_email")}</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin_user_plan")}</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin_user_joined")}</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin_change_plan")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users?.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{u.name ?? "—"}</p>
                          {u.role === "admin" && (
                            <Badge className="text-xs bg-amber-100 text-amber-700 border-0 mt-0.5">Admin</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email ?? "—"}</td>
                    <td className="px-6 py-4">
                      <Badge className={`text-xs ${PLAN_COLORS[(u as any).subscription?.plan ?? "free"]}`}>
                        {PLAN_NAMES[(u as any).subscription?.plan ?? "free"]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString(language === "es" ? "es-MX" : "en-US")}
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={(u as any).subscription?.plan ?? "free"}
                        onValueChange={(plan) => updatePlanMutation.mutate({ userId: u.id, plan: plan as any })}
                      >
                        <SelectTrigger className="w-36 rounded-xl border-gray-200 text-xs h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Gratis</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="professional">Profesional</SelectItem>
                          <SelectItem value="enterprise">Empresarial</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {(!users || users.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                      {language === "es" ? "No hay usuarios registrados aún." : "No users registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
