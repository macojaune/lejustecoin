import Quiz from "@/components/quiz";

export default function Home() {
  return (
    <div className="grid relative items-center min-h-screen bg-orange-01 p-8 pb-20 gap-8 sm:gap-16 sm:p-20 ">
      <h1 className="text-3xl text-orange-02 self-start text-center sm:text-6xl sm:text-left z-20 font-display">
        LeJusteCoin <small className="text-xs text-zinc-600">Guadeloupe</small>
      </h1>
      <Quiz />
      <main className="flex flex-col gap-8 items-center sm:items-start justify-end ">
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Toute ressemblance avec de vrais logements est purement fortuite.
          </li>
          <li>C&apos;est LeJusteCoin. Rien d&apos;autre.</li>
        </ol>
      </main>
      <footer className="flex flex-row gap-6 items-center justify-center">
        <a className="group" href="https://marvinl.com" target="_blank">
          Développé entre 2 coupures de courant par{" "}
          <span className="group-hover:underline group-hover:underline-offset-8 group-hover:text-orange-02">
            Marvinl.com →
          </span>
        </a>
      </footer>
    </div>
  );
}
