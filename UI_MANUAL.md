# UI Manual

## Purpose

This document tracks UI/UX planning, implementation decisions, and completed frontend work on the `Atina` branch. The first UI implementation covers the coach dashboard; other page redesigns remain pending.

## Current Product Flow

Cornerman is an AI sales coach for recruitment consultants. The current flow is diagnosis from seeded call outcomes, spoken practice, scoring, and progress tracking, with optional progress sharing.

| Route             | Current implementation                                                                                                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | Product introduction, diagnosis/drill/track overview, build phases, scope exclusions, and links to the coach and practice.                                                                               |
| `/coach`          | Rep dashboard with seeded call KPIs, weak-spot diagnosis, evidence, a prescribed fee drill, approved talk-track, loss rates, recent calls, practice progress, and sharing controls.                      |
| `/coach/training` | Scenario selection with difficulty, skill, client persona, opening line, and a recommended price/fee-objection scenario.                                                                                 |
| `/coach/practice` | Scenario-specific ElevenLabs voice roleplay with session controls, audio visualization, transcript, scoring, feedback, and repeat-practice actions. The `scenario` query parameter selects the scenario. |
| `/coach/manager`  | Demo team KPI table, illustrative conversion trend, and a practice summary gated by the rep's sharing setting. Raw transcripts are omitted.                                                              |

Practice attempts and sharing settings currently use local JSON storage. Call outcomes and team metrics are demo data, not a live CRM integration.

## UI Goals

- Make the product story immediately understandable.
- Create a consistent visual system.
- Make KPI diagnosis visually clear.
- Make the AI coaching session the main product moment.
- Clearly distinguish salesperson and manager views.
- Optimise the interface for a short hackathon demo.

## Design System

The following rules are approved for implementation. They have been applied to the coach dashboard content and its progress and sharing components; application-wide adoption remains pending. Reuse the existing CSS variables, Tailwind utilities, fonts, and shared components without introducing unnecessary tokens or abstractions.

### Visual Direction

Combine modern AI productivity SaaS with professional business analytics. Keep the cool neutral workspace, Geist fonts, restrained borders, and existing orange application accent, while using semantic colour to clarify intelligence, action, progress, attention, and risk. Prioritise diagnosis, live practice, and results for a polished 2-3 minute demo. Standardise the existing foundation rather than create a full brand identity.

### Colours

| Role               | Existing tokens                                              | Usage                                                                               |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Primary/accent     | `--accent`, `--accent-fg`, `--accent-soft`                   | Keep the existing orange for primary actions, selection, and the recommended drill. |
| Success            | `--ok`, `--ok-soft`                                          | Fee held and successful outcomes.                                                   |
| Warning            | `--warn`, `--warn-soft`                                      | Concessions and attention needed.                                                   |
| Danger             | `--danger`, `--danger-soft`                                  | Errors and destructive actions.                                                     |
| Background         | `--background`                                               | Page canvas.                                                                        |
| Surface/card       | `--card`, `--card-elevated`                                  | Standard contained content; reserve elevated surfaces for overlays.                 |
| Border             | `--border`                                                   | Subtle separators and boundaries.                                                   |
| Primary text       | `--foreground`                                               | Headings, metric values, and essential content.                                     |
| Muted text         | `--muted`                                                    | Secondary context and metadata.                                                     |
| Audio              | `--audio`, `--audio-soft`                                    | Listening states; retain orange for client speech.                                  |
| Coach intelligence | `--coach-ai`, `--coach-ai-soft`, `--coach-ai-fg`             | Muted indigo for AI interpretation and diagnosis on `/coach`.                       |
| Coach action       | `--coach-action`, `--coach-action-soft`, `--coach-action-fg` | Muted teal for prescribed coaching and its primary drill action.                    |
| Coach progress     | `--coach-positive`, `--coach-positive-soft`                  | Muted green for improvement, fee held, and positive progress.                       |
| Coach attention    | `--coach-warning`, `--coach-warning-soft`                    | Muted amber for explicit attention states.                                          |
| Coach risk         | `--coach-risk`, `--coach-risk-soft`                          | Muted coral for negative outcomes and risk signals.                                 |

Warning may continue using the existing warning token even though it currently overlaps with the accent colour. Always distinguish warnings through explicit text labels, icons, or context so they cannot be confused with primary actions. The route-scoped coach tokens extend this foundation for `/coach`; application-wide adoption is TBD.

### Typography

Keep Geist Sans and Geist Mono. Use zero letter spacing instead of mixed tight or widely spaced text.

