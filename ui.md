# `/coach` Diagnosis UI Manual

This manual describes the current, final UI implementation of the Diagnosis page on this branch. It is an implementation reference for recreating the same presentation in another branch without requiring this branch's component tree or data model.

The source of truth for this document is the current working tree. It describes the finished UI and the implementation decisions that remain in the code; it does not catalogue discarded visual experiments.

## 1. Purpose

Use this file to reproduce the current `/coach` visual structure, hierarchy, semantic surfaces, employee credential, flip interaction, responsive behavior, and accessibility behavior.

The visual structure and interaction patterns may be copied. Business behavior must remain owned by the destination branch. In particular, do not transplant or rewrite diagnosis, KPI, scoring, authentication, persistence, API, or voice logic merely to reproduce this UI. Feed the destination branch's values into the same presentation components.

The current page demonstrates that separation:

- `src/app/coach/page.tsx` gathers authenticated identity, dashboard data, practice attempts, and share state, then maps those values into UI.
- `src/app/coach/EmployeeCredential.tsx` owns the credential's local flip state and portrait fallback only.
- `src/app/coach/coach.module.css` owns the page-specific visual treatment.
- Shared components retain their data and interaction responsibilities and accept narrow presentation hooks such as `className` and `heading`.

## 2. Final `/coach` Page Structure

`/coach` is a server-rendered, dynamically evaluated employee page. It is wrapped by the shared `AppShell`, which supplies the application header, identity/navigation area, page width, responsive padding, and vertical gaps.

The exact content order is:

1. Shared application header and responsive navigation from `AppShell`/`AppHeader`.
2. Optional onboarding banner. It appears only when the browser has not stored the dismissal flag.
3. Page context row:
   - `Your diagnosis` eyebrow.
   - `Where you're losing deals` page title.
   - Signed-in display name, seeded rep role/agency, and weeks in role.
   - `Value / evidence →` link.
   - `Seeded demo data · not a live CRM` badge.
4. Diagnosis/verdict panel:
   - `The pattern costing you deals` label.
   - Large diagnosis headline.
   - Calls analysed, diagnosis confidence, and primary stage.
   - Primary `Practice this now` action.
   - Secondary training-scenario link.
5. Evidence panel:
   - `Why we think that — N recent losses` heading.
   - Numbered evidence statements.
6. Paired identity and performance section:
   - Interactive digital employee credential on the left at desktop widths.
   - Cohesive `Your performance snapshot` panel on the right.
7. `What to do next` action chapter:
   - Section heading and firm-guidance subtitle.
   - Approved talk-track headline and explanatory play.
   - List price and approval floor.
   - `Do this` and `Never do this` guidance.
8. Paired diagnostic detail and practice section at desktop widths:
   - `Where you struggle` stage breakdown.
   - `Are you improving?` practice progress.
9. `Secondary information` group:
   - Compact sharing/privacy settings.
   - Collapsed raw analysed-calls disclosure and table.

The identity and performance items are one visual section even though they are two panels. Likewise, stage breakdown and progress become a two-column row only at large widths.

### Text wireframe

```text
┌───────────────────────────────────────────────────────────────────────┐
│ Shared header: brand · identity/focus · route navigation · theme     │
└───────────────────────────────────────────────────────────────────────┘

[Optional onboarding banner                                      Got it]

YOUR DIAGNOSIS                         [Value / evidence] [Seeded demo]
Where you're losing deals
Signed-in name · role at agency · weeks in role

┌─ DIAGNOSIS / VERDICT ────────────────────────────────────────────────┐
│ THE PATTERN COSTING YOU DEALS                                      │
│ Large diagnosis conclusion                                         │
│ Calls analysed · confidence · weakest conversation stage            │
│ [Practice this now]  Or pick a different scenario →                 │
└─────────────────────────────────────────────────────────────────────┘

┌─ EVIDENCE ──────────────────────────────────────────────────────────┐
│ WHY WE THINK THAT — N RECENT LOSSES                                 │
│ 01  Evidence statement                                              │
│ 02  Evidence statement                                              │
└─────────────────────────────────────────────────────────────────────┘

┌─ EMPLOYEE CREDENTIAL ─────────────┐  ┌─ PERFORMANCE SNAPSHOT ───────┐
│ Northline                   STAFF │  │ Price concessions             │
│ ┌────────┐ Alex Chen              │  │ Average seat discount         │
│ │ photo  │ Account Executive      │  │ Win rate                      │
│ │  4:5   │ tenure · focus         │  │                               │
│ └────────┘             flip ↔     │  │ three compact metric columns  │
└───────────────────────────────────┘  └───────────────────────────────┘

┌─ WHAT TO DO NEXT ───────────────────────────────────────────────────┐
│ Firm-guidance subtitle                                              │
│ Large approved-play headline                                       │
│ Approved play explanation                                          │
│ List price                         Approval floor                    │
│ ┌─ Do this / positive ──────────┐  ┌─ Never do / negative ────────┐ │
│ └───────────────────────────────┘  └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘

┌─ WHERE YOU STRUGGLE ──────────────┐  ┌─ ARE YOU IMPROVING? ─────────┐
│ stage bars; weakest row promoted  │  │ attempts · last score · hold │
│ explanatory conclusion           │  │ trend chart and history       │
└───────────────────────────────────┘  └───────────────────────────────┘

SECONDARY INFORMATION
┌─ Sharing/privacy setting ───────────────────────────────────────────┐
└─────────────────────────────────────────────────────────────────────┘
┌─ ▸ See all N calls we analysed (collapsed by default) ──────────────┐
└─────────────────────────────────────────────────────────────────────┘
```

## 3. Visual Hierarchy

The page tells a diagnosis-to-action story. Visual weight decreases as the content moves from conclusion to evidence and detailed records.

### Diagnosis hierarchy

The diagnosis conclusion is the strongest textual element. The page title uses the display serif at `text-3xl` and becomes `text-4xl` at `lg`; the diagnosis headline also uses the display serif at `text-3xl`, becomes `text-4xl` at `lg`, and sits inside an accent-tinted verdict surface. A slim accent edge distinguishes the verdict from an ordinary card. Calls analysed, confidence, and stage remain 14 px supporting copy.

