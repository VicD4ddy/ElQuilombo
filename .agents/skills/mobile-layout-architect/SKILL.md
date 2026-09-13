---
name: mobile-layout-architect
description: >-
  Audita y optimiza la estructura visual, viewports, CSS Grid, Flexbox y Safe Areas para dispositivos móviles en El Quilombo.
  Usar cuando se detecten desbordamientos horizontales, desalineación de tarjetas o problemas de visualización en pantallas menores a 768px.
---

# Mobile Layout Architect Skill

Esta habilidad guía la maquetación responsiva fluida de **El Quilombo**, asegurando que el diseño impacte visualmente en pantallas estrechas (360px a 430px) tanto en Android como en iOS.

## Áreas de Enfoque y Checklist

### 1. Viewport y Contenedores Principales
- Asegurar que `meta viewport` incluya `width=device-width, initial-scale=1.0, viewport-fit=cover`.
- Proteger contra scroll horizontal indeseado:
  ```css
  html, body {
    overflow-x: hidden;
    max-width: 100vw;
  }
  ```
- Revisar que los `.container` tengan padding lateral flexible:
  ```css
  .container {
    width: 100%;
    padding-left: clamp(1rem, 4vw, 2rem);
    padding-right: clamp(1rem, 4vw, 2rem);
  }
  ```

### 2. Tarjeta del Hero / Reel de Instagram
- En pantallas de escritorio se usa una leve perspectiva 3D (`transform: perspective(1000px) rotateY(-3deg)`).
- En teléfonos (< 768px), la perspectiva provoca que la tarjeta se salga por los bordes o tape los stickers.
- **Acción requerida:**
  ```css
  @media (max-width: 768px) {
    .visual-card {
      transform: none !important;
      max-width: 340px;
      margin: 0 auto;
    }
  }
  ```

### 3. Tipografía con `clamp()`
- Títulos principales en el hero y secciones:
  ```css
  .hero-title {
    font-size: clamp(1.65rem, 6vw, 2.75rem);
    line-height: 1.15;
  }
  ```

### 4. Safe Areas de iOS (Notch y Home Indicator)
- En dispositivos iPhone con barra inferior, los elementos fijos (`.quilombo-player-dock`, modales) deben incorporar:
  ```css
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  ```
