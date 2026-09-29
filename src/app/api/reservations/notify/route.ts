import { NextResponse } from 'next/server';
import { ORGANIZERS_PHONE } from '../../../../data/ticketing';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data || !data.ticketCode || !data.buyerName) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos para la notificación' },
        { status: 400 }
      );
    }

    // Formatear mensaje para los organizadores
    const caracasTime = new Date().toLocaleString('es-VE', {
      timeZone: 'America/Caracas',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    const notificationMessage = `🔔 *¡NUEVA RESERVA REGISTRADA! - EL QUILOMBO* 🇦🇷🔥

🎫 *Código:* #${data.ticketCode}
👤 *Cliente:* ${data.buyerName}
🪪 *Cédula/DNI:* ${data.buyerDni || 'N/A'}
📱 *WhatsApp Comprador:* ${data.buyerPhone}
📧 *Email:* ${data.buyerEmail || 'N/A'}
🎟️ *Entradas:* ${data.quantity}x ${data.tierName || 'Pase Preventa'}
💰 *Total:* $${data.totalUSD} USD (Ref: Bs. ${data.totalRefBs || '0'})
💳 *Método de Pago:* ${data.paymentMethod || 'Pago Móvil'}
🎶 *Tema Pedido:* ${data.favoriteArtist || 'Sin especificar'}
🎯 *Canal:* ${data.referralSource || 'Web Directa'}
⏰ *Hora:* ${caracasTime}

👉 *Ver en el Panel de Control:*
https://elquilombo.netlify.app/organizador`;

    const channelsTriggered: string[] = [];
    let isDelivered = false;

    // 1. Envío mediante CallMeBot WhatsApp API (gratuito para alertas personales)
    const callmebotApiKey = process.env.CALLMEBOT_API_KEY;
    const organizerPhone = process.env.ORGANIZERS_PHONE || ORGANIZERS_PHONE || '584265401385';

    if (callmebotApiKey) {
      try {
        const cleanPhone = organizerPhone.replace(/\D/g, '');
        const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(
          notificationMessage
        )}&apikey=${callmebotApiKey.trim()}`;

        const cmbRes = await fetch(callmebotUrl, { method: 'GET' });
        if (cmbRes.ok) {
          channelsTriggered.push('callmebot');
          isDelivered = true;
          console.log('[Notify] Mensaje WhatsApp enviado exitosamente a organizadores vía CallMeBot');
        } else {
          console.warn('[Notify] CallMeBot respondió con estado no exitoso:', cmbRes.status);
        }
      } catch (cmbErr) {
        console.error('[Notify] Error enviando WhatsApp vía CallMeBot:', cmbErr);
      }
    }

    // 2. Envío mediante Webhook genérico (Discord, Telegram, Zapier, Evolution API, etc.)
    const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const whRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'new_reservation',
            message: notificationMessage,
            reservation: data,
            timestamp: new Date().toISOString(),
          }),
        });
        if (whRes.ok) {
          channelsTriggered.push('webhook');
          isDelivered = true;
          console.log('[Notify] Notificación enviada exitosamente vía Webhook');
        }
      } catch (whErr) {
        console.error('[Notify] Error enviando a Webhook:', whErr);
      }
    }

    // Si aún no hay credenciales configuradas en el entorno, dejamos registro en consola
    if (!callmebotApiKey && !webhookUrl) {
      console.log('----------------------------------------------------');
      console.log('[Notify] 🔔 NUEVA RESERVA RECIBIDA (Pendiente activar CALLMEBOT_API_KEY):');
      console.log(notificationMessage);
      console.log('----------------------------------------------------');
    }

    return NextResponse.json({
      success: true,
      delivered: isDelivered,
      channels: channelsTriggered,
      messagePreview: notificationMessage,
      note: !callmebotApiKey && !webhookUrl
        ? 'Notificación registrada. Configura CALLMEBOT_API_KEY en .env.local para recibirla en tu WhatsApp personal.'
        : 'Notificación procesada.',
    });
  } catch (error: any) {
    console.error('[Notify] Error general en endpoint de notificación:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
