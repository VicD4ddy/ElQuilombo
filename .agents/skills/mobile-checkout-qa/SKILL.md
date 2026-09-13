---
name: mobile-checkout-qa
description: >-
  Audita y optimiza el embudo de conversión de reservas, generación de tickets QR y redirección nativa a WhatsApp en teléfonos móviles en El Quilombo.
  Usar para probar el formulario de preventa, la calculadora de entradas, la visualización del boleto digital y el deeplink de WhatsApp.
---

# Mobile Checkout & Conversion QA Skill

Esta habilidad se enfoca en maximizar la tasa de conversión en teléfonos: desde el cálculo de entradas hasta el envío del comprobante por WhatsApp y la descarga del ticket digital.

## Áreas de Enfoque y Checklist

### 1. Formulario de Preventa en Móviles
- Los inputs deben contar con atributos correctos:
  - Nombre: `autocomplete="name"`.
  - Cédula/DNI: `inputmode="numeric"`.
  - Teléfono: `type="tel" inputmode="tel" autocomplete="tel"`.
  - Cantidad de entradas: selector rápido `+` y `-` con botones táctiles grandes para no forzar a escribir el número en teclado pequeño.
- El resumen de cálculo (subtotal, fee, total en USD y Bs) debe mantenerse visible de un vistazo en pantallas de 375px.

### 2. Deeplink Nativo de WhatsApp
En teléfonos móviles, abrir `https://api.whatsapp.com/...` o `https://wa.me/...` a veces abre una pestaña en el navegador con la pantalla de "¿Quieres abrir WhatsApp?".
- **Optimización:**
  Probar primero el protocolo directo `whatsapp://send?phone=...&text=...`, que abre directamente la aplicación de WhatsApp instalada en el dispositivo móvil sin pantallas intermedias.
  Si falla o está en escritorio, usar el fallback universal `https://api.whatsapp.com/send?phone=...&text=...`.

### 3. Visualización y Descarga del Ticket Digital QR
- En pantallas móviles, el modal `#ticket-dialog` debe caber completo en la pantalla vertical sin necesidad de scroll infinito.
- El canvas del QR (`#ticket-qr-canvas`) debe generarse en alta resolución (512x512px) pero mostrarse a tamaño adaptativo (180px a 220px) con botón grande:
  - **"📥 Guardar Ticket / Tomar Captura"**
  - **"💬 Confirmar por WhatsApp"**
