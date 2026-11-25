# The Offer Looks Good. Does the Job?

Exhibit 2 of the Studio Bridge research exhibition. Two fictional offers sit on a walnut desk. The visitor opens them, makes a first choice, opens the drawers, weighs priorities and circumstances, gathers questions, and then decides again.

```
npm install
npm run dev
npm run build   # dist/
```

- `src/data/content.ts`: all copy, both fictional offers, the six drawers, priorities, circumstance cards, the week, the sources and the disclaimers. Edit text here.
- `src/data/asset-manifest.json`: verified asset paths, plus the derivation notes for the derived layers.
- `src/state.ts`: the deterministic reducer, the question suggestions and the six progress beats.
- `src/components/Desk.tsx`: envelopes and letters (including the lens, pen and ruler layers), the decision card, props, note cards and the drawer cabinet.
- `src/components/Panels.tsx`: the drawer sheets, notebook, cards, calculator, week, question sheet with export, print sheet, sources and finding.
- `src/scenes/DeskScene.tsx`: the composited top-down desk, and the stacked layout for narrow screens.

See `QA_REPORT.md`.
