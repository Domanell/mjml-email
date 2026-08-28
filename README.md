# MJML Email Starter Kit

Starter kit for building responsive HTML emails with [MJML 5](https://documentation.mjml.io/). MJML is the source format; the file you send through an ESP is the compiled HTML in `dist/`.

Reusable across emails: bring your own Figma design and MJML source per project, this repo just wires up the build, watch and preview tooling. The template file(s) under `src/` are your working files, not part of this kit — keep them out of commits (see [Delivery](#delivery)).

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
src/       MJML sources — the files you edit
dist/      compiled HTML — generated, never edited by hand
assets/    images referenced by the template
```

`dist/` is build output: git-ignored, and any change made there is lost on the next compile. Run `npm run build` to recreate it after a fresh clone.

## Scripts

| Command | What it does |
|---|---|
| `npm run build` | Compiles `src/newsletter.mjml` to `dist/newsletter.html`, minified, strict validation. This is the file you ship. |
| `npm run watch` | Recompiles on every save, strict validation, **not** minified. Use while developing. |
| `npm run watch:daemon` | Runs the separate stable watcher for `src/newsletter.mjml`: it polls for saves, debounces editor writes, and continues watching after a compilation error. |
| `npm run dev` | Runs `watch:daemon` and live preview together at `http://127.0.0.1:3000/newsletter.html`. |

`watch:daemon` and `dev` use the installed MJML API rather than the MJML CLI's built-in watcher. For another email, pass its source and output paths to the same script:

```bash
node scripts/mjml.cjs --dev --input src/other.mjml --output dist/other.html
```

## Preview

1. Start the watcher and live preview:

   ```bash
   npm run dev
   ```

2. Open `http://127.0.0.1:3000/newsletter.html` in a browser.
3. Edit `src/newsletter.mjml`. The watcher rebuilds on save, and the preview reloads automatically.

The watcher skips minification so the output stays readable and diffable. Browser preview shows layout and copy only — it is **not** proof the email renders correctly in mail clients. Verify in real clients (or Litmus / Email on Acid) before sending, with Outlook on Windows first: it uses the Word rendering engine and breaks things no browser will.

To check mobile behaviour, narrow the browser window to 320px and 375px, or use the device toolbar in browser devtools.

## Build

```bash
npm run build
```

- `--config.minify=true` is mandatory for anything shipped. Gmail clips messages over 102KB and appends a "View entire message" link mid-email.
- `dist/` must exist before compiling — MJML does not create the output directory.
- **Judge the result by the exit code, not by the file.** A failed compile writes nothing, leaving the previous successful build in place — so a stale `dist/newsletter.html` looks exactly like a fresh one. Non-zero exit means the build failed, whatever is on disk.

If the template uses `<mj-include>` for partials, includes are disabled by default in MJML 5 and must be enabled explicitly:

```bash
npx mjml src/newsletter.mjml -o dist/newsletter.html \
  --config.minify=true --config.validationLevel=strict \
  --config.allowIncludes true --config.includePath ./src/partials
```

Without `--config.allowIncludes true` MJML **silently drops the include**, exits `0`, and still passes strict validation. Grep the compiled output for text you know lives in the partial before treating the build as good.

Note that the two paths resolve from different bases: `path="..."` on `<mj-include>` is relative to the MJML file, while `--config.includePath` is relative to the current working directory. Absolute paths avoid the ambiguity.

## Images

`assets/` holds sources at 1×. Before sending:

- Rasterize SVGs to PNG. Outlook does not render SVG at all and Gmail support is unreliable.
- Export at 2× the display size and set `width` to the 1× value so images stay sharp on retina screens.
- Replace local paths with absolute hosted URLs. `mj-image src` cannot be relative in a real send — the recipient's client has no access to your filesystem.
- Give every `<mj-image>` an `alt`. Many clients block images by default; the alt text is what the reader sees first.

## Delivery

- `src/*.mjml` is your working template for the current email. Treat it as local/project-specific — don't commit it into this starter kit repo.
- `dist/*.html` is what goes to the ESP. It is git-ignored too; build it and hand it over as a file or release artefact.

Recompiling from the same source is deterministic, so the HTML can always be regenerated. Edits made directly to the HTML cannot be carried back.
