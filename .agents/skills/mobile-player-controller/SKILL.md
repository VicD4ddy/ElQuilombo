---
name: mobile-player-controller
description: >-
  Especialista en la ergonomía y control del reproductor de música flotante «Quilombo Sound» en dispositivos móviles.
  Usar para integrar Media Session API (pantalla de bloqueo de iOS/Android), ajustar la barra flotante y evitar solapamientos con el botón de compra.
---

# Mobile Player Controller Skill

Esta habilidad garantiza que el reproductor de música trap (Milo J, Duki, Trueno) ofrezca una experiencia premium en teléfonos, integrándose con el sistema operativo móvil y sin bloquear la navegación.

## Áreas de Enfoque y Checklist

### 1. Integración con Media Session API de Android e iOS
Cuando el usuario apague la pantalla del celular o cambie de app, el reproductor debe mostrarse en la pantalla de bloqueo y el centro de control:
```javascript
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: 'El Quilombo - Fiesta Temática Valencia',
    artwork: [
      { src: track.cover, sizes: '300x300', type: 'image/jpeg' }
    ]
  });

  navigator.mediaSession.setActionHandler('play', () => window.QuilomboPlayer.play());
  navigator.mediaSession.setActionHandler('pause', () => window.QuilomboPlayer.pause());
  navigator.mediaSession.setActionHandler('previoustrack', () => window.QuilomboPlayer.prev());
  navigator.mediaSession.setActionHandler('nexttrack', () => window.QuilomboPlayer.next());
}
```

### 2. Ergonomía del Dock Flotante en Pantallas Móviles
- En móviles, el dock flotante debe ubicarse a `bottom: max(10px, env(safe-area-inset-bottom))`.
- Se oculta la barra de volumen física (`.player-volume-wrap`) para que la barra de tiempo (`#player-progress-bar`) y el botón central de Play tengan espacio suficiente sin amontonarse.
- Se mantiene el botón de mute rápido (🔇 / 🔊) y el botón de minimizar (`✕`).

### 3. Minimización Inteligente al Comprar Entradas
- Cuando el usuario hace foco en cualquier campo del formulario de preventa (`#reservation-form`), el reproductor se contrae automáticamente a la pastilla flotante compacta (`#player-mini-launcher`), dejando el botón **"Apartar Mi Entrada"** completamente visible.
- Cuando el usuario termina o hace scroll hacia arriba, puede volver a expandirlo con un solo toque.
