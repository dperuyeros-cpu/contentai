# ContentAI - TODO

## ✅ Fase 1 - Base (COMPLETADO)
- [x] Tabla de suscripciones (plan, estado, fechas)
- [x] Tabla de generaciones (historial de contenido generado)
- [x] Tabla de uso mensual por usuario
- [x] Migración SQL ejecutada
- [x] Procedimiento: generar contenido con IA (por tipo)
- [x] Procedimiento: obtener historial de generaciones
- [x] Procedimiento: verificar límite de uso por plan
- [x] Procedimiento: obtener/actualizar suscripción
- [x] Procedimiento: estadísticas de admin
- [x] Procedimiento: listar usuarios (admin)
- [x] Procedimiento: chat IA general
- [x] Hero section con CTA
- [x] Sección de características (6 features)
- [x] Sección de planes y precios
- [x] Sección de cómo funciona (3 pasos)
- [x] Sección FAQ (preguntas frecuentes)
- [x] Footer con links
- [x] Soporte bilingüe español/inglés (i18n)
- [x] Botón de cambio de idioma
- [x] Login con OAuth de Manus
- [x] Redirección post-login al dashboard
- [x] Manejo de sesión y logout
- [x] Generador de contenido (formulario + resultado)
- [x] 40+ tipos de contenido: redes sociales, anuncios, editorial, branding
- [x] 20+ industrias especializadas
- [x] Contador de generaciones usadas/disponibles
- [x] Historial de generaciones con búsqueda
- [x] Gestión de suscripción (plan actual, upgrade)
- [x] Modal de onboarding para nuevos usuarios
- [x] Modal de upgrade con selector de plan y método de pago
- [x] Integración Stripe (internacional)
- [x] Integración KobraPay (México/Latam)
- [x] Lista de usuarios registrados (admin)
- [x] Estadísticas de uso de la plataforma (admin)
- [x] Gestión de suscripciones (admin)
- [x] Paleta de colores: azul, blanco, gris (minimalista tipo ChatGPT)
- [x] Responsive design (mobile + desktop)
- [x] Página de Perfil de usuario
- [x] Página de Términos y Condiciones
- [x] Página de Aviso de Privacidad
- [x] Página de Agencia de Contenido
- [x] Página de Demo pública (sin login)
- [x] Chat IA general con historial de conversación
- [x] Notificación al dueño cuando hay nuevo usuario
- [x] Plan maestro ilimitado para el owner
- [x] 15 tests de vitest pasando
- [x] Guía completa de uso y monetización (documento)
- [x] Materiales de marketing (textos para Reddit, Facebook, LinkedIn)
- [x] Checklist de lanzamiento

## 🔜 Fase 2 - Mejoras Avanzadas (PRÓXIMAS)
- [ ] Generador de imágenes con IA (renders conceptuales desde descripción)
- [ ] Subida de foto de producto → script de comercial automático
- [ ] Exportar contenido a PDF profesional
- [ ] Exportar contenido a Word (.docx)
- [ ] Plan de equipos multi-usuario (Team $79/mes, Business $149/mes)
- [ ] Invitación de miembros al equipo por email
- [ ] Dashboard de gestión de equipo
- [ ] Onboarding inteligente: "Describe tu negocio → plan de 30 días"
- [ ] Calendario editorial visual (qué publicar cada día)
- [ ] Branding completo para tequilas y bebidas premium
- [ ] Identidad de marca completa con IA (nombre, slogan, colores)
- [ ] Manual de marca básico generado con IA
- [ ] Lector y analizador de PDFs (contratos, documentos)
- [ ] Revisor de contratos con IA
- [ ] Generador de respuestas a reseñas de Google
- [ ] Integración con ProductHunt para lanzamiento

## ✅ Fase 3 - Completado
- [x] Sistema de login propio con email y contraseña (sin Meta/OAuth)
- [x] Página de registro (/register) con email, nombre, contraseña
- [x] Página de login (/login) con email y contraseña
- [x] Logo nuevo (chispa azul + ContentAI) aplicado en toda la plataforma
- [x] Todos los botones de la plataforma redirigen a /login y /register
- [x] Stripe Checkout real integrado (crea sesión de pago real)
- [x] Webhook de Stripe para activar plan automáticamente tras pago
- [x] 20 tests de vitest pasando (100% verde)
- [ ] Recuperación de contraseña por email (pendiente)
- [ ] Generación de imágenes con IA desde descripción (pendiente)

## ✅ Fase 4 - KobraPay (COMPLETADO)
- [x] Credenciales de KobraPay guardadas como secrets
- [x] Router de KobraPay con checkout y webhook (/api/kobra/webhook)
- [x] Modal de upgrade con opción KobraPay (MXN) + Stripe (USD)
- [x] Activación automática de plan tras pago exitoso en KobraPay

## ✅ Entrega Final Completa (COMPLETADO)
- [x] KobraPay router completo (checkout + webhook)
- [x] Generación de imágenes con IA en el Dashboard (pestaña dedicada)
- [x] Generador de canciones/jingles con IA (pestaña dedicada)
- [x] Marketplace de plantillas (/templates) con pago integrado (Stripe + KobraPay)
- [x] Logo visible en todas las páginas (ChatAI, Agency, Templates)
- [x] 30 tests de vitest pasando (100% verde)
- [x] Corregir bug: contador de uso (limit ?? 10 en lugar de ?? 3)
- [x] Entrada por voz (micrófono) en dashboard (prompt + chat)
- [x] KobraPay checkout real implementado y funcional
- [x] Enlace al marketplace en sidebar del Dashboard

## ✅ Fase 5 - Mejoras v2.1 (COMPLETADO)
- [x] Logos más grandes y visibles en Home (h-14), Dashboard (h-14), ChatAI (h-12), Agency (logo real), Templates (h-12)
- [x] Recuperación de contraseña por email (/forgot-password + /reset-password)
- [x] Exportar contenido a PDF desde el historial y desde el resultado
- [x] Exportar contenido a Word (.docx) desde el historial y desde el resultado
- [x] Calendario editorial visual (/calendar) con vista mensual, CRUD de eventos, colores y plataformas
- [x] Enlace al Calendario en sidebar del Dashboard
- [x] 36 tests vitest pasando (100% verde)

## 🔜 Fase 6 - Logo más grande
- [ ] Logo del navbar 2x más grande (h-14 → h-28 aprox)
- [ ] Logo centrado en la sección hero del Home

## 🔜 Fase 6 - Mejoras v2.2 (EN PROGRESO)
- [ ] Logo del navbar 2x más grande (h-24) y logo centrado en hero
- [ ] Notificaciones de email reales con Resend (recuperación de contraseña)
- [ ] Vista semanal en el Calendario (pestaña Semana con horario hora a hora)
- [ ] Botón "Publicar ahora" en eventos del calendario con integración Buffer API