The primary action is a 48 px-high navy pill with 18 px semibold text. The alternative scenario link is smaller and muted, so the eye resolves the conclusion and its next action first.

### Evidence hierarchy

Evidence confirms the diagnosis without competing with it. It uses the standard neutral `surface-card`, a 12 px uppercase heading, 12 px monospaced sequence numbers, and 14 px body text. The numbered list makes the evidence scannable, but the neutral surface and smaller type keep it subordinate to the verdict.

### Employee identity and analytics

The credential answers “whose performance is this?” and the performance panel answers “how are they performing?” They are paired horizontally at desktop widths in a `37fr / 63fr` grid. The employee card has a unique warm-glass material and credential grammar; the performance panel retains the site's neutral analytics grammar. This prevents the credential from looking like a fourth KPI card.

Inside the credential, the issuer, `STAFF` label, portrait, name, role, tenure, and focus establish identity in that order. The name uses 24 px semibold text and is the strongest identity element. Metadata uses 12–14 px text.

### Performance hierarchy

The three metrics live inside one panel and one bordered grid. Metric values use 30 px semibold type in the current component markup. The two diagnosed problem metrics use warning-colored values and pale warning surfaces; the win rate remains neutral. Metric labels and explanations are smaller, and the problem hint is a 12 px warning line.

Current seeded examples are `66.7%`, `$10.70`, and `33.3%`. These are data outputs, not design constants. A port must render the destination branch's computed values.

### Recommended-action hierarchy

`What to do next` is a full-width visual chapter between performance and deeper analysis. Its 24 px heading becomes 30 px at `sm`. The talk-track title uses the display serif at 24 px, becoming 30 px at `sm`, and uses the accent color. Price values use 24 px semibold type. Supporting prose and list items remain 14–16 px.

The pale accent field and 3 px accent edge establish the section boundary. Within it, the approved play and pricing values precede the supporting `Do`/`Never` lists.

### Stage weakness hierarchy

The primary diagnosed stage receives a pale danger surface, 600-weight danger label, and a larger 24 px percentage. Other stage names are muted, their percentages retain the normal monospace treatment, and their red fills are reduced to `opacity: 0.45`. The bar length still reflects the unchanged loss-rate data.

### Progress hierarchy

`Attempts`, `Last score`, and `Price hold` are the dominant elements in the progress panel. `/coach` changes the shared heading from the default uppercase micro-label into a normal-case 20 px section heading. Top values scale with `clamp(1.75rem, 3vw, 2.25rem)` and use tabular numerals. The score trend, explanatory text, and history table remain below the top metrics as supporting detail.

### Secondary hierarchy

Sharing/privacy and raw-call evidence are grouped under a muted 16 px `Secondary information` heading. They use 16 px internal padding and no shadow. Raw calls stay inside a closed `<details>` element until the user requests the evidence. This keeps configuration and audit detail available without making either part of the main diagnosis story.

## 4. Colour System Used on `/coach`

The general page inherits semantic variables from `src/app/globals.css`. Local selectors combine them with `color-mix()` so light and dark themes keep the same meaning.

### Global semantic tokens

| Role | Light value | Dark value | `/coach` use |
|---|---:|---:|---|
| Page background | `#f8f9fa` | `#12161a` | App ground |
| Foreground | `#1a1d20` | `#f1f3f5` | Primary text |
| Card | `#ffffff` | `#1c232b` | Neutral panels |
| Muted | `#5c6570` | `#9aa4af` | Explanations and metadata |
| Border | `#e9ecef` | `#2c353f` | Dividers and neutral outlines |
| Accent | `#1b3a5c` | `#5b9bd5` | Diagnosis, coaching guidance, primary CTA |
| Accent soft | `#eaf0f6` | `#1a2b3d` | Onboarding and guidance surfaces |
| Positive | `#2b8a3e` | `#40c057` | Approved guidance and held-price progress |
| Positive soft | `#ebfbee` | `#13251a` | Positive surfaces |
| Warning | `#bf9521` | `#d4af37` | Problem KPI values and discounted practice |
| Warning soft | `#fdf6e3` | `#2e2510` | Problem KPI surfaces |
| Danger | `#c92a2a` | `#ff6b6b` | Never guidance, losses, weakest stage |
| Danger soft | `#fff5f5` | `#2a1515` | Negative surfaces and weakest-stage row |

### Page-specific semantic surfaces

- Onboarding: `var(--accent-soft)` with a border mixed from `22%` accent and the normal border.
- Verdict: a mix of `55%` accent-soft and card, with a solid accent left edge. The JSX still contains `border-l-danger`, but `.verdict:global(.surface-card)` currently replaces the left-edge color with `var(--accent)`.
- Guidance: `65%` accent-soft mixed with card, a border mixed from `20%` accent, and a 3 px accent left edge.
- Approved guidance: `55%` positive-soft mixed with card; border mixes `20%` positive with border.
- Never guidance: `65%` danger-soft mixed with card; border mixes `20%` danger with border.
- Problem metrics: `65%` warning-soft mixed with card. Their numbers and hints use `var(--warn)`.
- Progress: border mixes `20%` positive with border; the header uses `50%` positive-soft mixed with card. Held trend bars are positive; discounted bars are warning.
- Sharing: `30%` accent-soft mixed with card; border mixes `15%` accent with border.
- Raw calls: neutral card surface. Outcome badges use positive, danger, warning, or neutral semantics.

### Credential-only palette

The `.credential` wrapper redefines theme variables locally. These values remain warm and light in both application themes and do not leak outside the credential:

```css
--card: #f7f3eb;                 /* warm ivory glass source */
--foreground: #20344b;           /* deep navy identity text */
--muted: #6f665c;                /* warm taupe secondary text */
--accent: #20344b;               /* navy issuer/accent */
--accent-soft: #e5ebef;          /* cool grey-blue portrait/focus field */
--border: #d6cfc3;               /* warm neutral border/divider */
--credential-bronze: #79634d;    /* STAFF/COACHING label */
```

Additional translucent optical colors are literal CSS values:

