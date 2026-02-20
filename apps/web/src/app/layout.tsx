import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/app/providers";
import { Header } from "@/src/widgets/header/ui/Header";
import {QueryProvider} from '@/src/app/providers/QueryProvider'
import { Toaster, toast } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Per Diem",
  description: "Combinator–backed restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <QueryProvider>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </QueryProvider>
      </body>
    </html>
  );
}
