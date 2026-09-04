# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A starter kit for building responsive HTML emails — from a Figma design to a compiled email — using
MJML 5 as the source format. Not tied to one client or one email: each email lives in its own folder
under `emails/`.

## Structure

```
emails/<template-name>/
  CLAUDE.md              # rules, sources of truth and asset table specific to this email
  <template-name>.mjml   # source — the file you edit
  <template-name>.html   # compiled output — generated, git-ignored, never edited by hand
  design.jpg              # checked-in baseline screenshot, if any
  docs/                    # design-system notes specific to this email, if any
  assets/
    ...                    # exports used by the build
    original/               # raw exports the above were produced from — reference only, not a build input
```

Everything specific to one email (Figma file key/node IDs, its hard rules, its asset table, its
design docs) lives in that email's own `CLAUDE.md` and folder — read that before working on a given
email. This root file only covers what's true for every email in the repo: toolchain, general MJML
rules, and how to use the skills.

Compiled output is colocated with its source — deleting an email's folder removes everything about
it, including its build artefact. `build` and `watch` both compile to the same
`<template-name>.html`, with `--config.minify=true` for `build` and without it for `watch`.

## Required reading

| Read this                          | Before                         |
| ---------------------------------- | ------------------------------ |
| `emails/<template-name>/CLAUDE.md` | working on that specific email |
| skill `email-html-mjml`            | writing or editing any MJML    |

## Hard rules (every email)

- **Pixel-faithful.** Match layout, spacing, type scale and color to the design. Do not add
  sections, do not restyle, do not "improve". Do not invent a value the design already defines.
- **Live text.** Copy is real text, not baked into an image, unless the email's own `CLAUDE.md`
  documents a specific designed exception (and carries that text as `alt`).
- **Client targets:** Outlook 2016–365 (Word engine) and Outlook.com, Gmail web/app, Apple Mail
  (macOS/iOS), major mobile clients. Nothing older than 2016.

## Minimize `@media` usage (preference, not a hard rule)

Forwarding/resending a message can strip the `<style>` block and its `@media` rules — confirmed
behavior: Outlook desktop strips code it doesn't recognize on forward, and Outlook.com/Outlook for
Mac only evaluate media queries when the message wasn't first forwarded through Outlook desktop. So
as a general rule, build the responsive/mobile layout to depend on `@media` as little as possible —
prefer things that work without it (fluid widths, component padding, `mj-group` for
anti-stacking) and reach for `@media` only for what genuinely can't be done any other way.

## Column gaps: build them into padding, not gutters (preference, not a hard rule)

One concrete way to cut `@media` dependence: give gaps between/around columns their own padding
instead of a query-driven gutter.

- **Horizontal gap between columns**: give every `mj-column` equal left/right padding equal to half
  the desired gap (the Bootstrap 4 grid gutter pattern), and shrink the section's own left/right
  padding by that same half-gap to compensate — no negative margins. `<mj-section gutter="...">`
  already implements this and is the preferred shorthand; hand-roll the per-column padding only when
  `gutter` doesn't fit the layout.
- **Vertical gap when columns stack on mobile**: put the gap as bottom padding on each `mj-column`
  itself (present on desktop too, so no query needed to add it), and if the design tolerates it,
  shrink the section's own bottom padding by that same amount so desktop doesn't get it twice.

## Toolchain

MJML 5.4.0, local dev dependency. Never `npm install -g mjml`.

```bash
npx mjml emails/<template-name>/<template-name>.mjml -o emails/<template-name>/<template-name>.html \
  --config.minify=true --config.validationLevel=strict
```

- `--config.minify=true` is mandatory for anything shipped (Gmail clips at 102KB).
- Judge success by exit code, not by the presence of the output file: a failed recompile leaves the
  previous good build in place, so a stale file looks like a success.
- If partials are introduced via `<mj-include>`, add
  `--config.allowIncludes true --config.includePath <path>`. Without it MJML **silently drops** the
  include, exits `0` and still passes strict validation — grep the output for known partial text
  before delivering.
- Prefer `npm run build` / `npm run watch` / `npm run dev` over the raw `npx mjml` command above.
  They route through `scripts/mjml.cjs`, which takes a template name once
  (`npm run build -- <template-name>`), resolves `<template-name>.mjml`/`.html` by convention, and
  remembers the choice as `TEMPLATE=<template-name>` in the git-ignored `.env` so later calls need no
  argument (see `README.md`).

## Assets

Image export rules (2×, format, `alt`, hosted URLs) are covered by the `email-html-mjml` skill.

`assets/original/` (when present) holds the raw exports an email's processed assets were produced
from. It is reference material, not a build input — keep it out of anything the build depends on.
