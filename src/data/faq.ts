export interface FaqItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export const FAQS: FaqItem[] = [
  {
    question: '¿Cómo funciona el proceso de reserva y pago?',
    answer: 'Al llenar el formulario en esta web, se generará tu Boleto Digital con código QR. Luego serás redirigido directamente a nuestro WhatsApp oficial (+58 412-882460) con los datos de tu reserva listos para que el equipo de El Quilombo te envíe los datos de transferencia (Pago Móvil, Zelle, Binance o Efectivo) y confirme tu lugar.',
    defaultOpen: true,
  },
  {
    question: '¿Dónde y cuándo se realizará el evento?',
    answer: 'El evento se llevará a cabo el Viernes 09 de Octubre en Rock & Riff (Antiguo Óleo Gastrobar, La Viña, Valencia). Las puertas abren a las 8:00 PM y cerramos a las 3:00 AM con After Party oficial confirmado.',
    defaultOpen: true,
  },
  {
    question: '¿Cuál es la edad mínima para ingresar?',
    answer: 'El evento es para mayores de +15 años. Si eres menor de edad, debes asistir e ingresar obligatoriamente acompañado de tu representante legal.',
  },
  {
    question: '¿Cuál es el precio de las entradas?',
    answer: 'El Pase Preventa Oficial tiene un costo preferencial de $10 USD (o su equivalente en Bs a tasa BCV). En puerta la noche del evento tendrá un costo de $15 USD sujeto a aforo restante. ¡Asegurá tu preventa!',
  },
  {
    question: '¿Cuál es el código de vestimenta (Dress Code)?',
    answer: '¡La consigna es urbana! Podés venir con tu mejor outfit streetwear, zapatillas, estilo trap o incluso camisetas de la Selección Argentina / clubes de fútbol. Lo importante es venir con actitud para romper la noche.',
  },
];
