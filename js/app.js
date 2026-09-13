/**
 * EL QUILOMBO - MAIN APPLICATION CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize ticketing module
  if (window.QuilomboTicketing) {
    window.QuilomboTicketing.init();
  }

  // Mobile menu toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '76px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(10, 8, 20, 0.96)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border-neon-purple)';
      }
    });
  }

  // Smooth scroll for nav CTA
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          if (window.innerWidth <= 768 && navLinks) {
            navLinks.style.display = 'none';
          }
        }
      }
    });
  });

  // Instagram Reel In-Place Player
  const btnReelPlay = document.getElementById('btn-reel-play');
  const reelIframeContainer = document.getElementById('reel-iframe-container');
  const heroReelIframe = document.getElementById('hero-reel-iframe');
  const btnCloseReel = document.getElementById('btn-close-reel');
  const soundWidget = document.getElementById('sound-widget');
  const reelEmbedUrl = 'https://www.instagram.com/reel/Db4UmR8OuaR/embed/';

  if (btnReelPlay && reelIframeContainer && heroReelIframe) {
    const heroVisualMedia = document.getElementById('hero-visual-media');
    const visualCard = document.querySelector('.visual-card');

    function openReel() {
      // Pause background music player when opening Instagram Reel
      if (window.QuilomboPlayer && typeof window.QuilomboPlayer.pause === 'function') {
        window.QuilomboPlayer.pause();
      }

      if (!heroReelIframe.src || heroReelIframe.src === 'about:blank' || !heroReelIframe.src.includes('Db4UmR8OuaR')) {
        heroReelIframe.src = reelEmbedUrl;
      }
      reelIframeContainer.style.display = 'flex';
      btnReelPlay.style.display = 'none';
      if (soundWidget) soundWidget.style.display = 'none';
      if (visualCard) visualCard.classList.add('reel-active');
    }

    function closeReel(e) {
      if (e) e.stopPropagation();
      reelIframeContainer.style.display = 'none';
      btnReelPlay.style.display = 'flex';
      if (soundWidget) soundWidget.style.display = 'flex';
      if (visualCard) visualCard.classList.remove('reel-active');
      heroReelIframe.src = '';
    }

    btnReelPlay.addEventListener('click', (e) => {
      e.stopPropagation();
      openReel();
    });

    if (heroVisualMedia) {
      heroVisualMedia.addEventListener('click', (e) => {
        // Prevent opening if clicking sound-widget or inside active reel iframe
        if (e.target.closest('#sound-widget') || e.target.closest('#reel-iframe-container')) {
          return;
        }
        openReel();
      });
    }

    if (btnCloseReel) {
      btnCloseReel.addEventListener('click', closeReel);
    }
  }

  // Reservation Form & Ticket Dialog
  const resForm = document.getElementById('reservation-form');
  const ticketDialog = document.getElementById('ticket-dialog');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnWhatsappConfirm = document.getElementById('btn-whatsapp-confirm');
  const ticketCanvas = document.getElementById('ticket-qr-canvas');

  if (resForm && ticketDialog) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Read form data
      const name = document.getElementById('buyer-name').value.trim();
      const dni = document.getElementById('buyer-dni') ? document.getElementById('buyer-dni').value.trim() : 'N/A';
      const phone = document.getElementById('buyer-phone').value.trim();
      const email = document.getElementById('buyer-email').value.trim();
      const paymentMethod = document.getElementById('buyer-payment').value;
      const favoriteArtist = document.getElementById('buyer-artist').value.trim() || 'Milo J / Trueno';

      const order = window.QuilomboTicketing.getCurrentOrder();

      // Generate Ticket ID
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const ticketCode = `QLB-26-${randomCode}`;

      // Populate Ticket Modal
      document.getElementById('t-buyer-name').textContent = name;
      document.getElementById('t-tier-name').textContent = `${order.quantity}x ${order.tier.name}`;
      document.getElementById('t-total-usd').textContent = `$${order.totalUSD} USD`;
      document.getElementById('t-total-ref').textContent = `(Ref: Bs. ${order.totalRefBs})`;
      document.getElementById('t-code-display').textContent = `#${ticketCode}`;
      document.getElementById('t-payment-method').textContent = paymentMethod;

      // Draw custom high-DPI QR Matrix on Canvas
      drawTicketQR(ticketCanvas, ticketCode, name);

      // Build WhatsApp message
      const whatsappNumber = '584120000000'; // Número oficial de reservas
      const waMessage = 
`⚡ *RESERVA PREVENTA - EL QUILOMBO* 💜
¡Hola equipo de @elquilombo.vzla! Quiero confirmar mi entrada:

🎫 *Código:* #${ticketCode}
👤 *Titular:* ${name}
🪪 *Cédula/DNI:* ${dni}
📱 *WhatsApp:* ${phone}
📧 *Email:* ${email}
🎟️ *Entradas:* ${order.quantity}x ${order.tier.name}
💰 *Total a pagar:* $${order.totalUSD} USD (Ref: Bs. ${order.totalRefBs})
💳 *Método de pago:* ${paymentMethod}
🎶 *Tema/Artista que no puede faltar:* ${favoriteArtist}

¿Me podrían facilitar los datos para concretar el pago? ¡Nos vemos en Óleo Gastrobar! 🇦🇷🔥`;

      const waWebUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
      const waNativeUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(waMessage)}`;

      if (btnWhatsappConfirm) {
        btnWhatsappConfirm.setAttribute('href', waWebUrl);
        // Optimize for native mobile app launch (mobile-checkout-qa)
        btnWhatsappConfirm.onclick = (ev) => {
          const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          if (isMobileDevice) {
            ev.preventDefault();
            window.location.href = waNativeUrl;
            setTimeout(() => {
              window.open(waWebUrl, '_blank');
            }, 1200);
          }
        };
      }

      // Open native dialog modal
      ticketDialog.showModal();
    });

    // Close Modal
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        ticketDialog.close();
      });
    }

    // Close on backdrop click
    ticketDialog.addEventListener('click', (e) => {
      const rect = ticketDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        ticketDialog.close();
      }
    });
  }

  // Draw authentic styled QR Code on HTML5 Canvas
  function drawTicketQR(canvas, code, buyerName) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 260; // High-DPI for mobile retina screens
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Deterministic pseudo-random seed from code string
    let seed = 0;
    for (let i = 0; i < code.length; i++) {
      seed = (seed * 31 + code.charCodeAt(i)) & 0xffffffff;
    }
    function random() {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 4294967296;
    }

    const modules = 21;
    const cellSize = Math.floor(size / modules);
    const offset = Math.floor((size - (cellSize * modules)) / 2);

    ctx.fillStyle = '#06050a';

    // Finder patterns (3 corners)
    function drawFinder(r, c) {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
          const isCore = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          if (isBorder || isCore) {
            ctx.fillRect(offset + (c + j) * cellSize, offset + (r + i) * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, modules - 7);
    drawFinder(modules - 7, 0);

    // Fill data cells
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder areas
        if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
          continue;
        }
        // Timing patterns
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
          }
          continue;
        }
        if (random() > 0.46) {
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
        }
      }
    }
  }
});
