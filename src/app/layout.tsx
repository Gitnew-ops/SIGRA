import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SIGRA - Sistema Integrado de Gestão Rodoviária de Angola",
  description: "Plataforma completa para gestão rodoviária de Angola, otimizando a aplicação de multas, fiscalização com QR Code e análise de dados para maior segurança e eficiência.",
  keywords: ["SIGRA", "Angola", "Trânsito", "Multas", "Gestão Rodoviária", "DNVT", "Ministério do Interior"],
  authors: [{ name: "SIGRA Team" }],
  icons: {
    icon: "/images/logo.bmp",
  },
  openGraph: {
    title: "SIGRA - Sistema Integrado de Gestão Rodoviária de Angola",
    description: "Plataforma completa para gestão rodoviária de Angola",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