| Role               | Approved hierarchy                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Page title         | 30px font size / 36px line height, semibold; landing title may use 36px / 40px.              |
| Section heading    | 20px / 28px, semibold.                                                                       |
| Body               | 16px / 24px; 14px / 20px for tables and supporting content.                                  |
| Labels/eyebrows    | 12px / 16px, medium or semibold, sentence case.                                              |
| KPI/metric numbers | 30px / 36px, semibold, tabular numerals. Use Mono for timestamps and compact numeric tables. |

### Spacing

Use a 4px spacing rhythm. Keep existing `AppShell` page gutters and align header and content edges.

| Area            | Approved spacing                               |
| --------------- | ---------------------------------------------- |
| Page sections   | 24-32px.                                       |
| Card padding    | 16px on mobile; 24px on desktop.               |
| Card internals  | 16px between groups; 8px between related text. |
| Inline elements | 8-12px.                                        |

### Border Radius

Use 4px for badges and small controls, 6px for buttons, and 8px for cards and framed large panels. Replace mixed 12px card corners when implementing. Reserve fully rounded shapes for progress tracks and switches.

### Buttons

Use 44px-high controls, 14px semibold labels, consistent padding, visible keyboard focus, and stable loading dimensions. Exact shared padding and focus styling are TBD.

| Variant      | Approved treatment                                                            |
| ------------ | ----------------------------------------------------------------------------- |
| Primary      | `bg-accent text-accent-fg`; one dominant next action.                         |
| Secondary    | `bg-card border-border text-foreground`; accent border on hover.              |
| Subtle/ghost | Transparent with muted text; surface background and foreground text on hover. |
| Danger       | `bg-danger-soft text-danger border-danger/40`; destructive actions only.      |

Treat "End & score" as normal progression with primary styling when implemented, rather than its current danger styling.

### Cards

| Type                       | Approved treatment                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Standard card              | Existing `surface-card`, 8px radius, no default shadow.                                     |
| Highlighted/diagnosis card | Standard surface with an accent border or a small tinted heading area; exact treatment TBD. |
| KPI card                   | Equal-size compact tiles with a label, value, and optional context.                         |
| Supporting evidence card   | Neutral lists or tables with separators; avoid boxing every evidence item.                  |

Keep page sections unframed and avoid cards inside cards. Use cards for repeated items and tools that benefit from a defined boundary.

### Status Badges

Use 12px medium text, 4px radius, compact padding, and a subtle border. Always include a meaningful label; exact shared padding is TBD.

| Status      | Approved treatment                                                       |
| ----------- | ------------------------------------------------------------------------ |
| Recommended | Accent text and soft accent background.                                  |
| Success     | Success text and soft success background.                                |
| Warning     | Warning text and soft warning background, with explicit warning meaning. |
| Neutral     | Muted text on the standard surface.                                      |

### Charts

Retain Recharts and CSS theme variables. Conversion charts use 2px lines, small dots, faint grids, percentage labels, and themed tooltips. Progress charts use a consistent 0-100 score scale, green for fee held, and warning colour for softened outcomes.

Bars must have stable heights, visible values, and consistent scales across comparisons. Colour must not carry meaning alone. Exact chart dimensions and conversion-axis bounds are TBD.

### Navigation

Keep the sticky shared header with aligned page gutters. Show a clear active-page treatment and visually separate Manager from the rep workflow. Keep the theme toggle accessible and display role-appropriate context on manager pages.

Provide accessible mobile navigation because the current links disappear at smaller breakpoints. The choice of a compact row or menu, its breakpoint, and the exact active-page styling are TBD.

### Dark Mode

Preserve saved theme preference, the system-preference fallback, and early theme initialization. Keep layout, hierarchy, colour meanings, and control states consistent between light and dark themes. Use existing CSS variables for charts and surfaces.

Verify text, button, and keyboard-focus contrast in both themes during implementation. Browser and contrast verification are TBD; approval of these rules does not imply those checks are complete.

### Minimal UI Rules

1. Give every page one clear title and next action.
2. Keep diagnosis and the recommended drill visible together.
3. Make voice controls and session state prominent during practice.
4. Use large type for conclusions and metrics; keep metadata secondary.
5. Keep essential demo content readable without inspecting tooltips.
6. Use neutral surfaces broadly and semantic colour selectively.
7. Separate content with spacing before adding another container.
8. Keep loading, empty, error, and completed states visually consistent.
9. Preserve navigation and usable controls on mobile.
10. Keep seeded data, illustrative metrics, and sharing status explicit.

