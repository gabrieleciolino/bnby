import type { Metadata } from "next";
import {
  DM_Sans,
  Manrope,
  Playfair_Display,
  Unbounded,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
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
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} antialiased`}
      >
        <NuqsAdapter>
          {children}
          <Toaster />
        </NuqsAdapter>
      </body>
    </html>
  );
}