- White inner rims: `rgb(255 255 255 / 92%)` and `rgb(255 255 255 / 72%)`.
- Cool refraction: `#ccecf2` mixed at `24%` with transparent.
- Main glass border: white mixed at `52%` with `--border`.
- Sheen/reflection whites range from `7%` to `64%` alpha.
- A pale cyan sheen stop uses `#d7f3f5` mixed at `14%` with transparent.

The credential intentionally differs from both the neutral analytics panel and the pale-blue action section: identity is warm glass, analytics is neutral, and coaching guidance is pale accent blue.

## 5. Readability / Spacing Rules

The page follows these current rules:

- Reserve the display serif for the page title, diagnosis conclusion, and approved talk-track title.
- Use the largest sizes for conclusions and decision-driving numbers. Keep explanatory sentences at 14–16 px and metadata at 10–12 px.
- Use uppercase tracking only for true eyebrow/meta labels. `/coach` explicitly removes uppercase and tracking from the progress heading, progress metric labels, trend label, and sharing eyebrow where the shared component would otherwise create too many competing micro-labels.
- Keep major page regions separated by the `AppShell` main gap: 24 px by default and 32 px from `lg` upward. Additional local top margins separate major chapters (`.guidance` and `.secondary` use `margin-top: 1rem`; the stage/progress row uses `mt-3`).
- Use compact internal gaps for related detail: metric blocks use 16 px padding, guidance subcards use 16 px, and secondary cards are forced to 16 px with shadows removed.
- Group related content into cohesive panels. Three KPIs share one panel and one internal metric grid; guidance is one chapter with two semantic subareas; identity and performance are paired.
- Avoid giving every subsection an equal border, shadow, or heading size. Evidence is neutral, supporting charts/tables sit below summary metrics, and raw calls remain collapsed.
- Let semantic color clarify purpose while labels continue to carry meaning. Warning, positive, and danger colors never replace the text labels.

## 6. Employee Credential

### Layout

At `min-width: 1024px`, `.profilePerformance` uses:

```css
grid-template-columns: minmax(0, 37fr) minmax(0, 63fr);
gap: 1.5rem;
```

Below 1024 px it is a one-column grid with the employee credential above the performance panel and a 20 px gap.

The credential uses a horizontal internal identity grid:

- Left: portrait, `minmax(4rem, 28%)` on desktop.
- Right: name, role, time in role, and current coaching focus.
- Internal gap: `clamp(0.75rem, 2vw, 1.5rem)`.
- Portrait aspect ratio: `4 / 5`.
- Header: issuer/agency at left and `STAFF` at right, separated from the identity by a bottom rule.
- Footer affordance: `Tap to flip ↔` aligned right in 10 px muted text.

The base `.repProfile` rule declares `aspect-ratio: 1.6`, expressing the intended landscape direction. The effective flip face rule is more specific: `.credentialFace.repProfile { aspect-ratio: auto; }`. Consequently, the current rendered credential height is content-driven rather than locked to exactly 1.6:1. This allows both grid-overlaid faces to contribute to one stable intrinsic row and prevents content clipping. Preserve this cascade if reproducing the exact current behavior.

The front contains:

- Current agency/company as issuer (`Northline` in seeded data).
- `STAFF` label.
- 4:5 portrait or initials fallback.
- Authenticated display name.
- Seeded rep role.
- Seeded weeks in role.
- `Price concessions` coaching-focus field.
- Flip affordance.

The back contains:

- Current agency/company as issuer.
- `COACHING` label.
- Current coaching focus.
- Weakest diagnosed stage.
- Practice attempt count or compact no-attempt state.
- Privacy note.
- Return affordance.

### Identity behavior

Display identity and performance data are deliberately separate.

In `page.tsx`:

```ts
const user = await requireRole("employee");
const repId = user.repId ?? DEMO_REP_ID;
const dash = getRepDashboard(repId);
```

The credential receives `name={user.name}` but receives `rep.id`, agency, role, tenure, diagnosis stage, and attempts from the resolved dashboard/demo rep. Its React key is `${rep.id}:${user.name}` so a display-identity change remounts local credential state.

This means a custom demo login can show its authenticated name while reusing Alex's seeded calls, KPIs, diagnosis, firm details, and practice stream. Do not change the seeded data model to reproduce this behavior.

The Alex portrait condition requires both:

```ts
repId === "rep_demo_alex" && name.trim().toLowerCase() === "alex chen"
```

Thus:

- Canonical Alex demo identity: shows `Alex Chen` and `/alex-chen.png`.
- Custom identity such as Atina mapped to the Alex demo rep: shows `Atina`, generated initials, and no Alex portrait.
- Any other rep or display name: generated initials and no invented portrait.

Initials take the first character of the first two whitespace-delimited name parts. They are decorative and marked `aria-hidden` because the adjacent visible name supplies identity.

### Portrait

- Asset: `public/alex-chen.png`.
- Browser path: `/alex-chen.png`.
- Source asset: 1123 × 1401 RGB PNG, close to the rendered 4:5 frame.
- Component: Next.js `Image` with `fill`.
- Sizing hint: `(max-width: 1023px) 112px, 180px`.
- Crop: `object-fit: cover; object-position: center`.
- Alt text: `Alex Chen`.
- Frame: relative positioning, `overflow: hidden`, 4:5 ratio, 1 px mixed navy/warm border, and `0.375rem` radius.
- Fallback: `onError` sets local `portraitFailed` state and replaces the image with initials. Custom names start with initials because no portrait source is assigned.

### Flip interaction

`EmployeeCredential` is a page-local client component. It stores only `flipped` and `portraitFailed` UI state.

The accessible hit target is a native `button` positioned over the entire credential. Click, tap, Enter, and Space therefore use standard button behavior. The button label changes with state:

- Front visible: `Show {name}'s coaching summary`.
- Back visible: `Show {name}'s employee identity`.

The stable 3D structure is:

```text
.credential              layout box, clipping, shadow, 1200px perspective
└── .credentialControl   absolute full-size native button
└── .credentialRotor     shared grid, owns rotateY transform
    ├── front face       grid-area 1 / 1, rotateY(0)
    └── back face        grid-area 1 / 1, rotateY(180deg)
```

Key values:

