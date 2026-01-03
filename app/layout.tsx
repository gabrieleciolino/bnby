import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BnBFacile | Template per siti BnB",
  description:
    "BnBFacile e un SaaS per creare siti BnB con template curati da 99 EUR e consulenza custom quando vuoi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${manrope.variable} ${unbounded.variable} antialiased`}>
        <NuqsAdapter>
          {children}
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
