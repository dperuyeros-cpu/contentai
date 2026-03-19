import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ChevronLeft, ChevronRight, Plus, X, CalendarDays,
  Instagram, Twitter, Linkedin, Youtube, Facebook,
  FileText, Megaphone, Mail, Video, Music, Image,
  Sparkles, Trash2, CheckCircle, ArrowLeft,
  Loader2
} from "lucide-react";
import { getLoginUrl } from "@/const";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  email: Mail,
  blog: FileText,
  video: Video,
  music: Music,
  image: Image,
  ad: Megaphone,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-100 text-pink-700 border-pink-200",
  twitter: "bg-sky-100 text-sky-700 border-sky-200",
  linkedin: "bg-blue-100 text-blue-700 border-blue-200",
  youtube: "bg-red-100 text-red-700 border-red-200",
  facebook: "bg-indigo-100 text-indigo-700 border-indigo-200",
  email: "bg-yellow-100 text-yellow-700 border-yellow-200",
  blog: "bg-green-100 text-green-700 border-green-200",
  video: "bg-orange-100 text-orange-700 border-orange-200",
  music: "bg-purple-100 text-purple-700 border-purple-200",
  image: "bg-violet-100 text-violet-700 border-violet-200",
  ad: "bg-rose-100 text-rose-700 border-rose-200",
};

const EVENT_COLORS = [
  { id: "blue", label: "Azul", class: "bg-blue-500" },
  { id: "green", label: "Verde", class: "bg-green-500" },
  { id: "purple", label: "Morado", class: "bg-purple-500" },
  { id: "pink", label: "Rosa", class: "bg-pink-500" },
  { id: "orange", label: "Naranja", class: "bg-orange-500" },
  { id: "red", label: "Rojo", class: "bg-red-500" },
  { id: "yellow", label: "Amarillo", class: "bg-yellow-500" },
  { id: "teal", label: "Verde azul", class: "bg-teal-500" },
];

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  green: "bg-green-100 text-green-800 border-green-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  pink: "bg-pink-100 text-pink-800 border-pink-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  red: "bg-red-100 text-red-800 border-red-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  teal: "bg-teal-100 text-teal-800 border-teal-200",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  scheduled: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

