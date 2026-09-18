# El Quilombo - Autonomous Engineering Agents Squad (10 Agentes Especializados)

Este documento define la arquitectura, especialidades y protocolos del equipo de 10 agentes autónomos dedicados a la calidad visual, rendimiento, interactividad viral y conversión de la plataforma web de **El Quilombo** (Next.js 15 + React 19 + TypeScript + Vanilla CSS + Supabase).

---

## 🤖 Directorio del Squad de 10 Agentes

| # | Agente | Nombre Clave | Misión y Especialidad Principal | Áreas de Acción y Archivos Clave |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Layout & Viewport Architect** | `mobile-layout-architect` | Viewports fluidos, CSS Grid, Safe Areas de iOS/Android, prevención de desbordamientos y márgenes laterales exactos (`overflow-x: clip`). | `src/app/globals.css`<br>`src/components/layout/Navbar.tsx`<br>`src/components/sections/HeroSection.tsx` |
| **2** | **Touch & UX Ergonomics Specialist** | `mobile-touch-ux` | Áreas táctiles WCAG (mínimo 48x48px), prevención de auto-zoom en Safari iOS (font-size 16px en inputs), drawer y visibilidad de CTA directo sin menú hamburguesa en mobile. | `src/components/layout/Navbar.tsx`<br>`src/components/sections/TicketingSection.tsx` |
| **3** | **Media & Performance Optimizer** | `mobile-perf-optimizer` | Optimización de assets pesados (GIF de fondo, avatares), compresión WebP, lazy loading, Core Web Vitals (LCP < 2.5s, INP < 200ms). | `public/assets/img/`<br>`src/components/sections/ArtistsCarousel.tsx`<br>`src/app/globals.css` |
| **4** | **Quilombo Audio Engine Controller** | `mobile-player-controller` | Ergonomía del dock flotante («Quilombo Sound»), Media Session API (pantalla de bloqueo Android/iOS), auto-pausa al reproducir videos. | `src/components/player/MusicPlayer.tsx`<br>`src/components/modals/ReelModal.tsx` |
| **5** | **Ticketing & Conversion QA** | `checkout-conversion-qa` | Formulario de preventa en pantalla reducida, calculadora dinámica con descuentos (USD / Bs), generación de Ticket Digital y Deep Link a WhatsApp. | `src/components/sections/TicketingSection.tsx`<br>`src/data/tickets.ts` |
| **6** | **Viral Meme & Social FX Engineer** | `meme-viral-engineer` | Gamificación de preventa: trigger de audio "FAHHHHHH", generador de stickers y memes temáticos, exportador de entradas a Instagram Stories y WhatsApp Status con efecto FOMO. | `src/components/memes/`<br>`src/components/modals/TicketModal.tsx`<br>`public/assets/audio/` |
| **7** | **Supabase Database Architect** | `supabase-db-architect` | Persistencia en base de datos PostgreSQL en Supabase, unicidad de cédula/DNI (`unique constraint`), control del flag `is_paid: false`, auditoría y Row Level Security (RLS). | `supabase_schema.sql`<br>`src/lib/supabase.ts` |
| **8** | **Reel & Story Modal Controller** | `reel-modal-controller` | Reproductor modal inmersivo de video 9:16 estilo TikTok/Instagram Reels, sincronización con el reproductor de audio general y prefetching de videos. | `src/components/modals/ReelModal.tsx`<br>`src/components/sections/HeroSection.tsx` |
| **9** | **SEO & Social Meta Specialist** | `seo-social-meta-agent` | Next.js Metadata API, generación dinámica de OpenGraph y Twitter Cards para previews atractivas al compartir en WhatsApp, Telegram e Instagram. | `src/app/layout.tsx`<br>`public/assets/img/og-preview.png` |
| **10** | **Security & Anti-Fraud Agent** | `security-anti-fraud-agent` | Sanitización estricta de inputs (XSS / SQLi), validación de teléfonos y cédulas, rate limiting para evitar spam de reservas y gestión segura de variables de entorno de Supabase. | `src/lib/supabase.ts`<br>`src/app/api/` |

---

## 🔄 Protocolo de Colaboración Integral

1. **Fase 1 - Maquetación y Márgenes (`mobile-layout-architect` + `mobile-touch-ux`):**
   Garantizan que en cualquier resolución (desde 360px hasta 4K) no exista scroll horizontal, que el navbar mantenga el CTA directo de "Apartar Entrada" en mobile, y que los márgenes laterales se respeten estrictamente.
2. **Fase 2 - Sonido y Multimedia (`mobile-player-controller` + `mobile-perf-optimizer` + `reel-modal-controller`):**
   Garantizan carga instantánea, audio continuo sin interrumpir la navegación y coordinación fluida entre la música de fondo y los videos de los reels.
3. **Fase 3 - Embudo de Compra y Gamificación (`checkout-conversion-qa` + `meme-viral-engineer`):**
   Calculadora reactiva de entradas + experiencia viral con el sonido "FAHHHHHH", stickers aleatorios y exportación a Stories para maximizar la conversión y el boca a boca.
4. **Fase 4 - Persistencia y Seguridad (`supabase-db-architect` + `security-anti-fraud-agent` + `seo-social-meta-agent`):**
   Validación de datos, prevención de cédulas duplicadas, almacenamiento seguro en Supabase y visualización perfecta del enlace al ser compartido en redes.
