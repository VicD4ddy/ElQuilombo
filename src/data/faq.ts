export interface FaqItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export const FAQS: FaqItem[] = [
  {
    question: '¿Cómo funciona el proceso de reserva y pago?',
    answer: 'Al llenar el formulario en esta web, se generará tu Boleto Digital con código QR. Luego serás redirigido directamente a nuestro WhatsApp oficial con los datos de tu reserva listos para que el equipo de El Quilombo te envíe los datos de transferencia (Pago Móvil, Zelle, Binance o Efectivo) y confirme tu lugar.',
    defaultOpen: true,
  },
  {
    question: '¿Cuál es el horario del evento y del After Party?',
    answer: 'Las puertas abren a las 9:00 PM con ambientación y primeros sets musicales. El show principal y dinámicas se desarrollan a lo largo de la medianoche, y a partir de las 2:30 AM arranca el After Party oficial extendido.',
  },
  {
    question: '¿Cuál es el código de vestimenta (Dress Code)?',
    answer: '¡La consigna es urbana! Podés venir con tu mejor outfit streetwear, zapatillas, estilo trap o incluso camisetas de la Selección Argentina / equipos de fútbol. Lo importante es venir con actitud y comodidad para romper la pista.',
  },
  {
    question: '¿El evento es para mayores de edad?',
    answer: 'Sí, evento exclusivo para mayores de 18 años (+18). Se solicitará cédula de identidad laminada en la entrada del local.',
  },
  {
    question: '¿Qué pasa si compro en la entrada el día del evento?',
    answer: 'El aforo de Óleo Gastrobar es limitado. El precio en puerta será significativamente mayor y estará sujeto a disponibilidad de cupos. Recomendamos asegurar tu entrada en esta preventa para garantizar acceso y precio preferencial.',
  },
];
