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
  title: "bnby.me | Crea il tuo sito per il tuo BnB in pochi minuti",
  description:
    "bnby ti consente di creare il sito per il tuo BnB in pochi minuti. ",
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
