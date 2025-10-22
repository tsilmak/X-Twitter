import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Analytics } from "@vercel/analytics/react";
import CookiePopup from "@/components/common/CookiePopup";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X",
  description: "X App",
  openGraph: {
    title: "X",
    description: "X (formerly Twitter)",
    images: [
      {
        url: `${process.env.MAIN_IMAGE_URL}`,
        alt: "X Social Platform",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} antialiased`}>
        <StoreProvider>
          <Analytics />
          <main>
            {modal}
            {children}
          </main>
          {/* Global Cookie Popup */}
          <CookiePopup />
        </StoreProvider>
      </body>
    </html>
  );
}
