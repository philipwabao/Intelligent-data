import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Roboto } from 'next/font/google';
import Script from 'next/script';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Auxerta — Data annotation for ML teams',
  description:
    'Auxerta labels training data for ML teams. Bounding boxes, text classification, RLHF — reviewed by senior annotators and delivered in days.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KW5QCPNT6J"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KW5QCPNT6J');
          `}
        </Script>
      </head>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
