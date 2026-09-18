'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TICKET_TIERS, REF_EXCHANGE_RATE } from '../../data/ticketing';
import { TicketTier, TicketOrder } from '../../types/ticket';
import { getRandomMemeSticker } from '../../data/memes';
import { processReservation } from '../../lib/reservations';

interface TicketingSectionProps {
  onGenerateTicket: (order: TicketOrder) => void;
}

export default function TicketingSection({ onGenerateTicket }: TicketingSectionProps) {
  const [selectedTierId, setSelectedTierId] = useState<'general' | 'vip'>('vip');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    email: '',
    paymentMethod: 'Pago Móvil',
    favoriteArtist: '',
  });

  const fahAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const audio = new Audio('/assets/audio/fah.mp3');
      audio.preload = 'auto';
      fahAudioRef.current = audio;
    } catch (e) {}
  }, []);

  const playFahSound = () => {
    try {
      if (fahAudioRef.current) {
        fahAudioRef.current.currentTime = 0;
        fahAudioRef.current.volume = 1.0;
        const playPromise = fahAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[Ticketing] Audio play failed:', err);
          });
        }
      } else {
        const audio = new Audio('/assets/audio/fah.mp3');
        audio.volume = 1.0;
        audio.play().catch(() => {});
      }
    } catch (e) {
      console.warn('[Ticketing] Audio error:', e);
    }
  };

  const [bcvRate, setBcvRate] = useState<number>(REF_EXCHANGE_RATE);
  const [isRateLive, setIsRateLive] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/bcv')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.rate && typeof data.rate === 'number' && data.rate > 0) {
          setBcvRate(data.rate);
          setIsRateLive(Boolean(data.isLive));
        }
      })
      .catch((err) => {
        console.warn('[Ticketing] Error fetching live BCV rate:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedTier: TicketTier = TICKET_TIERS[selectedTierId];
  const totalUSD = selectedTier.priceUSD * quantity;
  const rawTotalBs = totalUSD * bcvRate;
  const totalRefBs = rawTotalBs.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedBcvRate = bcvRate.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      return Math.min(Math.max(next, 1), 10);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.dni) return;

    // 1. Play viral meme audio "FAHHHHHH"
    playFahSound();

    // 2. Explode party neon confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#a855f7', '#00f0ff', '#ff007f', '#ffd600', '#ffffff'],
      });
    } catch (err) {}

    setIsSubmitting(true);

    try {
      const meme = getRandomMemeSticker();
      const result = await processReservation(
        {
          tier: selectedTier,
          quantity,
          buyerName: formData.name.trim(),
          buyerDni: formData.dni.trim(),
          buyerPhone: formData.phone.trim(),
          buyerEmail: formData.email.trim(),
          paymentMethod: formData.paymentMethod,
          favoriteArtist: formData.favoriteArtist.trim() || 'Milo J / Trueno',
          totalUSD,
          totalRefBs,
        },
        meme
      );

      const finalOrder: TicketOrder = {
        ...result.order,
        meme,
        isExisting: result.isExisting,
        noticeMessage: result.message,
      };

      onGenerateTicket(finalOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section ticketing-section" id="entradas">
      <div className="container">
        <div className="section-header">
          <span className="section-pill">Fase de Preventa</span>
          <h2 className="section-title">
            ELEGÍ TU <span className="text-gradient">TIPO DE ENTRADA</span>
          </h2>
          <p className="section-subtitle">
            Precios especiales de Preventa 1. Seleccioná tu pase para calcular el total y apartar tu entrada al instante.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {/* General Pass */}
          <div
            className={`ticket-card ${selectedTierId === 'general' ? 'selected' : ''}`}
            data-tier="general"
            onClick={() => setSelectedTierId('general')}
          >
            <div className="ticket-header">
              <h3 className="ticket-name">{TICKET_TIERS.general.name}</h3>
              <div className="ticket-sub">⚡ Preventa 1 (Early Bird)</div>
            </div>
            <div className="ticket-price-box">
              <span className="ticket-currency">$</span>
              <span className="ticket-amount">{TICKET_TIERS.general.priceUSD}</span>
              <span className="ticket-period">USD</span>
            </div>
            <ul className="ticket-features">
              {TICKET_TIERS.general.features.map((feat, idx) => (
                <li key={idx} className="ticket-feature-item">
                  <span className="check">✓</span> <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-select-tier">
              {selectedTierId === 'general' ? '✓ Seleccionado' : 'Seleccionar Pase'}
            </button>
          </div>

          {/* VIP Pass */}
          <div
            className={`ticket-card popular ${selectedTierId === 'vip' ? 'selected' : ''}`}
            data-tier="vip"
            onClick={() => setSelectedTierId('vip')}
          >
            <div className="badge-popular">🔥 MÁS POPULAR</div>
            <div className="ticket-header">
              <h3 className="ticket-name">{TICKET_TIERS.vip.name}</h3>
              <div className="ticket-sub">⚡ Experiencia Completa + After</div>
            </div>
            <div className="ticket-price-box">
              <span className="ticket-currency">$</span>
              <span className="ticket-amount">{TICKET_TIERS.vip.priceUSD}</span>
              <span className="ticket-period">USD</span>
            </div>
            <ul className="ticket-features">
              {TICKET_TIERS.vip.features.map((feat, idx) => (
                <li key={idx} className="ticket-feature-item">
                  <span className="check">✓</span> <span>{feat}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-select-tier">
              {selectedTierId === 'vip' ? '✓ Seleccionado' : 'Seleccionar Pase'}
            </button>
          </div>
        </div>

        {/* Reservation Box */}
        <div className="reservation-box" id="reserva">
          <div className="res-header">
            <h3 className="res-title">APARTÁ TU ENTRADA EN PREVENTA</h3>
            <p className="res-subtitle">
              Completá tus datos para generar tu <strong>Ticket Digital con Código QR</strong> y confirmar tu reserva directamente por WhatsApp.
            </p>
          </div>

          {/* Live Calculator Bar */}
          <div className="calculator-bar">
            <div className="calc-tier-info">
              <span className="calc-tier-name" id="calc-tier-name">
                {selectedTier.name}
              </span>
              <span className="calc-tier-unit" id="calc-tier-unit">
                ${selectedTier.priceUSD} USD c/u
              </span>
            </div>

            <div className="calc-qty-control">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                CANTIDAD:
              </span>
              <button
                type="button"
                className="btn-qty"
                id="btn-qty-minus"
                onClick={() => handleQtyChange(-1)}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="qty-display" id="calc-qty">
                {quantity}
              </span>
              <button
                type="button"
                className="btn-qty"
                id="btn-qty-plus"
                onClick={() => handleQtyChange(1)}
                disabled={quantity >= 10}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            <div className="calc-total-box">
              <div className="calc-total-usd" id="calc-total-usd">
                ${totalUSD} USD
              </div>
              <div className="calc-total-ref" id="calc-total-ref">
                Ref. Bs: {totalRefBs}
              </div>
              <div
                id="bcv-rate-indicator"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.74rem',
                  color: isRateLive ? 'var(--neon-cyan)' : 'var(--text-subtle)',
                  marginTop: '0.35rem',
                  fontWeight: 600,
                  letterSpacing: '0.2px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: isRateLive ? '#00f0ff' : '#888',
                    boxShadow: isRateLive ? '0 0 8px #00f0ff' : 'none',
                    flexShrink: 0,
                  }}
                />
                <span>Tasa BCV oficial: Bs. {formattedBcvRate}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form className="res-form" id="reservation-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="buyer-name" className="form-label">
                Nombre y Apellido *
              </label>
              <input
                type="text"
                id="buyer-name"
                className="form-input"
                placeholder="Ej: Santiago Pérez"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <span className="form-hint">El nombre que aparecerá en tu boleto digital</span>
            </div>

            <div className="form-group">
              <label htmlFor="buyer-dni" className="form-label">
                Cédula o DNI *
              </label>
              <input
                type="text"
                id="buyer-dni"
                className="form-input"
                placeholder="Ej: V-28123456"
                required
                inputMode="numeric"
                autoComplete="off"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              />
              <span className="form-hint">Para verificación de aforo en la puerta</span>
            </div>

            <div className="form-group">
              <label htmlFor="buyer-phone" className="form-label">
                WhatsApp de Contacto *
              </label>
              <input
                type="tel"
                id="buyer-phone"
                className="form-input"
                placeholder="Ej: 0412 1234567"
                required
                autoComplete="tel"
                inputMode="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <span className="form-hint">Para enviarte la confirmación y datos de pago</span>
            </div>

            <div className="form-group">
              <label htmlFor="buyer-email" className="form-label">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="buyer-email"
                className="form-input"
                placeholder="tucorreo@ejemplo.com"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <span className="form-hint">Para respaldo de tu boleto y código QR</span>
            </div>

            <div className="form-group">
              <label htmlFor="buyer-payment" className="form-label">
                Método de Pago Preferido *
              </label>
              <select
                id="buyer-payment"
                className="form-select"
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="Pago Móvil">Pago Móvil (Banesco, Mercantil, Venezuela, etc.)</option>
                <option value="Zelle">Zelle (USD)</option>
                <option value="Binance Pay (USDT)">Binance Pay (USDT)</option>
                <option value="Efectivo en Óleo Gastrobar">Efectivo (USD en puerta / local)</option>
              </select>
              <span className="form-hint">Te daremos los datos según tu método elegido</span>
            </div>

            <div className="form-group form-full">
              <label htmlFor="buyer-artist" className="form-label">
                ¿Qué tema o artista argentino no puede faltar en la fiesta? 🗣️
              </label>
              <input
                type="text"
                id="buyer-artist"
                className="form-input"
                placeholder="Ej: Milo J - Rara Vez / Trueno - Dance Crip / Duki"
                value={formData.favoriteArtist}
                onChange={(e) => setFormData({ ...formData, favoriteArtist: e.target.value })}
              />
              <span className="form-hint">¡Los temas más pedidos sonarán en vivo!</span>
            </div>

            <div className="form-full">
              <button type="submit" id="btn-submit-reservation" className="btn-checkout" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>⚡ Guardando en Supabase y Generando Boleto...</span>
                ) : (
                  <>
                    <span>⚡ Generar Boleto Digital & Apartar por WhatsApp</span>
                    <span>→</span>
                  </>
                )}
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.65rem' }}>
                <button
                  type="button"
                  id="btn-preview-fah"
                  onClick={playFahSound}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px dashed var(--border-neon-purple)',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--neon-purple-light)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '0.45rem 1rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>🔊 Probar audio "FAHHHHHH"</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
