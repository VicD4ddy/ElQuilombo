'use client';

import React from 'react';
import { EventSettings } from '../../types/settings';

interface AdminTicketPreviewProps {
  settings: EventSettings;
}

export default function AdminTicketPreview({ settings }: AdminTicketPreviewProps) {
  return (
    <div
      style={{
        background: 'rgba(10, 8, 20, 0.85)',
        border: '1px solid var(--border-neon-purple)',
        borderRadius: '20px',
        padding: '1.25rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.5rem',
        }}
      >
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          👁️ Simulador de Boleto en Vivo
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
          Vista del Asistente
        </span>
      </div>

      <div
        className="ticket-pass"
        style={{
          maxWidth: '100%',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
          transform: 'scale(0.98)',
          transformOrigin: 'top center',
        }}
      >
        {/* Pass Header */}
        <div className="ticket-pass-header">
          <div className="ticket-pass-brand">
            <img
              src="/assets/img/el-quilombo-logo.png"
              alt="El Quilombo"
              className="ticket-pass-logo"
            />
            <div style={{ fontSize: '0.72rem', opacity: 0.95, fontWeight: 700, letterSpacing: '0.5px' }}>
              {settings.ticketSubtitle || 'FIESTA ARGENTINA'}
            </div>
          </div>
          <div className="ticket-pass-badge">
            ¡RESERVA CONFIRMADA!
          </div>
        </div>

        {/* Pass Body */}
        <div className="ticket-pass-body">
          {/* Sample Sticker */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.2), rgba(168, 85, 247, 0.2))',
              border: '2px dashed var(--neon-pink)',
              borderRadius: '12px',
              padding: '0.65rem 0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <span style={{ fontSize: '1.6rem' }}>🐶🕺</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#ff007f', textTransform: 'uppercase' }}>
                STICKER OFICIAL: PERRITO BAILARÍN
              </div>
              <div style={{ fontSize: '0.72rem', color: '#ff77bc' }}>
                &ldquo;Hoy se sale a romper la noche en Óleo&rdquo;
              </div>
            </div>
          </div>

          <div className="ticket-info-grid">
            <div className="ticket-info-item">
              <span className="t-label">Titular de la Entrada</span>
              <span className="t-value">Nombre del Asistente</span>
            </div>
            <div className="ticket-info-item">
              <span className="t-label">Cédula / DNI</span>
              <span className="t-value">V-28.XXX.XXX</span>
            </div>
            <div className="ticket-info-item">
              <span className="t-label">Fecha & Hora</span>
              <span className="t-value" style={{ color: 'var(--neon-cyan)', fontWeight: 800 }}>
                {settings.eventDate}
              </span>
            </div>
            <div className="ticket-info-item">
              <span className="t-label">Tipo de Boleto</span>
              <span className="t-value neon-highlight">
                1x Pase VIP Quilombo
              </span>
            </div>
            <div className="ticket-info-item" style={{ gridColumn: 'span 2' }}>
              <span className="t-label">Lugar del Evento</span>
              <span className="t-value" style={{ color: '#fff', fontWeight: 700 }}>
                {settings.venueName}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                {settings.venueAddress}
              </span>
            </div>
            <div className="ticket-info-item">
              <span className="t-label">Total a Pagar (VIP)</span>
              <span className="t-value neon-highlight">
                ${settings.priceVip} USD
              </span>
            </div>
            <div className="ticket-info-item">
              <span className="t-label">Precio General</span>
              <span className="t-value" style={{ color: 'var(--text-muted)' }}>
                ${settings.priceGeneral} USD
              </span>
            </div>
          </div>

          {/* Perforation */}
          <div className="ticket-perforation">
            <div className="perforation-line" />
          </div>

          {/* QR & Code */}
          <div className="ticket-qr-section">
            <div
              style={{
                width: '80px',
                height: '80px',
                background: '#fff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
              }}
            >
              🏁
            </div>
            <div className="ticket-code-info">
              <span className="t-label">Código Único de Reserva</span>
              <span className="ticket-code-num">#QLB-26-XXXX</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                {settings.ticketDoorInstructions}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              background: 'rgba(37, 211, 102, 0.12)',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              borderRadius: '8px',
              fontSize: '0.74rem',
              color: '#25d366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>WhatsApp Oficial para Pagos:</span>
            <strong>+{settings.officialWhatsapp}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
