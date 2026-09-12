# Cornerman

**The AI sales coach that drills your real weak spot.**

> Cornerman diagnoses a recruitment rep’s losing pattern from seeded call outcomes, runs a live ElevenLabs fee-objection roleplay, scores against approved talk-tracks, and shows progress — rep-owned, not surveillance.

Forward: AI in Business Hackathon · Track 1 + Built With ElevenLabs

## Scope (locked)

| In | Out (kill list) |
|---|---|
| Diagnose weak spot from seeded call outcomes | Live CRM / ATS / call-recording pipe |
| Live spoken fee-objection roleplay (ElevenLabs) | Multi-vertical “any sales team” |
| Rubric scoring grounded in approved talk-tracks | Manager “who’s failing” leaderboard |
| Re-practice + progress over time | Mobile apps, payments, full SSO |
| Rep-owned sharing (manager sees progress only) | Invented fees / ungrounded “best practice” |

## Stack

- Next.js + TypeScript (App Router)
- ElevenLabs Agents SDK (voice client persona)
- Postgres / Supabase (structured memory) — wired in Phase 1+
- SpaceXAI / xAI for diagnosis & scoring LLM calls (`XAI_API_KEY`)
- Deploy: Vercel / Railway / Render (production URL required for judging)

## Phases

| Phase | Status | Focus |
|------|--------|--------|
| 0 | **done** | Scaffold + scope lock + landing |
| 1 | **done** | Seed data + diagnosis API/UI + KPI stats |
| 2 | **done** | ElevenLabs voice roleplay + transcript |
| 3 | **next** | Scoring + grounded feedback |
| 4 | pending | Full loop + progress + share controls |
| 5 | pending | Eval harness |
| 6 | pending | User tests + value |
| 7 | pending | Harden + docs |
| 8 | pending | Demo video + Devpost |

Planning live in Flint: `(Notepad) 002 Cornerman Induction + Build Plan`.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill keys as you get them
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Env vars

See `.env.example`. Never commit secrets.

## Honesty for judges

Demo diagnosis runs on **seeded** call data, not a live CRM. The diagnose → drill → score loop is real; CRM/call-recording integration is the obvious next step.
