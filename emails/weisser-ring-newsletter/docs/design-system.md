# Design system

Every value here is read out of the Figma file (variables + `get_design_context`), not sampled by
eye. Define each one **once** in `<mj-attributes>` / `<mj-class>`; never inline a repeated value.

## Color

| Token (Figma) | Hex | Used for |
| --- | --- | --- |
| `WR Dunkelblau \| Markenfarbe` | `#002550` | Dark sections, button text on orange, CTA background on orange bands, footer copy, social glyphs |
| `WR Cyan \| Markenfarbe` | `#019DE2` | Cyan section background, social band, anniversary headline, lead-in line in the letter, footer logo tile |
| `WR Orange \| CTA` | `#FF7F00` | Orange bands, primary CTA background |
| `WR Weiß \| Markenfarbe` | `#FFFFFF` | Copy on dark/cyan, footer background |
| `WR Dunkelblau Verlauf` | `#1B2645` | Body copy on white (letter, stats labels) |

Note the split: copy on a white background is `#1B2645`, copy on a light gradient is `#002550`.
They are close but distinct — do not merge them.

The `wireframes/*` variables (`#074EE8`, `#E0EAFF`) are placeholder-artwork colors. They belong to
the pending image slot and must not appear in the build.

### Gradients

Four sections are radial gradients, not flat fills. Word-engine Outlook renders no CSS gradient,
so each ships as a **background image on `<mj-section>`** (the only component that emits Outlook
VML) plus a `background-color` fallback picked so the copy stays readable when images are blocked.

| Section | Gradient | Fallback color | File |
| --- | --- | --- | --- |
| Blue services (`4001:43`) | radial `#009EE0` → `#002550` | `#002550` | `bg-blue-services.jpg` |
| Light story (`4001:52`) | radial `#009EE0` → `#FFFFFF` | `#CDEAF8` | `bg-light-story.jpg` |
| Donation grid (`4001:129`) | radial `#18488D` → `#002550` | `#002550` | `bg-donation-grid.jpg` |
| Anniversary (`4001:142`) | radial `#1D9AD7` → `#FFFFFF`, origin below the section | `#FFFFFF` | `bg-anniversary.jpg` |

Always pair `background-url` with `background-color` **and** an explicit `background-size`.

Shipped as JPEG at 2x, not PNG — deliberate choice, overriding the usual banding concern on smooth
gradients. Export at high quality (90%+) to keep the banding invisible in practice; Outlook's VML
`background-url` accepts either format, so this is purely a quality trade-off, not a compatibility
one.

## Type

Two families, both Google Fonts, declared with `<mj-font>` and a real fallback stack:

| Family | Fallback stack | Used for |
| --- | --- | --- |
| Merriweather Sans | `'Trebuchet MS', Verdana, Arial, sans-serif` | Headings, buttons, donation amounts and tile labels, 9px legal print |
| Merriweather (serif) | `Georgia, 'Times New Roman', serif` | Body copy, bulleted lists, signature, address block, stats labels |

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
| Tile label | Merriweather Sans | Light 300 | 10px | 14px | -0.2px |
| Legal | Merriweather Sans | Light 300 | 9px | 13px | -0.2px |

`h1` is always **UPPERCASE** in the design; the copy in Figma is mixed case and the transform is
visual. Ship the copy uppercase in the markup — `text-transform` is unreliable in Outlook.

Line-heights are an implementation decision: Figma has every style except `h1` on "auto". The
values above are the email-safe equivalents; do not leave line-height unset.

Paragraph rhythm inside a text block is a bottom margin of 10px (headings, tiles) or 12px
(letter, address block), not an empty paragraph.

## Buttons

One shape, two color variants, no third style. 12px Merriweather Sans Bold, uppercase, with a
trailing ` →` as literal text (not an image, not an entity-only glyph).

| Variant | Background | Text | Where |
| --- | --- | --- | --- |
| Primary | `#FF7F00` | `#002550` | On blue, cyan and gradient sections |
| Inverse | `#002550` | `#FFFFFF` | On the two orange donation bands |

- Padding: `8px 14px`; two buttons with longer labels use `8px 10px`
  ("die ganze geschichte lesen", "mehr erfahren").
- Square corners — `border-radius: 0`.
- Rendered height is ~31px, **below the 44px tap-target minimum**. Bump vertical padding to 14px
  under the mobile media query; do not change the desktop metrics.

## Spacing

Vertical section padding comes from three tokens. Nothing else is used.

| Token | Value | Sections |
| --- | --- | --- |
| `top-bottom/S` | 24px | Orange bands, cyan section, U-Bahn, social band |
| `top-bottom/M` | 40px | Editorial letter, blue services, light story |
| `top-bottom/L` | 64px | Donation grid, anniversary |

Gaps between blocks inside a section: 8, 16, 20, 24, 32, 40 — see `docs/sections.md` per section.

## Recurring patterns

- **Section headline block** — `h1` then optional `h2`, both inside one `<mj-text>`; the 10px gap
  between them is a paragraph margin, not a spacer row.
- **Copy with bold runs** — German copy highlights key phrases with `Merriweather Bold` mid-sentence.
  Keep them as `<strong>` inside the same `<mj-text>`; never split into separate blocks.
- **CTA follows copy** — every CTA sits below its text block with the section's gap value, left
  aligned, except the donation grid (centred).
- **Donation band** — orange background, 4c `h2` in `#002550`, inverse CTA. It appears twice with
  different copy and identical styling; build it once as a pattern.
