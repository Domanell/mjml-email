# CLAUDE.md — weisser-ring-newsletter-2

Guidance specific to this email. Repo-wide rules (toolchain, general MJML/asset rules, how to use
skills) are in the root `CLAUDE.md` — read that first if you haven't.

## What this email is

The WEISSER RING #2 fundraising newsletter, German language, built from a Figma design.

It reuses the section patterns of `emails/weisser-ring-newsletter` (header, letter, light story,
donation grid, orange band, social band, CTA buttons). Reuse the existing MJML for every pattern;
only content, section order and the notice block are specific to this email.

Deliver both files: `weisser-ring-newsletter-2.mjml` (source) and the compiled
`weisser-ring-newsletter-2.html`.

## Sources of truth

In this order. When two disagree, the higher one wins.

1. **Figma** — file `UM2JFsxQQmfZck3zO04J9P`, node `2267:55`
   ([link](https://www.figma.com/design/UM2JFsxQQmfZck3zO04J9P/WR-Fundraising-Newsletter-Coding--Copy-?node-id=2267-55&t=JDMxZwQPtdscyyJT-0)).
2. **`docs/`** (this folder) — design values and build rules. Read these instead of re-deriving
   anything.
3. **`design.jpg`** (601×2349), **`assets/`** and **`text.txt`** (verbatim German copy) — the
   checked-in baseline. Use for a visual check and for copy.

### Working with Figma

The Figma call limit is 10. **Never open Figma on own initiative.** Call it only when the user
explicitly asks. Everything else comes from `docs/`, `design.jpg`, `assets/` and `text.txt`. When asked, request the smallest node that answers the
question, one call per need.

## Required reading

| Read this                                  | Before                                                    |
| ------------------------------------------ | --------------------------------------------------------- |
| `docs/grid.md`                             | placing anything — every width and offset is a grid value |
| `docs/design-system.md`                    | writing colors, type, buttons or spacing                  |
| `docs/sections.md`                         | building or editing any section                           |
| skill `email-html-mjml` (root `CLAUDE.md`) | writing or editing any MJML                               |

**Its dark-mode pattern does not apply here.**

## Hard rules

- **Content and section order only.** The section styles in the current MJML are final and tested.
  Do not change the styles, spacing, classes, `mj-attributes` or media queries of an existing
  section. Only swap copy and images, add, remove or reorder sections, and build the notice block.
- **Reuse, do not rebuild.** Buttons, section wrappers, `mj-class` definitions, the light-story
  gradient, the donation-grid background and the social row exist in the current MJML. Copy and
  edit them.
- **Grid before eyeball.** Resolve any measurement against the 6-column grid first
  (30px margin, 20px gutter, 73.33px column). 167 / 260 / 353 / 540 are spans, not arbitrary widths.
- **Define once.** The two heading scales, the two CTA variants and the three section-padding steps
  go in `<mj-attributes>` / `<mj-class>`. No repeated inline value.
- **Mobile is mandatory.** Verify every section at 320px and 375px, not only at 600px. No horizontal
  scroll. Tap targets ≥ 44px on every CTA. Rows that must not stack go in `<mj-group>`; rows that
  must reflow use groups (see `docs/grid.md`).
- **No dark mode.** Light palette everywhere. No `prefers-color-scheme` blocks, no logo swaps.
- **Live text.** All copy is real text, with three designed exceptions, each carrying its copy as
  `alt`: the hero headline and the volunteer caption are composited into `hero.jpg`, and the
  "Jetzt spenden!" donate badge is composited into `heart-button.png` (heart shape not
  reproducible as live HTML across clients).
- **German copy verbatim** from `text.txt`. Preserve umlauts, `ß` and typographic quotes exactly.
  `[NN*]` in the notice block is a literal placeholder, shipped as written. Set `lang="de"` on
  `<mjml>`, plus `<mj-title>` and `<mj-preview>`.
- **Client targets:** Outlook 2016–365 (Word engine) and Outlook.com, Gmail web/app, Apple Mail
  (macOS/iOS), major mobile clients. Nothing older than 2016.

### MJML constraints that bite this design

- Section background images emit Outlook VML only on `<mj-section>` and `<mj-hero>`. The donation
  grid ships its radial gradient as a background JPEG + `background-color` fallback + explicit
  `background-size`. The two light-story sections use a CSS gradient on a class with a flat
  `background-color` fallback (see `docs/design-system.md`).
- If any column in a section sets `vertical-align`, every column in that section must set it too.
  This applies to both light-story rows.
- The donate badge (`heart-button.png`, 86×68) lives as its own 93px column in the
  **editorial-letter** section, which runs right-to-left (`direction="rtl"`) so the badge sits at
  the top right next to the text column. It is not positioned with `position: absolute`, which no
  email client supports reliably.

## Assets

`assets/` holds exports for a 600px body (files are 2× unless noted); `assets/original/` holds the
raw exports these were produced from (not used by the build — reference only).

| File                            | Format                               | File size | Render size | Slot                                                                    |
| ------------------------------- | ------------------------------------ | --------- | ----------- | ----------------------------------------------------------------------- |
| `herzenssache-weisser-ring.png` | PNG (transparency)                   | 490×174   | 245×87      | Header lockup (wordmark + logo, one file)                               |
| `hands.png`                     | PNG (transparency)                   | 298×138   | 149×69      | Header heart-hands                                                      |
| `hero.jpg`                      | JPEG (photo)                         | 1202×240  | 600×120     | Hero, headline and volunteer caption baked in                           |
| `heart-button.png`              | PNG (transparency)                   | 172×136   | 86×68       | Donate badge in the letter, "Jetzt spenden!" baked in                   |
| `person-photo.png`              | PNG (alpha circle mask)              | 136×136   | 68×68       | Signature portrait (Barbara Richstein)                                  |
| `logo.png`                      | PNG (transparency)                   | 334×118   | 131×46      | Letter signature logo                                                   |
| `person-illustration.png`       | PNG (transparency)                   | 334×398   | 167×199     | Light story #1 illustration                                             |
| `person-illustration-2.png`     | PNG (transparency)                   | 334×356   | 167×178     | Light story #2 illustration                                             |
| `bg-donation-grid.jpg`          | JPEG (gradient, export ≥90% quality) | 1202×952  | 601×476     | Donation grid background                                                |
| `butoon-arrow-icon.png`         | PNG (transparency)                   | 16×15     | 8×8         | CTA arrow on primary (orange) buttons                                   |
| `butoon-arrow-icon-inverse.png` | PNG (transparency)                   | 16×15     | 8×8         | CTA arrow on inverse (dark blue) buttons                                |
| `fb-icon.png`                   | PNG (transparency)                   | 20×39     | 10×20       | Social row, glyph `#002550`                                             |
| `inst-icon.png`                 | PNG (transparency)                   | 42×42     | 21×21       | Social row, glyph `#002550`                                             |
| `linkedin-icon.png`             | PNG (transparency)                   | 35×35     | 18×18       | Social row, glyph `#002550`                                             |

The file name `butoon-arrow-icon*.png` is spelled as exported; keep it so existing URLs stay valid.

General image export rules (2×, format, `alt`, hosted URLs) are covered by the `email-html-mjml`
skill — those apply here unchanged.

## Open decisions

These deviate from the design on purpose, for email legibility and accessibility. Confirm with the
user before shipping.

| Design value                  | Ship as                                    | Why                                                            |
| ----------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| Body copy 12px                | 12px desktop, **14px below 480px**         | Design minimum is 12px; 14px is the mobile floor for body copy |
| Tile labels / notice 10px     | 10px desktop, **12px below 480px**         | Same reason, on the smallest text in the design                |
| CTA height ~31px              | 31px desktop, **≥44px below 480px**        | Tap-target minimum; achieved with vertical padding only        |
| Line-height "auto"            | Explicit values in `docs/design-system.md` | Clients disagree on `normal`                                   |

## Pending items

| Item                           | Status                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Unsubscribe link               | The notice says the link is at the end of the mail; no footer exists in the design. |
| `[NN*]` merge value            | Shipped as the literal placeholder until the sender supplies the name.              |