## Page Plans

### Landing Page `/`

#### Current state

Introduces the product with links to open the coach or start a drill. Shows the diagnosis/drill/track sequence, build phases, scope exclusions, and a seeded-data disclosure.

#### Planned UI changes

Clarify the product story and the primary demo entry point. Review the prominence of build-planning content in the demo experience. Final layout and copy are TBD.

#### Completed changes

None yet.

### Coach Dashboard `/coach`

#### Current state

Shows Alex Chen and the existing agency/role context, followed by the fee-concession KPI, secondary metrics, diagnosis and prescribed coaching, practice progress, supporting evidence, and privacy/sharing. The existing diagnosis text and data remain unchanged.

#### Planned UI changes

The first implementation follows the approved hierarchy. Further adjustments after teammate review and the timed demo rehearsal are TBD. Shared header/navigation changes remain outside this page-only implementation.

Visual direction revised on 2026-09-13: `/coach` uses a calm enterprise SaaS treatment with neutral surfaces, dark text, fine borders, restrained shadows, and a muted slate/blue-grey accent. The existing orange remains only for compact, explicitly labelled warnings and risk data. This route-specific treatment supersedes the earlier dominant-orange dashboard concept; it does not change the application-wide accent decision for other routes.

The latest visual pass combines modern AI productivity SaaS with professional business analytics. The page remains calm and structured, but now uses restrained semantic variety: muted indigo for AI interpretation, teal for coaching actions, green for positive progress, amber for attention, and coral for risk. Pale tinted surfaces carry meaning without large saturated colour blocks. Varied content widths, whitespace, and compact metric tiles replace the previous rigid reporting-dashboard rhythm. The orange application accent remains unchanged for other routes.

#### Completed changes

Implemented a visibly distinct performance summary with one dominant orange fee-concession KPI and a compact secondary metric rail. The compact intro now frames the page as Alex's personal coaching focus rather than a generic performance breakdown.

The AI diagnosis and recommended drill now form one connected white/neutral decision surface with a thin slate header rule. The diagnosis uses a strong headline, separate weak-stage, diagnosed-skill, and confidence fields, and two immediate evidence excerpts. Its softly tinted coaching panel carries the approved play, fee guardrails, and muted deep-blue primary action. Supporting evidence remains lower on the page with stage bars, approved talk-track guidance, and expandable call outcomes.

Progress now uses an elevated visual section with larger summary metrics, a dedicated chart plane, and collapsible detailed history. Privacy and sharing remain a quieter final section with the accessible sharing switch. Applied existing colour tokens, 8px cards, 6px buttons, sentence-case labels, restrained shadows, and visible keyboard focus to the edited dashboard content.

The latest presentation pass makes the KPI summary more compact and rhythmic: the priority signal remains largest, while three smaller metrics use varied proportions and restrained semantic tints. AI diagnosis and recommended coaching are separate but visually connected surfaces, with an indigo AI identity flowing into a teal action treatment and primary drill CTA. Progress is now an open section with semantic metric tiles, a secondary chart surface, and collapsible history. Supporting evidence and sharing retain their existing hierarchy while using the same semantic status language.

`ProgressPanel` now displays scores on a fixed 0-100 visual scale with explicit values and Held/Softened labels. `ShareControls` retains its existing request and state-update logic. Both components are currently used only by `/coach`.

Implementation status: Complete for the scoped coach dashboard redesign. Verification status: Complete for the requested dashboard checks, including populated progress; this is not a claim of application-wide or integration verification.

The initial browser pass covered the empty-progress dashboard at 1440, 768, 390, and 320px in light/dark themes, with no page overflow or runtime errors. Keyboard expansion exposed all 12 call rows. Sharing on/off and failed-save UI were checked with intercepted requests, without writing persisted data.

The semantic visual pass was reverified in the production build at 1440x1000, 768x1024, 390x844, and 320x740 in both light and dark themes. The empty dashboard passed without horizontal page overflow or runtime errors. The populated-progress suite also passed all 24 combinations of viewport, theme, and 1/3/60-attempt fixtures, including exact score-bar heights, unclipped metrics, keyboard history expansion, and contained chart/table scrolling. No responsive fix was required during this pass.

#### Populated-progress verification

Verified the actual `ProgressPanel` component with temporary 1-, 3-, and 60-attempt fixtures inside a copy of the production-rendered dashboard, using its compiled styles and fonts. Fixture markup was isolated from hydration; no seeded data or persistence files were changed. Scores included 0, 50, and 100, both Held and Softened outcomes, and fee-held metrics of 100% and 66.7%.

