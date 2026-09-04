# Grid

The whole design is laid out on one 6-column grid. Almost every width, x-offset and section
padding in the Figma file is a grid value, not an eyeballed number. Resolve every measurement
against this table **before** measuring anything off `design.jpg`.

## Constants

| Token | Figma name | Value |
| --- | --- | --- |
| Body width | frame `Newsletter final` | 601px in Figma → **build at 600px** |
| Outer margin | `New group/Column-0` | 30px |
| Content width | — | 540px (Figma 541) |
| Columns | — | 6 |
| Gutter | — | 20px |
| Column width | — | 73.33px (Figma 73.5) |
| Column pitch | — | 93.33px (column + gutter) |

Figma is 1px wider than the build target. Drop the odd pixel at the right margin; never scale
the design to fit.

## Column lines

x-offset of each column's left edge, measured from the left body edge:

| Column | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Figma x | 30 | 123.5 | 217 | 310.5 | 404 | 497.5 |
| Build x | 30 | 123.33 | 216.67 | 310 | 403.33 | 496.67 |

`New group/Column-1` = 124 is the column-2 line. It is used as the left **and** right padding of
the editorial letter and both orange donation bands, which therefore run 4 columns wide.

## Span widths

| Span | 1c | 2c | 3c | 4c | 5c | 6c |
| --- | --- | --- | --- | --- | --- | --- |
| Figma | 73.5 | 167 | 260.5 | 354 | 447.5 | 541 |
| Build | 73.33 | 166.67 | 260 | 353.33 | 446.67 | 540 |

Seen in the design as: 353/354 = 4c (letter, blue section, orange bands), 261 = 3c (cyan
section copy), 260 = 3c (U-Bahn copy), 167 = 2c (person illustration, every donation tile),
541 = 6c (donation block, stats row).

## Bleed

An image sized **290px** is 3 columns *plus the 30px outer margin* — it runs off the body edge:

- cyan "jedes opfer" section — image bleeds through the **right** margin
- U-Bahn section — image bleeds through the **left** margin

Both sections therefore set padding on one side only (`padding-right: 30px` / `padding-left: 0`).

## Grid exceptions

Three blocks are not column-aligned. Do not try to force them onto the grid:

| Block | Width | Rule |
| --- | --- | --- |
| Anniversary headline block | 413px, centred | max-width for the centred text, `(601-413)/2 = 94` |
| 4-up stats row | 4 × 120.25 | content width split in quarters minus gutters: `(541 - 3×20) / 4` |
| Header lockup / hands | 245×87 / 149×69 | absolutely placed inside the orange band |

## MJML mapping

Body: `<mj-body width="600px">`.

Section horizontal padding equals the outer margin (`padding-left="30px" padding-right="30px"`)
unless the section bleeds.

MJML columns have no gap, so the 20px gutter is carried **inside** the columns. Two working
patterns:

**Explicit widths** — column width = span + gutter, gutter re-declared as padding:

```xml
<!-- 2c image + 4c copy, gutter between them -->
<mj-column width="187px" padding-right="20px">…</mj-column>  <!-- content 167px -->
<mj-column width="353px">…</mj-column>
```

`187 + 353 = 540` ✔

**Padded section** — for evenly split rows, shrink the section padding by half a gutter and give
every column `padding="0 10px"`. The outer 10px inset restores the 30px margin exactly:

```xml
<!-- 4-up stats: section padding 20 → inner 560 → 4 × 140 → content 120, gaps 20 -->
<mj-section padding-left="20px" padding-right="20px">
  <mj-group>
    <mj-column width="25%" padding="0 10px">…</mj-column>
    …
  </mj-group>
</mj-section>
```

First content edge lands at `20 + 10 = 30`, last at `600 - 20 - 10 = 570`. Same trick for the
3-up donation row (`33.33%`, content 166.67 ✔) and the centred 2-up row
(`padding-left/right="114px"`, `50%`, first content edge at 124 = column 2 ✔).

## Responsive

Breakpoint: `<mj-breakpoint width="480px" />` (MJML default). Below it, columns in a section stack
to full width; columns inside `<mj-group>` never stack.

**The 2×2 trick.** Columns inside a group never stack, but *groups themselves do*. To get 4-up on
desktop and 2×2 on mobile, put two groups of two columns in one section:

```xml
<mj-section>
  <mj-group><mj-column width="50%"/><mj-column width="50%"/></mj-group>
  <mj-group><mj-column width="50%"/><mj-column width="50%"/></mj-group>
</mj-section>
```

Desktop: 4 across. Mobile: two rows of two. Used for the stats row and the 3-up donation row
(group of 2 + group of 1 → 2 + 1 on mobile).

Per-section stacking behaviour is specified in `docs/sections.md`.

## Mobile margin

Horizontal outer margin is **30px on every non-bleed section, at every width** — desktop (600px)
and mobile (down to 320px) alike. Do not let it drift per section.

Two groups of sections need a mobile override to hold that invariant, because their desktop
value isn't 30px:

- **Inset sections** — editorial letter and both orange donation bands pad to the column-2 line
  (`124px`) on desktop for a narrower 4c content column. Left at `124px` on a 320-375px screen it
  eats up to ~250px and leaves as little as ~70px for content. Override to `30px`/`30px` below
  the breakpoint.
- **Bleed sections** — cyan "jedes opfer" and U-Bahn pad one side only (`0`) so their 290px image
  can run past the body edge on desktop. That bleed is a desktop-only effect: on mobile, override
  the `0` side back to `30px` so the image sits inside the normal margin instead of running off
  the screen (see their entries in `docs/sections.md`).

Which element carries the padding (section vs. column) and how the breakpoint override is wired
is decided when the MJML is written, per the `email-html-mjml` skill's rules.
