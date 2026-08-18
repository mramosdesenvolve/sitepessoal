import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Uma família só, em pesos variados — ecoa a proposta de onur.design (uma
// grotesca, sem serifado, peso fazendo o trabalho de hierarquia).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marcos Ramos",
  description:
    "Investigo como a educação e a tecnologia podem produzir novas formas de imaginar o mundo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen font-sans text-ink bg-paper">
        {children}
      </body>
    </html>
  );
}
