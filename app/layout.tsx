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
      </head>
      <body className="min-h-full bg-gray-100 flex flex-col items-center">
        {children}
      </body>
    </html>
  );
}
