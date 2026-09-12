import Link from "next/link";

export default function CoachPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-500 transition hover:text-amber-400"
      >
        ← Cornerman
      </Link>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500/80">
          Demo coach
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
          Diagnosis lands in Phase 1
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Phase 0 locked the product and scaffolded the app. Next stage seeds a
          demo recruitment rep&apos;s call history and shows their real weak
          spot — then we wire the ElevenLabs fee-objection drill.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          <li>Seed call outcomes + approved talk-tracks</li>
          <li>Diagnosis API + UI for demo rep Alex</li>
          <li>Start-drill CTA ready for Phase 2 voice</li>
        </ol>
        <p className="mt-8 text-sm text-zinc-500">
          Say <span className="text-zinc-300">go Phase 1</span> when you want
          this built.
        </p>
      </div>
    </div>
  );
}