- Perspective: `1200px`, centered on `.credential` only.
- Rotor transform origin: center.
- Rotor 3D mode: `transform-style: preserve-3d`.
- Transition: `transform 420ms ease-in-out`.
- Flipped state: exact `rotateY(180deg)`.
- Back starting transform: exact `rotateY(180deg)`.
- Both faces: `backface-visibility: hidden` plus the WebKit-prefixed form.
- Both faces: `width: 100%`, `max-width: 100%`, `min-width: 0`, `box-sizing: border-box`, shared inherited radius, and the same grid cell.
- Outer wrapper: `width/max-width: 100%`, `min-width: 0`, and `overflow: clip`.

The inactive face receives `aria-hidden="true"`; the active face is referenced by the button's `aria-describedby`. Face IDs come from React `useId()`.

Under `prefers-reduced-motion: reduce`, the rotor transition is removed. State and accessibility behavior remain intact; the card changes sides without animated rotation.

### Back side

The reverse is a coaching summary using existing data only:

1. Current coaching focus: `Price concessions`.
2. Weakest diagnosed stage from `diagnosis.primaryStage`, converted from underscores to spaces.
3. Existing practice attempt count; zero renders `No scored drills yet`.
4. Privacy statement: `Raw practice transcripts are never shared with your manager.`

It does not invent an employee number, contact detail, HR field, barcode, or QR code.

### Containment rule

The containment fix depends on the structure, not a z-index trick:

- `.credential` owns the grid column width, perspective, border radius, clipping, and outer shadow.
- `.credentialRotor` owns the transform and never changes width or height between states.
- The two faces are regular grid children in the same `grid-area: 1 / 1`; they are not absolutely positioned. Both therefore contribute to one stable intrinsic grid row.
- Each face is explicitly constrained to the wrapper width and uses border-box sizing.
- `overflow: clip` prevents projected rotating edges from painting into the performance column without flattening the preserved 3D scene as `overflow: hidden` can in some rendering paths.
- The outer shadow belongs to the wrapper. Face optical effects remain inset or clipped inside each face.
- All transform origins are centered, so the card does not appear to hinge sideways into the adjacent panel.

Do not move perspective onto the rotor, put a scale transform on either face, or position the two faces outside the shared sizing grid.

## 7. Employee Credential Material / Liquid Glass Styling

Both faces use the same `.credentialFace.repProfile` material rule. The back differs only by its 180-degree starting transform.

### Card background material

The main surface is translucent warm frosted acrylic, not a solid ivory fill:

```css
background:
  linear-gradient(
    145deg,
    rgb(255 255 255 / 34%),
    rgb(255 255 255 / 9%) 42%,
    color-mix(in srgb, var(--card) 18%, transparent) 72%
  ),
  color-mix(in srgb, var(--card) 68%, transparent);
backdrop-filter: blur(22px) saturate(124%);
-webkit-backdrop-filter: blur(22px) saturate(124%);
```

The 68% warm base preserves text contrast while allowing the surface to read as translucent. The 22 px blur suppresses distracting content behind the card, and 124% saturation adds a small acrylic refraction cue.

### Glass edge treatment

The face border mixes white at `52%` with the credential's warm `--border`. Inset shadows construct the bright and refracted edges:

```css
box-shadow:
  inset 0 2px 1px rgb(255 255 255 / 92%),
  inset 2px 0 1px rgb(255 255 255 / 72%),
  inset -1px 0 2px color-mix(in srgb, #ccecf2 24%, transparent),
  inset 0 -2px 4px color-mix(in srgb, var(--accent) 20%, transparent);
```

This gives the top and left a luminous inner rim, the right a faint cool-cyan refraction, and the bottom a darker navy-weighted refraction.

The inherited `::before` inset line sits 6 px inside the face. On the credential it is overridden to:

```css
border-color: color-mix(in srgb, var(--credential-bronze) 18%, transparent);
box-shadow:
  inset 1px 1px 0 rgb(255 255 255 / 75%),
  inset -1px -1px 0 color-mix(in srgb, var(--accent) 14%, transparent),
  0 0 8px rgb(255 255 255 / 24%);
```

The wrapper adds depth without duplicating a dashboard-card shadow:

```css
box-shadow:
  0 1px 2px rgb(255 255 255 / 55%),
  0 5px 12px -6px color-mix(in srgb, var(--accent) 24%, transparent),
  0 18px 34px -18px color-mix(in srgb, var(--accent) 48%, transparent);
```

### Reflection layer

Each face owns a clipped `::after` reflection covering `inset: 0`. It uses a broad diagonal `122deg` band:

```css
background: linear-gradient(
  122deg,
  transparent 8%,
  rgb(255 255 255 / 7%) 19%,
  rgb(255 255 255 / 38%) 30%,
  rgb(255 255 255 / 64%) 37%,
  rgb(255 255 255 / 28%) 44%,
  color-mix(in srgb, #d7f3f5 14%, transparent) 51%,
  transparent 63%
);
opacity: 0.72;
transform: translateX(-3%);
```

It is pointer-transparent, shares the face radius, and never grows beyond the face. On a fine pointer with hover support and normal motion preference, the sheen shifts to `translateX(3%)` and `opacity: 0.9`. It does not loop.

With reduced motion, its transition is removed and its transform is reset to none. The static reflection remains visible.

### Portrait and content layers

All direct face children receive `position: relative; z-index: 1`. This places text and the portrait above the reflection. `backdrop-filter` filters only the material backdrop; it does not apply a CSS `filter` or opacity to the portrait. The Next.js image therefore remains crisp and uses its own clipped photo frame.

### Clipping and 3D compatibility

- The reflection and inset line live independently on both faces.
- Each pseudo-element inherits the face radius and remains inside its face.
- No filter or opacity is applied to `.credentialRotor`, which preserves the 3D context.
- The wrapper clips projected child edges but supplies the external shadow itself.
- Neither material layer changes box metrics, card width, or card height.

## 8. Performance Snapshot

`Your performance snapshot` is one `.performancePanel`, not three standalone dashboard cards. It uses a neutral `var(--card)` background, standard border, `0.75rem` radius, a 3 px accent top edge, and a restrained `0 2px 6px rgb(16 20 24 / 4%)` shadow.

