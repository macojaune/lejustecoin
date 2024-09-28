import type { Metadata } from "next";
import localFont from "next/font/local";
import { Raleway } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexProvider";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const lyonsRounded = localFont({
  src: "./fonts/538LyonsRounded.woff",
  variable: "--font-lyons-rounded",
  weight: "100",
});
const raleway = Raleway({
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-raleway",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "LeJusteCoin Guadeloupe",
  description: "Parce que les loyers sont tout sauf justes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <Script
        strategy="beforeInteractive"
        src="https://analytics.marvinl.com/script.js"
        data-website-id="c073967b-0198-441b-adf0-0b50a877043f"
      />

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} ${lyonsRounded.variable} antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
