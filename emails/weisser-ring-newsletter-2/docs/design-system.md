# Design system

Values come from the Figma design and, for the notice block, from measurements of
`design.jpg`. Define each one **once** in `<mj-attributes>` / `<mj-class>`; never inline a repeated value.

## Color

| Token (Figma) | Hex | Used for |
| --- | --- | --- |
| `WR Dunkelblau \| Markenfarbe` | `#002550` | Dark sections, button text on orange, CTA background on orange bands, notice text, social glyphs |
| `WR Cyan \| Markenfarbe` | `#019DE2` | Social band, lead-in lines (letter, light story), notice link line |
| `WR Orange \| CTA` | `#FF7F00` | Orange bands, primary CTA background |
| `WR Weiß \| Markenfarbe` | `#FFFFFF` | Copy on dark/cyan |
| `WR Dunkelblau Verlauf` | `#1B2645` | Body copy on white (letter) |

Note the split: letter body copy on white is `#1B2645`; copy on a light gradient, on orange and
in the notice block is `#002550`.
They are close but distinct — do not merge them.

The `wireframes/*` variables (`#074EE8`, `#E0EAFF`) are placeholder-artwork colors. They belong to
the pending image slot and must not appear in the build.

### Gradients

Word-engine Outlook renders no CSS gradient, so every gradient section has a flat
`background-color` fallback picked so the copy stays readable.

| Section | Gradient | Fallback color | Implementation |
| --- | --- | --- | --- |
| Donation grid | radial `#18488D` → `#002550` | `#002550` | background image `bg-donation-grid.jpg` on `<mj-section>` (the only component that emits Outlook VML) |
| Light story (both) | linear 129.56° `#009EE0` → `#FFFFFF` | `#EAF8FF` | CSS `linear-gradient` on the `.bg-light-story` class |

Always pair `background-url` with `background-color` **and** an explicit `background-size`.

Shipped as JPEG at 2x, not PNG — deliberate choice, overriding the usual banding concern on smooth
gradients. Export at high quality (90%+) to keep the banding invisible in practice; Outlook's VML
`background-url` accepts either format, so this is purely a quality trade-off, not a compatibility
one.

## Type

Two families, both Google Fonts, declared with `<mj-font>` and a real fallback stack:

| Family | Fallback stack | Used for |
| --- | --- | --- |
| Merriweather Sans | `'Trebuchet MS', Verdana, Arial, sans-serif` | Headings, buttons, donation amounts and tile labels, notice block, 9px role line |
| Merriweather (serif) | `Georgia, 'Times New Roman', serif` | Body copy, lead-ins, signature |

Body copy is the serif; anything that shouts is the sans. Bold runs inside a paragraph switch to
`Merriweather Bold` — same family, heavier weight, never a different family.

### Scale

Letter-spacing is `-2%` of the font size everywhere.

| Role | Family | Weight | Size | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- |
| `h1` | Merriweather Sans | ExtraBold 800 | 26px | 30px | -0.52px |
| `h2` | Merriweather Sans | Bold 700 | 18px | 22px | -0.36px |
| Amount | Merriweather Sans | ExtraBold 800 | 30px | 34px | -0.6px |
| Lead-in | Merriweather | Bold 700 | 14px | 21px | -0.28px |
| Body | Merriweather | Light 300 | 12px | 18px | -0.24px |
| Tile label, notice | Merriweather Sans | Light 300 (notice link line: Bold 700) | 10px | 14px | -0.2px |
| Role (signature) | Merriweather Sans | Light 300 | 9px | 13px | -0.2px |
| Band body | Merriweather | Light 300 | 14px | 18px | -0.28px |

`h1` is always **UPPERCASE** in the design; the copy in Figma is mixed case and the transform is
visual. Ship the copy uppercase in the markup — `text-transform` is unreliable in Outlook.

Line-heights are an implementation decision: Figma has every style except `h1` on "auto". The
values above are the email-safe equivalents; do not leave line-height unset.

Paragraph rhythm inside a text block is a bottom margin of 10px (headings, tiles) or 12px
(letter, address block), not an empty paragraph.

## Buttons

One shape, two color variants, no third style. 12px Merriweather Sans Bold, uppercase, with a
trailing arrow image (`butoon-arrow-icon.png` on primary, `butoon-arrow-icon-inverse.png` on
inverse, rendered 8×8, `margin-left: 4px`, empty `alt`), as built in the current MJML.

| Variant | Background | Text | Where |
| --- | --- | --- | --- |
| Primary | `#FF7F00` | `#002550` | Letter, donation grid, light story #2 |
| Inverse | `#002550` | `#FFFFFF` | Orange band |

- Padding: `8px 14px`; the long label "JETZT SPENDEN UND HILFE MÖGLICH MACHEN" uses `8px 10px`.
- Square corners — `border-radius: 0`.
- Rendered height is ~31px, **below the 44px tap-target minimum**. Bump vertical padding to 14px
  under the mobile media query; do not change the desktop metrics.

## Spacing

Vertical section padding comes from three tokens. Nothing else is used.

| Token | Value | Sections |
| --- | --- | --- |
| `top-bottom/S` | 24px | Orange band, social band |
| `top-bottom/M` | 40px | Editorial letter, light story (both) |
| `top-bottom/L` | 64px | Donation grid |

The notice block is the only section outside these tokens: ≈15px top and bottom.

Gaps between blocks inside a section: 8, 16, 20, 24, 32, 40 — see `docs/sections.md` per section.

## Recurring patterns

- **Section headline block** — `h1` then optional `h2`, both inside one `<mj-text>`; the 10px gap
  between them is a paragraph margin, not a spacer row.
- **Copy with bold runs** — German copy highlights key phrases with `Merriweather Bold` mid-sentence.
  Keep them as `<strong>` inside the same `<mj-text>`; never split into separate blocks.
- **CTA follows copy** — every CTA sits below its text block with the section's gap value, left
  aligned, except the donation grid (centred).
- **Light story** — illustration (2c) + copy (4c), CSS-gradient background. It appears twice with
  different copy and a different illustration; build it once as a pattern.
- **Lead-in** — one Merriweather Bold 14px `#019DE2` paragraph inside body copy (letter, both light
  stories).