Inside it, `.performanceMetrics` creates a single bordered grid with 1 px dividers, `0.5rem` radius, and clipped corners. At `min-width: 640px`, the grid has three equal columns; below 640 px the metrics stack.

The current metrics are:

1. Price concessions — problem semantic treatment.
2. Average seat discount — problem semantic treatment.
3. Win rate — neutral treatment.

Each block has 16 px padding. Labels are 12 px medium muted text. Values are 30 px semibold, with problem values in warning color and win rate in foreground. Explanations are 12 px muted text. Problem metrics include the explicit warning-colored hint `← this is the one to fix`, so color is not the only indication.

The panel fills the available paired-section height through its flex layout and `align-items: stretch` on the parent. Its 63% desktop share keeps analysis dominant while the 37% credential supplies personal context.

## 9. What to Do Next

The `.guidance` section is designed as a major chapter:

```css
margin-top: 1rem;
padding: clamp(1rem, 3vw, 2rem);
background: color-mix(in srgb, var(--accent-soft) 65%, var(--card));
border: 1px solid color-mix(in srgb, var(--accent) 20%, var(--border));
border-left: 3px solid var(--accent);
border-radius: 0.75rem;
```

Its hierarchy is:

1. `What to do next`: 24 px semibold, 30 px from `sm`.
2. `What your firm says to do here`: 14 px muted subtitle.
3. Talk-track title: display serif, 24 px, 30 px from `sm`, accent colored.
4. Approved-play explanation: 16 px with relaxed leading.
5. Pricing pair: each label is 14 px and each value is 24 px semibold.
6. Supporting positive/negative lists: 16 px headings, 14 px muted bullets.

`.pricing` uses block dividers mixed from 15% accent, a 24 px top margin, 16 px vertical padding, and a 16 px gap. It becomes two equal columns at 640 px. The approval floor includes a 12 px explanation that approval is required below it.

`Do this` and `Never do this` use distinct, restrained sub-surfaces with 16 px padding and `0.5rem` radius. They become two columns through `sm:grid-cols-2` at 640 px and stack below that breakpoint. Positive checkmarks and the `Do this` label use `--ok`; negative crosses and the `Never do this` label use `--danger`. The complete guidance content still comes from the current talk-track data.

## 10. Where You Struggle

This neutral `surface-card` contains the current stage-breakdown data from `kpis.byStage`. The explanatory copy establishes that longer red bars indicate worse outcomes.

Every row contains:

- A fixed 96 px stage-name column.
- A flexible 8 px-high rounded track.
- A red fill capped visually at 100% width.
- A right-aligned percentage.

The row whose stage equals `diagnosis.primaryStage` gets `.weakestStage`:

- 12 px vertical and 8 px horizontal inset.
- `var(--danger-soft)` background.
- `0.5rem` radius.
- Danger-colored 600-weight stage label.
- Danger-colored 24 px, 600-weight percentage with a minimum 72 px width.

Other rows use `.otherStage`: 8 px horizontal inset, muted stage name, and a red fill at `opacity: 0.45`. The final explanatory paragraph names the primary stage in text. No CSS selector chooses the weakest stage; the existing diagnosis result supplies that comparison.

## 11. Are You Improving?

The page reuses `ProgressPanel` and supplies `heading="Are you improving?"` plus `.progress` as a scoped class. The shared component owns the data formatting; the page stylesheet changes only its emphasis.

Top-level metrics are always a three-column row:

- Attempts.
- Last score, taken from the first/latest attempt.
- Price hold.

The `/coach` overrides enlarge values to `clamp(1.75rem, 3vw, 2.25rem)`, use 1.2 line height and tabular numerals, and accent the latest-score value. The header receives a pale positive surface and the whole panel a subtle positive border.

When attempts exist:

- The bar chart is chronological, oldest at left.
- Chart height is 112 px.
- Bar height has an 8% minimum and is normalized against at least 100.
- Positive green means price held; warning gold means price discounted.
- A text legend repeats both meanings.
- The history table lists attempt number, local date/time, score, and `Held`/`Softened` status.

When no attempts exist, the component renders one compact 14 px message with `/coach` adding only `0.75rem` vertical padding. It does not render an empty chart or table.

At 1024 px and above, this panel sits to the right of the stage breakdown in a two-column grid. Below 1024 px it stacks below the stage breakdown. The history area has horizontal overflow enabled if its contents exceed the panel width.

## 12. Secondary Information

The `.secondary` group uses a 16 px top margin and a 12 px internal gap. Its heading is muted, 16 px, and medium weight.

`ShareControls` remains fully interactive but visually compact:

- 16 px panel padding instead of the shared component's default 20 px.
- No card shadow.
- A very light accent mix and low-contrast accent border.
- Normal-case muted eyebrow instead of a competing uppercase label.
- 16 px section heading.
- 12 px status/helper details.
- Explicit copy says sharing is private by default and managers receive progress summaries, never raw transcripts.

The raw analysed-call table is inside a native `<details>` element with no `open` attribute, so it is collapsed by default. The closed summary is 14 px muted text. When expanded, an `overflow-x-auto` wrapper contains a table with `min-width: 720px`; narrow viewports scroll the table rather than compressing its six columns. Outcome pills combine labels with semantic colors: won/positive, lost/danger, conceded/warning, and no-decision/neutral.

## 13. Scoped CSS Strategy

All Diagnosis-specific visual rules live in `src/app/coach/coach.module.css` and are imported as `colors` by the page and employee credential. This keeps the custom hierarchy, semantic surfaces, credential material, and component overrides confined to `/coach`.

The global `.surface-card` rule is unlayered CSS:

```css
.surface-card {
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(16, 20, 24, 0.04),
              0 4px 10px -2px rgba(16, 20, 24, 0.06);
  transition: box-shadow 180ms ease, border-color 180ms ease,
              transform 180ms ease;
}
```

Because it is unlayered, it can beat Tailwind background and border utilities generated inside Tailwind's cascade layers. A class such as `bg-accent-soft` on a `surface-card` is therefore insufficient by itself.

