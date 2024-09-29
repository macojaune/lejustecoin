import Quiz from "@/components/quiz";
import Script from "next/script";
export default function Home() {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "LeJusteCoin",
    interactionType: "SingleplayerGame",
  };

  return (
    <div className="contents">
      <Script type="application/ld+json" id="game-ld-json">
        {JSON.stringify(ldJson)}
      </Script>
      <h1 className="text-3xl text-orange-02 self-start text-center sm:text-6xl sm:text-left z-20 font-display">
        LeJusteCoin <small className="text-sm text-zinc-600">Guadeloupe</small>
      </h1>
      <Quiz />
    </div>
  );
}
