---
paths:
  - "emails/**/*.mjml"
---

# Outlook rendering quirks

Behaviors of MJML 5 output in Outlook 2016-365 (Word engine). Each entry states the behavior and
how well it is confirmed: **confirmed** = reproduced in Outlook, **inferred** = read from the
compiled HTML only.

## `mj-wrapper` with `background-url` emits VML

- `mj-wrapper` compiles its content into `<v:rect>` + `<v:textbox inset="0,0,0,0">` and a nested
  `<td width="600px">` ghost table, the same as `mj-section` does. It is not limited to
  `mj-section` and `mj-hero`.
- In Outlook 2019 the content of such a wrapper sits left of the body's content edge, while sibling
  sections without VML keep their padding.
- A background set only through CSS on the wrapper (class or inline style, no `background-url`)
  emits no VML and keeps the wrapper's layout. Outlook does not render that image, so it shows
  only the `background-color`. Other clients show the image.
- Status: VML emission confirmed. Link to the left shift inferred.

## A fixed `line-height` on an ancestor clips images in Outlook

- Outlook treats a fixed `line-height` on an element containing an inline image as exact and clips
  the image to the line box. The top of the image is cut off and only its bottom strip shows.
- `mj-table` compiles with a fixed `line-height` (`22px` by default), so images placed in its cells
  are affected. Any ancestor with a fixed `line-height` has the same effect.
- A `%` value on the ancestor avoids the clipping. `normal` is rejected by strict validation (only
  `px` and `%` units are accepted).
- Status: confirmed.

## A `mj-group` or `mj-column` narrower than its section is left-aligned in Outlook

- Browsers and most clients center it through `text-align:center` on the section. The ghost table
  Outlook uses has no `align` attribute, so it sits at the left edge of the section's content area.
- Status: inferred.
