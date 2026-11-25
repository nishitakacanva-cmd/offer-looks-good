import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { beats, initial, reducer, suggestions } from './state';
import { DeskScene } from './scenes/DeskScene';
import { Cabinet } from './components/Desk';
import { Calc, Cards, DrawerDoc, Finding, Intro, Notebook, PrintSheet, Questions, SourcesPanel, Week } from './components/Panels';
import { COPY } from './data/content';

const BASE_W = 1376, BASE_H = 768, MIN_STAGE_SCALE = 0.62;

function playDeskSound(kind: string) {
  const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const ctx = new AudioContextCtor();
  const now = ctx.currentTime;
  const tone = (freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.035, endFreq = freq) => {
    const osc = ctx.createOscillator(), vol = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, now); osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
    vol.gain.setValueAtTime(gain, now); vol.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(vol); vol.connect(ctx.destination); osc.start(now); osc.stop(now + duration);
  };
  if (kind === 'paper') { tone(1300, .07, 'triangle', .025, 650); tone(800, .12, 'sawtooth', .012, 220); }
  else if (kind === 'drawer') { tone(150, .22, 'triangle', .045, 85); tone(420, .07, 'square', .018, 260); }
  else if (kind === 'calc') { tone(880, .045, 'square', .025, 620); }
  else if (kind === 'clock') { tone(1200, .035, 'sine', .02, 760); }
  else if (kind === 'magnet') { tone(230, .13, 'sine', .035, 520); tone(620, .08, 'triangle', .018, 420); }
  else { tone(520, .06, 'sine', .018, 380); }
  window.setTimeout(() => { void ctx.close(); }, 500);
}

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
  const [sound, setSound] = useState(() => { try { return localStorage.getItem('offer-looks-good-sound') !== 'off'; } catch { return true; } });

  useLayoutEffect(() => {
    function fit() {
      const w = wrapRef.current?.clientWidth ?? window.innerWidth;
      const cab = window.innerHeight < 860 ? 174 : 190;
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

  useEffect(() => {
    const onDeskClick = (event: MouseEvent) => {
      if (!sound) return;
      const target = (event.target as HTMLElement).closest('button');
      if (!target || target.disabled) return;
      const kind = target.closest('.env__btn') || target.closest('.ln--pen') ? 'paper'
        : target.closest('.drawer') ? 'drawer'
        : target.closest('.ckey, .calc__clr') ? 'calc'
        : target.closest('.p-clock') ? 'clock'
        : target.closest('.weight, .cards__stack') ? 'magnet'
        : 'tap';
      playDeskSound(kind);
    };
    document.addEventListener('click', onDeskClick, true);
    return () => document.removeEventListener('click', onDeskClick, true);
  }, [sound]);

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
          <button type="button" className="btn btn--sm" onClick={() => setSound(on => { const next = !on; try { localStorage.setItem('offer-looks-good-sound', next ? 'on' : 'off'); } catch { /* storage may be unavailable */ } return next; })} aria-pressed={sound}>{sound ? 'Sound on' : 'Sound off'}</button>
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
