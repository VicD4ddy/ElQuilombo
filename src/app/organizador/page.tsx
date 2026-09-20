'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EventSettings, DEFAULT_EVENT_SETTINGS, OrganizerMetrics } from '../../types/settings';
import { Track } from '../../types/track';
import { PLAYLIST as INITIAL_PLAYLIST } from '../../data/playlist';
import AdminTicketPreview from '../../components/admin/AdminTicketPreview';
import { saveEventSettings, getEventSettings } from '../../lib/settings';
import TicketQrModal from '../../components/modals/TicketQrModal';
import { TicketOrder } from '../../types/ticket';
import { MEME_STICKERS } from '../../data/memes';

export default function OrganizadorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'metrics' | 'attendees' | 'ticket' | 'playlist'>('metrics');

  // Selected reservation to generate and send QR ticket
  const [selectedTicketOrder, setSelectedTicketOrder] = useState<TicketOrder | null>(null);

  // Event settings state
  const [settings, setSettings] = useState<EventSettings>(DEFAULT_EVENT_SETTINGS);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [settingsSaveNotice, setSettingsSaveNotice] = useState<string | null>(null);

  // Reservations state
  const [reservations, setReservations] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<OrganizerMetrics | null>(null);
  const [isLoadingReservations, setIsLoadingReservations] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Playlist state
  const [customTracks, setCustomTracks] = useState<Track[]>([]);
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    src: '',
    cover: '',
    badge: '',
  });
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);

  // Check saved session on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('quilombo_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load settings and reservations when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchSettings();
    fetchReservations();
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        if (Array.isArray(data.settings.customTracks)) {
          setCustomTracks(data.settings.customTracks);
        }
      }
    } catch (err) {
      console.warn('Error fetching settings:', err);
    }
  };

  const fetchReservations = async () => {
    setIsLoadingReservations(true);
    try {
      const res = await fetch('/api/admin/reservations');
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations || []);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.warn('Error fetching reservations:', err);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handlePinSubmit = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    const cleanPin = pinInput.trim();
    // Default master PIN is 1984 or customized in settings
    if (cleanPin === '1984' || cleanPin === settings.organizerPin) {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('quilombo_admin_auth', 'true');
      }
      setPinError(null);
    } else {
      setPinError('PIN incorrecto. El PIN por defecto es 1984.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('quilombo_admin_auth');
    setPinInput('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSaveNotice(null);

    try {
      const payload = {
        ...settings,
        customTracks,
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSettingsSaveNotice('¡Configuración guardada exitosamente en Supabase!');
        setTimeout(() => setSettingsSaveNotice(null), 4000);
      } else {
        setSettingsSaveNotice('Error al guardar: ' + (data.error || 'Desconocido'));
      }
    } catch (err: any) {
      setSettingsSaveNotice('Error de conexión al guardar.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTogglePaid = async (reservation: any) => {
    const newPaidStatus = !reservation.is_paid;
    setUpdatingId(reservation.id);

    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reservation.id,
          is_paid: newPaidStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state immediately
        setReservations((prev) =>
          prev.map((r) => (r.id === reservation.id ? { ...r, is_paid: newPaidStatus } : r))
        );
        // Refresh metrics
        fetchReservations();
      }
    } catch (err) {
      console.error('Error toggling is_paid:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenTicketGenerator = async (reservation: any) => {
    // Si aún no está aprobada, la marcamos como pagada en el sistema
    if (!reservation.is_paid) {
      await handleTogglePaid(reservation);
    }

    const selectedMeme =
      MEME_STICKERS.find((m) => m.id === reservation.meme_sticker_used) ||
      MEME_STICKERS[0];

    const order: TicketOrder = {
      tier: {
        id: reservation.tier_id || 'general',
        name: reservation.tier_name || 'Pase Preventa Oficial',
        priceUSD: reservation.quantity ? Math.round(reservation.total_usd / reservation.quantity) : 10,
        features: [],
      },
      quantity: reservation.quantity || 1,
      buyerName: reservation.buyer_name || 'Asistente',
      buyerDni: reservation.buyer_dni || '',
      buyerPhone: reservation.buyer_phone || '',
      buyerEmail: reservation.buyer_email || '',
      paymentMethod: reservation.payment_method || 'Pago Móvil',
      favoriteArtist: reservation.favorite_artist || '',
      totalUSD: Number(reservation.total_usd || 0),
      totalRefBs: Number(reservation.total_ref_bs || 0).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      ticketCode: reservation.ticket_code,
      createdAt: reservation.created_at,
      isPaid: true,
      meme: selectedMeme,
    };

    setSelectedTicketOrder(order);
  };

  const handleExportCSV = () => {
    if (reservations.length === 0) {
      alert('No hay reservas registradas para exportar.');
      return;
    }

    const headers = [
      'Codigo Ticket',
      'Titular',
      'Cedula DNI',
      'WhatsApp',
      'Email',
      'Pase',
      'Cantidad',
      'Total USD',
      'Total Bs',
      'Metodo Pago',
      'Tema Pedido',
      'Sticker Usado',
      'Estado Pago',
      'Fecha Creacion',
    ];

    const rows = reservations.map((r) => [
      `"${r.ticket_code}"`,
      `"${r.buyer_name || ''}"`,
      `"${r.buyer_dni || ''}"`,
      `"${r.buyer_phone || ''}"`,
      `"${r.buyer_email || ''}"`,
      `"${r.tier_name || ''}"`,
      r.quantity || 1,
      r.total_usd || 0,
      r.total_ref_bs || 0,
      `"${r.payment_method || ''}"`,
      `"${(r.favorite_artist || '').replace(/"/g, '""')}"`,
      `"${r.meme_sticker_used || ''}"`,
      r.is_paid ? 'PAGADO' : 'PENDIENTE',
      `"${r.created_at || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lista_puerta_el_quilombo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrack.title || !newTrack.artist || !newTrack.src) {
      alert('Por favor completá al menos el Título, Artista y enlace de audio.');
      return;
    }

    const id = 'custom-' + Date.now();
    const trackItem: Track = {
      id,
      title: newTrack.title.trim(),
      artist: newTrack.artist.trim(),
      src: newTrack.src.trim(),
      cover: newTrack.cover.trim() || '/assets/img/tracks/gil.jpg',
      badge: newTrack.badge.trim() || `🔥 ${newTrack.artist.trim()}`,
      category: 'custom',
    };

    const updated = [...customTracks, trackItem];
    setCustomTracks(updated);
    setNewTrack({ title: '', artist: '', src: '', cover: '', badge: '' });

    // Auto save to settings
    saveEventSettings({ customTracks: updated });
  };

  const handleRemoveTrack = (id: string) => {
    const updated = customTracks.filter((t) => t.id !== id);
    setCustomTracks(updated);
    saveEventSettings({ customTracks: updated });
  };

  const handlePreviewTrack = (src: string, id: string) => {
    if (previewingTrackId === id) {
      if (previewAudio) {
        previewAudio.pause();
      }
      setPreviewingTrackId(null);
      return;
    }

    if (previewAudio) {
      previewAudio.pause();
    }

    const audio = new Audio(src);
    audio.play().catch(() => alert('No se pudo reproducir este archivo de audio. Verificá la URL.'));
    setPreviewAudio(audio);
    setPreviewingTrackId(id);
    audio.onended = () => setPreviewingTrackId(null);
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      (r.buyer_name && r.buyer_name.toLowerCase().includes(q)) ||
      (r.buyer_dni && r.buyer_dni.toLowerCase().includes(q)) ||
      (r.ticket_code && r.ticket_code.toLowerCase().includes(q)) ||
      (r.buyer_phone && r.buyer_phone.includes(q));

    if (!matchesQuery) return false;

    if (statusFilter === 'paid') return r.is_paid;
    if (statusFilter === 'pending') return !r.is_paid;
    return true;
  });

  const paidCount = reservations.filter((r) => r.is_paid).length;
  const pendingCount = reservations.filter((r) => !r.is_paid).length;

  // -------------------------------------------------------------
  // PIN LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at 50% 30%, #1e1135 0%, #06050a 80%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          fontFamily: 'var(--font-body)',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(15, 12, 28, 0.95)',
            border: '1px solid var(--border-neon-purple)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.2)',
          }}
        >
          <img
            src="/assets/img/el-quilombo-logo.png"
            alt="El Quilombo"
            style={{ width: '130px', margin: '0 auto 1.25rem', display: 'block' }}
          />

          <div
            style={{
              display: 'inline-block',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid var(--border-neon-cyan)',
              color: 'var(--neon-cyan)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem',
            }}
          >
            🔐 Panel de Organizador
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '0.5rem',
            }}
          >
            ACCESO EXCLUSIVO
          </h1>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', marginBottom: '1.75rem' }}>
            Ingresá el PIN de seguridad del equipo de El Quilombo para acceder a métricas, conciliación y personalización.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePinSubmit(e);
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <input
                type="password"
                id="organizer-pin-input"
                inputMode="numeric"
                maxLength={8}
                placeholder="Ingresá el PIN (ej: 1984)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePinSubmit(e);
                  }
                }}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '14px',
                  color: '#fff',
                  padding: '0.9rem',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  letterSpacing: '4px',
                  outline: 'none',
                }}
              />
            </div>

            {pinError && (
              <div style={{ color: '#ff007f', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>
                {pinError}
              </div>
            )}

            <button
              type="button"
              id="btn-login-organizer"
              onClick={handlePinSubmit}
              style={{
                width: '100%',
                background: 'var(--gradient-party)',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-title)',
                fontWeight: 900,
                fontSize: '0.95rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-neon-pink)',
              }}
            >
              Desbloquear Panel →
            </button>
          </form>

          <div style={{ marginTop: '1.5rem' }}>
            <Link
              href="/"
              style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', textDecoration: 'underline' }}
            >
              ← Volver al sitio web principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ORGANIZER DASHBOARD
  // -------------------------------------------------------------
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06050a',
        color: 'var(--text-main)',
        fontFamily: 'var(--font-body)',
        paddingBottom: '5rem',
      }}
    >
      {/* Top Admin Header */}
      <header className="organizer-header-responsive">
        <div className="organizer-header-top">
          <div className="organizer-brand-group">
            <Link href="/" title="Volver a la portada">
              <img
                src="/assets/img/el-quilombo-logo.png"
                alt="El Quilombo"
                className="organizer-brand-logo"
              />
            </Link>
            <span className="organizer-badge-tag">
              Panel Organizador
            </span>
          </div>

          <div className="organizer-header-actions">
            <Link
              href="/"
              target="_blank"
              className="organizer-action-link-web"
              title="Abrir web pública en nueva pestaña"
            >
              <span>🌐</span> <span>Ver Web ↗</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="organizer-action-btn-logout"
              title="Cerrar sesión de organizador"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="organizer-tabs-bar">
          <button
            type="button"
            id="tab-btn-metrics"
            onClick={() => setActiveTab('metrics')}
            className={`organizer-tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          >
            <span>📊</span> Métricas
          </button>

          <button
            type="button"
            id="tab-btn-attendees"
            onClick={() => setActiveTab('attendees')}
            className={`organizer-tab-btn ${activeTab === 'attendees' ? 'active' : ''}`}
          >
            <span>👥</span> Asistentes ({reservations.length})
          </button>

          <button
            type="button"
            id="tab-btn-ticket"
            onClick={() => setActiveTab('ticket')}
            className={`organizer-tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
          >
            <span>🎟️</span> Boleto Digital
          </button>

          <button
            type="button"
            id="tab-btn-playlist"
            onClick={() => setActiveTab('playlist')}
            className={`organizer-tab-btn ${activeTab === 'playlist' ? 'active' : ''}`}
          >
            <span>🎵</span> Playlist ({customTracks.length + INITIAL_PLAYLIST.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="organizer-main-container">
        {/* ========================================================= */}
        {/* TAB 1: METRICS DASHBOARD                                  */}
        {/* ========================================================= */}
        {activeTab === 'metrics' && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>
                  RESUMEN DE RECAUDACIÓN &amp; AFORO
                </h2>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                  Datos en tiempo real sincronizados desde la base de datos Supabase.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchReservations}
                disabled={isLoadingReservations}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-pill)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  minHeight: '40px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {isLoadingReservations ? '🔄 Actualizando...' : '🔄 Refrescar'}
              </button>
            </div>

            {/* Metric KPI Cards Grid (Responsive 2x2 on Mobile, 4x1 on Desktop) */}
            <div className="organizer-metrics-grid">
              {/* Total Revenue USD */}
              <div
                className="organizer-kpi-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(15, 12, 28, 0.85))',
                  border: '1px solid var(--border-neon-cyan)',
                }}
              >
                <span className="organizer-kpi-title" style={{ color: 'var(--neon-cyan)' }}>
                  💰 Total Preventa (USD)
                </span>
                <div className="organizer-kpi-value">
                  ${metrics?.totalRevenueUSD || 0} USD
                </div>
                <span className="organizer-kpi-subtext">
                  Ref. Bs: {metrics ? metrics.totalRevenueBs.toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '0,00'}
                </span>
              </div>

              {/* Tickets Count */}
              <div
                className="organizer-kpi-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(15, 12, 28, 0.85))',
                  border: '1px solid var(--border-neon-purple)',
                }}
              >
                <span className="organizer-kpi-title" style={{ color: 'var(--neon-purple-light)' }}>
                  🎟️ Entradas Apartadas
                </span>
                <div className="organizer-kpi-value">
                  {metrics?.totalTicketsCount || 0}
                </div>
                <span className="organizer-kpi-subtext">
                  {metrics?.totalReservations || 0} órdenes registradas
                </span>
              </div>

              {/* Paid Status */}
              <div
                className="organizer-kpi-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12), rgba(15, 12, 28, 0.85))',
                  border: '1px solid rgba(37, 211, 102, 0.35)',
                }}
              >
                <span className="organizer-kpi-title" style={{ color: '#25d366' }}>
                  ✓ Pagadas vs. ⏳ Pendientes
                </span>
                <div className="organizer-kpi-value">
                  <span style={{ color: '#25d366' }}>{metrics?.paidReservationsCount || 0}</span>
                  <span style={{ color: 'var(--text-subtle)', fontSize: '1rem' }}> / </span>
                  <span style={{ color: '#ffd600' }}>{metrics?.pendingReservationsCount || 0}</span>
                </div>
                <span className="organizer-kpi-subtext">
                  WhatsApp Conciliación
                </span>
              </div>

              {/* Aforo / Occupancy */}
              <div
                className="organizer-kpi-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.12), rgba(15, 12, 28, 0.85))',
                  border: '1px solid var(--border-neon-pink)',
                }}
              >
                <span className="organizer-kpi-title" style={{ color: 'var(--neon-pink)' }}>
                  🔥 Aforo Rock &amp; Riff
                </span>
                <div className="organizer-kpi-value">
                  {metrics?.occupancyPercentage || 0}%
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginTop: '0.45rem' }}>
                  <div
                    style={{
                      width: `${Math.min(100, metrics?.occupancyPercentage || 0)}%`,
                      height: '100%',
                      background: 'var(--gradient-party)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Top Song Requests */}
            <div
              style={{
                background: 'rgba(15, 12, 28, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.5rem',
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  🎧 TOP TEMAS & ARTISTAS MÁS PEDIDOS (PARA EL DJ)
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                  Canciones que los asistentes escribieron en el formulario de preventa:
                </p>
              </div>

              {metrics && metrics.topRequestedArtists.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {metrics.topRequestedArtists.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-neon-purple)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ color: 'var(--neon-cyan)', fontWeight: 800 }}>#{idx + 1}</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{item.name}</span>
                      <span
                        style={{
                          background: 'rgba(168, 85, 247, 0.3)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        {item.count} votos
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  Aún no hay suficientes votos registrados.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ATTENDEES & PAYMENT RECONCILIATION                 */}
        {/* ========================================================= */}
        {activeTab === 'attendees' && (
          <div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                  LISTA DE ASISTENTES & CONCILIACIÓN
                </h2>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                  Buscá por cédula o código, cambiá el estado de pago y contactá al cliente.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  id="btn-export-csv"
                  onClick={handleExportCSV}
                  style={{
                    background: 'rgba(0, 240, 255, 0.15)',
                    border: '1px solid var(--border-neon-cyan)',
                    color: 'var(--neon-cyan)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>📥</span> Descargar Lista de Puerta (CSV)
                </button>
              </div>
            </div>

            {/* Filter Bar with iOS-friendly 16px search and count pills */}
            <div className="organizer-filters-bar">
              <div className="organizer-search-box">
                <input
                  type="text"
                  id="search-attendees-input"
                  placeholder="🔍 Buscar por nombre, cédula o código..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="organizer-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="organizer-search-clear-btn"
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="organizer-filter-pills-row">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className="organizer-filter-pill-btn"
                  style={{
                    background: statusFilter === 'all' ? 'var(--neon-purple)' : 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    boxShadow: statusFilter === 'all' ? '0 0 12px rgba(168, 85, 247, 0.4)' : 'none',
                  }}
                >
                  Todos ({reservations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('paid')}
                  className="organizer-filter-pill-btn"
                  style={{
                    background: statusFilter === 'paid' ? '#25d366' : 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    boxShadow: statusFilter === 'paid' ? '0 0 12px rgba(37, 211, 102, 0.35)' : 'none',
                  }}
                >
                  ✓ Pagados ({paidCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className="organizer-filter-pill-btn"
                  style={{
                    background: statusFilter === 'pending' ? '#ffd600' : 'rgba(255, 255, 255, 0.06)',
                    color: statusFilter === 'pending' ? '#000' : '#fff',
                    boxShadow: statusFilter === 'pending' ? '0 0 12px rgba(255, 214, 0, 0.35)' : 'none',
                  }}
                >
                  ⏳ Pendientes ({pendingCount})
                </button>
              </div>
            </div>

            {/* Desktop View: Full Data Table (Screens >= 768px) */}
            <div className="organizer-desktop-table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '0.85rem 1rem', color: 'var(--neon-cyan)', fontWeight: 800 }}>Código</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 800 }}>Titular &amp; Cédula</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 800 }}>Entradas</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 800 }}>Monto</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 800 }}>Método</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 800 }}>Estado Pago</th>
                    <th style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 800 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((r) => {
                      const waCleanPhone = (r.buyer_phone || '').replace(/\D/g, '');
                      const waLink = `https://wa.me/${waCleanPhone}?text=${encodeURIComponent(
                        `¡Hola ${r.buyer_name}! Te escribimos del equipo de El Quilombo 🇦🇷🔥 con respecto a tu preventa #${r.ticket_code} ($${r.total_usd} USD).`
                      )}`;

                      return (
                        <tr
                          key={`desktop-${r.id}`}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            background: r.is_paid ? 'rgba(37, 211, 102, 0.03)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--neon-cyan)' }}>
                            #{r.ticket_code}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 700, color: '#fff' }}>{r.buyer_name}</div>
                            <div style={{ color: 'var(--text-subtle)', fontSize: '0.74rem' }}>{r.buyer_dni}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span style={{ fontWeight: 700 }}>{r.quantity}x</span> {r.tier_name}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--neon-cyan)' }}>${r.total_usd} USD</div>
                            <div style={{ color: 'var(--text-subtle)', fontSize: '0.72rem' }}>Ref: Bs. {r.total_ref_bs}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                            {r.payment_method}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <button
                              type="button"
                              onClick={() => handleTogglePaid(r)}
                              disabled={updatingId === r.id}
                              style={{
                                background: r.is_paid ? '#25d366' : 'rgba(255, 214, 0, 0.15)',
                                border: r.is_paid ? 'none' : '1px solid #ffd600',
                                color: r.is_paid ? '#fff' : '#ffd600',
                                borderRadius: 'var(--radius-pill)',
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                              }}
                            >
                              {updatingId === r.id ? 'Guardando...' : r.is_paid ? '✓ PAGADO' : '⏳ PENDIENTE'}
                            </button>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleOpenTicketGenerator(r)}
                                title="Generar imagen oficial con código QR y enviar al cliente por WhatsApp"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(139, 23, 245, 0.3) 0%, rgba(0, 240, 255, 0.25) 100%)',
                                  border: '1px solid var(--border-neon-cyan)',
                                  color: '#fff',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.65rem',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <span>🎟️</span> Generar Boleto QR &amp; Enviar
                              </button>
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  background: 'rgba(37, 211, 102, 0.15)',
                                  border: '1px solid #25d366',
                                  color: '#25d366',
                                  borderRadius: '6px',
                                  padding: '0.35rem 0.65rem',
                                  fontSize: '0.74rem',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                💬 WhatsApp
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-subtle)' }}>
                        No se encontraron reservas con ese criterio de búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Ergonomic Concierge Cards (Screens < 768px) */}
            <div className="organizer-mobile-cards-container">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((r) => {
                  const waCleanPhone = (r.buyer_phone || '').replace(/\D/g, '');
                  const waLink = `https://wa.me/${waCleanPhone}?text=${encodeURIComponent(
                    `¡Hola ${r.buyer_name}! Te escribimos del equipo de El Quilombo 🇦🇷🔥 con respecto a tu preventa #${r.ticket_code} ($${r.total_usd} USD).`
                  )}`;

                  return (
                    <div
                      key={`mobile-card-${r.id}`}
                      className={`attendee-mobile-card ${r.is_paid ? 'paid' : 'pending'}`}
                    >
                      {/* Card Header: Ticket Code + Status Toggle */}
                      <div className="attendee-mobile-card-header">
                        <span className="attendee-mobile-ticket-code">
                          #{r.ticket_code}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleTogglePaid(r)}
                          disabled={updatingId === r.id}
                          className={`attendee-mobile-status-toggle ${r.is_paid ? 'paid' : 'pending'}`}
                          title="Tocar para cambiar estado de pago"
                        >
                          {updatingId === r.id
                            ? 'Guardando...'
                            : r.is_paid
                            ? '✓ PAGADO'
                            : '⏳ PENDIENTE'}
                        </button>
                      </div>

                      {/* Attendee Name */}
                      <div className="attendee-mobile-buyer-name">{r.buyer_name}</div>

                      {/* Meta: Cédula & Phone */}
                      <div className="attendee-mobile-meta-row">
                        {r.buyer_dni && (
                          <span className="attendee-mobile-meta-item">
                            🪪 {r.buyer_dni}
                          </span>
                        )}
                        {r.buyer_phone && (
                          <span className="attendee-mobile-meta-item">
                            📱 {r.buyer_phone}
                          </span>
                        )}
                      </div>

                      {/* Details Grid: Quantity, Tier, Amount & Payment Method */}
                      <div className="attendee-mobile-details-grid">
                        <div>
                          <div className="attendee-mobile-detail-label">Entradas</div>
                          <div className="attendee-mobile-detail-value">
                            {r.quantity}x {r.tier_name || 'Preventa'}
                          </div>
                        </div>

                        <div>
                          <div className="attendee-mobile-detail-label">Total USD</div>
                          <div className="attendee-mobile-detail-value" style={{ color: 'var(--neon-cyan)' }}>
                            ${r.total_usd} USD
                          </div>
                        </div>

                        <div>
                          <div className="attendee-mobile-detail-label">Método Pago</div>
                          <div className="attendee-mobile-detail-value" style={{ fontSize: '0.8rem' }}>
                            {r.payment_method || 'Pago Móvil'}
                          </div>
                        </div>

                        <div>
                          <div className="attendee-mobile-detail-label">Ref. Bs</div>
                          <div className="attendee-mobile-detail-value" style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                            Bs. {r.total_ref_bs || '0,00'}
                          </div>
                        </div>
                      </div>

                      {/* Song Request if provided */}
                      {r.favorite_artist && (
                        <div className="attendee-mobile-song-box" title={`Tema pedido: ${r.favorite_artist}`}>
                          <span>🎧</span>
                          <span><strong>Tema pedido:</strong> {r.favorite_artist}</span>
                        </div>
                      )}

                      {/* Action Buttons: Generate & Send QR + Direct WhatsApp */}
                      <div className="attendee-mobile-actions-row">
                        <button
                          type="button"
                          onClick={() => handleOpenTicketGenerator(r)}
                          className="attendee-mobile-btn-qr"
                          title="Aprobar y generar imagen oficial con código QR para enviar al asistente"
                        >
                          <span>🎟️</span>
                          <span>Generar Boleto QR</span>
                        </button>

                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="attendee-mobile-btn-wa"
                          title="Abrir chat directo de WhatsApp con el cliente"
                        >
                          <span>💬</span>
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2.5rem 1rem',
                    background: 'rgba(15, 12, 28, 0.8)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-subtle)',
                  }}
                >
                  <p style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>🔍</p>
                  <p style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 700 }}>
                    No se encontraron reservas
                  </p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Probá cambiando el filtro o término de búsqueda.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CUSTOMIZE DIGITAL TICKET                           */}
        {/* ========================================================= */}
        {activeTab === 'ticket' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                PERSONALIZADOR DEL BOLETO DIGITAL
              </h2>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                Modificá las fechas, lugar, precios y textos del comprobante. Los cambios se sincronizan en la web de todos los usuarios.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
                alignItems: 'start',
              }}
            >
              {/* Settings Form */}
              <form
                onSubmit={handleSaveSettings}
                style={{
                  background: 'rgba(15, 12, 28, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                }}
              >
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                      Fecha y Hora del Evento
                    </label>
                    <input
                      type="text"
                      id="input-event-date"
                      value={settings.eventDate}
                      onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '0.7rem',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                      Lugar del Evento (Venue)
                    </label>
                    <input
                      type="text"
                      id="input-venue-name"
                      value={settings.venueName}
                      onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '0.7rem',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      id="input-venue-address"
                      value={settings.venueAddress}
                      onChange={(e) => setSettings({ ...settings, venueAddress: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '0.7rem',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                        Precio General ($ USD)
                      </label>
                      <input
                        type="number"
                        id="input-price-general"
                        min="1"
                        value={settings.priceGeneral}
                        onChange={(e) => setSettings({ ...settings, priceGeneral: Number(e.target.value) })}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '0.7rem',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                        Precio VIP ($ USD)
                      </label>
                      <input
                        type="number"
                        id="input-price-vip"
                        min="1"
                        value={settings.priceVip}
                        onChange={(e) => setSettings({ ...settings, priceVip: Number(e.target.value) })}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '0.7rem',
                          color: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                      WhatsApp Oficial de Pagos
                    </label>
                    <input
                      type="text"
                      id="input-official-whatsapp"
                      value={settings.officialWhatsapp}
                      onChange={(e) => setSettings({ ...settings, officialWhatsapp: e.target.value })}
                      placeholder="Ej: 58412882460"
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '0.7rem',
                        color: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                      Instrucciones de Puerta en el Boleto
                    </label>
                    <textarea
                      id="input-door-instructions"
                      rows={2}
                      value={settings.ticketDoorInstructions}
                      onChange={(e) => setSettings({ ...settings, ticketDoorInstructions: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '0.7rem',
                        color: '#fff',
                        fontSize: '0.85rem',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>

                  {settingsSaveNotice && (
                    <div
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background: settingsSaveNotice.includes('Error')
                          ? 'rgba(255, 0, 127, 0.15)'
                          : 'rgba(0, 240, 255, 0.15)',
                        color: settingsSaveNotice.includes('Error') ? '#ff007f' : 'var(--neon-cyan)',
                      }}
                    >
                      {settingsSaveNotice}
                    </div>
                  )}

                  <button
                    type="submit"
                    id="btn-save-ticket-settings"
                    disabled={isSavingSettings}
                    style={{
                      background: 'var(--gradient-party)',
                      border: 'none',
                      color: '#fff',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-pill)',
                      cursor: 'pointer',
                    }}
                  >
                    {isSavingSettings ? 'Guardando en Supabase...' : '💾 Guardar Cambios en Vivo'}
                  </button>
                </div>
              </form>

              {/* Live Preview */}
              <div>
                <AdminTicketPreview settings={settings} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PLAYLIST MANAGEMENT                                */}
        {/* ========================================================= */}
        {activeTab === 'playlist' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                GESTOR DE PLAYLIST «QUILOMBO SOUND»
              </h2>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                Añadí nuevas canciones para que suenen en el reproductor web y en la lista de los visitantes.
              </p>
            </div>

            {/* Add Song Form */}
            <div
              style={{
                background: 'rgba(15, 12, 28, 0.85)',
                border: '1px solid var(--border-neon-purple)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--neon-cyan)', marginBottom: '1rem' }}>
                ➕ Añadir Nueva Canción al Reproductor
              </h3>

              <form onSubmit={handleAddTrack} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#fff', marginBottom: '0.35rem' }}>
                    Título de la Canción *
                  </label>
                  <input
                    type="text"
                    id="input-song-title"
                    placeholder="Ej: Si Me Sobrara El Tiempo"
                    value={newTrack.title}
                    onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.6rem',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#fff', marginBottom: '0.35rem' }}>
                    Artista(s) *
                  </label>
                  <input
                    type="text"
                    id="input-song-artist"
                    placeholder="Ej: Duki"
                    value={newTrack.artist}
                    onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.6rem',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#fff', marginBottom: '0.35rem' }}>
                    URL del Audio (mp3 o m4a) *
                  </label>
                  <input
                    type="text"
                    id="input-song-src"
                    placeholder="Ej: /assets/audio/goteo.m4a o URL web"
                    value={newTrack.src}
                    onChange={(e) => setNewTrack({ ...newTrack, src: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.6rem',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#fff', marginBottom: '0.35rem' }}>
                    Carátula (Opcional)
                  </label>
                  <input
                    type="text"
                    id="input-song-cover"
                    placeholder="/assets/img/tracks/goteo.jpg"
                    value={newTrack.cover}
                    onChange={(e) => setNewTrack({ ...newTrack, cover: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.6rem',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    type="submit"
                    id="btn-add-song"
                    style={{
                      width: '100%',
                      background: 'var(--gradient-party)',
                      border: 'none',
                      color: '#fff',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    + Agregar Canción
                  </button>
                </div>
              </form>
            </div>

            {/* Combined Playlist View */}
            <div
              style={{
                background: 'rgba(15, 12, 28, 0.85)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                  Canciones en la Playlist ({INITIAL_PLAYLIST.length + customTracks.length} tracks activos)
                </h3>
              </div>

              {/* Custom Added Tracks */}
              {customTracks.length > 0 && (
                <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(0, 240, 255, 0.05)', borderBottom: '1px solid rgba(0, 240, 255, 0.1)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--neon-cyan)', textTransform: 'uppercase' }}>
                    ⚡ Agregadas por el Organizador ({customTracks.length}):
                  </span>
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {customTracks.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255, 255, 255, 0.04)',
                          borderRadius: '8px',
                          padding: '0.6rem 0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>🎵</span>
                          <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>{t.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{t.artist}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handlePreviewTrack(t.src, t.id)}
                            style={{
                              background: previewingTrackId === t.id ? '#25d366' : 'rgba(255, 255, 255, 0.08)',
                              border: 'none',
                              color: '#fff',
                              borderRadius: '6px',
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            {previewingTrackId === t.id ? '⏸ Detener' : '▶ Probar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTrack(t.id)}
                            style={{
                              background: 'rgba(255, 0, 127, 0.15)',
                              border: '1px solid var(--border-neon-pink)',
                              color: 'var(--neon-pink)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            ✕ Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Initial Tracks */}
              <div style={{ padding: '0.75rem 1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                  Lineup Base Oficial ({INITIAL_PLAYLIST.length} temas):
                </span>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {INITIAL_PLAYLIST.map((t, idx) => (
                    <div
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ color: 'var(--neon-cyan)', fontWeight: 800, fontSize: '0.75rem' }}>#{idx + 1}</span>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{t.title}</span>
                        <span style={{ color: 'var(--text-subtle)' }}>— {t.artist}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>Base oficial</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Generador de Boleto QR para el Organizador */}
      {selectedTicketOrder && (
        <TicketQrModal
          order={selectedTicketOrder}
          onClose={() => {
            setSelectedTicketOrder(null);
            fetchReservations();
          }}
          isOrganizerView={true}
        />
      )}
    </div>
  );
}
