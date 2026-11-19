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

Seen in the design as: 353/354 = 4c (letter, light-story copy, orange band), 167 = 2c (both person
illustrations, every donation tile), 541 = 6c (donation block).

## Grid exceptions

Two blocks are not column-aligned. Do not try to force them onto the grid:

| Block | Width | Rule |
| --- | --- | --- |
| Notice block text | 500px, centred | 50px side padding |
| Header lockup / hands | 245×87 / 149×69 | absolutely placed inside the orange band |

## MJML mapping

Body: `<mj-body width="600px">`.

Section horizontal padding equals the outer margin (`padding-left="30px" padding-right="30px"`)
unless the section is an inset section (see "Mobile margin").

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
<!-- 3-up donation row: section padding 20 → inner 560 → 3 × 186.67 → content 166.67, gaps 20 -->
<mj-section padding-left="20px" padding-right="20px">
  <mj-group>
    <mj-column width="33.33%" padding="0 10px">…</mj-column>
    …
  </mj-group>
</mj-section>
```

First content edge lands at `20 + 10 = 30`, last at `600 - 20 - 10 = 570`. Same trick for the
centred 2-up row (`padding-left/right="114px"`, `50%`, first content edge at 124 = column 2 ✔).

## Responsive

Breakpoint: `<mj-breakpoint width="480px" />` (MJML default). Below it, columns in a section stack
to full width; columns inside `<mj-group>` never stack.

**The group trick.** Columns inside a group never stack, but *groups themselves do*. For the
3-up donation row, a group of 2 + a group of 1 gives 3 across on desktop and 2 + 1 on mobile.

Per-section stacking behaviour is specified in `docs/sections.md`.

## Mobile margin

Horizontal outer margin is **30px on every section, at every width** — desktop (600px)
and mobile (down to 320px) alike. Do not let it drift per section.

One kind of section needs a mobile override to hold that invariant, because their desktop
value isn't 30px:

- **Inset sections** — editorial letter and the orange band pad to the column-2 line (`124px`) on
  desktop for a narrower 4c content column. Left at `124px` on a 320-375px screen it eats up to
  ~250px and leaves as little as ~70px for content. Override to `30px`/`30px` below the
  breakpoint.

Which element carries the padding (section vs. column) and how the breakpoint override is wired
is decided when the MJML is written, per the `email-html-mjml` skill's rules.
