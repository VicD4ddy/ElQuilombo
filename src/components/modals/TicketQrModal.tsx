'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { TicketOrder } from '../../types/ticket';
import { OFFICIAL_WHATSAPP_NUMBER } from '../../data/ticketing';
import { MemeSticker, getRandomMemeSticker } from '../../data/memes';
import { exportStoryVideo, exportStoryGif } from '../../lib/storyVideoExporter';

interface TicketQrModalProps {
  order: TicketOrder | null;
  onClose: () => void;
  onOrderUpdated?: (order: TicketOrder) => void;
}

export default function TicketQrModal({ order, onClose, onOrderUpdated }: TicketQrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  // Local state for active meme and order
  const [currentMeme, setCurrentMeme] = useState<MemeSticker | null>(null);
  const [currentOrder, setCurrentOrder] = useState<TicketOrder | null>(null);

  // Export states
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [isExportingGif, setIsExportingGif] = useState<boolean>(false);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [exportProgressText, setExportProgressText] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Synchronize with parent order
  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
      setCurrentMeme(order.meme || getRandomMemeSticker());
      setExportNotice(null);
    }
  }, [order]);

  // QR Code Rendering
  useEffect(() => {
    if (!currentOrder || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 260;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    let seed = 0;
    const code = currentOrder.ticketCode;
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
  }, [currentOrder]);

  if (!currentOrder || !currentMeme) return null;

  const whatsappNumber = OFFICIAL_WHATSAPP_NUMBER;
  const memeText = `Sticker: ${currentMeme.emoji} ${currentMeme.name}`;
  const waMessage = `⚡ *RESERVA PREVENTA - EL QUILOMBO* 💜
¡Hola equipo de @elquilombo.vzla! Quiero confirmar mi entrada:

🎫 *Código:* #${currentOrder.ticketCode}
👤 *Titular:* ${currentOrder.buyerName}
🪪 *Cédula/DNI:* ${currentOrder.buyerDni}
📱 *WhatsApp:* ${currentOrder.buyerPhone}
📧 *Email:* ${currentOrder.buyerEmail}
🎟️ *Entradas:* ${currentOrder.quantity}x ${currentOrder.tier.name}
💰 *Total a pagar:* $${currentOrder.totalUSD} USD (Ref: Bs. ${currentOrder.totalRefBs})
💳 *Método de pago:* ${currentOrder.paymentMethod}
🎶 *Tema/Artista que no puede faltar:* ${currentOrder.favoriteArtist}
🎯 *${memeText}*

¿Me podrían facilitar los datos para concretar el pago? ¡Nos vemos en Rock & Riff! 🇦🇷🔥`;

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

  // 1. Export 9:16 Video Story
  const handleExportVideo = async () => {
    setIsExportingVideo(true);
    setExportNotice(null);
    setExportProgressText('Iniciando grabación...');

    try {
      const res = await exportStoryVideo(
        currentOrder,
        currentMeme,
        '/assets/audio/fah.mp3',
        (pct, txt) => setExportProgressText(`${txt} (${pct}%)`)
      );

      if (res.success) {
        if (res.shared) {
          setExportNotice('¡Listo! Video enviado a tu menú de compartir para Instagram / WhatsApp.');
        } else {
          setExportNotice('¡Video descargado con éxito! Subilo a tus historias de Instagram o Estados de WhatsApp con sonido.');
        }
      } else {
        setExportNotice(`Inconveniente al exportar video: ${res.error || 'intenta nuevamente'}.`);
      }
    } catch (err: any) {
      console.error('Error generating video story:', err);
      setExportNotice('No se pudo generar el video en este dispositivo. Podés descargar el PNG o GIF.');
    } finally {
      setIsExportingVideo(false);
      setExportProgressText(null);
    }
  };

  // 2. Export Animated GIF
  const handleExportGif = async () => {
    setIsExportingGif(true);
    setExportNotice(null);
    setExportProgressText('Generando GIF animado...');

    try {
      const res = await exportStoryGif(currentOrder, currentMeme, (pct, txt) =>
        setExportProgressText(`${txt} (${pct}%)`)
      );
      if (res.success) {
        setExportNotice('¡GIF animado descargado! Compartilo por tus chats de WhatsApp.');
      } else {
        setExportNotice('Error al crear GIF animado.');
      }
    } catch (err: any) {
      console.error('Error generating GIF:', err);
      setExportNotice('No se pudo generar el GIF.');
    } finally {
      setIsExportingGif(false);
      setExportProgressText(null);
    }
  };

  // 3. Export Static PNG
  const handleExportPng = async () => {
    if (!ticketRef.current) return;
    setIsExportingPng(true);
    setExportNotice(null);

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0a0814',
      });

      const link = document.createElement('a');
      link.download = `Boleto_ElQuilombo_${currentOrder.ticketCode}.png`;
      link.href = dataUrl;
      link.click();

      setExportNotice('¡Boleto descargado en alta resolución (PNG) para mostrar en puerta!');
    } catch (err) {
      console.error('Error exporting story image:', err);
      setExportNotice('Hubo un inconveniente al exportar. Podés tomarle captura al boleto.');
    } finally {
      setIsExportingPng(false);
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
          {currentOrder.noticeMessage && (
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
              ℹ️ {currentOrder.noticeMessage}
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
            </div>
            <button
              type="button"
              id="btn-close-ticket-top"
              aria-label="Cerrar boleto"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1,
                transition: 'all 0.2s',
              }}
            >
              ✕
            </button>
          </div>

          {/* Pass Body */}
          <div className="ticket-pass-body">
            {/* Buyer Personalized Gratitude Header */}
            <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--neon-purple)', fontWeight: 800 }}>
                ¡GRACIAS POR RESERVAR!
              </span>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0.2rem 0' }}>
                {currentOrder.buyerName.toUpperCase()}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                Tu lugar está reservado para la noche más picante de Valencia 🔥
              </span>
            </div>

            {/* Meme Sticker Stamped on Ticket */}
            <div
              className={`meme-sticker-interactive-card ${currentMeme.animationClass}`}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderLeft: `4px solid ${currentMeme.borderColor || 'var(--neon-purple)'}`,
              }}
            >
              <div className="meme-sticker-img-container">
                <img
                  src={currentMeme.imageUrl}
                  alt={currentMeme.name}
                  className="meme-sticker-img"
                  loading="eager"
                />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.4px', lineHeight: 1.2 }}>
                  STICKER: {currentMeme.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.3 }}>
                  "{currentMeme.tagline}"
                </div>
              </div>
            </div>

            {/* Ticket Info Grid */}
            <div className="ticket-info-grid" style={{ marginTop: '1rem' }}>
              <div className="ticket-info-item">
                <span className="t-label">Titular de la Entrada</span>
                <span className="t-value" id="t-buyer-name">{currentOrder.buyerName}</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Cédula / DNI</span>
                <span className="t-value">{currentOrder.buyerDni}</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Fecha &amp; Hora</span>
                <span className="t-value">09 OCT • 8:00 PM</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Entradas Amparadas</span>
                <span className="t-value neon-highlight" id="t-tier-name">
                  {currentOrder.quantity}x {currentOrder.tier.name}
                </span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Lugar del Evento</span>
                <span className="t-value">Rock &amp; Riff (La Viña)</span>
              </div>
              <div className="ticket-info-item">
                <span className="t-label">Total a Pagar</span>
                <span className="t-value neon-highlight" id="t-total-usd">${currentOrder.totalUSD} USD</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }} id="t-total-ref">
                  (Ref: Bs. {currentOrder.totalRefBs})
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
                <span className="ticket-code-num" id="t-code-display">#{currentOrder.ticketCode}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px', maxWidth: '200px' }}>
                  Mostrá este código por WhatsApp o en la entrada de Rock &amp; Riff
                </span>
              </div>
            </div>
          </div>

          {/* Pass Actions Footer */}
          <div className="ticket-pass-footer">
            {exportProgressText && (
              <div style={{ fontSize: '0.82rem', color: 'var(--neon-cyan)', textAlign: 'center', marginBottom: '0.25rem', fontWeight: 700 }}>
                ⏳ {exportProgressText}
              </div>
            )}
            {exportNotice && (
              <div style={{ fontSize: '0.82rem', color: '#ffd600', textAlign: 'center', marginBottom: '0.25rem', fontWeight: 700 }}>
                {exportNotice}
              </div>
            )}

            {/* 1. Share / Export Video 9:16 for Instagram Stories */}
            <button
              type="button"
              id="btn-export-story-video"
              onClick={handleExportVideo}
              disabled={isExportingVideo || isExportingGif || isExportingPng}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #8b17f5 0%, #ec4899 50%, #ffd600 100%)',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-title)',
                fontWeight: 900,
                fontSize: '0.95rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(236, 72, 153, 0.45)',
                transition: 'transform 0.2s',
              }}
            >
              <span>🎬 {isExportingVideo ? 'Generando Video Stories...' : 'Compartir en Instagram Stories (Video 9:16)'}</span>
            </button>

            {/* 2. Secondary Export Options: GIF & PNG */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                id="btn-export-gif"
                onClick={handleExportGif}
                disabled={isExportingVideo || isExportingGif || isExportingPng}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-neon-cyan)',
                  color: 'var(--neon-cyan)',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>🎞️ {isExportingGif ? 'Creando GIF...' : 'Descargar GIF'}</span>
              </button>

              <button
                type="button"
                id="btn-export-png"
                onClick={handleExportPng}
                disabled={isExportingVideo || isExportingGif || isExportingPng}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-neon-purple)',
                  color: '#fff',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>📸 {isExportingPng ? 'Guardando...' : 'Boleto PNG'}</span>
              </button>
            </div>

            {/* 3. WhatsApp Direct Link */}
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
