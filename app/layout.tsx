import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader'
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PUBLYPOST",
  description: "A blogging platform built with Next.js, offering a seamless and engaging experience for writers and readers alike.",
  icons: {
    icon: "/fav.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader color="#F66F7D" height={3} showSpinner={false} />
        <SmoothScrollProvider>
        {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