| Viewport           | Light                       | Dark                        |
| ------------------ | --------------------------- | --------------------------- |
| Desktop, 1440x1000 | Passed                      | Passed                      |
| Tablet, 768x1024   | Passed                      | Passed                      |
| Mobile, 390x844    | Passed                      | Passed                      |
| Mobile, 320x740    | Passed after responsive fix | Passed after responsive fix |

All 24 fixture combinations passed metric-width checks, zero horizontal page overflow with history expanded, exact 0/50/100 bar-height checks, keyboard history expansion, and expected history row counts. Long charts and narrow history tables scrolled within their own containers. Screenshots were reviewed across both themes and all four widths, including long-history presentation. No browser runtime errors were recorded.

Responsive fix: The stronger progress typography exposed metric clipping at both narrow mobile widths. The metric grid now uses two columns below 420px and three columns from 420px upward; metric type steps from 30px on mobile to 36px from the `sm` breakpoint. Typography hierarchy remains stronger while 100% and 66.7% fit without clipping. Metric values and calculations were unchanged.

Final checks: `npm run build -- --webpack`, `tsc --noEmit --incremental false`, targeted ESLint for the three changed TSX files, and `git diff --check` passed. The default Turbopack build could not complete in this environment: the initial sandboxed attempt could not fetch Google Fonts, and the network-enabled retry failed when its CSS worker attempted to bind an internal port (Operation not permitted). Webpack is a command-line verification fallback only; no build configuration or dependency files were changed.

Previously recorded repository-wide lint errors remain in the unchanged `ThemeProvider.tsx` and `usePracticeConversation.ts`; full lint was not rerun in this verification pass. Formal contrast auditing, other routes, and end-to-end voice/scoring/persistence verification remain outside this pass.

### Training `/coach/training`

#### Current state

Lists scenarios with difficulty badges, skills, client personas, opening lines, and start-drill links. Marks the price/fee-objection scenario as recommended.

#### Planned UI changes

Make the recommended scenario and scenario comparisons easy to scan, with a clear path into practice. Final design is TBD.

#### Completed changes

None yet.

### Practice `/coach/practice`

#### Current state

Loads the selected scenario and presents the live voice session, transcript, session status, audio visualization, and scored feedback. Users can practise again or return to diagnosis or scenario selection.

#### Planned UI changes

Make the AI coaching session the main product moment. Review the hierarchy of session controls, connection and speaking states, transcript, and post-session feedback. Final design is TBD.

#### Completed changes

None yet.

### Manager Dashboard `/coach/manager`

#### Current state

Shows a demo team table, illustrative conversion trend, and a separate practice summary that appears when the rep enables sharing. The summary is blocked when sharing is off; raw transcripts are omitted. The team table also incorporates the demo rep's practice-session count.

#### Planned UI changes

Clearly distinguish the manager view from the salesperson workspace. Make demo metrics, shared progress, and sharing status understandable. Final design is TBD.

#### Completed changes

None yet.

## Shared Components

Existing components are located in `src/components`.

| Component         | Role                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `AppShell`        | Shared page wrapper, header placement, content width, and responsive page padding.                                 |
| `AppHeader`       | Product identity, navigation, and rep/focus context.                                                               |
| `ThemeProvider`   | Manages light/dark theme state and persists the theme preference.                                                  |
| `ThemeIcons`      | Day and night icons used by theme controls.                                                                        |
| `PracticeSession` | Practice interface with voice controls, session state, transcript, and feedback.                                   |
| `AudioWaveform`   | Visualizes audio activity during practice.                                                                         |
| `FeedbackCard`    | Displays the score, fee outcome, transcript excerpts, approved guidance, suggested response, and rubric breakdown. |
| `ProgressPanel`   | Displays attempt counts, latest score, fee-hold rate, score trend, and attempt history.                            |
| `ShareControls`   | Lets the rep enable or disable manager progress sharing and navigate to the manager view.                          |
| `ConversionChart` | Renders the illustrative conversion trend on the manager dashboard.                                                |

## Responsive Behaviour

### Desktop

Source inspection shows a shared content container capped at 1800px, responsive page padding, and multi-column layouts at larger breakpoints. The redesigned coach dashboard places progress below the combined diagnosis/coaching panel and shows supporting evidence in two columns. Training scenarios and manager sections retain their existing multi-column layouts.

