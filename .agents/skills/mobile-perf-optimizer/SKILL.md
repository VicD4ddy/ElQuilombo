---
name: mobile-perf-optimizer
description: >-
  Optimiza la velocidad de carga, consumo de datos móviles y rendimiento gráfico en teléfonos con conexiones 3G/4G o batería reducida en El Quilombo.
  Usar para auditar el fondo GIF animado de 11MB, lazy loading de imágenes, compresión de audio y Core Web Vitals móviles.
---

# Mobile Performance & Media Optimizer Skill

Esta habilidad asegura que la página cargue en menos de 2.5 segundos en redes móviles LTE/4G y no agote los datos ni recaliente el dispositivo móvil del usuario.

## Áreas de Enfoque y Diagnóstico

### 1. Gestión del Fondo Animado (`QuilomboAnimado.gif`)
- El archivo actual `QuilomboAnimado.gif` pesa aproximadamente **10.78 MB**.
- En Wi-Fi carga bien, pero en conexiones móviles con datos limitados puede ralentizar la renderización y provocar tirones en el scroll (jank).
- **Estrategias de optimización recomendadas:**
  1. En pantallas móviles o si el usuario tiene activado `prefers-reduced-motion` o `prefers-reduced-data`, usar el fondo estático limpio `assets/img/fondosinletras.png` o una versión comprimida WebP/MP4.
  2. Implementar `will-change: transform` solo donde sea estrictamente necesario y remover filtros CSS pesados (`blur(60px)`) en procesadores móviles lentos.

### 2. Carga Diferida (Lazy Loading)
- Añadir `loading="lazy"` y `decoding="async"` a imágenes debajo de la línea de flotación (artistas del lineup, mapa de ubicación y fotos secundarias):
  ```html
  <img src="assets/img/artistas/..." loading="lazy" decoding="async" alt="...">
  ```

### 3. Carga Inteligente de Audio
- Los audios en `assets/audio/` tienen un tamaño de ~1 MB cada uno (30 segundos M4A AAC estéreo de alta calidad).
- Solo se precarga el primer tema (`audio.preload = 'metadata'`), evitando descargar toda la playlist simultáneamente.
