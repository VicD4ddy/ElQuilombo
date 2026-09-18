'use client';

import React, { useEffect, useRef } from 'react';
import { TicketOrder } from '../../types/ticket';

interface TicketQrModalProps {
  order: TicketOrder | null;
  onClose: () => void;
}

export default function TicketQrModal({ order, onClose }: TicketQrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!order || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 260; // High-DPI for mobile retina screens
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Deterministic pseudo-random seed from code string
    let seed = 0;
    const code = order.ticketCode;
    for (let i = 0; i < code.length; i++) {
      seed = (seed * 31 + code.charCodeAt(i)) & 0xffffffff;
    }
    const random = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 4294967296;
    };

    const modules = 21;
    const cellSize = Math.floor(size / modules);
    const offset = Math.floor((size - cellSize * modules) / 2);

    ctx.fillStyle = '#06050a';

    // Finder patterns (3 corners)
    const drawFinder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
          const isCore = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          if (isBorder || isCore) {
            ctx.fillRect(offset + (c + j) * cellSize, offset + (r + i) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, modules - 7);
    drawFinder(modules - 7, 0);

    // Fill data cells
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
          continue;
        }
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
  }, [order]);

  if (!order) return null;

  const whatsappNumber = '584120000000';
  const waMessage = `⚡ *RESERVA PREVENTA - EL QUILOMBO* 💜
¡Hola equipo de @elquilombo.vzla! Quiero confirmar mi entrada:

🎫 *Código:* #${order.ticketCode}
👤 *Titular:* ${order.buyerName}
🪪 *Cédula/DNI:* ${order.buyerDni}
📱 *WhatsApp:* ${order.buyerPhone}
📧 *Email:* ${order.buyerEmail}
🎟️ *Entradas:* ${order.quantity}x ${order.tier.name}
💰 *Total a pagar:* $${order.totalUSD} USD (Ref: Bs. ${order.totalRefBs})
💳 *Método de pago:* ${order.paymentMethod}
🎶 *Tema/Artista que no puede faltar:* ${order.favoriteArtist}

¿Me podrían facilitar los datos para concretar el pago? ¡Nos vemos en Óleo Gastrobar! 🇦🇷🔥`;

  const waWebUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
  const waNativeUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(waMessage)}`;

  const handleWhatsappClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Attempt native protocol with fallback to web URL
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      e.preventDefault();
      window.location.href = waNativeUrl;
      setTimeout(() => {
        window.open(waWebUrl, '_blank');
      }, 750);
    }
  };

  return (
    <div className="ticket-modal-overlay" role="dialog" aria-modal="true">
      <div className="ticket-modal-backdrop" onClick={onClose} />
      <div className="ticket-card-dialog">
        <button
          type="button"
          className="btn-modal-close"
          onClick={onClose}
          aria-label="Cerrar comprobante"
        >
          ✕
        </button>

        <div className="ticket-stub-header">
          <div className="ticket-brand">
            <span className="bolt">⚡</span>
            <span>EL QUILOMBO • PREVENTA OFICIAL</span>
          </div>
          <span className="ticket-status-pill">Reserva Pendiente de Pago</span>
        </div>

        <div className="ticket-body">
          {/* Left / Top: QR Code */}
          <div className="ticket-qr-zone">
            <div className="qr-wrapper">
              <canvas ref={canvasRef} id="ticket-qr-canvas" className="qr-canvas" />
            </div>
            <div className="qr-caption">Presentá este código en puerta</div>
            <div className="ticket-code-display" id="t-code-display">
              #{order.ticketCode}
            </div>
          </div>

          {/* Right / Bottom: Details */}
          <div className="ticket-info-zone">
            <div className="t-row">
              <span className="t-label">Titular:</span>
              <strong className="t-val" id="t-buyer-name">{order.buyerName}</strong>
            </div>
            <div className="t-row">
              <span className="t-label">Entradas:</span>
              <strong className="t-val" id="t-tier-name">{order.quantity}x {order.tier.name}</strong>
            </div>
            <div className="t-row">
              <span className="t-label">Total a Pagar:</span>
              <div className="t-price-block">
                <strong className="t-val-price" id="t-total-usd">${order.totalUSD} USD</strong>
                <span className="t-val-ref" id="t-total-ref">(Ref: Bs. {order.totalRefBs})</span>
              </div>
            </div>
            <div className="t-row">
              <span className="t-label">Método:</span>
              <span className="t-val" id="t-payment-method">{order.paymentMethod}</span>
            </div>
            <div className="t-row">
              <span className="t-label">Lugar & Fecha:</span>
              <span className="t-val">Óleo Gastrobar, La Viña • 3 de Octubre, 9:00 PM</span>
            </div>
          </div>
        </div>

        <div className="ticket-footer-actions">
          <a
            href={waWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-confirm"
            onClick={handleWhatsappClick}
          >
            <span>💬 Confirmar y Enviar Pago por WhatsApp</span>
            <span>→</span>
          </a>
          <button type="button" className="btn-ticket-close-text" onClick={onClose}>
            Guardar datos y cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
