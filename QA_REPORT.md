# Exhibit 2: THE OFFER LOOKS GOOD. DOES THE JOB? — build report

**Build:** v1.0 (24 Nov 2026) · React 19 + TypeScript + Vite 8
**Published page:** https://claude.ai/artifact/SJQ11gZS9BtZMAGvCnPuVA (private to you until shared)
**Launch locally:** `npm install && npm run dev`, or serve `dist/` statically (relative paths).

## What the visitor does (plot beats)
1. **Opening:** YOU HAVE TWO OFFERS. / the lede → **OPEN YOUR OFFERS**.
2. **Open the envelopes:** the knife slices, the wax seal cracks into two halves, the envelope opens and the letter slides onto the desk. Letters are live HTML on the Gemini letterhead shells.
3. **First impression** on the cream decision card: AT FIRST GLANCE, I'D CHOOSE A / …B / I NEED MORE INFORMATION. This unlocks the drawers.
4. **Six drawers** (front-view cabinet under the desk): The Actual Work, The People, The Feedback, The Learning, The Hours, The Money. Each opens a "Private correspondence" sheet showing:
   - what the visitor would learn about A and B;
   - what each letter leaves out;
   - questions to tick.
5. **Priorities (leather notebook):** Income, Learning, Autonomy, Creative Work, Stability, Team Environment, reordered by drag or arrow buttons. The top three highlight matching letter lines and put a MATTERS ribbon on related drawers. **No fit percentage anywhere.**
6. **Circumstances:** move the brass paperweight to reach seven hypothetical cards. Picking a card puts a CHECK ribbon on related drawers and adds a question.
7. **Questions to ask:** the sheet collects questions from opened drawers and picked cards, with priority-matched ones listed first. The visitor can add their own. **Print**, **Save as text** and **Copy** all work.
8. **Decide again** (after three drawers): the card shows *First glance* against *Now*.
9. **Finding:** A BETTER OFFER ISN'T ALWAYS THE SAME AS A BETTER FIT. / READ THE OFFER. QUESTION THE ASSUMPTIONS. It shows a summary of the first and revised choice, the top three priorities and the number of questions, with options to start again or print the sheet.

