import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="vi" className="h-full antialiased">
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
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full bg-gray-100 flex flex-col items-center">
        {children}
      </body>
    </html>
  );
}