For page-only semantic cards, the module pairs the local class with the global class:

```css
.onboarding:global(.surface-card) { ... }
.verdict:global(.surface-card) { ... }
.progress:global(.surface-card) { ... }
.sharing:global(.surface-card) { ... }
.rawCalls:global(.surface-card) { ... }
```

This supplies enough specificity and keeps the correction route-local. Standalone page sections such as `.guidance`, `.approved`, `.avoid`, `.performancePanel`, and the credential use local classes directly.

Do not change global `.surface-card` to recreate `/coach` semantic colors. That would alter every route using the shared surface. Add a page-local class to the target element and override only the required background, border, shadow, or hierarchy property.

The legacy `.problem:global(.surface-card)` and `.problem > p:first-child` selectors still exist in the module, but the current performance implementation uses `.metricProblem` inside `.performancePanel`; `.problem` is not applied by current `/coach` JSX. Reproduce the active `.metricProblem` pattern rather than relying on the unused selector.

## 14. Relevant Files

### Primary `/coach` files

| File | Responsibility | Scope if changed |
|---|---|---|
| `src/app/coach/page.tsx` | Server page composition, exact section order, mapping current data into diagnosis, evidence, credential, metrics, guidance, stage, progress, sharing, and raw-call UI | `/coach` only, though it calls shared logic |
| `src/app/coach/coach.module.css` | All page-specific semantic surfaces, hierarchy overrides, credential construction/material, paired layouts, and breakpoints | `/coach` only while imported only here/local component |
| `src/app/coach/EmployeeCredential.tsx` | Client-side credential markup, identity-vs-dataset portrait rule, initials fallback, flip state, dynamic accessibility labels, front/back fields | `/coach` only |
| `public/alex-chen.png` | Canonical Alex portrait asset | Any future consumer of this explicit path; currently the credential |

### Shared components used by `/coach`

| File | Responsibility | Porting note |
|---|---|---|
| `src/components/OnboardingBanner.tsx` | Dismissible first-use explanation; localStorage key `cornerman-onboarding-dismissed`; accepts optional `className` | Keep behavior shared; pass the scoped `.onboarding` class from `/coach` |
| `src/components/ProgressPanel.tsx` | Attempts summary, latest score, fee-hold rate, trend bars, legend, history, empty state; accepts `className` and custom `heading` | Keep calculations/data rendering here; scope hierarchy changes through `.progress` |
| `src/components/ShareControls.tsx` | Share/private toggle, saving/error state, POST to `/api/practice/share`; accepts optional `className` | Keep persistence behavior unchanged; scope compact presentation through `.sharing` |
| `src/components/AppShell.tsx` | Shared header wrapper and application-main dimensions: max width 1800 px, responsive padding/gaps | Do not change for a Diagnosis-only port |
| `src/components/AppHeader.tsx` | Brand, identity/focus line, role-aware navigation, sign-out, theme control; desktop/mobile navigation behavior | Shared across app; do not alter for this page design |
| `src/components/ThemeProvider.tsx` | Saved/system theme synchronization and theme switching | Shared runtime behavior; not a `/coach` styling hook |
| `src/components/ThemeIcons.tsx` | Decorative day/night SVG icon components | Shared theme control |
| `src/app/layout.tsx` | Fonts, metadata, pre-paint theme initialization, `ThemeProvider` | App-wide; do not alter for a page-only port |
| `src/app/globals.css` | Theme tokens, Tailwind theme mapping, shared `.surface-card`, `.eyebrow`, `.display-serif`, motion, and global primitives | Consume tokens; avoid page-specific edits here |

### Data and behavior sources to connect, not restyle

| File | Current responsibility |
|---|---|
| `src/lib/auth.ts` and auth types/routes | Session lookup and employee role enforcement |
| `src/lib/diagnosis.ts` | Dashboard assembly and diagnosis calculation |
| `src/lib/kpis.ts` | KPI and stage-rate calculation |
| `src/lib/attempts.ts` | Attempt retrieval and practice KPI derivation |
| `src/lib/share.ts` and `/api/practice/share` | Share-setting retrieval/persistence |
| `src/lib/money.ts` | Price display formatting |
| `src/data/seed.ts` | Demo rep, firm, calls, and talk-track values |

## 15. Logic That Must Stay Separate From UI

During a port, preserve or reconnect the destination branch's implementation for:

- Diagnosis ranking, confidence, headline generation, supporting evidence, and primary-stage selection.
- Call KPIs, concession rates, average-price calculations, win rate, and stage loss rates.
- Seeded firms, reps, calls, outcomes, pricing guidance, and talk tracks.
- Authentication, authorization, cookies, session identity, and role enforcement.
- The distinction between authenticated display identity and the rep ID used to load demo performance.
- Practice-attempt storage, ordering, aggregation, and trend labels.
- Sharing state, request/response handling, persistence, privacy policy, and manager visibility.
- API routes and payload contracts.
- Practice score criteria and held-fee interpretation.
- Voice session behavior and ElevenLabs integration.
- Route paths, query parameters, middleware access control, and navigation.

The UI expects values such as `diagnosis.headline`, `diagnosis.evidence`, `diagnosis.primaryStage`, `kpis.byStage`, three summary KPI values, `talkTrack`, attempts, and share state. A new branch should adapt its own data to those visual inputs. Do not copy the current demo calculations into UI components.

The page-local `discount` expression and `pct`/`label` helpers are current presentation mappings, but their source data still comes from KPI/diagnosis logic. Treat these as formatting seams, not permission to duplicate business rules in CSS or the credential.

## 16. Responsive Behaviour

### Shared shell and navigation

- Base main padding: 16 px horizontal and 24 px vertical; vertical content gap 24 px.
- `sm` (`min-width: 640px`): horizontal main padding becomes 24 px.
- `lg` (`min-width: 1024px`): content gap becomes 32 px and horizontal padding becomes 40 px.
- `xl` (`min-width: 1280px`): horizontal padding becomes 48 px.
- Main width is capped at 1800 px and centered.
- Below `lg`, the header's route navigation moves to a wrapping row beneath the top bar. At `lg` and above, route links and sign-out appear inline in the top bar.

### Credential and performance