type CalendarEventType = {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  contentType: string | null;
  platform: string | null;
  scheduledDate: string;
  scheduledTime: string | null;
  status: "draft" | "scheduled" | "published" | "cancelled";
  generationId: number | null;
  color: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const DAYS_OF_WEEK_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAYS_OF_WEEK_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface EventFormData {
  title: string;
  description: string;
  platform: string;
  contentType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "draft" | "scheduled" | "published" | "cancelled";
  color: string;
  notes: string;
}

const defaultForm: EventFormData = {
  title: "",
  description: "",
  platform: "instagram",
  contentType: "instagram_post",
  scheduledDate: "",
  scheduledTime: "09:00",
  status: "scheduled",
  color: "blue",
  notes: "",
};

export default function Calendar() {
  const { user, isAuthenticated, loading } = useAuth();
  const { language } = useLanguage();
  const [, navigate] = useLocation();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventType | null>(null);
  const [form, setForm] = useState<EventFormData>(defaultForm);

  const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const { data: events = [], refetch } = trpc.calendar.getEvents.useQuery(
    { month: monthStr },
    { enabled: isAuthenticated }
  );

  const createMutation = trpc.calendar.createEvent.useMutation({
    onSuccess: () => {
      toast.success(language === "es" ? "Evento creado" : "Event created");
      refetch();
      setShowModal(false);
      setForm(defaultForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.calendar.updateEvent.useMutation({
    onSuccess: () => {
      toast.success(language === "es" ? "Evento actualizado" : "Event updated");
      refetch();
      setShowModal(false);
      setEditingEvent(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.calendar.deleteEvent.useMutation({
    onSuccess: () => {
      toast.success(language === "es" ? "Evento eliminado" : "Event deleted");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentYear, currentMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEventType[]> = {};
    for (const ev of events as CalendarEventType[]) {
      if (!map[ev.scheduledDate]) map[ev.scheduledDate] = [];
      map[ev.scheduledDate].push(ev);
    }
    return map;
  }, [events]);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const openCreate = (dateStr: string) => {
    setEditingEvent(null);
    setForm({ ...defaultForm, scheduledDate: dateStr });
    setShowModal(true);
  };

  const openEdit = (ev: CalendarEventType) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      description: ev.description ?? "",
      platform: ev.platform ?? "instagram",
      contentType: ev.contentType ?? "instagram_post",
      scheduledDate: ev.scheduledDate,
      scheduledTime: ev.scheduledTime ?? "09:00",
      status: ev.status,
      color: ev.color ?? "blue",
      notes: ev.notes ?? "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, ...form });
    } else {
      createMutation.mutate(form);
    }
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <CalendarDays className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {language === "es" ? "Inicia sesión para ver tu calendario" : "Sign in to view your calendar"}
          </h2>
          <Button onClick={() => window.location.href = getLoginUrl()} className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
            {language === "es" ? "Iniciar sesión" : "Sign in"}
          </Button>
        </div>
      </div>
    );
  }

  const daysOfWeek = language === "es" ? DAYS_OF_WEEK_ES : DAYS_OF_WEEK_EN;
  const months = language === "es" ? MONTHS_ES : MONTHS_EN;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {language === "es" ? "Dashboard" : "Dashboard"}
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <img src={LOGO_URL} alt="ContentAI" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            {language === "es" ? "Calendario Editorial" : "Editorial Calendar"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <Button
            onClick={() => openCreate(todayStr)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            {language === "es" ? "Nuevo evento" : "New event"}
          </Button>
        </div>
      </nav>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h2 className="text-xl font-black text-gray-900 min-w-[200px] text-center">
              {months[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); }}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              {language === "es" ? "Hoy" : "Today"}
            </button>
            <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">
              {(events as CalendarEventType[]).length} {language === "es" ? "eventos" : "events"}
            </Badge>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dateStr = day
                ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : null;
              const dayEvents = dateStr ? (eventsByDate[dateStr] ?? []) : [];
              const isToday = dateStr === todayStr;
              const isPast = dateStr ? dateStr < todayStr : false;

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] border-b border-r border-gray-50 p-1.5 relative transition-colors ${
                    day ? "cursor-pointer hover:bg-blue-50/30" : "bg-gray-50/50"
                  } ${isToday ? "bg-blue-50/50" : ""} ${isPast && day ? "opacity-70" : ""}`}
                  onClick={() => day && dateStr && openCreate(dateStr)}
                >
                  {day && (
                    <>
                      <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${
                        isToday ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map((ev) => {
                          const PlatformIcon = ev.platform ? (PLATFORM_ICONS[ev.platform] ?? Sparkles) : Sparkles;
                          const colorClass = COLOR_MAP[ev.color ?? "blue"] ?? COLOR_MAP.blue;
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium border truncate cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
                            >
                              <PlatformIcon className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-400 pl-1">+{dayEvents.length - 3} {language === "es" ? "más" : "more"}</div>
                        )}
                      </div>
                      {day && (
                        <button
                          onClick={(e) => { e.stopPropagation(); dateStr && openCreate(dateStr); }}
                          className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">{language === "es" ? "Estado:" : "Status:"}</span>
          {Object.entries(STATUS_COLORS).map(([status, cls]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                {status === "draft" ? (language === "es" ? "Borrador" : "Draft")
                  : status === "scheduled" ? (language === "es" ? "Programado" : "Scheduled")
                  : status === "published" ? (language === "es" ? "Publicado" : "Published")
                  : (language === "es" ? "Cancelado" : "Cancelled")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create/Edit Event */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">
                  {editingEvent
                    ? (language === "es" ? "Editar evento" : "Edit event")
                    : (language === "es" ? "Nuevo evento" : "New event")}
                </h3>
              </div>
              <button
                onClick={() => { setShowModal(false); setEditingEvent(null); setForm(defaultForm); }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {language === "es" ? "Título del evento *" : "Event title *"}
                </Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={language === "es" ? "Ej: Post de Instagram - Lanzamiento de producto" : "E.g: Instagram Post - Product Launch"}
                  required
                  className="h-10 rounded-xl border-gray-200 text-sm"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">
                    {language === "es" ? "Fecha *" : "Date *"}
                  </Label>
                  <Input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                    required
                    className="h-10 rounded-xl border-gray-200 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-700">
                    {language === "es" ? "Hora" : "Time"}
                  </Label>
                  <Input
                    type="time"
                    value={form.scheduledTime}
                    onChange={(e) => setForm(f => ({ ...f, scheduledTime: e.target.value }))}
                    className="h-10 rounded-xl border-gray-200 text-sm"
                  />
                </div>
              </div>

              {/* Platform */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {language === "es" ? "Plataforma" : "Platform"}
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.entries(PLATFORM_ICONS).map(([platform, Icon]) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, platform }))}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all ${
                        form.platform === platform
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{platform}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {language === "es" ? "Estado" : "Status"}
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["draft", "scheduled", "published", "cancelled"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, status: s }))}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                        form.status === s
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      {s === "draft" ? (language === "es" ? "Borrador" : "Draft")
                        : s === "scheduled" ? (language === "es" ? "Programado" : "Scheduled")
                        : s === "published" ? (language === "es" ? "Publicado" : "Published")
                        : (language === "es" ? "Cancelado" : "Cancelled")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {language === "es" ? "Color" : "Color"}
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {EVENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, color: c.id }))}
                      className={`w-7 h-7 rounded-full ${c.class} transition-all ${
                        form.color === c.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {language === "es" ? "Descripción" : "Description"}
                </Label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  placeholder={language === "es" ? "Descripción del contenido a publicar..." : "Description of content to publish..."}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {language === "es" ? "Notas internas" : "Internal notes"}
                </Label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder={language === "es" ? "Notas para tu equipo..." : "Notes for your team..."}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {editingEvent ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(language === "es" ? "¿Eliminar este evento?" : "Delete this event?")) {
                        deleteMutation.mutate({ id: editingEvent.id });
                        setShowModal(false);
                        setEditingEvent(null);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {language === "es" ? "Eliminar" : "Delete"}
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => { setShowModal(false); setEditingEvent(null); setForm(defaultForm); }}
                    className="rounded-xl text-xs"
                  >
                    {language === "es" ? "Cancelar" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : editingEvent ? (
                      <><CheckCircle className="w-3.5 h-3.5" />{language === "es" ? "Guardar" : "Save"}</>
                    ) : (
                      <><Plus className="w-3.5 h-3.5" />{language === "es" ? "Crear evento" : "Create event"}</>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
