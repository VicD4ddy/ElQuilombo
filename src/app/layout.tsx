import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#080518',
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  'https://elquilombo.netlify.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    title: 'El Quilombo • La Fiesta Temática Argentina en Valencia',
    description:
      'Vení a vivir la noche más picante del trap, freestyle y cultura argentina en Rock & Riff, La Viña. Viernes 09 de Octubre. Preventa oficial activa $10 USD.',
    siteName: 'El Quilombo',
    images: [
      {
        url: `${SITE_URL}/assets/img/el-quilombo-seo.png`,
        secureUrl: `${SITE_URL}/assets/img/el-quilombo-seo.png`,
        width: 378,
        height: 350,
        type: 'image/png',
        alt: 'El Quilombo - 09 de Octubre en Rock & Riff',
      },
    ],
    locale: 'es_VE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Quilombo • La Fiesta Temática Argentina en Valencia',
    description:
      'Vení a vivir la noche más picante del trap, freestyle y cultura argentina en Rock & Riff, La Viña. Viernes 09 de Octubre. Preventa oficial activa $10 USD.',
    images: [`${SITE_URL}/assets/img/el-quilombo-seo.png`],
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
      <head>
        <meta property="og:image" content={`${SITE_URL}/assets/img/el-quilombo-seo.png`} />
        <meta property="og:image:secure_url" content={`${SITE_URL}/assets/img/el-quilombo-seo.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="378" />
        <meta property="og:image:height" content="350" />
        <link rel="image_src" href={`${SITE_URL}/assets/img/el-quilombo-seo.png`} />
      </head>
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
