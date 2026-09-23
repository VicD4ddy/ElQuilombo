export interface PaymentField {
  label: string;
  value: string;
  copyValue?: string;
  copyable?: boolean;
}

export interface PaymentDetail {
  id: string;
  name: string;
  badge: string;
  icon: string;
  accentColor: string;
  fields: PaymentField[];
  note?: string;
  instructions: string;
}

export const PAYMENT_METHODS: Record<string, PaymentDetail> = {
  'Pago Móvil': {
    id: 'Pago Móvil',
    name: 'Pago Móvil (BNC)',
    badge: 'Bolívares (Bs.)',
    icon: '📱',
    accentColor: '#00e5ff',
    fields: [
      {
        label: 'Banco',
        value: 'BNC (Banco Nacional de Crédito - 0191)',
        copyValue: '0191',
        copyable: true,
      },
      {
        label: 'Cédula',
        value: '32.275.458',
        copyValue: '32275458',
        copyable: true,
      },
      {
        label: 'Teléfono',
        value: '0426-5401385',
        copyValue: '04265401385',
        copyable: true,
      },
    ],
    instructions: 'Realizá el pago móvil por el monto exacto en Bs. y enviá el comprobante a los organizadores.',
  },
  'Zelle': {
    id: 'Zelle',
    name: 'Zelle (USD)',
    badge: 'Dólares USD',
    icon: '💵',
    accentColor: '#8734d8',
    fields: [
      { label: 'Correo Zelle', value: 'buthainarafeh@gmail.com', copyValue: 'buthainarafeh@gmail.com', copyable: true },
      { label: 'Nombre / Titular', value: 'Buthaina Rafeh de Barreto', copyValue: 'Buthaina Rafeh de Barreto', copyable: true },
      { label: 'Concepto obligatorio', value: 'El quilombo', copyValue: 'El quilombo', copyable: true },
    ],
    note: '⚠️ IMPORTANTE: Es indispensable colocar en el concepto/memo: "El quilombo"',
    instructions: 'Hacé la transferencia por Zelle colocando "El quilombo" de concepto y adjuntá el capture por WhatsApp.',
  },
  'Binance Pay (USDT)': {
    id: 'Binance Pay (USDT)',
    name: 'Binance Pay (USDT)',
    badge: 'Cripto Estable',
    icon: '🟡',
    accentColor: '#f0b90b',
    fields: [
      { label: 'Binance Pay ID', value: '1182025220', copyValue: '1182025220', copyable: true },
      { label: 'Usuario', value: 'Belife BR', copyValue: 'Belife BR', copyable: true },
    ],
    note: 'Recibimos USDT sin comisiones a través de Binance Pay directo.',
    instructions: 'Enviá el monto exacto en USDT por Binance Pay y compartí el ID de orden o captura al WhatsApp.',
  },
  'Efectivo en Rock & Riff': {
    id: 'Efectivo en Rock & Riff',
    name: 'Efectivo en Rock & Riff',
    badge: 'Pago en Puerta / Efectivo',
    icon: '💵',
    accentColor: '#00f0ff',
    fields: [
      { label: 'Lugar de Pago', value: 'Rock & Riff (El Viñedo, Valencia)', copyValue: 'Rock & Riff, Valencia', copyable: true },
      { label: 'Moneda Aceptada', value: 'USD Efectivo o Bolívares (Tasa BCV)', copyable: false },
      { label: 'Ubicación Google Maps', value: 'antiguo Oleo Gastrobar', copyValue: 'https://maps.app.goo.gl/u3Q8guMx3PVEw4Vc8', copyable: true },
    ],
    note: '💡 Tu preventa queda apartada en el sistema. Llevá el monto exacto en efectivo el día del evento en taquilla.',
    instructions: 'Completá tu reserva para generar tu código y boleto digital. El pago se efectúa directamente en la puerta de Rock & Riff.',
  },
};

export function getPaymentDetail(methodName: string): PaymentDetail {
  if (methodName.includes('Zelle')) return PAYMENT_METHODS['Zelle'];
  if (methodName.includes('Binance')) return PAYMENT_METHODS['Binance Pay (USDT)'];
  if (methodName.toLowerCase().includes('efectivo')) return PAYMENT_METHODS['Efectivo en Rock & Riff'];
  return PAYMENT_METHODS['Pago Móvil'];
}

/**
 * Genera el formato estándar de texto que las apps bancarias de Venezuela (BNC, Banesco, BDV, Bancamiga, Mercantil)
 * detectan automáticamente al pulsar "Pegar Datos de Pago Móvil"
 */
export function getPagoMovilBankingClipboard(amountBs: string | number): string {
  let cleanAmount = '';
  if (typeof amountBs === 'number') {
    cleanAmount = amountBs.toFixed(2);
  } else {
    // Si viene formateado "9.744,19" -> "9744.19"
    cleanAmount = String(amountBs).replace(/\./g, '').replace(',', '.').trim();
  }

  // Formato multilínea reconocido por BNC, Banesco, BDV, Bancamiga
  return `0191\n04265401385\n32275458\n${cleanAmount}`;
}

/**
 * Formato legible para copiar un resumen completo de pago
 */
export function getPaymentFullSummary(methodName: string, amountDisplay: string): string {
  const detail = getPaymentDetail(methodName);
  if (detail.id === 'Pago Móvil') {
    const cleanNum = amountDisplay.replace(/[^0-9,.]/g, '').trim();
    return `*DATOS DE PAGO MÓVIL EL QUILOMBO*\nBanco: BNC (0191)\nCédula: 32275458\nTeléfono: 04265401385\nMonto: Bs. ${cleanNum}`;
  }
  if (detail.id === 'Zelle') {
    return `*DATOS ZELLE EL QUILOMBO*\nCorreo: buthainarafeh@gmail.com\nTitular: Buthaina Rafeh de Barreto\nConcepto obligatorio: El quilombo\nMonto: ${amountDisplay}`;
  }
  if (detail.id === 'Efectivo en Rock & Riff') {
    return `*PAGO EN EFECTIVO EL QUILOMBO*\nLugar: Rock & Riff (El Viñedo, Valencia - antiguo Oleo Gastrobar)\nUbicación: https://maps.app.goo.gl/u3Q8guMx3PVEw4Vc8\nMonto a pagar en taquilla: ${amountDisplay}`;
  }
  return `*DATOS BINANCE PAY EL QUILOMBO*\nBinance ID: 1182025220\nUsuario: Belife BR\nMonto: ${amountDisplay}`;
}
