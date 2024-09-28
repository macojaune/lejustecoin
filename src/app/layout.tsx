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
  title: "LeJusteCoin Guadeloupe - Viens découvrir le jeu",
  description:
    "Parce que les loyers sont tout sauf justes. Un petit jeu pour détentre l'atmosphère ? Ou décrier une réalité bien sombre en Guadeloupe ? On sait pas…",
  twitter: {
    creator: "@macojaune",
    card: "summary_large_image",
    site: "@lejustecoinBot",
    title: "LeJusteCoin Guadeloupe - Viens découvrir le jeu",
    description:
      "Parce que les loyers sont tout sauf justes. Un petit jeu pour détentre l'atmosphère ? Ou décrier une réalité bien sombre en Guadeloupe ? On sait pas…",
    images: [],
  },
  openGraph: {
    description:
      "Parce que les loyers sont tout sauf justes. Un petit jeu pour détentre l'atmosphère ? Ou décrier une réalité bien sombre en Guadeloupe ? On sait pas…",
    title: "LeJusteCoin Guadeloupe - Viens découvrir le jeu",
    type: "website",
    url: "https://lejustecoin.marvinl.com",
    siteName: "LeJusteCoin Guadeloupe",
    images: [
      // {
      //   url: "https://lejustecoin.marvinl.com", //todo: change this
      //   width: 1200,
      //   height: 630,
      //   alt: "LeJusteCoin Guadeloupe - Viens découvrir le jeu",
      // },
    ],
  },
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