**Desk affordances:**
- **Magnifying glass:** a live clip-mask lens reveals handwritten fine-print notes aligned to each letter line.
- **Fountain pen:** underlines a line with an animated ink stroke and saves it to the notebook.
- **Brass ruler:** a "comparison light" lines up both letters and marks NOT STATED gaps.
- **Desk lamp:** crossfades between the two supplied environments.
- **Desk clock:** opens a ring-bound typical week (A's office days are "?").
- **Calculator:** a working keypad, with keyboard support, plus exact sums and a commute input.
- **Paperweight:** slides off the note cards.
- **Envelopes:** straighten (rotate) when picked up.

## Scenario disclosure and evidence source register
**Disclosure:** North Pier Product Works and Room Eight Design Office are fictional. Every term and amount (₹56,000 and ₹40,000 gross monthly) is an illustrative constructed example, not a real offer or salary benchmark. It appears on the intro, both letters, every drawer sheet, the stage footer, the printed sheet and the sources panel.

| Key | Source | Used for |
|---|---|---|
| sb | Studio Bridge interview themes (paraphrased; no quotes) | Support, mentorship, feedback and respect show up after joining, which is why the drawers exist |
| deloitte2025 | Deloitte, *2025 Gen Z and Millennial Survey* (May 2025) | Learning and development was among the top three reasons for choosing an employer, and respondents felt managers miss the mark on development (Learning priority / drawer) |
| epf | *Employees' Provident Funds and Miscellaneous Provisions Act, 1952* | PF is 12% of basic wages + DA, not gross, so a gross figure can't tell you take-home (Money drawer, calculator note) |

**Calculator:** exact arithmetic only.
- Office days per month: A = 3 × 52 ÷ 12 = 13; B = 5 × 52 ÷ 12 ≈ 21.67. Rupee results are rounded to the nearest rupee.
- Tax, PF and other deductions are deliberately not calculated, and the panel says so.
- Verified: 56,000 × 12 = ₹6,72,000; with ₹150/day commute, A = ₹54,050, B = ₹36,750, gap = ₹17,300.

## QA screenshots (in `screens/`)
- `1-opening.png`: opening
- `2-midpoint.png`: three drawers opened, priorities and circumstances highlighting evidence, magnifier reading fine print
- `3-compare.png`: comparison light with NOT STATED gaps
- `4-drawer.png`: drawer sheet
- `5-finding.png`: end finding with initial and revised choice

## Interaction checklist: what was actually run (headless Chrome)
**55 of 55 automated checks pass.**

Mouse:
- The drawers stay locked until the first choice, and the decision card waits for both envelopes.
- The seal cracks while opening, and the other envelope is locked meanwhile (race guard).
- Live letter data matches the spec, and the fictional stamp is on both letters.
- All three first-impression choices work.
- Drawer sheets open and close; decide-again stays locked until three drawers, and 6 drawers are confirmed.
- Priorities reorder with the arrow buttons and with **pointer drag**. The emphasis changes and no "%" appears anywhere.
- Drawer ribbons follow the priorities.
- The paperweight moves; 7 cards appear, and CHECK ribbons follow the picked cards.
- **Calculator:** 56000×12 = 672000 on the keypad, and 7÷2 = 3.5 from the keyboard. All seven quick sums are exact with Indian digit grouping.
- The week opens with A's days unknown.
- The comparison light shows 8 NOT STATED gaps, and the tools are mutually exclusive.
- The magnifier lens works; the pen underlines a line and it is saved in the notebook.
- The lamp crossfades.
- **Question sheet:**
  - questions are collected (8), with priority-matched ones first;
  - a custom question can be added;
  - Save as text downloads with the correct content, and Copy works;
  - print media hides the app and shows only the re-typeset sheet.
- The revised choice shows next to the first one, and all six progress steps complete.
- The finding copy is exact; Start again resets everything.
- No console errors.

Keyboard only (1366×768):
- Enter on the CTA; Enter/Space opens the envelopes; Enter on a choice.
- Drawers open with focus moved into the dialog, and Esc closes them.
- The full path reaches the revised choice.

Touch, at 1024×768 and 768×1024 tablet and 390×844 phone: the full flow works by tap through to the finding, with no horizontal overflow.

Sizes:
- 1920×1080, 1366×768 and 1024×768 use the composited desk.
- 768×1024 and 390×844 use stacked panels with large controls.
- No horizontal overflow at any size. A 212px overflow at 1024 caused by the progress strip was found and fixed.

Reduced motion: the envelope opens almost instantly and animations are suppressed.

Missing assets: the Offer A letterhead and the calculator were blocked. They show labelled fallbacks, the live letter text still reads, and there are no broken images or errors.

**Not tested:**
- Real-device touch drag in the notebook. It uses pointer events with `touch-action: none` on the list; the arrow buttons always work.
- Screen-reader speech output.
- Print and download inside the claude.ai viewer, which may block them. The exhibit says so and offers Copy.

## Asset pack files: used vs skipped
**Used (all 20 production files):**
- OF_ENV_01 (lit) and OF_ENV_02 (low light, for the lamp crossfade).
- OF_PROP_01 to OF_PROP_14.
- OF_DOC_01 to OF_DOC_04.
- PROP_04 is the decision card; PROP_10 is used three times for the six-drawer cabinet; PROP_12 holds the circumstance cards.

**Derived (originals untouched; recorded in `src/data/asset-manifest.json`):**
- `OF_PROP_03__burgundy`: the pack has only a green opened envelope, so it was recoloured to match OF_PROP_02 by mean HSV. The cream letter and gold seal are untouched.
- `OF_PROP_01__seal` and `OF_PROP_02__seal`: the wax seals were cut out so they can crack into two halves.

**Skipped:** the six `02_Sheets/OF_SHEET_*` contact sheets, which the directive says not to use as live UI.

## Observed asset notes and adaptations
- **Letterheads (DOC_01/02):** the baked text, including the taglines "THE BIGGER TEAM" and "THE CLOSER STUDIO", is spelled correctly and agrees with the live data. All terms are live HTML.
- **DOC_03 and DOC_04:** they have baked headers ("Two offers. Two very different Tuesdays."; the questions header and footer line). The body area is overlaid with live content, and the printed sheet is re-typeset in HTML/CSS, not printed from the PNG.
- **PROP_10 drawers:** photographed from the front, while the desk is top-down. To avoid a perspective clash, the cabinet sits in its own band below the desk instead of on it.
- **No calendar asset:** the "calendar opening" interaction is a CSS ring-bound week sheet, triggered by the desk clock.
- **Resolution:** the environments are 1376×768 and are scaled about 1.1× at 1920×1080.

## Not available to this build
- `StudioBridge_Claude_Master_Prompt_Pack.docx` was not supplied. The spec comes from the rebuild directive's Exhibit 2 section.
- No interview transcripts, so there are no quotations.

**STOPPED. WAITING FOR EXPLICIT INSTRUCTION TO START EXHIBIT 3.**
