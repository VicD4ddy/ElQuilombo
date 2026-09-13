# ⚡ El Quilombo — Fiesta Temática Argentina en Valencia 💜

Plataforma web oficial para la preventa de entradas, experiencia multimedia y promoción del evento **El Quilombo**, la fiesta temática argentina en **Óleo Gastrobar** (La Viña, Valencia, Edo. Carabobo, Venezuela) el **3 de Octubre de 2026**.

---

## 🚀 Características Principales

- 🎨 **Diseño y Branding Urbano:** Inspirado en la movida callejera, graffiti y cultura del trap argentino (Milo J, Trueno, Duki, Bizarrap).
- 📻 **Quilombo Sound (Reproductor de Fondo):**
  - Reproductor flotante con vinilo animado, ecualizador en vivo y barra de progreso.
  - Pistas oficiales precargadas: *Gil* (Milo J & Trueno), *Goteo* (Duki), *Mamichula* (Trueno & Nicki Nicole), *M.A.I* (Milo J), *She Don't Give a Fo* (Duki & KHEA), *Niño* (Milo J).
  - Drawer desplegable de Playlist con filtros por artista (*Todos, Milo J, Duki, Trueno*).
  - Integración con **Media Session API** (controles y carátula en pantalla de bloqueo de iOS/Android).
- 📱 **Reproductor de Reel de Instagram Integrado:** Visualización *in-place* del Reel oficial (`Db4UmR8OuaR`) dentro de la tarjeta vertical del hero con pausa inteligente del audio de fondo.
- 🎟️ **Calculadora de Preventa y Entradas:**
  - Selección entre **Pase General ($10)** y **Pase VIP Quilombo ($20)** con cálculo dinámico en USD y Bs.
- 🎫 **Generador de Boleto Digital QR:** Matriz QR renderizada en Canvas en alta definición (260px) apta para capturas de pantalla móviles.
- 💬 **Checkout Directo por WhatsApp:** Redirección automática con protocolo `whatsapp://send` y fallback web para abrir la conversación con el equipo de reservas con el pedido preformateado.
- 🤖 **Arquitectura de Agentes Autónomos (`.agents/`):** Squad de 5 agentes especializados para responsabilidades móviles (Layout, Touch UX, Media Performance, Player Controller y Checkout QA).

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico:** Estructura accesible, meta tags Open Graph, Twitter cards y viewport adaptativo con `viewport-fit=cover`.
- **CSS3 Moderno:** Variables HSL, diseño Glassmorphism con `backdrop-filter`, animaciones neón, Safe Area Insets (`env(safe-area-inset-bottom)`) y diseño responsive para smartphones.
- **JavaScript (ES6+):** Controladores modulares nativos sin dependencias externas pesadas (`countdown.js`, `ticketing.js`, `player.js`, `app.js`).
- **Web APIs:** Media Session API, HTML5 Canvas API, HTML5 Audio, Web Animations.

---

## 📂 Estructura del Repositorio

```text
├── .agents/                    # Configuración de agentes y habilidades especializadas
│   ├── AGENTS.md               # Directorio y protocolo del Squad Móvil
│   ├── rules/
│   │   └── mobile-standards.md # Estándares y restricciones móviles
│   └── skills/                 # Skills para Layout, Touch UX, Rendimiento, Audio y Checkout
├── assets/
│   ├── audio/                  # Clips y pistas oficiales de audio (M4A)
│   └── img/                    # Logos, fondos, carátulas y banners
├── css/
│   ├── design-system.css       # Tokens, paleta de color y tipografía
│   └── style.css               # Estilos principales y media queries
├── js/
│   ├── app.js                  # Controlador general y generador QR
│   ├── countdown.js            # Cuenta regresiva para el 3 de Octubre
│   ├── player.js               # Reproductor de música trap y Media Session API
│   └── ticketing.js            # Lógica de cálculo de entradas de preventa
├── index.html                  # Página principal de la plataforma
└── README.md                   # Documentación del proyecto
```

---

## 👥 Créditos Oficiales

- **Creadora:** [@belleamar_](https://www.instagram.com/belleamar_/)
- **Diseño Gráfico:** [@andrea_calanche](https://www.instagram.com/andrea_calanche/)
- **Diseñador Web:** [@Vicdaddy.js](https://www.instagram.com/Vicdaddy.js/)
- **Venue:** [@oleo.gastrobar](https://www.instagram.com/oleo.gastrobar/)
- **Lugar:** Valencia, Estado Carabobo, Venezuela 🇻🇪

---

© 2026 El Quilombo Vzla. Todos los derechos reservados.
