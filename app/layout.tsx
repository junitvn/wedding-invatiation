import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Montserrat } from 'next/font/google';
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--gf-cormorant',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--gf-great-vibes',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--gf-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Thiệp Cưới · Ngọc Lâm & Ngọc Bích",
  description: "Trân trọng kính mời bạn tới dự tiệc cưới của Ngọc Lâm và Ngọc Bích",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`h-full antialiased ${cormorantGaramond.variable} ${greatVibes.variable} ${montserrat.variable}`}>
      <head>
        <meta name="color-scheme" content="light" />
        {/* Preload local fonts to prevent FOUT */}
        <link rel="preload" href="/fonts/KattyDiona.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/UVNKeChuyen3.TTF" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/le_jour_script/Le Jour Script Personal Use Only.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/le_jour_script/Le Jour Serif Personal Use Only.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SFU Sigvar/SFUSigvarRegular.TTF" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SFU Sigvar/SFUSigvarLight.TTF" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SFU Sigvar/SFUSigvarDemiBold.TTF" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SFU Sigvar/SFUSigvarRegularItalic.TTF" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/SFU Sigvar/SFUSigvarDemiBoldItalic_.TTF" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-gray-100 flex flex-col items-center">
        {children}
      </body>
    </html>
  );
}
