# Section spec

13 sections, top to bottom. Figma node IDs are given so any measurement can be re-checked with
`get_design_context` / `get_metadata` against file `NYoVYVHcayedJTuoGv7IGa`.

Values are Figma values (601px frame). Build them at 600px per `docs/grid.md`.

---

## 1. Header — orange brand band · `4001:4`

Background `#FF7F00`, height 123. Absolutely placed, not auto-layout.

| Element | Asset | Size | Position |
| --- | --- | --- | --- |
| Wordmark + logo lockup | `herzenssache-weisser-ring.png` | 245×87 | x 30 (column 1), y 16 |
| Heart hands | `hands.svg` | 149×69 | x 422, y 23 |
| Tagline | live text | 249×17 | right edge at 571, baseline y ~94 |

Tagline: "Gemeinsam helfen. Menschen beistehen.", white, Merriweather Sans Bold, ~12px.
It is **live text**, not part of the artwork.

`herzenssache-weisser-ring.png` is the combined lockup.

Mobile: lockup, hands and tagline all stack full width and **centre** — logo centred, hands
centred below it, tagline centred below that. Short/symmetric brand elements (logo, icon
graphic, one-line caption), not body copy, so centring is the correct pattern here.

---

## 2. Hero · `4001:32`

Full-bleed image `hero.jpg`, 601×281, no padding, no overlay.

**The headline is baked into the image** ("Jedes Opfer hat eine Geschichte. / WIR SEHEN SIE.") —
this is the one deliberate exception to the live-text rule, because the type is composited into
the photography. It must therefore carry the full headline as `alt` text.

Mobile: scales to width. Check that the two faces are not cropped at 320px.

---

## 3. Editorial letter · `4001:34`

White background. Padding `40px 124px` (column 2 both sides → 4c content). Block gap 32px.

Copy: Merriweather Light 12px, `#1B2645`, paragraph margin 12px. One highlighted lead-in line at
14px `#019DE2` with "Jedes Opfer hat eine Geschichte – wir sehen sie" in Merriweather Bold.

Signature block (`4001:36`), gap 16px between the two columns:

| Element | Detail |
| --- | --- |
| Portrait | `person-photo.png`, 68×68, circular mask |
| Name | "Herzliche Grüße / Barbara Richstein", Merriweather Light 12px, black |
| Role | "Bundesvorsitzende", Merriweather Sans Light 9px |
| Logo | `logo.png` at 131×46 (same file as the footer logo, shown smaller here) — a logo image, **not** a button |

Mobile: signature block does **not** stack — portrait and name/role/logo stay side by side at
every width, aligned left with the letter body copy above it. Small enough to fit down to the
minimum supported viewport; wrapping it would break its visual tie to the paragraph it closes.
Build it as `<mj-group>` (columns inside a group never stack — see `docs/grid.md`), not two plain
columns.

---

## 4. Blue services · `4001:43`

Radial gradient `#009EE0` → `#002550`, fallback `#002550`. Padding `40px 30px 40px 0` — content is
**right-aligned**, 354 wide, starting at column 3. Block gap 24px.

- `h1` white: "HILFE, WENN DAS LEBEN AUS DER BAHN GERÄT"
- `h2` white: "Unsere Hilfe umfasst unter anderem:"
- Bulleted list, 6 items, Merriweather Light 12px white, bold runs on the key phrase of each item,
  5px between items. Build as a real `<ul>` inside one `<mj-text>`.
- Primary CTA "unser hilfsangebot →" → `https://weisser-ring.de`

Mobile: full width, section padding 30px both sides. Bulleted list is body copy — switch to
**left**-align on mobile; the desktop right-align is a layout choice against the background
graphic, not a rule that should carry to a stacked, full-width list.

---

## 5. Orange donation band #1 · `4001:48`

Background `#FF7F00`. Padding `24px 124px` (4c). Gap 16px.

- `h2` `#002550`: "Unsere Hilfe ist nur möglich, weil Menschen sie mit ihrer Spende ermöglichen."
- Inverse CTA "jetzt spenden →" → `https://spenden.weisser-ring.de`

---

## 6. Light story · `4001:52`

