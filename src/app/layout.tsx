import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UniAsigna - Sistema de Auditoría de Expendios',
  description: 'Sistema para asignar y gestionar auditorías de expendios universitarios - USAC',
  icons: {
    icon: '/escudo-usac.jpeg',
    shortcut: '/escudo-usac.jpeg',
    apple: '/escudo-usac.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
