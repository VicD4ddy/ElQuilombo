# Mobile Compatibility & Responsive Rules for El Quilombo

Estas reglas deben ser aplicadas rigurosamente en cualquier modificación que involucre el diseño, HTML, CSS o JavaScript para dispositivos móviles.

## 1. Reglas de Maquetación y Viewport
- **Cero scroll horizontal (`overflow-x: hidden`):** Ningún elemento puede exceder el `100vw`. Evitar anchos fijos mayores a `320px`.
- **Desactivación de 3D invasivo en pantallas pequeñas:** Las transformaciones 3D con perspectiva (`perspective(1000px) rotateY(-3deg)`) deben reajustarse a `none` o rotación 0° en `@media (max-width: 768px)` para no descalibrar el alineamiento visual de las tarjetas.
- **Safe Area Insets:** Usar `padding-bottom: env(safe-area-inset-bottom, 16px)` en elementos fijos inferiores como el reproductor y modales para respetar la barra de inicio de los iPhones.

## 2. Reglas de Interacción Táctil
- **Tamaño mínimo de toque (Tap Target):** Cualquier botón o enlace interactivo debe contar con un área de toque efectiva mínima de 44x44px (preferible 48x48px).
- **Prohibido el auto-zoom en iOS:** Todos los elementos `<input>`, `<select>` y `<textarea>` deben tener `font-size: 16px` o superior en móviles. Si la fuente es menor a 16px, Safari en iOS fuerza un zoom que rompe la estética de la web.
- **Teclado móvil contextual:**
  - Teléfono: `type="tel"` y `inputmode="tel"`.
  - Cantidad de entradas: `type="number"` o `inputmode="numeric"`.

## 3. Reglas del Reproductor de Audio
- **Nunca bloquear el checkout:** El dock flotante de música debe poseer un botón de minimizar rápido o contraerse a pastilla pequeña cuando el usuario interactúe con el formulario de reservas.
- **Ocultar slider de volumen en móviles:** En smartphones, los usuarios utilizan los botones físicos de volumen del teléfono. En pantallas < 768px se oculta la barra deslizadora de volumen para dejar más espacio al botón de Play y al título de la canción.

## 4. Reglas de Conversión por WhatsApp
- **Deeplink compatible:** El enlace hacia WhatsApp debe generar el mensaje preformateado con nombre, cédula, cantidad y total, usando `encodeURIComponent` y funcionando tanto en web como en la app nativa móvil.
