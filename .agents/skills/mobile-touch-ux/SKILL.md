---
name: mobile-touch-ux
description: >-
  Optimiza la experiencia táctil, tamaños de botones (tap targets), navegación móvil y previene problemas de zoom o fricción táctil en teléfonos.
  Usar al diseñar menús móviles, botones de reserva, modales o formularios de preventa en El Quilombo.
---

# Mobile Touch UX Specialist Skill

Esta habilidad garantiza que cualquier interacción física con los dedos (toques, deslizamientos, escritura) sea ergonómica y libre de fricciones en teléfonos táctiles.

## Áreas de Enfoque y Checklist

### 1. Prevención de Auto-Zoom en Safari iOS
En iOS, si un campo de texto `<input>` tiene un `font-size` menor a `16px`, Safari hace un zoom involuntario hacia el campo al tocarlo, descuadrando la página.
- **Acción obligatoria:**
  ```css
  @media (max-width: 768px) {
    .form-control,
    .form-group input,
    .form-group select {
      font-size: 16px !important;
    }
  }
  ```

### 2. Dimensiones Mínimas de Botones (Tap Targets)
- Cumplimiento WCAG 2.5.5: Mínimo 44x44px de área de contacto.
- Los botones como:
  - Botón de play/pause (`.btn-player-play`) -> 44px o 48px.
  - Botones de cerrar (`.btn-player-minimize`, `.btn-close-modal`) -> mínimo 44px de bounding box táctil.
  - Pastillas de filtros de la playlist (`.player-filter-pill`) -> padding vertical de `0.4rem` y horizontal de `0.85rem`.

### 3. Navegación Móvil Amigable
- El botón de menú hamburguesa (`#nav-toggle`) debe contar con animación fluida y cerrar automáticamente al hacer clic en cualquier ancla (`#entradas`, `#lineup`, etc.).
- Fondo con desenfoque (`backdrop-filter: blur(16px)`) para mantener legibilidad sobre el fondo animado.

### 4. Modales Estilo "Bottom Sheet"
- En pantallas pequeñas, los modales centrados (`#ticket-dialog`) deben posicionarse adheridos a la parte inferior como una lámina que se puede leer de forma natural con una sola mano.
