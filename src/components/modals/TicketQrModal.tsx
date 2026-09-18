'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { TicketOrder } from '../../types/ticket';

interface TicketQrModalProps {
  order: TicketOrder | null;
  onClose: () => void;
}

export default function TicketQrModal({ order, onClose }: TicketQrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

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
  const memeText = order.meme ? `Sticker: ${order.meme.emoji} ${order.meme.name}` : '';
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
${memeText ? `🎯 *${memeText}*` : ''}

¿Me podrían facilitar los datos para concretar el pago? ¡Nos vemos en Óleo Gastrobar! 🇦🇷🔥`;

  const waWebUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
  const waNativeUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(waMessage)}`;

  const handleWhatsappClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      e.preventDefault();
      window.location.href = waNativeUrl;
      setTimeout(() => {
        window.open(waWebUrl, '_blank');
      }, 750);
    }
  };

  const handleExportStory = async () => {
    if (!ticketRef.current) return;
    setIsExporting(true);
    setExportNotice(null);

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0a0814',
      });

      const link = document.createElement('a');
      link.download = `Boleto_ElQuilombo_${order.ticketCode}.png`;
      link.href = dataUrl;
      link.click();

      setExportNotice('¡Boleto descargado en alta resolución! Subilo a tus historias de Instagram.');
    } catch (err) {
      console.error('Error exporting story image:', err);
      setExportNotice('Hubo un inconveniente al exportar. Podés tomarle captura al boleto.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="ticket-dialog-wrapper"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      {/* Dark Blur Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(6, 5, 10, 0.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          zIndex: 1,
        }}
        onClick={onClose}
      />

      {/* Main Ticket Modal Dialog */}
      <dialog
        className="ticket-dialog"
        open
        style={{
          position: 'relative',
          zIndex: 2,
          margin: 'auto',
          border: 'none',
          background: 'transparent',
          padding: 0,
          maxWidth: '560px',
          width: '100%',
        }}
      >
        <div className="ticket-pass" ref={ticketRef}>
          {/* Notification Alert for existing reservations */}
          {order.noticeMessage && (
            <div
              className="ticket-notice-alert"
              id="ticket-notice-alert"
              style={{
                background: 'rgba(0, 240, 255, 0.15)',
                borderBottom: '1px solid var(--border-neon-cyan)',
                padding: '0.65rem 1.25rem',
                fontSize: '0.8rem',
                color: 'var(--neon-cyan)',
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              ℹ️ {order.noticeMessage}
            </div>
          )}

          {/* Pass Header */}
          <div className="ticket-pass-header">
            <div className="ticket-pass-brand">
              <img
                src="/assets/img/el-quilombo-logo.png"
                alt="El Quilombo"
                className="ticket-pass-logo"
              />
              <div style={{ fontSize: '0.72rem', opacity: 0.95, fontWeight: 700, letterSpacing: '0.5px' }}>
                FIESTA ARGENTINA
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="ticket-pass-badge">
                {order.isExisting ? 'PRE-RESERVA ACTIVA' : '¡RESERVA CONFIRMADA!'}
              </div>
              <button
                type="button"
                id="btn-close-ticket-top"
                aria-label="Cerrar boleto"
                onClick={onClose}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: 0,
                  lineHeight: 1,
                  transition: 'background 0.2s',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Pass Body */}
          <div className="ticket-pass-body">
            {/* Meme Sticker Stamped on Ticket */}
            {order.meme && (
              <div
                className="ticket-meme-sticker"
                style={{
                  background: order.meme.badgeBg,
                  border: `2px dashed ${order.meme.borderColor}`,
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  animation: 'floatElement 3s ease-in-out infinite',
                }}
              >
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{order.meme.emoji}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.85rem', color: order.meme.textColor, textTransform: 'uppercase' }}>
                    STICKER OFICIAL: {order.meme.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: order.meme.textColor, opacity: 0.95 }}>
                    "{order.meme.tagline}"
                  </div>
                </div>
              </div>
            )}

            {/* Ticket Info Grid */}
            <div className="ticket-info-grid">
              <div className="ticket-info-item">
                <span className="t-label">Titular de la Entrada</span>
                <span className="t-value" id="t-buyer-name">{order.buyerName}</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Cédula / DNI</span>
                <span className="t-value">{order.buyerDni}</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Fecha & Hora</span>
                <span className="t-value">03 OCT • 9:00 PM</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Tipo de Boleto</span>
                <span className="t-value neon-highlight" id="t-tier-name">
                  {order.quantity}x {order.tier.name}
                </span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Lugar del Evento</span>
                <span className="t-value">Óleo Gastrobar (La Viña)</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Total a Pagar</span>
                <span className="t-value neon-highlight" id="t-total-usd">${order.totalUSD} USD</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }} id="t-total-ref">
                  (Ref: Bs. {order.totalRefBs})
                </span>
              </div>
            </div>

            {/* Perforation Divider Cut */}
            <div className="ticket-perforation">
              <div className="perforation-line" />
            </div>

            {/* QR & Booking Serial Section */}
            <div className="ticket-qr-section">
              <div className="qr-canvas-box">
                <canvas ref={canvasRef} id="ticket-qr-canvas" style={{ width: '100px', height: '100px', display: 'block' }} />
              </div>
              <div className="ticket-code-info">
                <span className="t-label">Código Único de Reserva</span>
                <span className="ticket-code-num" id="t-code-display">#{order.ticketCode}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px', maxWidth: '200px' }}>
                  Mostrá este código por WhatsApp o en la entrada de Óleo Gastrobar
                </span>
              </div>
            </div>
          </div>

          {/* Pass Actions Footer */}
          <div className="ticket-pass-footer">
            {exportNotice && (
              <div style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', textAlign: 'center', marginBottom: '0.25rem' }}>
                🎉 {exportNotice}
              </div>
            )}

            {/* WhatsApp Direct Link */}
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

            {/* Export for Instagram Stories / WhatsApp Status */}
            <button
              type="button"
              id="btn-export-story"
              onClick={handleExportStory}
              disabled={isExporting}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-neon-purple)',
                color: '#fff',
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s',
              }}
            >
              <span>📸 {isExporting ? 'Generando Imagen...' : 'Guardar Boleto para Instagram Story'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              className="btn-close-modal"
              id="btn-close-modal"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '0.4rem',
                textDecoration: 'underline',
              }}
            >
              Cerrar Comprobante
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
