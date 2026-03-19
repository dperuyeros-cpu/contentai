import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Star, Download, ShoppingCart, Search, Filter, Check, Sparkles, Tag, Crown, Package, Zap, Globe, Utensils, Building2, Heart, Music, Camera, BookOpen, Wand2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";

type Lang = "es" | "en";

// ─── Plantillas disponibles ────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "restaurant_kit",
    category: "restaurant",
    title: { es: "Kit Completo Restaurante", en: "Complete Restaurant Kit" },
    description: { es: "30 plantillas de contenido para restaurantes: menú, promociones, redes sociales, email marketing y más.", en: "30 content templates for restaurants: menu, promotions, social media, email marketing and more." },
    price: 29,
    priceMXN: 580,
    rating: 4.9,
    reviews: 128,
    downloads: 1240,
    icon: Utensils,
    color: "bg-orange-500",
    tags: { es: ["Restaurante", "Redes Sociales", "Email"], en: ["Restaurant", "Social Media", "Email"] },
    featured: true,
    includes: {
      es: ["30 plantillas de texto", "5 prompts de imagen", "Guía de uso", "Actualizaciones gratuitas"],
      en: ["30 text templates", "5 image prompts", "Usage guide", "Free updates"],
    },
  },
  {
    id: "ecommerce_kit",
    category: "ecommerce",
    title: { es: "Kit E-commerce & Tienda Online", en: "E-commerce & Online Store Kit" },
    description: { es: "25 plantillas para tiendas online: descripciones de producto, emails de carrito abandonado, campañas de retargeting.", en: "25 templates for online stores: product descriptions, abandoned cart emails, retargeting campaigns." },
    price: 24,
    priceMXN: 480,
    rating: 4.8,
    reviews: 96,
    downloads: 870,
    icon: ShoppingCart,
    color: "bg-blue-500",
    tags: { es: ["E-commerce", "Producto", "Email"], en: ["E-commerce", "Product", "Email"] },
    featured: false,
    includes: {
      es: ["25 plantillas de texto", "Emails de carrito abandonado", "Descripciones SEO", "Actualizaciones gratuitas"],
      en: ["25 text templates", "Abandoned cart emails", "SEO descriptions", "Free updates"],
    },
  },
  {
    id: "real_estate_kit",
    category: "real_estate",
    title: { es: "Kit Inmobiliario Premium", en: "Premium Real Estate Kit" },
    description: { es: "20 plantillas para agentes inmobiliarios: listados de propiedades, emails de seguimiento, publicaciones en redes.", en: "20 templates for real estate agents: property listings, follow-up emails, social media posts." },
    price: 34,
    priceMXN: 680,
    rating: 4.7,
    reviews: 54,
    downloads: 420,
    icon: Building2,
    color: "bg-indigo-500",
    tags: { es: ["Inmobiliaria", "Propiedades", "Email"], en: ["Real Estate", "Properties", "Email"] },
    featured: false,
    includes: {
      es: ["20 plantillas de texto", "Listados de propiedades", "Emails de seguimiento", "Actualizaciones gratuitas"],
      en: ["20 text templates", "Property listings", "Follow-up emails", "Free updates"],
    },
  },
  {
    id: "health_wellness_kit",
    category: "health",
    title: { es: "Kit Salud & Bienestar", en: "Health & Wellness Kit" },
    description: { es: "25 plantillas para clínicas, spas y gimnasios: contenido educativo, promociones, testimonios.", en: "25 templates for clinics, spas and gyms: educational content, promotions, testimonials." },
    price: 24,
    priceMXN: 480,
    rating: 4.8,
    reviews: 73,
    downloads: 650,
    icon: Heart,
    color: "bg-pink-500",
    tags: { es: ["Salud", "Bienestar", "Gym"], en: ["Health", "Wellness", "Gym"] },
    featured: false,
    includes: {
      es: ["25 plantillas de texto", "Contenido educativo", "Promociones especiales", "Actualizaciones gratuitas"],
      en: ["25 text templates", "Educational content", "Special promotions", "Free updates"],
    },
  },
  {
    id: "entertainment_kit",
    category: "entertainment",
    title: { es: "Kit Entretenimiento & Eventos", en: "Entertainment & Events Kit" },
    description: { es: "20 plantillas para bares, antros y organizadores de eventos: promociones, invitaciones, contenido viral.", en: "20 templates for bars, clubs and event organizers: promotions, invitations, viral content." },
    price: 19,
    priceMXN: 380,
    rating: 4.6,
    reviews: 41,
    downloads: 380,
    icon: Music,
    color: "bg-purple-500",
    tags: { es: ["Bar", "Eventos", "Viral"], en: ["Bar", "Events", "Viral"] },
    featured: false,
    includes: {
      es: ["20 plantillas de texto", "Invitaciones digitales", "Contenido viral", "Actualizaciones gratuitas"],
      en: ["20 text templates", "Digital invitations", "Viral content", "Free updates"],
    },
  },
  {
    id: "personal_brand_kit",
    category: "personal_brand",
    title: { es: "Kit Marca Personal & Coaching", en: "Personal Brand & Coaching Kit" },
    description: { es: "35 plantillas para coaches, consultores y creadores de contenido: LinkedIn, Instagram, newsletter.", en: "35 templates for coaches, consultants and content creators: LinkedIn, Instagram, newsletter." },
    price: 39,
    priceMXN: 780,
    rating: 4.9,
    reviews: 112,
    downloads: 1050,
    icon: Star,
    color: "bg-amber-500",
    tags: { es: ["Coaching", "LinkedIn", "Newsletter"], en: ["Coaching", "LinkedIn", "Newsletter"] },
    featured: true,
    includes: {
      es: ["35 plantillas de texto", "Contenido de LinkedIn", "Newsletter templates", "Actualizaciones gratuitas"],
      en: ["35 text templates", "LinkedIn content", "Newsletter templates", "Free updates"],
    },
  },
  {
    id: "travel_hospitality_kit",
    category: "travel",
    title: { es: "Kit Turismo & Hospitalidad", en: "Tourism & Hospitality Kit" },
    description: { es: "22 plantillas para hoteles, agencias de viajes y guías turísticos: descripciones, reseñas, promociones.", en: "22 templates for hotels, travel agencies and tour guides: descriptions, reviews, promotions." },
    price: 24,
    priceMXN: 480,
    rating: 4.7,
    reviews: 38,
    downloads: 290,
    icon: Globe,
    color: "bg-teal-500",
    tags: { es: ["Hotel", "Turismo", "Viajes"], en: ["Hotel", "Tourism", "Travel"] },
    featured: false,
    includes: {
      es: ["22 plantillas de texto", "Descripciones de destinos", "Emails de reserva", "Actualizaciones gratuitas"],
      en: ["22 text templates", "Destination descriptions", "Booking emails", "Free updates"],
    },
  },
  {
    id: "content_creator_kit",
    category: "creator",
    title: { es: "Kit Creador de Contenido Pro", en: "Pro Content Creator Kit" },
    description: { es: "40 plantillas para YouTubers, TikTokers e influencers: guiones, descripciones, CTAs, colaboraciones.", en: "40 templates for YouTubers, TikTokers and influencers: scripts, descriptions, CTAs, collaborations." },
    price: 44,
    priceMXN: 880,
    rating: 4.9,
    reviews: 187,
    downloads: 2100,
    icon: Camera,
    color: "bg-red-500",
    tags: { es: ["YouTube", "TikTok", "Influencer"], en: ["YouTube", "TikTok", "Influencer"] },
    featured: true,
    includes: {
      es: ["40 plantillas de texto", "Guiones de video", "Descripciones SEO", "Actualizaciones gratuitas"],
      en: ["40 text templates", "Video scripts", "SEO descriptions", "Free updates"],
    },
  },
];

