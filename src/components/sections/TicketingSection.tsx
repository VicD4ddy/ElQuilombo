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
    paymentMethod: 'Pago Móvil (Bolívares)',
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
    <section className="section" id="entradas">
      <div className="container">
        <div className="section-header">
          <span className="section-pill">Fase 1 • Cupos Limitados</span>
          <h2 className="section-title">
            ASEGURÁ TU ENTRADA EN <span className="text-gradient">PREVENTA OFICIAL</span>
          </h2>
          <p className="section-subtitle">
            Seleccioná tu tipo de entrada, calculá tu monto en USD o Bolívares y completá tu reserva para recibir tu boleto digital con código QR.
          </p>
        </div>

        {/* Pricing Cards Grid (2 Centered Columns) */}
        <div className="pricing-grid">
          {/* General Pass */}
          <div
            className={`pricing-card ${selectedTierId === 'general' ? 'active' : ''}`}
            onClick={() => setSelectedTierId('general')}
          >
            <div className="tier-badge-wrap">
              <span className="tier-badge">{TICKET_TIERS.general.badge}</span>
            </div>
            <h3 className="tier-name">{TICKET_TIERS.general.name}</h3>
            <div className="tier-price-box">
              <span className="price-currency">$</span>
              <span className="price-amount">{TICKET_TIERS.general.priceUSD}</span>
              <span className="price-period">USD</span>
            </div>
            <p className="tier-desc">{TICKET_TIERS.general.description}</p>
            <ul className="tier-features-list">
              {TICKET_TIERS.general.features.map((feat, idx) => (
                <li key={idx}><span className="check">✓</span> {feat}</li>
              ))}
            </ul>
            <button
              type="button"
              className={`btn-select-tier ${selectedTierId === 'general' ? 'selected' : ''}`}
            >
              {selectedTierId === 'general' ? '✓ Seleccionado' : 'Elegir Pase General'}
            </button>
          </div>

          {/* VIP Pass */}
          <div
            className={`pricing-card featured ${selectedTierId === 'vip' ? 'active' : ''}`}
            onClick={() => setSelectedTierId('vip')}
          >
            <div className="tier-badge-wrap">
              <span className="tier-badge highlight">{TICKET_TIERS.vip.badge}</span>
            </div>
            <h3 className="tier-name">{TICKET_TIERS.vip.name}</h3>
            <div className="tier-price-box">
              <span className="price-currency">$</span>
              <span className="price-amount">{TICKET_TIERS.vip.priceUSD}</span>
              <span className="price-period">USD</span>
            </div>
            <p className="tier-desc">{TICKET_TIERS.vip.description}</p>
            <ul className="tier-features-list">
              {TICKET_TIERS.vip.features.map((feat, idx) => (
                <li key={idx}><span className="check">✓</span> {feat}</li>
              ))}
            </ul>
            <button
              type="button"
              className={`btn-select-tier ${selectedTierId === 'vip' ? 'selected' : ''}`}
            >
              {selectedTierId === 'vip' ? '✓ Seleccionado' : 'Elegir Pase VIP'}
            </button>
          </div>
        </div>

        {/* Live Calculation Banner */}
        <div className="calculator-box">
          <div className="calc-details">
            <span className="calc-label">Pase Seleccionado:</span>
            <strong className="calc-value">{selectedTier.name}</strong>
            <span className="calc-unit">(${selectedTier.priceUSD} c/u)</span>
          </div>

          <div className="calc-qty-control">
            <span className="calc-label">Cantidad:</span>
            <div className="qty-picker">
              <button
                type="button"
                className="btn-qty"
                onClick={() => handleQtyChange(-1)}
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="qty-display">{quantity}</span>
              <button
                type="button"
                className="btn-qty"
                onClick={() => handleQtyChange(1)}
                disabled={quantity >= 10}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          <div className="calc-total">
            <span className="calc-label">Total Estimado:</span>
            <div className="total-amount-box">
              <strong className="total-usd">${totalUSD} USD</strong>
              <span className="total-ref">(Ref: Bs. {totalRefBs})</span>
            </div>
          </div>
        </div>

        {/* Reservation Form */}
        <div className="form-container">
          <div className="form-header">
            <h3 className="form-title">COMPLETA TUS DATOS DE RESERVA</h3>
            <p className="form-subtitle">
              Generá tu comprobante digital y te pondremos en contacto directo con nuestro canal oficial de WhatsApp para procesar tu pago.
            </p>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="buyer-name" className="form-label">
                  Nombre y Apellido <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="buyer-name"
                  className="form-input"
                  required
                  placeholder="Ej: Santiago Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="buyer-dni" className="form-label">
                  Cédula / DNI <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="buyer-dni"
                  className="form-input"
                  required
                  inputMode="numeric"
                  placeholder="Ej: 28.123.456"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="buyer-phone" className="form-label">
                  WhatsApp / Teléfono <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  id="buyer-phone"
                  className="form-input"
                  required
                  inputMode="tel"
                  placeholder="Ej: 0412-1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="buyer-email" className="form-label">
                  Correo Electrónico <span className="req">*</span>
                </label>
                <input
                  type="email"
                  id="buyer-email"
                  className="form-input"
                  required
                  placeholder="Ej: santiago@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="buyer-payment" className="form-label">
                  Método de Pago Preferido <span className="req">*</span>
                </label>
                <select
                  id="buyer-payment"
                  className="form-input"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                >
                  <option value="Pago Móvil (Bolívares)">Pago Móvil (Bolívares al cambio)</option>
                  <option value="Zelle (USD)">Zelle (USD)</option>
                  <option value="Binance Pay (USDT)">Binance Pay (USDT)</option>
                  <option value="Efectivo USD en Óleo">Efectivo USD en puerta de Óleo</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria Nacional</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="buyer-artist" className="form-label">
                  ¿Qué tema o artista no puede faltar?
                </label>
                <input
                  type="text"
                  id="buyer-artist"
                  className="form-input"
                  placeholder="Ej: Rara Vez de Milo J / Goteo de Duki"
                  value={formData.favoriteArtist}
                  onChange={(e) => setFormData({ ...formData, favoriteArtist: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit-booking">
              <span>🎟️ Generar Boleto QR & Reservar (${totalUSD} USD)</span>
              <span>→</span>
            </button>

            <div className="form-guarantee">
              <span>🔒 Reserva segura y directa • Sin intermediarios • Confirmación inmediata por WhatsApp</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
