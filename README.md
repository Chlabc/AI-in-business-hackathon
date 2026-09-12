# Cornerman

**The AI sales coach that drills your real weak spot.**

> Cornerman diagnoses a B2B SaaS AE’s losing pattern from seeded call outcomes, runs a live ElevenLabs price-objection roleplay, scores against approved talk-tracks, and shows progress — rep-owned, not surveillance.

Forward: AI in Business Hackathon · Track 1 + Built With ElevenLabs

## Scope (locked)

| In | Out (kill list) |
|---|---|
| Diagnose weak spot from seeded call outcomes | Live CRM / call-recording pipe |
| Live spoken price-objection roleplay (ElevenLabs) | Multi-vertical “any sales team” |
| Rubric scoring grounded in approved talk-tracks | Manager “who’s failing” leaderboard |
| Re-practice + progress over time | Mobile apps, payments, full SSO |
| Rep-owned sharing (manager sees progress only) | Invented prices / ungrounded “best practice” |

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
| 3 | **done** | Scoring + grounded feedback + practice KPIs |
| 4 | **done** | Full loop + progress + share + full-width UI |
| 5 | **done** | Eval harness (`npm run eval` → `EVAL.md`) |
| — | **done** | Playbook (Manager) + reactive cue modes Off/Soft/Full |
| 6 | **next** | User tests + value |
| 7 | pending | Harden + docs |
| 8 | pending | Demo video + Devpost |

## Eval

```bash
npm run eval
```

Writes `EVAL.md` with diagnosis accuracy, scoring–human agreement, and persona/guardrail results.

Planning live in Flint: `(Notepad) 002 Cornerman Induction + Build Plan`.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill keys as you get them
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Sign in**.

## Demo accounts (not real email auth)

Passwordless allowlist — no magic link, no SSO. Signed httpOnly cookie (`AUTH_SECRET`).

| Role | Email | After login |
|------|-------|-------------|
| Employee | `alex@northline.demo` | Diagnosis · Scenarios · Drill |
| Manager | `jordan@northline.demo` | Manager · Playbook · Health |

Use the **Fill** buttons on `/login`, or type the email and **Continue**.

## Env vars

See `.env.example`. Never commit secrets. Set `AUTH_SECRET` to any long random string (a dev default exists if unset).

## Honesty for judges

Demo diagnosis runs on **seeded** call data, not a live CRM. Demo login is **allowlisted emails only**, not a production IdP. The diagnose → drill → score loop is real; CRM/call-recording integration is the obvious next step.
