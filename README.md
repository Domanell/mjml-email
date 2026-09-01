# MJML Email Starter Kit

Starter kit for building responsive HTML emails with [MJML 5](https://documentation.mjml.io/). MJML is the source format; the file you send through an ESP is the compiled HTML sitting next to it.

Reusable across emails and clients: each email lives in its own self-contained folder under `emails/`, this repo just wires up the build, watch and preview tooling shared by all of them.

## Requirements

- Node.js 20 or later (MJML 5 targets LTS 20/22/24)
- npm

## Setup

```bash
npm install
```

Installs MJML locally as a dev dependency. Never install it globally — the build always resolves the pinned local version.

## Layout

```
emails/<template-name>/
  CLAUDE.md              rules, sources of truth and asset table for this email
  <template-name>.mjml   MJML source — the file you edit
  <template-name>.html   compiled output — generated, git-ignored, never edited by hand
  docs/                  design-system notes specific to this email, if any
  design.jpg             checked-in baseline screenshot, if any
  assets/
    ...                  1x exports used by the build
    original/            raw exports these were produced from — reference only
```

The compiled `.html` lives next to its `.mjml` — deleting a template's folder removes everything about it, build output included. It's git-ignored; run `npm run build` to recreate it after a fresh clone.

## Scripts

All three scripts take the template's folder name as an argument, so switching which email you're
working on never means editing `package.json`. Pass it once after `--`:

```bash
npm run build -- example
```

That resolves to `emails/example/example.mjml` / `.html` by convention, and remembers the choice as
`TEMPLATE=example` in `.env` (git-ignored). Every following call — `build`, `watch` or `dev`, with no
argument — reuses that last-selected template:

```bash
npm run build
npm run dev
```

Run any of them with an unknown name, or with no template selected yet, and the script exits with
the list of available templates from `emails/`.

| Command | What it does |
|---|---|
| `npm run build` | Compiles the selected template, minified, strict validation. This is the file you ship. |
| `npm run watch` | Recompiles on every save, strict validation, **not** minified. Use while developing. |
| `npm run dev` | Same as `watch`, plus a live-reloading browser preview. |

For a one-off run on a different template without changing what's "active", or to point at custom
paths (e.g. for `<mj-include>` partials), bypass the picker with explicit flags:

```bash
node scripts/mjml.cjs --dev --input emails/<template-name>/<template-name>.mjml --output emails/<template-name>/<template-name>.html
```

`build` and `watch` both compile to the same `<template-name>.html`; `build` adds
`--config.minify=true`, `watch` doesn't.

The preview server serves images from the `assets/` folder next to whichever template is selected,
so each template's images resolve correctly regardless of which one you're previewing.

## Preview

1. Start the watcher and live preview:

   ```bash
   npm run dev -- example
   ```

2. Open `http://127.0.0.1:3000/example.html` in a browser.
3. Edit `emails/example/example.mjml`. The watcher rebuilds on save, and the preview reloads automatically.

The watcher skips minification so the output stays readable and diffable. Browser preview shows layout and copy only — it is **not** proof the email renders correctly in mail clients. Verify in real clients (or Litmus / Email on Acid) before sending, with Outlook on Windows first: it uses the Word rendering engine and breaks things no browser will.

To check mobile behaviour, narrow the browser window to 320px and 375px, or use the device toolbar in browser devtools.

## Build

```bash
npm run build
```

- `--config.minify=true` is mandatory for anything shipped. Gmail clips messages over 102KB and appends a "View entire message" link mid-email.
- **Judge the result by the exit code, not by the file.** A failed compile writes nothing, leaving the previous successful build in place — so a stale output file looks exactly like a fresh one. Non-zero exit means the build failed, whatever is on disk.

If a template uses `<mj-include>` for partials, includes are disabled by default in MJML 5 and must be enabled explicitly:

```bash
npx mjml emails/<template-name>/<template-name>.mjml -o emails/<template-name>/<template-name>.html \
  --config.minify=true --config.validationLevel=strict \
  --config.allowIncludes true --config.includePath ./emails/<template-name>/partials
```

Without `--config.allowIncludes true` MJML **silently drops the include**, exits `0`, and still passes strict validation. Grep the compiled output for text you know lives in the partial before treating the build as good.

Note that the two paths resolve from different bases: `path="..."` on `<mj-include>` is relative to the MJML file, while `--config.includePath` is relative to the current working directory. Absolute paths avoid the ambiguity.

## Images

Each template's `assets/` folder holds its 1× exports, with a `assets/original/` subfolder for the raw exports they were produced from (reference only, not a build input). Before sending:

- Rasterize SVGs to PNG. Outlook does not render SVG at all and Gmail support is unreliable.
- Export at 2× the display size and set `width` to the 1× value so images stay sharp on retina screens.
- Replace local paths with absolute hosted URLs. `mj-image src` cannot be relative in a real send — the recipient's client has no access to your filesystem.
- Give every `<mj-image>` an `alt`. Many clients block images by default; the alt text is what the reader sees first.

## Delivery

- `emails/<template-name>/<template-name>.mjml` is the source of truth for that email.
- `emails/<template-name>/<template-name>.html` is what goes to the ESP. It is git-ignored; build it and hand it over as a file or release artefact.

Recompiling from the same source is deterministic, so the HTML can always be regenerated. Edits made directly to the HTML cannot be carried back.