Radial gradient `#009EE0` → `#FFFFFF`, fallback `#CDEAF8`. Padding `40px 30px`, gutter 20px.

| Column | Span | Content |
| --- | --- | --- |
| Left | 2c (167×199) | `person-illustration.png` |
| Right | 4c (353) | Copy, block gap 24px |

- `h1` `#002550`: "HINTER JEDER STRAFTAT STEHT EIN MENSCH"
- `h2` `#002550`: „Ich lebe jetzt mein Leben“ — keep the German typographic quotes
- Two body paragraphs, 12px, bold run on "Franziska P."
- Primary CTA "die ganze geschichte lesen →" (padding `8px 10px`)
  → `https://wr-magazin.de/themen/wir-geben-nicht-auf/`

Mobile: illustration above copy, **centred** — it's a standalone graphic on its own row, not
body text. Copy block stays left-aligned (headings, paragraphs, CTA) — it's multi-line body
copy, the case centring is wrong for.

---

## 7. Cyan "jedes opfer" · `4001:122`

Flat `#019DE2`. Padding `24px 0 24px 30px` — image **bleeds through the right margin**, gutter
20px. Mirror of section 10's one-sided padding (`CLAUDE.md` — "those sections set horizontal
padding on one side only"), zero on the side the image bleeds through.

| Column | Span | Content |
| --- | --- | --- |
| Left | 3c (261) | Copy, gap 16px |
| Right | 290×215 | `story-photo.jpg` — placeholder, final photo pending |

- `h1` white: "JEDES OPFER HAT EINE GESCHICHTE"
- Body 12px white, bold run on "Collien Monica Fernandes"
- Primary CTA "mehr erfahren →" (padding `8px 10px`) → `#` — no matching page found on
  weisser-ring.de, swap once the real link is supplied

Designer annotation: "bis dahin erstmal nur der Platzhalter" — this is a still **image**, not a
video. Ship `story-photo.jpg` at 290×215 now; the final photo replaces the same filename later,
no markup change.

Mobile: copy above image. Copy stays left-aligned (multi-line body text). Image is a standalone
graphic — **centred**, full width, aspect ratio kept. The desktop bleed (`padding-right: 30px
padding-left: 0`) does not carry to mobile: switch to the standard symmetric `30px`/`30px` (see
"Mobile margin" in `docs/grid.md`) so the image sits inside the normal margin instead of running
off the screen edge.

---

## 8. Donation grid · `4001:129`

Radial gradient `#18488D` → `#002550`, fallback `#002550`. Padding `64px 30px`, 6c content,
block gap 40px, everything centred.

- `h1` white centred, two lines: "IHRE UNTERSTÜTZUNG / MACHT HILFE MÖGLICH"
- `h2` white centred: "Schon kleine Beträge helfen ganz konkret:"
- 5 tiles, each 2c (167) wide, row gap 20px, gutter 20px:
  - row 1 — 20€, 35€ — centred, 354 wide, starting at column 2
  - row 2 — 85€, 130€, 550€ — full 6c
  - amount: Merriweather Sans ExtraBold 30px white, 3px below it the label at 10px
- Primary CTA "So wirkt Ihre Spende →" centred — **link pending**

Mobile (see the 2×2 trick in `docs/grid.md`): row 1 stays 2-up; row 2 becomes 2 + 1.

---

## 9. Anniversary · `4001:142`

Radial gradient `#1D9AD7` → `#FFFFFF` rising from below, fallback `#FFFFFF`. Padding `64px 30px`,
block gap 40px, centred.

Headline block, 413 wide centred (grid exception), gap 16px:

- `logo-anniversary.png`, 78×68
- `h1` `#019DE2` centred: "SEIT 50 JAHREN AN DER SEITE / VON KRIMINALITÄTSOPFERN"
- `h2` `#002550` centred: "Der WEISSE RING ist Deutschlands größte Hilfsorganisation für Opfer
  von Kriminalität."

4-up stats row, 6c wide, 4 × 120.25, gutter 20px, icon-to-label gap 8px:

