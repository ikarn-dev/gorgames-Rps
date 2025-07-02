import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rock Paper Scissors Game",
  description: "A Solana-based Rock Paper Scissors game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased min-h-screen w-full relative`}
      >
        {/* Fixed background image */}
        <div 
          className="fixed inset-0 w-full h-full z-0"
          style={{
            backgroundImage: 'url(/assets/game-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark overlay */}
        <div className="fixed inset-0 bg-black/20 z-10" />
        {/* Content */}
        <div className="relative z-20 min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
