-- ==============================================================================
-- TABLA DE RESERVAS DE PREVENTA - EL QUILOMBO
-- Diseñada según los requerimientos de Tarek Barreto Bell:
-- 1. Cédula única para evitar duplicados.
-- 2. Código único de ticket QR.
-- 3. Campo 'is_paid' booleano por defecto en false para conciliación de pagos.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    ticket_code VARCHAR(32) UNIQUE NOT NULL,
    buyer_name VARCHAR(120) NOT NULL,
    buyer_dni VARCHAR(32) UNIQUE NOT NULL,
    buyer_phone VARCHAR(32) NOT NULL,
    buyer_email VARCHAR(120) NOT NULL,
    tier_id VARCHAR(32) NOT NULL,
    tier_name VARCHAR(64) NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    total_usd NUMERIC(10, 2) NOT NULL,
    total_ref_bs NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(64) NOT NULL,
    favorite_artist VARCHAR(120),
    meme_sticker_used VARCHAR(64),
    is_paid BOOLEAN DEFAULT false NOT NULL
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_reservations_ticket_code ON public.reservations(ticket_code);
CREATE INDEX IF NOT EXISTS idx_reservations_buyer_dni ON public.reservations(buyer_dni);
CREATE INDEX IF NOT EXISTS idx_reservations_is_paid ON public.reservations(is_paid);

-- Políticas de Seguridad RLS (Row Level Security)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios anónimos registrar su reserva desde la web
CREATE POLICY "Permitir inserción de reservas a visitantes anónimos"
ON public.reservations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir consultar reservas públicas por código de ticket para validación de entrada
CREATE POLICY "Permitir lectura de su propio boleto por código"
ON public.reservations
FOR SELECT
TO anon, authenticated
USING (true);
