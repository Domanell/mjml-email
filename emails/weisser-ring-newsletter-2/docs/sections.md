# Section spec

9 sections, top to bottom. Values are design values (601px frame); build them at 600px per
`docs/grid.md`. German copy is verbatim from `text.txt`. Every CTA that donates links to
`https://spenden.weisser-ring.de/spenden`.

Every section except the notice block reuses an existing pattern in
`weisser-ring-newsletter.mjml`; edit the copy and keep the markup.

---

## 1. Header — orange brand band

Background `#FF7F00`, height 123. Absolutely placed in the design, built as in the current MJML.

| Element                | Asset                           | Size   | Position                          |
| ---------------------- | ------------------------------- | ------ | --------------------------------- |
| Wordmark + logo lockup | `herzenssache-weisser-ring.png` | 245×87 | x 30 (column 1), y 16             |
| Heart hands            | `hands.png`                     | 149×69 | x 422, y 23                       |
| Tagline                | live text                       | 249×17 | right edge at 571, baseline ~ y94 |

Tagline: "Gemeinsam helfen. Menschen beistehen.", `#002550`, Merriweather Sans Regular 13px. Live text.

Mobile: lockup, hands and tagline stack full width and **centre**.

---

## 2. Notice block

White background, 73px tall (y 123–196). Text is centred, 500px wide.

| Line | Copy                                                                                                                                                                                                          | Style                                          |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1–2  | "[NN\*] unterstützt den WEISSEN RING bei der Spendenwerbung. Sie erhalten diese E-Mail, weil Sie bei [NN\*] eingewilligt haben, Werbung zugeschickt zu bekommen. Dem können Sie jederzeit widersprechen."      | Merriweather Sans Light 10px/14px, `#002550`   |
| 3    | "Den Abmeldelink finden Sie am Ende der Mail."                                                                                                                                                                | Merriweather Sans Bold 10px/14px, `#019DE2`    |

Vertical padding ≈ 15px top and bottom (three 14px lines + padding = 73px). Lines 2 and 3 have no
extra gap between them. `[NN*]` is a literal placeholder. The cyan line is plain text, not a
link.

---

## 3. Hero

Full-bleed image `hero.jpg`, 600×120, no padding, no overlay.

The headline ("IHRE SPENDE GIBT OPFERN VON KRIMINALITÄT EINE PERSPEKTIVE") and the volunteer caption
("JAKOB, ehrenamtlicher Opferhelfer des WEISSEN RINGS") are baked into the image. The `alt`
carries both.

Mobile: scales to width. Check that the headline stays legible at 320px.

---

## 4. Editorial letter

White background. Padding `40px 124px` (column 2 both sides → 4c content). Block gap as in the
current MJML.

Copy, in order (Merriweather Light 12px, `#1B2645`, paragraph margin 12px unless noted):

1. "Liebe Leserin, lieber Leser,"
2. "eine Straftat kann das Leben des Opfers von einem Moment auf den anderen verändern. Was oft
   bleibt, sind Angst, Unsicherheit und das Gefühl, allein zu sein."
3. Lead-in (Merriweather Bold 14px, `#019DE2`): "Doch niemand sollte nach einer Straftat allein
   bleiben."
4. "Der WEISSE RING ist für Menschen da, die Opfer von Kriminalität geworden sind. Unsere
   ehrenamtlichen Mitarbeiterinnen und Mitarbeiter hören zu, beraten, begleiten und helfen – genau
   dann, wenn Unterstützung besonders dringend gebraucht wird."
5. Bold, `#002550`: "Damit wir auch weiterhin für Betroffene da sein können, brauchen wir Ihre
   Unterstützung."
6. Primary CTA "JETZT MIT IHRER SPENDE HELFEN →", padding `8px 14px`.

Donate badge: `heart-button.png`, 86×68, alt "Jetzt spenden!", own column at the top right of
the letter (mechanics in `CLAUDE.md`).

Signature block, gap 16px between the two columns:

| Element  | Detail                                                                              |
| -------- | ----------------------------------------------------------------------------------- |
| Portrait | `person-photo.png`, 68×68, circular mask                                            |
| Lines    | "Vielen Dank für Ihre Hilfe" / "Ihre Barbara Richstein", Merriweather Light 12px, black, separate paragraphs |
| Role     | "Bundesvorsitzende", Merriweather Sans Light 9px                                    |
| Logo     | `logo.png` at 131×46 — a logo image, **not** a button                               |

Mobile: signature block does **not** stack — portrait and text stay side by side (`<mj-group>`).
Section padding becomes `30px`/`30px`.

---

## 5. Light story #1

Linear gradient `#009EE0` → `#FFFFFF` (CSS on a class), fallback `#EAF8FF`. Padding `40px 30px`,
gutter 20px.

