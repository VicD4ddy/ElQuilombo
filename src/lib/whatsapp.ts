/**
 * Normaliza y formatea cualquier número de teléfono para la API de WhatsApp.
 * Soporta números venezolanos con/sin código de país (ej. 0412, 0414, 0424, 0416, 0426, 412, +58),
 * y números internacionales (+1, +54, etc.).
 */
export function formatWhatsappPhone(rawPhone?: string): string {
  if (!rawPhone) return '';
  let digits = rawPhone.replace(/\D/g, '');
  if (!digits) return '';

  // Quitar 00 inicial internacional (ej: 0058...)
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  // Si empieza con 0 nacional venezolano (ej: 0412882460, 0414..., 0424...)
  if (digits.startsWith('0') && digits.length >= 10) {
    digits = '58' + digits.slice(1);
  }
  // Si escribió 9 dígitos venezolanos omitiendo el 0 y el 58 (ej: 412882460)
  else if (!digits.startsWith('58') && digits.length === 9 && (digits.startsWith('4') || digits.startsWith('2'))) {
    digits = '58' + digits;
  }

  return digits;
}

/**
 * Genera el enlace oficial universal para abrir el chat de WhatsApp.
 * Utiliza https://api.whatsapp.com/send?phone=... que es interceptado nativamente
 * por la app de WhatsApp en iOS y Android, y abre WhatsApp Web / Desktop en PC.
 */
export function getWhatsappChatUrl(rawPhone: string, message?: string): string {
  const phone = formatWhatsappPhone(rawPhone);
  const textParam = message ? `&text=${encodeURIComponent(message)}` : '';
  return `https://api.whatsapp.com/send?phone=${phone}${textParam}`;
}
