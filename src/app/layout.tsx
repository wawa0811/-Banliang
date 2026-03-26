import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Cedarville_Cursive } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cedarville = Cedarville_Cursive({
  variable: "--font-cedarville",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BANLIANG | Global Trading Simulator",
  description: "Experience premium financial trading simulation with real-time market data and sophisticated analytics",
};

export const viewport: Viewport = {
  themeColor: "#FEF9E6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cedarville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-textSoft">
        {children}
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('/noise.png')] mix-blend-multiply" />
      </body>
    </html>
  );
}