| Column | Span | Content                                       |
| ------ | ---- | --------------------------------------------- |
| Left   | 2c   | `person-illustration.png` (167×199)           |
| Right  | 4c   | Copy, block gap 24px                          |

- `h1` `#002550`: "IHRE SPENDE MACHT HILFE MÖGLICH" (two lines)
- Body 12px `#002550`: "Hinter jeder Straftat steht ein Mensch. Ein Mensch, der vielleicht nicht
  mehr allein aus dem Haus geht, nachts nicht schlafen kann oder nach einem Übergriff dringend
  Schutz und Unterstützung benötigt."
- Lead-in (Merriweather Bold 14px, `#019DE2`): "Mit Ihrer Spende helfen Sie, dass Betroffene
  wieder Halt finden und Schritt für Schritt ins Leben zurückkehren können."
- No CTA.

Mobile: illustration above copy, **centred**. Copy stays left-aligned.

---

## 6. Donation grid

Radial gradient `#18488D` → `#002550`, fallback `#002550`, background image `bg-donation-grid.jpg`.
Padding `64px 30px`, 6c content, block gap as in the current MJML, everything centred.

- `h1` white centred, three lines: "DAS BEWIRKT IHRE / UNTERSTÜTZUNG / BEISPIELSWEISE:"
- 5 tiles, each 2c (167) wide, row gap 20px, gutter 20px (amount Merriweather Sans ExtraBold 30px
  white, 3px below it the 10px label):

| Row | Amount | Label                                          |
| --- | ------ | ---------------------------------------------- |
| 1   | 20€    | ermöglichen die Begleitung zu einem Gerichtstermin |
| 1   | 35€    | finanzieren einen Wochenend-<br>einkauf nach einem Raub |
| 2   | 85€    | helfen beim Ersatz zerrissener Kleidung        |
| 2   | 130€   | ermöglichen den Austausch eines Türschlosses   |
| 2   | 550€   | unterstützen ein Gewaltschutzverfahren         |

- Row 1 is centred, 354 wide, starting at column 2. Row 2 is the full 6c.
- Primary CTA "JETZT SPENDEN →" centred.

Mobile: row 1 stays 2-up; row 2 becomes 2 + 1 (see `docs/grid.md`).

---

## 7. Orange band

Background `#FF7F00`. Padding `24px 124px` (4c). Gap 16px.

- `h2` `#002550`: "Jeder Beitrag zählt."
- Body Merriweather Light 14px/18px `#002550`: "Denn jede Spende hilft dabei, Menschen in einer
  schwierigen Lebenssituation nicht allein zu lassen."
- Inverse CTA "JETZT SPENDEN →"

Mobile: padding `30px`/`30px`.

---

## 8. Light story #2

Same structure, gradient and mobile behaviour as section 5.

| Column | Span | Content                                       |
| ------ | ---- | --------------------------------------------- |
| Left   | 2c   | `person-illustration-2.png` (167×178)         |
| Right  | 4c   | Copy, block gap 24px                          |

- `h1` `#002550`: "GEMEINSAM AN DER SEITE VON BETROFFENEN" (two lines)
- Body 12px `#002550`: "Seit 50 Jahren steht der WEISSE RING Menschen zur Seite, die Opfer von
  Kriminalität geworden sind. Bundesweit engagieren sich rund 3.000 Ehrenamtliche in mehr als 400
  Außenstellen."
- Lead-in (Merriweather Bold 14px, `#019DE2`): "Diese Hilfe ist nur möglich, weil Menschen wie
  Sie den WEISSEN RING unterstützen."
- Body 12px `#002550`: "Bitte helfen Sie mit Ihrer Spende, damit Betroffene nicht allein bleiben."
- Primary CTA "JETZT SPENDEN UND HILFE MÖGLICH MACHEN →", padding `8px 10px`.

---

## 9. Social band

Cyan `#019DE2`, height ~157. Padding `24px`, text 576 wide centred.

Three lines of white copy: "Ihnen gefällt unser Newsletter?" (bold), "Leiten Sie ihn gerne an
Bekannte oder Kolleg:innen weiter!", "Und bleiben Sie mit uns in Verbindung:".

Icon row centred, 96 wide, **24px gaps**, glyphs filled `#002550`:

| Icon               | Size  | Link                                     |
| ------------------ | ----- | ---------------------------------------- |
| `fb-icon.png`      | 10×20 | `https://www.facebook.com/WEISSERRING`   |
| `inst-icon.png`    | 21×21 | `https://www.instagram.com/weisser_ring` |
| `linkedin-icon.png`| 18×18 | `https://www.linkedin.com/company/weisserringev` |

Built with `<mj-social>` (`mode="horizontal"`, `icon-padding="0 8px"`) and custom icon images.

The email ends here: the design has no footer.