- Below 1024 px: `.profilePerformance` is one column; credential appears above performance.
- At 1024 px and above: 37/63 credential/performance columns with a 24 px gap.
- At `max-width: 1023px`, the credential identity grid uses `clamp(4rem, 18vw, 7rem)` for the portrait column and the remaining width for details.
- The credential preserves its horizontal photo-plus-details composition at tablet/mobile widths. Its effective height remains content-driven, which avoids clipping long names or back-side copy.
- The flip is tap/click driven, so it does not depend on hover and works on touch devices.

### KPI panel

- Below 640 px: the three metric blocks stack inside the one performance panel.
- At 640 px and above: three equal columns.
- `min-width: 0` on panels and blocks prevents grid content from forcing the page wider.

### Guidance

- Padding scales with `clamp(1rem, 3vw, 2rem)`.
- Pricing stacks below 640 px and becomes two equal columns at 640 px.
- `Do this`/`Never do this` stack below 640 px and become two equal columns at 640 px.
- Heading and talk-track title increase from 24 px to 30 px at 640 px.

### Stage and progress

- Below 1024 px: `Where you struggle` and `Are you improving?` stack.
- At 1024 px: two equal columns with 32 px gap.
- Progress top metrics remain three columns at all widths; compact labels and flexible values support this layout.
- Progress history can scroll horizontally if necessary.

### Raw calls

- The disclosure remains closed by default at every width.
- When open, the six-column table keeps a 720 px minimum width and scrolls horizontally within its own wrapper.

## 17. Accessibility

- The credential uses a real `button`, so it is keyboard focusable and responds to Enter/Space without custom key handlers.
- The credential button has a visible 3 px accent outline inset by 4 px on `:focus-visible`.
- Its `aria-label` describes the action and updates after each flip.
- `aria-describedby` points to the currently visible face; the inactive face receives `aria-hidden="true"`.
- React `useId()` provides stable front/back description IDs.
- Alex's image uses `alt="Alex Chen"`. Initials are `aria-hidden` because the visible name carries the same information.
- Decorative checks, crosses, chart swatches, and initials are marked hidden where present. Their accompanying text preserves meaning.
- Metric problem states include labels and explanatory text in addition to warning color.
- Stage weakness is named in copy and receives weight/size/surface differences in addition to red.
- Progress bars include a text legend and history table.
- `prefers-reduced-motion: reduce` removes the 3D transition and sheen movement while preserving flip state changes.
- Raw calls use native `<details>/<summary>` semantics.
- Buttons in onboarding and sharing use native button semantics and disabled states where required.

## 18. Known non-UI issue

The previously reported root-script and theme-toggle hydration errors are not represented as active defects in the current source.

Current `src/app/layout.tsx` uses Next.js `Script` with `strategy="beforeInteractive"` to read `cornerman-theme`, fall back to `prefers-color-scheme`, and apply the document class/color scheme before paint. `ThemeProvider` starts with deterministic `light` state for matching server/first-client markup, then synchronizes the saved/system preference in an effect. Root `<html>` retains `suppressHydrationWarning` because the pre-hydration script intentionally changes its theme class; suppression is not being used to hide a toggle-content mismatch.

The current workspace has had a separate TypeScript/build-environment issue involving `jspdf` resolution in PDF components. It is unrelated to `/coach` presentation and should not be worked around inside the Diagnosis page. Recheck it in the target branch rather than assuming it is part of this UI.

## 19. Porting Checklist

### Structure and data seams

- [ ] Recreate the `/coach` section order from this manual.
- [ ] Preserve the destination branch's employee-role guard and route behavior.
- [ ] Connect the authenticated display name separately from the performance dataset ID.
- [ ] Connect rep agency, role, tenure, diagnosis, evidence, KPIs, talk track, attempts, and sharing from branch-owned logic.
- [ ] Keep current numeric outputs dynamic; do not hardcode the seeded demo examples.
- [ ] Keep pricing formatting and stage labels consistent with destination data units.
- [ ] Keep raw calls collapsed by default.

### Scoped styles

- [ ] Copy or recreate `src/app/coach/coach.module.css`.
- [ ] Import the module only into `/coach` and its page-local credential.
- [ ] Apply scoped compound selectors to `surface-card` elements that need semantic backgrounds/borders.
- [ ] Do not globally modify `.surface-card` for this page.
- [ ] Reuse global accent/ok/warn/danger tokens for page semantics.
- [ ] Recreate the credential-only custom-property scope exactly.
- [ ] Check the unused `.problem` selector before copying; current KPI emphasis uses `.metricProblem`.

### Credential

- [ ] Create the page-local client `EmployeeCredential`.
- [ ] Pass authenticated `user.name` as display identity.
- [ ] Preserve the canonical-Alex check requiring both Alex demo rep ID and normalized `Alex Chen` display name.
- [ ] Copy `public/alex-chen.png`, or intentionally replace the mapping with a branch-owned portrait source.
- [ ] Keep initials fallback for custom identities and image load failure.
- [ ] Preserve the 4:5 portrait frame and `object-fit: cover` crop.
- [ ] Preserve the wrapper/rotor/shared-grid-face 3D structure.
- [ ] Keep perspective on the wrapper and transform on the rotor.
- [ ] Keep both faces in `grid-area: 1 / 1` so sizing is stable.
- [ ] Preserve `min-width: 0`, 100% width constraints, border-box sizing, centered origins, and wrapper clipping.
- [ ] Keep both faces' radius, glass treatment, and sheen identical.
- [ ] Verify the portrait/content layer sits above the sheen.
- [ ] Keep the native full-card button, dynamic label, described face, focus ring, and hidden inactive face.
- [ ] Preserve reduced-motion behavior.

### Performance and hierarchy

- [ ] Recreate one cohesive performance panel with three internal metric blocks.
- [ ] Mark the two diagnosed problem metrics in warning semantics and leave win rate neutral.
- [ ] Keep the credential/performance split at 37/63 from 1024 px.
- [ ] Recreate the verdict hierarchy and primary practice CTA.
- [ ] Recreate the neutral numbered evidence treatment.
- [ ] Recreate the full-width pale-accent `What to do next` chapter.
- [ ] Present list price and approval floor as separate scan-friendly values.
- [ ] Recreate positive `Do this` and negative `Never do this` sub-surfaces.
- [ ] Promote the diagnosed stage without changing the stage data.
- [ ] Promote attempts/latest score/price hold and leave chart/history secondary.
- [ ] Keep sharing and raw calls under the low-priority secondary heading.

