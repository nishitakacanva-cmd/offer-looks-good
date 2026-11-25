import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { beats, initial, reducer, suggestions } from './state';
import { DeskScene } from './scenes/DeskScene';
import { Cabinet } from './components/Desk';
import { Calc, Cards, DrawerDoc, Finding, Intro, Notebook, PrintSheet, Questions, SourcesPanel, Week } from './components/Panels';
import { COPY } from './data/content';

const BASE_W = 1376, BASE_H = 768, MIN_STAGE_SCALE = 0.62;

function useReducedMotion() {
  const q = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const [r, setR] = useState(!!q?.matches);
  useEffect(() => { if (!q) return; const f = () => setR(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, [q]);
  return r;
}

export default function App() {
  const [s, d] = useReducer(reducer, initial);
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<'stage' | 'stack'>('stage');

  useLayoutEffect(() => {
    function fit() {
      const w = wrapRef.current?.clientWidth ?? window.innerWidth;
      const cab = window.innerHeight < 860 ? 150 : 186;
      const h = window.innerHeight - 56 - cab;
      const sc = Math.min(w / BASE_W, Math.max(h, 420) / BASE_H);
      setScale(sc);
      setMode(sc < MIN_STAGE_SCALE || window.innerWidth < 900 ? 'stack' : 'stage');
    }
    fit();
    const ro = new ResizeObserver(fit); if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', fit);
    return () => { ro.disconnect(); window.removeEventListener('resize', fit); };
  }, []);

  const b = beats(s);
  const nQ = s.selected.length + s.custom.length;
  return (
    <div className={'app mode-' + mode + (reduced ? ' rm' : '') + (s.lamp ? '' : ' dim')}>
      <header className="topbar">
        <div className="topbar__brand"><b>The Offer Looks Good.</b><span>Does the job?</span></div>
        <ol className="agenda" aria-label="Your progress">
          {b.map((x, i) => <li key={x.k} className={x.done ? 'done' : ''}><i>{x.done ? '✓' : i + 1}</i>{x.k}</li>)}
        </ol>
        <nav className="topbar__nav" aria-label="Desk tools">
          <button type="button" className="btn btn--sm" onClick={() => d({ t: 'panel', p: { t: 'questions' } })} disabled={s.phase !== 'desk'}>Questions{nQ ? ` (${nQ})` : suggestions(s).length ? ' •' : ''}</button>
          <button type="button" className="btn btn--sm" onClick={() => d({ t: 'panel', p: { t: 'sources' } })} disabled={s.phase === 'intro'}>Sources</button>
        </nav>
        <span className="topbar__attr">{COPY.attribution}</span>
      </header>

      <main className="desk" ref={wrapRef} aria-hidden={s.phase !== 'desk'} inert={s.phase !== 'desk'}>
        <DeskScene s={s} d={d} mode={mode} scale={scale} reduced={reduced} />
        <Cabinet s={s} d={d} />
      </main>

      <p className="sr-only" role="status" aria-live="polite">{s.announce}</p>
      {s.phase === 'intro' && <Intro d={d} />}
      {s.phase === 'finding' && <Finding s={s} d={d} />}
      <DrawerDoc s={s} d={d} />
      <Notebook s={s} d={d} />
      <Cards s={s} d={d} />
      <Calc s={s} d={d} />
      <Week s={s} d={d} />
      <Questions s={s} d={d} />
      <SourcesPanel s={s} d={d} />
      <PrintSheet s={s} />
    </div>
  );
}