Coach dashboard browser checks passed at 1440px and 768px in both themes, including populated progress with up to 60 attempts. The primary drill action was visible in the initial 1440x1000 first-viewport check. Other routes' desktop verification: TBD.

### Mobile

Source inspection shows single-column defaults, wrapping action groups, and responsive padding. Recent-call and manager tables use horizontal overflow containers with minimum table widths; feedback also has a horizontally scrollable rubric table.

Coach dashboard browser checks passed at 390px and 320px in both themes, including populated progress, contained chart/history scrolling, and no horizontal page overflow. Progress metrics use two columns below 360px to prevent long percentages overflowing their columns. The initial pass also checked expanded call-table overflow and 44px primary controls. The unchanged shared header still hides navigation links on mobile; dashboard links provide access to practice, scenarios, and the manager view. Other routes and live-session mobile usability: TBD.

## Demo Considerations

The UI should support a clear 2-3 minute hackathon demo with minimal navigation friction. The intended sequence is to show the diagnosed weak spot, enter a recommended drill, demonstrate the spoken coaching interaction, review feedback and progress, and briefly show optional manager sharing.

Keep the distinction between seeded data and live practice clear. Final demo sequencing and page-specific presentation decisions are TBD.

## Outstanding UI Tasks

- [ ] Plan and implement the landing page UI.
- [x] Plan and implement the coach dashboard UI.
- [x] Verify scoped coach dashboard UI, including populated progress in desktop/tablet/mobile and both themes.
- [ ] Plan and implement the training page UI.
- [ ] Plan and implement the practice page UI.
- [ ] Plan and implement the manager dashboard UI.
- [ ] Define and apply the shared visual system across components.
- [ ] Review and verify desktop and mobile responsiveness.
- [ ] Verify the 2-3 minute demo flow and navigation.
- [ ] Finalise UI documentation with actual decisions, completed changes, and affected files.

## Change Log

| Date       | Area                        | Change                                                                                                                                                                                                                                                                                                                                                                                     | Files                                                                                                                                   |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-09-12 | Design system documentation | Defined the approved design system and 10 Minimal UI Rules, including the existing orange accent, explicit warning meaning, 8px card radius, and 6px button radius. No UI implementation completed.                                                                                                                                                                                        | `UI_MANUAL.md`                                                                                                                          |
| 2026-09-12 | Coach dashboard             | Implemented KPI-to-diagnosis-to-coaching hierarchy, progress presentation, supporting evidence disclosures, and sharing switch. Preserved data, calculations, APIs, scoring, voice, persistence, and routes. Recorded verification and existing lint limitations.                                                                                                                          | `src/app/coach/page.tsx`, `src/components/ProgressPanel.tsx`, `src/components/ShareControls.tsx`, `UI_MANUAL.md`                        |
| 2026-09-12 | Coach verification          | Fixed progress metric overflow at 320px with two columns below 360px. Passed 24 populated-progress viewport/theme fixtures, production Webpack build, TypeScript, targeted lint, and whitespace checks. Distinguished implementation from verification and documented the default Turbopack environment failure.                                                                           | `src/components/ProgressPanel.tsx`, `UI_MANUAL.md`                                                                                      |
| 2026-09-13 | Coach visual redesign       | Reworked the page into a dominant orange performance summary, compact KPI rail, connected AI diagnosis and recommended coaching surface, and more visual progress section. Updated the responsive progress breakpoint to 420px and re-passed empty and populated browser checks across four viewports and both themes. No logic, data, API, persistence, voice, scoring, or route changes. | `src/app/coach/page.tsx`, `src/components/ProgressPanel.tsx`, `UI_MANUAL.md`                                                            |
| 2026-09-13 | Coach professional styling  | Replaced large orange surfaces with neutral cards, subtle slate rules, a muted deep-blue CTA, and calmer elevation. Added light/dark coach presentation tokens used only by the dashboard and retained orange for explicit warnings. Reverified four viewports in both themes.                                                                                                             | `src/app/globals.css`, `src/app/coach/page.tsx`, `src/components/ProgressPanel.tsx`, `src/components/ShareControls.tsx`, `UI_MANUAL.md` |
| 2026-09-13 | Coach semantic visual pass  | Introduced route-scoped indigo, teal, green, amber, and coral presentation roles; compacted the KPI area; visually connected AI diagnosis to coaching; and opened up the progress layout. No business logic or data changed.                                                                                                                                                               | `src/app/globals.css`, `src/app/coach/page.tsx`, `src/components/ProgressPanel.tsx`, `src/components/ShareControls.tsx`, `UI_MANUAL.md` |
