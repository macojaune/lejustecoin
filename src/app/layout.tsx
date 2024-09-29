import type { Metadata } from "next";
import localFont from "next/font/local";
import { Raleway } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexProvider";
import Script from "next/script";
import Link from "next/link";

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
        <div className="grid relative items-center min-h-screen bg-orange-01 p-8 pb-20 gap-8 sm:gap-16 sm:p-20">
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <main className="flex flex-col gap-8 items-center sm:items-start justify-end ">
            <ol className="list-inside list-decimal text-sm text-justify sm:text-left font-mono">
              <li className="mb-2">
                Toute ressemblance avec de vrais logements est purement
                fortuite.
              </li>
              <li>C&apos;est LeJusteCoin. Pas le bon…</li>
              <li className="group font-semibold">
                <Link href={"/classement"}>
                  Pour voir le classement c&apos;est{" "}
                  <span className="group-hover:underline group-hover:underline-offset-8 group-hover:text-orange-02">
                    par ici
                  </span>
                </Link>
              </li>
            </ol>
          </main>
          <footer className="flex flex-row gap-6 items-center justify-center">
            <a
              className="group text-sm font-mono"
              href="https://marvinl.com"
              target="_blank"
            >
              Développé entre 2 coupures de courant par{" "}
              <span className="group-hover:underline group-hover:underline-offset-8 group-hover:text-orange-02">
                Marvinl.com →
              </span>
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
