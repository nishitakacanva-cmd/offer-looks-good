import { CIRCUMSTANCES, DEFAULT_PRIORITY_ORDER, DRAWERS, PRIORITIES, type Choice, type DrawerId, type OfferId, type PriorityId } from './data/content';

export type Panel = null | { t: 'drawer'; id: DrawerId } | { t: 'notebook' } | { t: 'cards' } | { t: 'calc' } | { t: 'week' } | { t: 'questions' } | { t: 'sources' };
export type Tool = null | 'lens' | 'pen' | 'ruler';

export interface State {
  phase: 'intro' | 'desk' | 'finding';
  opened: Record<OfferId, boolean>;
  opening: OfferId | null;
  first: Choice | null;
  again: Choice | null;
  drawers: DrawerId[];
  panel: Panel;
  priorities: PriorityId[];
  priTouched: boolean;
  circ: string[];
  weightMoved: boolean;
  tool: Tool;
  underlined: string[];
  selected: string[];
  custom: string[];
  lamp: boolean;
  announce: string;
}

export const initial: State = {
  phase: 'intro', opened: { A: false, B: false }, opening: null, first: null, again: null, drawers: [], panel: null,
  priorities: [...DEFAULT_PRIORITY_ORDER], priTouched: false, circ: [], weightMoved: false, tool: null, underlined: [],
  selected: [], custom: [], lamp: true, announce: ''
};

export const MIN_DRAWERS_TO_DECIDE = 3;

export type Action =
  | { t: 'begin' } | { t: 'openStart'; o: OfferId } | { t: 'openDone'; o: OfferId }
  | { t: 'first'; c: Choice } | { t: 'again'; c: Choice } | { t: 'panel'; p: Panel }
  | { t: 'move'; id: PriorityId; dir: -1 | 1 } | { t: 'reorder'; order: PriorityId[] }
  | { t: 'circ'; id: string } | { t: 'weight' } | { t: 'tool'; tool: Tool }
  | { t: 'underline'; id: string } | { t: 'select'; q: string } | { t: 'custom'; q: string } | { t: 'removeCustom'; q: string }
  | { t: 'lamp' } | { t: 'finding' } | { t: 'backToDesk' } | { t: 'restart' };

export function bothOpen(s: State) { return s.opened.A && s.opened.B; }
export function topPriorities(s: State) { return s.priorities.slice(0, 3); }

/** Suggested questions, ordered so ones tied to the visitor's top priorities and circumstances come first. */
export function suggestions(s: State): { q: string; why: string; hot: boolean }[] {
  const top = topPriorities(s);
  const out: { q: string; why: string; hot: boolean }[] = [];
  DRAWERS.filter(d => s.drawers.includes(d.id)).forEach(d => d.questions.forEach(q => {
    const hit = d.pri.find(p => top.includes(p));
    out.push({ q, why: d.name + (hit ? ' · matches “' + PRIORITIES[hit].name + '”' : ''), hot: !!hit });
  }));
  CIRCUMSTANCES.filter(c => s.circ.includes(c.id)).forEach(c => out.push({ q: c.question, why: 'Circumstance: ' + c.text.toLowerCase(), hot: true }));
  const seen = new Set<string>();
  return out.filter(x => (seen.has(x.q) ? false : (seen.add(x.q), true))).sort((a, b) => Number(b.hot) - Number(a.hot));
}

export function beats(s: State) {
  return [
    { k: 'First look', done: !!s.first },
    { k: 'Open drawers', done: s.drawers.length >= MIN_DRAWERS_TO_DECIDE },
    { k: 'Priorities', done: s.priTouched },
    { k: 'Circumstances', done: s.circ.length > 0 },
    { k: 'Questions', done: s.selected.length + s.custom.length > 0 },
    { k: 'Decide again', done: !!s.again }
  ];
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

export function reducer(s: State, a: Action): State {
  switch (a.t) {
    case 'begin': return { ...s, phase: 'desk', announce: 'Two sealed envelopes are on the desk.' };
    case 'openStart': return s.opening || s.opened[a.o] ? s : { ...s, opening: a.o, tool: null, announce: 'Opening offer ' + a.o + '.' };
    case 'openDone': {
      const opened = { ...s.opened, [a.o]: true };
      return { ...s, opened, opening: null, announce: 'Offer ' + a.o + ' is open on the desk.' + (opened.A && opened.B ? ' Make your first choice on the card below the letters.' : '') };
    }
    case 'first': return bothOpen(s) && !s.first ? { ...s, first: a.c, announce: 'First impression recorded. The drawers now hold more detail.' } : s;
    case 'again': return s.first && s.drawers.length >= MIN_DRAWERS_TO_DECIDE ? { ...s, again: a.c, announce: 'Revised choice recorded.' } : s;
    case 'panel': {
      if (a.p && a.p.t === 'drawer' && !s.first) return { ...s, announce: 'Make a first choice before opening the drawers.' };
      const drawers = a.p && a.p.t === 'drawer' && !s.drawers.includes(a.p.id) ? [...s.drawers, a.p.id] : s.drawers;
      return { ...s, panel: a.p, drawers, tool: a.p ? null : s.tool };
    }
    case 'move': {
      const i = s.priorities.indexOf(a.id), j = i + a.dir;
      if (j < 0 || j >= s.priorities.length) return s;
      const p = [...s.priorities]; [p[i], p[j]] = [p[j], p[i]];
      return { ...s, priorities: p, priTouched: true, announce: PRIORITIES[a.id].name + ' moved to position ' + (j + 1) + '.' };
    }
    case 'reorder': return { ...s, priorities: a.order, priTouched: true };
    case 'circ': return { ...s, circ: toggle(s.circ, a.id) };
    case 'weight': return { ...s, weightMoved: !s.weightMoved };
    case 'tool': return { ...s, tool: s.tool === a.tool ? null : a.tool, announce: a.tool && s.tool !== a.tool ? ({ lens: 'Magnifying glass on: move it over a letter to read the fine print.', pen: 'Pen on: select a line in a letter to underline it.', ruler: 'Comparison light on: both letters are lined up, with what each leaves out.' } as const)[a.tool] : 'Tool put down.' };
    case 'underline': return { ...s, underlined: toggle(s.underlined, a.id) };
    case 'select': return { ...s, selected: toggle(s.selected, a.q) };
    case 'custom': { const q = a.q.trim(); return q && !s.custom.includes(q) ? { ...s, custom: [...s.custom, q.slice(0, 200)] } : s; }
    case 'removeCustom': return { ...s, custom: s.custom.filter(x => x !== a.q) };
    case 'lamp': return { ...s, lamp: !s.lamp, announce: s.lamp ? 'Desk lamp dimmed.' : 'Desk lamp on.' };
    case 'finding': return { ...s, phase: 'finding', panel: null, tool: null };
    case 'backToDesk': return { ...s, phase: 'desk' };
    case 'restart': return { ...initial };
  }
}
