# El Quilombo - Mobile Engineering Agents Squad

Este documento define la arquitectura y especialidades del equipo de agentes autónomos dedicados a la optimización, compatibilidad y experiencia móvil de la plataforma web de **El Quilombo**.

## 📱 Visión del Squad Móvil
El 85%+ del público objetivo de la fiesta temática (jóvenes seguidores del trap y la cultura urbana en Valencia) accede a la web directamente desde sus teléfonos celulares a través de enlaces en Instagram (@elquilombo, historias, biografías y WhatsApp). La experiencia móvil debe ser de primer nivel: fluida, con carga rápida, sonido inmersivo sin trabas y un checkout de entradas en menos de 60 segundos.

---

## 🤖 Directorio de Agentes Especializados

| Agente | Nombre Clave | Especialidad Principal | Archivo de Instrucciones |
| :--- | :--- | :--- | :--- |
| **1. Layout Architect** | `mobile-layout-architect` | Viewports fluidos, CSS Grid móvil, Safe Areas de iOS y prevención de desbordamientos | [SKILL.md](skills/mobile-layout-architect/SKILL.md) |
| **2. Touch & UX Specialist** | `mobile-touch-ux` | Áreas táctiles WCAG (48px), prevención de auto-zoom en iOS, bottom-sheets | [SKILL.md](skills/mobile-touch-ux/SKILL.md) |
| **3. Media & Perf Optimizer** | `mobile-perf-optimizer` | Optimización de assets pesados (GIF 11MB), lazy loading, Core Web Vitals móviles | [SKILL.md](skills/mobile-perf-optimizer/SKILL.md) |
| **4. Mobile Player Controller** | `mobile-player-controller` | Ergonomía del dock flotante, Media Session API (pantalla de bloqueo) y gestión de audio | [SKILL.md](skills/mobile-player-controller/SKILL.md) |
| **5. Checkout & Conversion QA** | `mobile-checkout-qa` | Formulario de preventa en pantalla reducida, Deeplinks WhatsApp y captura de QR | [SKILL.md](skills/mobile-checkout-qa/SKILL.md) |

---

## 🔄 Protocolo de Colaboración Entre Agentes

1. **Fase de Maquetación (Layout & Viewport):**
   `mobile-layout-architect` ajusta el viewport, desactiva perspectivas 3D en pantallas < 768px y asegura contenedores elásticos sin scroll horizontal.

2. **Fase de Interacción y Accesibilidad Táctil:**
   `mobile-touch-ux` audita todos los botones, inputs y navegación móvil, asegurando fuentes de 16px en campos de texto y tap targets amplios.

3. **Fase de Experiencia de Audio Móvil:**
   `mobile-player-controller` implementa la compactación automática del reproductor para no solaparse con botones de acción y conecta la Media Session API con Android y Apple iOS.

4. **Fase de Rendimiento y Carga de Medios:**
   `mobile-perf-optimizer` aplica alternativas ligeras o carga condicional para el fondo animado y assets pesados.

5. **Fase de Conversión y Validación:**
   `mobile-checkout-qa` simula la reserva completa de boleto, generación del QR descargable y redirección a WhatsApp en viewports de 360px a 430px.
