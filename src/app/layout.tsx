import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0814',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://elquilombo.club'),
  title: 'El Quilombo • La Fiesta Temática Argentina en Valencia | Preventa Oficial',
  description:
    'Asegurá tu entrada para El Quilombo en Rock & Riff, La Viña, Valencia. Lo mejor del trap, freestyle y cultura urbana argentina. Viernes 09 de Octubre.',
  keywords: [
    'El Quilombo',
    'Fiesta Argentina Valencia',
    'Rock & Riff',
    'Óleo Gastrobar',
    'Trap Argentino',
    'Milo J',
    'Trueno',
    'Duki',
    'Ca7riel y Paco',
    'Valencia Venezuela',
    'Preventa Entradas',
  ],
  authors: [{ name: 'El Quilombo Team' }, { name: 'Vicdaddy.js', url: 'https://www.instagram.com/Vicdaddy.js/' }],
  openGraph: {
    type: 'website',
    url: 'https://elquilombo.club',
    title: 'El Quilombo • La Fiesta Temática Argentina en Valencia',
    description:
      'Vení a vivir la noche más picante del trap, freestyle y cultura argentina en Rock & Riff, La Viña. Preventa oficial activa $10 USD.',
    siteName: 'El Quilombo',
    images: [
      {
        url: '/recursos/fondoestatico.png',
        width: 1200,
        height: 630,
        alt: 'El Quilombo - Fiesta Temática Argentina',
      },
    ],
    locale: 'es_VE',
  },
  icons: {
    icon: '/recursos/El Quilombo.png',
    apple: '/recursos/El Quilombo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="page-bg-layer" aria-hidden="true" />
        <div className="page-bg-overlay" aria-hidden="true" />
        <AudioPlayerProvider>
          {children}
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
