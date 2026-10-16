import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apothecary 3D — Modern Pharmacy Store | Health, Sorted.",
  description: "Experience an immersive 3D pharmacy dispensary. Certified prescription medicines, pharmacist oversight, and rapid 30-minute doorstep delivery.",
  keywords: ["online pharmacy", "3D pharmacy", "prescription medicine", "pharmacist consultation", "health and wellness"],
  authors: [{ name: "Apothecary 3D Health Systems" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#070a0c] text-slate-100">
        {children}
      </body>
    </html>
  );
}