### Responsive and regression checks

- [ ] Stack KPI blocks below 640 px.
- [ ] Stack pricing and Do/Never below 640 px.
- [ ] Stack credential/performance and stage/progress below 1024 px.
- [ ] Preserve the horizontal credential identity arrangement on small screens.
- [ ] Keep raw-call horizontal scrolling inside the disclosure.
- [ ] Verify the header switches to its shared wrapped mobile navigation.
- [ ] Verify touch flipping and keyboard flipping.
- [ ] Verify light and dark application themes.
- [ ] Verify the warm credential remains legible in both themes.
- [ ] Verify no global style regression on other routes.
- [ ] Run targeted lint and TypeScript checks in the destination branch.

## 20. Final Visual Verification Checklist

### Desktop

- [ ] At 1024 px and wider, credential and performance align in a 37/63 row without horizontal overflow.
- [ ] Stage breakdown and progress align as equal columns.
- [ ] Navigation stays in the desktop header.
- [ ] Credential never paints over the performance panel during either half of the flip.
- [ ] Hover changes only the sheen position/opacity and does not move or scale the card.

### Tablet

- [ ] Below 1024 px, credential stacks above performance.
- [ ] Portrait/details remain horizontal and balanced.
- [ ] Stage breakdown stacks above progress.
- [ ] Header navigation wraps below the top bar.

### Mobile

- [ ] At widths below 640 px, KPI metrics stack in one panel.
- [ ] Pricing values stack.
- [ ] Do/Never panels stack.
- [ ] Credential content remains readable without excessive height or clipped text.
- [ ] Raw-call table scrolls internally and does not widen the page.
- [ ] All full-card flip interactions work by tap.

### Themes and material

- [ ] Light mode retains clear page/card separation.
- [ ] Dark mode keeps semantic accent, positive, warning, and danger contrast.
- [ ] Credential stays warm, translucent, and readable in both app themes.
- [ ] Glass base is visibly translucent but does not expose distracting page detail.
- [ ] Top/left rim, bottom/right refraction, inset issuer line, and broad sheen are visible at normal size.
- [ ] Front and back have identical material, border, radius, and shadow alignment.
- [ ] Portrait remains crisp above the optical reflection.

### Identity and content states

- [ ] Canonical `Alex Chen` plus `rep_demo_alex` displays `/alex-chen.png`.
- [ ] Custom name mapped to Alex demo data displays the custom name and initials, never Alex's portrait.
- [ ] Non-Alex rep displays initials unless a real branch-owned mapping is added.
- [ ] Broken Alex image falls back to initials.
- [ ] Long names, roles, stage labels, and focus values wrap inside the credential rather than widening it.
- [ ] Front shows issuer, STAFF, identity, tenure, and focus.
- [ ] Back shows focus, weakest stage, attempts, and privacy note only.

### Interaction and accessibility

- [ ] Click and tap flip exactly 180 degrees in place.
- [ ] Enter and Space activate the credential.
- [ ] Focus ring is visible.
- [ ] Button label changes to describe the next side.
- [ ] Only the visible face is exposed as its description.
- [ ] With reduced motion enabled, no rotation or sheen transition runs.
- [ ] Card size and surrounding layout never change between sides.

### Data states

- [ ] Populated practice shows top metrics, chronological bars, legend, explanation, and history.
- [ ] Empty practice shows the compact message and no empty chart/table.
- [ ] Held and discounted bars/status pills match their text labels.
- [ ] Stage rows use actual rates; diagnosed primary stage alone receives the promoted row treatment.
- [ ] Sharing toggle displays saving, shared/private, and error states correctly.
- [ ] Raw call outcomes retain text labels as well as color.

## 21. Change Summary

| Area | Final change | Main files |
|---|---|---|
| Page story | Diagnosis → evidence → personal performance → action → weakness/progress → secondary evidence | `src/app/coach/page.tsx` |
| Semantic surfaces | Page-scoped accent, warning, positive, danger, progress, and privacy treatments | `src/app/coach/coach.module.css` |
| Readability | Larger conclusions/key values, quieter helper text, stronger grouping, reduced secondary-card weight | `page.tsx`, `coach.module.css` |
| Employee identity | Paired digital credential using authenticated display name while permitting seeded demo analytics | `page.tsx`, `EmployeeCredential.tsx` |
| Portrait | Canonical-Alex-only image with 4:5 cover crop and initials fallback | `EmployeeCredential.tsx`, `public/alex-chen.png` |
| Credential interaction | Accessible click/tap/keyboard 3D front/back flip with stable shared sizing | `EmployeeCredential.tsx`, `coach.module.css` |
| Credential containment | Layout wrapper owns perspective/clip/shadow; rotor transforms; grid-overlaid faces share dimensions | `coach.module.css` |
| Liquid glass | Warm translucent base, 22 px blur, layered rim/refraction, clipped specular reflection | `coach.module.css` |
| Performance | One cohesive three-metric panel with two warning-emphasized problem metrics | `page.tsx`, `coach.module.css` |
| Recommended action | Full-width pale-accent chapter with promoted play, pricing pair, and Do/Never columns | `page.tsx`, `coach.module.css` |
| Stage breakdown | Diagnosed weakest row promoted; other stages deliberately quieter | `page.tsx`, `coach.module.css` |
| Practice progress | Top metrics promoted; chart/history secondary; empty state compact | `ProgressPanel.tsx`, `coach.module.css` |
| Secondary evidence | Sharing compacted and raw calls collapsed/scrollable | `ShareControls.tsx`, `page.tsx`, `coach.module.css` |
| Shared shell/theme | Existing app navigation, typography tokens, semantic tokens, and theme behavior retained | `AppShell.tsx`, `AppHeader.tsx`, `globals.css`, `layout.tsx`, `ThemeProvider.tsx` |
