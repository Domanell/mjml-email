# CLAUDE.md — weisser-ring-newsletter

Guidance specific to this email. Repo-wide rules (toolchain, general MJML/asset rules, how to use
skills) are in the root `CLAUDE.md` — read that first if you haven't.

## What this email is

The WEISSER RING e.V. fundraising newsletter, German language, built from a Figma design.

Deliver both files: `weisser-ring-newsletter.mjml` (source) and the compiled
`weisser-ring-newsletter.html`.

## Sources of truth

In this order. When two disagree, the higher one wins.

1. **Figma** — file key `NYoVYVHcayedJTuoGv7IGa`, root node `4001:3`
   ([link](https://www.figma.com/design/NYoVYVHcayedJTuoGv7IGa/WR-Fundraising-Newsletter-08.2026-Abgabe--Copy-?node-id=4001-3)).
   Reachable through the Figma MCP server: `get_variable_defs` for tokens, `get_design_context` for
   a section's exact styles, `get_metadata` for geometry, `get_screenshot` to re-render,
   `download_assets` to export. Node IDs for every section are in `docs/sections.md`.
2. **`docs/`** (this folder) — the design extracted from Figma and translated into build rules.
   Written from the live file, not from eyeballing. Read these instead of re-deriving anything.
3. **`design.jpg`** (602×4130) and **`assets/`** — the checked-in baseline. Use for a visual check.

`get_design_context` requires the `figma-design-to-code` skill to be loaded first — read the MCP
resource `skill://figma/figma-design-to-code/SKILL.md` if the skill is not installed locally.

## Required reading

| Read this | Before |
| --- | --- |
| `docs/grid.md` | placing anything — every width and offset is a grid value |
| `docs/design-system.md` | writing colors, type, buttons or spacing |
| `docs/sections.md` | building or editing any section |
| skill `email-html-mjml` (root `CLAUDE.md`) | writing or editing any MJML |

`weisser-ring-newsletter.mjml` is the closest structural match to the skill's strict-clean
templates. **Its dark-mode pattern does not apply here.**

## Hard rules

- **Pixel-faithful.** Match layout, spacing, type scale and color. Do not add sections, do not
  restyle, do not "improve". Do not invent a value that Figma already defines.
- **Grid before eyeball.** Resolve any measurement against the 6-column grid first
  (30px margin, 20px gutter, 73.33px column). 167 / 260 / 353 / 540 are spans, not arbitrary widths.
- **Define once.** The two heading scales, the two CTA variants and the three section-padding steps
  go in `<mj-attributes>` / `<mj-class>`. No repeated inline value.
- **Mobile is mandatory.** Verify every section at 320px and 375px, not only at 600px. No horizontal
  scroll. Tap targets ≥ 44px on every CTA. Rows that must not stack go in `<mj-group>`; rows that
  must reflow 4→2×2 use two groups of two (see `docs/grid.md`).
- **No dark mode.** Light palette everywhere. No `prefers-color-scheme` blocks, no logo swaps.
- **Live text.** All copy is real text, with two designed exceptions: the hero headline is
  composited into `hero.jpg`, and the "Jetzt spenden!" donate badge is composited into
  `heart-button.png` (heart shape not reproducible as live HTML across clients) — both carry the
  copy as `alt`.
- **German copy verbatim.** Preserve umlauts, `ß` and the typographic quotes „…" exactly. Set
  `lang="de"` on `<mjml>`, plus `<mj-title>` and `<mj-preview>` — the design has no in-body
  preheader bar, so the inbox preview line comes from `<mj-preview>` alone.
- **Client targets:** Outlook 2016–365 (Word engine) and Outlook.com, Gmail web/app, Apple Mail
  (macOS/iOS), major mobile clients. Nothing older than 2016.

### MJML constraints that bite this design

- Section background images emit Outlook VML only on `<mj-section>` and `<mj-hero>`. Four sections
  are radial gradients and must ship as a background PNG + `background-color` fallback + explicit
  `background-size` (list in `docs/design-system.md`).
- If any column in a section sets `vertical-align`, every column in that section must set it too.
  This applies to the 4-up stats row and both image/copy rows.
- Two sections have a 290px image that bleeds through the outer margin — those sections set
  horizontal padding on one side only.
- The donate badge (`heart-button.png`, 86×68) lives as its own 187px column in the
  **editorial-letter** section (next to the 353px text column), not inside the Hero. It overlaps the
  Hero/editorial-letter seam via `margin-top: -21px; margin-bottom: -47px;` on its `<img>`
  (`.hero-badge` class, in `<mj-style>`) — not `position: absolute`, which no email client supports
  reliably. The compensating `margin-bottom` keeps its own column's flow height at zero so the badge
  doesn't push anything below it down. If the `<style>` block is ever stripped (e.g. a forwarded
  Outlook message), the badge falls back to sitting in normal flow at the top of its column, next to
  the letter's opening line — not a stray element floating between two sections.
- Below 480px, columns stack full-width in source order (text, then badge) and the overlap would
  land on real copy, so `.hero-badge img { margin-top: 0; margin-bottom: 0; }` in the
  `max-width: 480px` `<mj-style>` block kills the overlap instead of padding around it: the badge
  just renders as a normal image below the letter text, no collision, no padding hack needed.

## Assets

`assets/` holds 1× exports for a 600px body; `assets/original/` holds the raw exports these were
produced from (not used by the build — reference only, not a rebuild dependency).

| File | Format | 1× size | 2× size | Slot | Figma node |
| --- | --- | --- | --- | --- | --- |
| `herzenssache-weisser-ring.png` | PNG (transparency) | 245×87 | 490×174 | Header lockup (wordmark + logo, one file) | `4001:4` |
| `hands.png` | PNG (transparency) | 149×69 | 298×138 | Header heart-hands | `4001:4` |
| `person-illustration.png` | PNG (transparency) | 167×199 | 334×398 | Light-story illustration | `4001:52` |
| `buildings-icon.png` | PNG (transparency) | 30×30 | 60×60 | 4-up stats icon | `4001:142` |
| `heart-icon.png` | PNG (transparency) | 30×25 | 60×50 | 4-up stats icon | `4001:142` |
| `chat-icon.png` | PNG (transparency) | 30×30 | 60×60 | 4-up stats icon | `4001:142` |
| `handshake-icon.png` | PNG (transparency) | 32×32 | 64×64 | 4-up stats icon | `4001:142` |
| `fb-icon.png` | PNG (transparency) | 10×20 | 20×40 | Social row, glyph `#002550` | `4001:173` |
| `inst-icon.png` | PNG (transparency) | 21×21 | 42×42 | Social row, glyph `#002550` | `4001:173` |
| `linkedin-icon.png` | PNG (transparency) | 18×18 | 36×36 | Social row, glyph `#002550` | `4001:173` |
| `person-photo.png` | PNG (alpha circle mask) | 68×68 | 136×136 | Signature portrait (Barbara Richstein) | `4001:36` |
| `logo.png` | PNG (transparency) | 167×59 | 334×118 | Same logo used twice: footer at 167×59, letter signature at 131×46 (`width` set smaller, same file) | `4001:179` |
| `logo-anniversary.png` | PNG (transparency) | 78×68 | 156×136 | Anniversary logo | `4001:142` |
| `hero.jpg` | JPEG (photo) | 601×281 | 1202×562 (optional) | Hero, headline baked in | `4001:32` |
| `heart-button.png` | PNG (transparency) | 86×68 | 172×136 | Donate CTA badge, straddles Hero/editorial-letter seam, "Jetzt spenden!" baked in | `4090:58` |
| `u-bahn-photo.jpg` | JPEG (photo) | 290×215 | 580×430 | U-Bahn section, bleeds left | `4001:165` |
| `story-photo.jpg` | JPEG (photo) | 290×215 | 580×430 (when final photo lands) | Section 7 image — **placeholder**, final photo pending | `4001:122` |
| `bg-blue-services.jpg` | JPEG (gradient, export ≥90% quality) | — | matches section box, ×2 | Blue services background | `4001:43` |
| `bg-light-story.jpg` | JPEG (gradient, export ≥90% quality) | — | matches section box, ×2 | Light story background | `4001:52` |
| `bg-donation-grid.jpg` | JPEG (gradient, export ≥90% quality) | — | matches section box, ×2 | Donation grid background | `4001:129` |
| `bg-anniversary.jpg` | JPEG (gradient, export ≥90% quality) | — | matches section box, ×2 | Anniversary background | `4001:142` |

- The 290×215 image in section 7 (`story-photo.jpg`) is a still photo, not a video — the design
  annotation calls it "ein Standbild". It is not delivered yet; build with a placeholder at the
  correct size, shipping the real one is a same-filename swap. Pending items are listed at the
  end of `docs/sections.md`.

General image export rules (2×, format, `alt`, hosted URLs) are covered by the `email-html-mjml`
skill — those apply here unchanged.

## Open decisions

These deviate from the design on purpose, for email legibility and accessibility. Confirm with the
user before shipping.

| Design value | Ship as | Why |
| --- | --- | --- |
| Body copy 12px | 12px desktop, **14px below 480px** | Design minimum is 12px; 14px is the mobile floor for body copy |
| Tile labels 10px, legal 9px | 10/9 desktop, **12/11 below 480px** | Same reason, on the smallest text in the design |
| CTA height ~31px | 31px desktop, **≥44px below 480px** | Tap-target minimum; achieved with vertical padding only |
| Line-height "auto" | Explicit values in `docs/design-system.md` | Clients disagree on `normal` |