| Icon | Size | Label (Merriweather Light 12px, `#1B2645`, centred) |
| --- | --- | --- |
| `buildings-icon.png` | 30×30 | über 400 Außenstellen bundesweit |
| `heart-icon.png` | 30×25 | rund 3.000 ehrenamtlich Engagierte |
| `chat-icon.png` | 30×30 | bundesweite Opfer-Telefon-Hotline 116 006 (täglich von 7 bis 22 Uhr) |
| `handshake-icon.png` | 32×32 | unabhängig und überwiegend spendenfinanziert |

Icons are top-aligned, labels are not equal height — set `vertical-align="top"` on **every**
column in the section.

Mobile: 2×2.

---

## 10. U-Bahn campaign · `4001:165`

Flat `#002550`. Padding `24px 30px 24px 0` — image **bleeds through the left margin**, gutter 20px.

| Column | Span | Content |
| --- | --- | --- |
| Left | 290×215 | `u-bahn-photo.jpg` |
| Right | 3c (260) | Copy, vertically centred |

- `h2` white: "Jede Geschichte verdient / jemanden, der hinsieht." (5px below it)
- Body Merriweather Light **14px** white — the only 14px body copy in the design

Mobile: image above copy, **centred**, full width — standalone graphic. Copy stays left-aligned
(multi-line body text). The desktop bleed (`padding-left: 0`) does not carry to mobile: switch to
the standard symmetric `30px`/`30px` (see "Mobile margin" in `docs/grid.md`).

---

## 11. Orange donation band #2 · `4001:168` / `4001:169`

Identical styling to section 5. Copy: "Jede Spende trägt dazu bei, dass Betroffene nach einer
Straftat nicht allein bleiben." Inverse CTA "jetzt spenden →".

---

## 12. Social band · `4001:173`

Cyan `#019DE2`, height ~157. Padding `24px`, text 576 wide centred.

Three lines of white copy: "Ihnen gefällt unser Newsletter?" (bold), "Leiten Sie ihn gerne an
Bekannte oder Kolleg:innen weiter!", "Und bleiben Sie mit uns in Verbindung:".

Icon row centred, 96 wide, **24px gaps**, glyphs filled `#002550`:

| Icon | Size |
| --- | --- |
| `fb-icon.svg` | 10×20 |
| `inst-icon.svg` | 21×21 |
| `linkedin-icon.png` | 18×18 |

Heights differ — export onto a common canvas so the row aligns optically. Build with plain
`<img>` inline in one `<mj-text>`/column, each wrapped in its own `<a>` with `padding: 0 12px` and
`min-width: 22px` (tap-target floor), not margin on the `<img>` — Outlook's Word engine handles
padding on inline `<a>` more reliably than margin, and it keeps the gap on the link itself rather
than only around the icon. Not `<mj-social>` (its bundled icons do not match) and not a group (a
group would spread them across the width).

---

## 13. Footer · `4001:179`

White. Absolutely placed in Figma; rebuild as ordinary stacked rows.

| Block | Position | Detail |
| --- | --- | --- |
| Logo tile | x 404 (column 5), y ~22 | `logo.png`, 167×59, right-aligned |
| Unsubscribe line | x 30, y 107 | 9px, "hier abmelden" underlined — **link pending** |
| Publisher block | below it, 542 wide | 12px, labels ("Herausgeber:", "Telefon:", "E-Mail:", "Internet:") in Merriweather Bold, values in Light |
| Legal block | x 28, y 300, 450 wide | 9px Merriweather Sans, 2px paragraph margins |

Links: `mailto:newsletter@weisser-ring.de`, `http://www.weisser-ring.de`,
`https://weisser-ring.de/datenschutzerklaerung`.

All footer copy is `#002550`.

Mobile: logo centres above the text blocks.

---

## Pending items

| Item | Section | Status |
| --- | --- | --- |
| `story-photo.jpg` final photo | 7 | placeholder shipped at 290×215 — swap same filename when delivered |
| CTA link "mehr erfahren" | 7 | no matching page found on weisser-ring.de — shipped as `#` |
| CTA link "So wirkt Ihre Spende" | 8 | no matching page found on weisser-ring.de — shipped as `#` |
| Unsubscribe link | 13 | ESP merge tag, not a static page — shipped as `#` until the ESP supplies it |