const CATEGORIES = [
  { id: "all", label: { es: "Todos", en: "All" }, icon: Package },
  { id: "restaurant", label: { es: "Restaurante", en: "Restaurant" }, icon: Utensils },
  { id: "ecommerce", label: { es: "E-commerce", en: "E-commerce" }, icon: ShoppingCart },
  { id: "real_estate", label: { es: "Inmobiliaria", en: "Real Estate" }, icon: Building2 },
  { id: "health", label: { es: "Salud", en: "Health" }, icon: Heart },
  { id: "entertainment", label: { es: "Entretenimiento", en: "Entertainment" }, icon: Music },
  { id: "personal_brand", label: { es: "Marca Personal", en: "Personal Brand" }, icon: Star },
  { id: "travel", label: { es: "Turismo", en: "Tourism" }, icon: Globe },
  { id: "creator", label: { es: "Creadores", en: "Creators" }, icon: Camera },
];

export default function Templates() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof TEMPLATES[0] | null>(null);
  const [purchasedTemplates, setPurchasedTemplates] = useState<string[]>([]);

  const checkoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      toast.success(language === "es" ? "Redirigiendo al pago..." : "Redirecting to payment...");
      window.open(data.checkoutUrl, "_blank");
    },
    onError: (err) => toast.error(err.message),
  });

  const kobraCheckoutMutation = trpc.subscription.createKobraCheckout.useMutation({
    onSuccess: (data) => {
      toast.success(language === "es" ? `Redirigiendo al pago MXN ($${data.priceMXN} MXN)...` : `Redirecting to MXN payment ($${data.priceMXN} MXN)...`);
      window.open(data.checkoutUrl, "_blank");
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch = search === "" ||
      t.title[language as Lang].toLowerCase().includes(search.toLowerCase()) ||
      t.description[language as Lang].toLowerCase().includes(search.toLowerCase()) ||
      t.tags[language as Lang].some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredTemplates = TEMPLATES.filter(t => t.featured);

  const handlePurchase = (template: typeof TEMPLATES[0], method: "stripe" | "kobrapay") => {
    if (!isAuthenticated) {
      toast.error(language === "es" ? "Inicia sesión para comprar plantillas" : "Sign in to purchase templates");
      navigate("/");
      return;
    }
    // For templates, we use the "starter" plan as a proxy for the template price
    // In a real implementation, you'd have a separate product for each template
    if (method === "stripe") {
      checkoutMutation.mutate({
        plan: "starter",
        origin: window.location.origin,
      });
    } else {
      kobraCheckoutMutation.mutate({
        plan: "starter",
        origin: window.location.origin,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500" />
            </button>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663381362445/mDJbhZThnmgq57e2ZxHzfD/contentai-logo-transparent_307b2919.png"
              alt="ContentAI"
              className="h-12 w-auto"
            />
            <div className="h-5 w-px bg-gray-200" />
            <div>
              <h1 className="font-bold text-gray-900 text-sm">
                {language === "es" ? "Marketplace de Plantillas" : "Template Marketplace"}
              </h1>
              <p className="text-xs text-gray-500">
                {language === "es" ? "Kits profesionales listos para usar" : "Professional ready-to-use kits"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs">
              {TEMPLATES.length} {language === "es" ? "kits disponibles" : "kits available"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 text-white">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-200" />
              <span className="text-blue-200 text-sm font-medium">
                {language === "es" ? "Kits de Contenido Profesional" : "Professional Content Kits"}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-3">
              {language === "es" ? "Acelera tu marketing con plantillas probadas" : "Accelerate your marketing with proven templates"}
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-5">
              {language === "es"
                ? "Cada kit incluye decenas de plantillas de texto listas para usar con ContentAI. Ahorra horas de trabajo y obtén resultados profesionales desde el primer día."
                : "Each kit includes dozens of text templates ready to use with ContentAI. Save hours of work and get professional results from day one."}
            </p>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-300" />{language === "es" ? "Acceso inmediato" : "Immediate access"}</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-300" />{language === "es" ? "Actualizaciones gratuitas" : "Free updates"}</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-300" />{language === "es" ? "Garantía 30 días" : "30-day guarantee"}</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === "es" ? "Buscar plantillas..." : "Search templates..."}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.label[language as Lang]}
            </button>
          ))}
        </div>

        {/* Featured */}
        {selectedCategory === "all" && search === "" && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-amber-500" />
              <h3 className="font-semibold text-gray-900 text-sm">
                {language === "es" ? "Más Populares" : "Most Popular"}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  language={language as Lang}
                  featured
                  onSelect={() => setSelectedTemplate(template)}
                  purchased={purchasedTemplates.includes(template.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">
              {selectedCategory === "all"
                ? (language === "es" ? "Todos los Kits" : "All Kits")
                : CATEGORIES.find(c => c.id === selectedCategory)?.label[language as Lang]}
              <span className="ml-2 text-gray-400 font-normal">({filteredTemplates.length})</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                language={language as Lang}
                onSelect={() => setSelectedTemplate(template)}
                purchased={purchasedTemplates.includes(template.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${selectedTemplate.color} flex items-center justify-center`}>
                    <selectedTemplate.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedTemplate.title[language as Lang]}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-600">{selectedTemplate.rating} ({selectedTemplate.reviews} {language === "es" ? "reseñas" : "reviews"})</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                {selectedTemplate.description[language as Lang]}
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <h4 className="text-xs font-semibold text-gray-700 mb-3">
                  {language === "es" ? "¿Qué incluye?" : "What's included?"}
                </h4>
                <ul className="space-y-2">
                  {selectedTemplate.includes[language as Lang].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Download className="w-3.5 h-3.5" />
                  {selectedTemplate.downloads.toLocaleString()} {language === "es" ? "descargas" : "downloads"}
                </div>
                <div className="flex gap-1.5">
                  {selectedTemplate.tags[language as Lang].map(tag => (
                    <Badge key={tag} className="bg-gray-100 text-gray-600 border-0 text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">${selectedTemplate.price}</span>
                  <span className="text-sm text-gray-400">USD</span>
                  <span className="text-sm text-gray-400 ml-2">/ ${selectedTemplate.priceMXN} MXN</span>
                </div>

                <Button
                  onClick={() => handlePurchase(selectedTemplate, "stripe")}
                  disabled={checkoutMutation.isPending || kobraCheckoutMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-semibold mb-2"
                >
                  {checkoutMutation.isPending
                    ? (language === "es" ? "Preparando pago..." : "Preparing payment...")
                    : `💳 ${language === "es" ? "Comprar con tarjeta (USD)" : "Buy with card (USD)"} — $${selectedTemplate.price}`}
                </Button>

                <Button
                  onClick={() => handlePurchase(selectedTemplate, "kobrapay")}
                  disabled={checkoutMutation.isPending || kobraCheckoutMutation.isPending}
                  variant="outline"
                  className="w-full h-11 rounded-xl font-semibold border-green-200 text-green-700 hover:bg-green-50 bg-white"
                >
                  {kobraCheckoutMutation.isPending
                    ? (language === "es" ? "Preparando pago..." : "Preparing payment...")
                    : `🇲🇽 ${language === "es" ? "Pagar en MXN (OXXO/SPEI)" : "Pay in MXN (OXXO/SPEI)"} — $${selectedTemplate.priceMXN}`}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  🔒 {language === "es" ? "Pago seguro · Acceso inmediato · Garantía 30 días" : "Secure payment · Immediate access · 30-day guarantee"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Template Card Component ──────────────────────────────────────────────────
function TemplateCard({
  template,
  language,
  featured = false,
  onSelect,
  purchased,
}: {
  template: typeof TEMPLATES[0];
  language: Lang;
  featured?: boolean;
  onSelect: () => void;
  purchased: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
        featured ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100 hover:border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${template.color} flex items-center justify-center`}>
            <template.icon className="w-5 h-5 text-white" />
          </div>
          {featured && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
              <Crown className="w-3 h-3 mr-1" />
              {language === "es" ? "Popular" : "Popular"}
            </Badge>
          )}
          {purchased && (
            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
              <Check className="w-3 h-3 mr-1" />
              {language === "es" ? "Comprado" : "Purchased"}
            </Badge>
          )}
        </div>

        <h4 className="font-semibold text-gray-900 text-sm mb-1.5 leading-snug">
          {template.title[language]}
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
          {template.description[language]}
        </p>

        <div className="flex items-center gap-3 mb-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {template.rating}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {template.downloads.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${template.price}</span>
            <span className="text-xs text-gray-400 ml-1">USD</span>
          </div>
          <Button
            size="sm"
            className="text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
          >
            {purchased ? (language === "es" ? "Ver" : "View") : (language === "es" ? "Comprar" : "Buy")}
          </Button>
        </div>
      </div>
    </div>
  );
}
