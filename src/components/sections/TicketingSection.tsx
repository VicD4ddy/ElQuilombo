'use client';

import React, { useState } from 'react';
import { TICKET_TIERS, REF_EXCHANGE_RATE } from '../../data/ticketing';
import { TicketTier, TicketOrder } from '../../types/ticket';

interface TicketingSectionProps {
  onGenerateTicket: (order: TicketOrder) => void;
}

export default function TicketingSection({ onGenerateTicket }: TicketingSectionProps) {
  const [selectedTierId, setSelectedTierId] = useState<'general' | 'vip'>('vip');
  const [quantity, setQuantity] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    email: '',
    paymentMethod: 'Pago Móvil',
    favoriteArtist: '',
  });

  const selectedTier: TicketTier = TICKET_TIERS[selectedTierId];
  const totalUSD = selectedTier.priceUSD * quantity;
  const totalRefBs = (totalUSD * REF_EXCHANGE_RATE).toFixed(2);

  const handleQtyChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      return Math.min(Math.max(next, 1), 10);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `QLB-26-${randomCode}`;

    const order: TicketOrder = {
      tier: selectedTier,
      quantity,
      buyerName: formData.name.trim(),
      buyerDni: formData.dni.trim() || 'N/A',
      buyerPhone: formData.phone.trim(),
      buyerEmail: formData.email.trim(),
      paymentMethod: formData.paymentMethod,
      favoriteArtist: formData.favoriteArtist.trim() || 'Milo J / Trueno',
      totalUSD,
      totalRefBs,
      ticketCode,
      createdAt: new Date().toISOString(),
    };

    onGenerateTicket(order);
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
                Ref. aprox: Bs. {totalRefBs}
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
              <button type="submit" className="btn-checkout">
                <span>⚡ Generar Boleto Digital & Apartar por WhatsApp</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
