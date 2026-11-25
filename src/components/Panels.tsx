import { useEffect, useRef, useState, type Dispatch, type ReactNode } from 'react';
import { AssetImage } from './AssetImage';
import {
  CHOICES, CIRCUMSTANCES, COPY, DISCLAIMERS, DRAWERS, GROSS, OFFERS, OFFICE_DAYS_PER_WEEK, PRIORITIES, SOURCES, WEEK, type OfferId, type PriorityId
} from '../data/content';
import { suggestions, topPriorities, type Action, type State } from '../state';

export function Modal({ open, onClose, label, className = '', children }: { open: boolean; onClose: () => void; label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);
  return (
    <dialog ref={ref} className={'modal ' + className} aria-label={label} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === ref.current) onClose(); }}>
      {open && children}
    </dialog>
  );
}
const X = ({ onClick }: { onClick: () => void }) => <button type="button" className="xbtn" onClick={onClick} aria-label="Close">×</button>;
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/* ---------- Intro ---------- */
export function Intro({ d }: { d: Dispatch<Action> }) {
  return (
    <div className="intro" role="dialog" aria-modal="true" aria-labelledby="intro-h">
      <div className="intro__card">
        <span className="attribution">{COPY.attribution} · {COPY.exhibit}</span>
        <h1 id="intro-h">{COPY.title}</h1>
        <p className="intro__lede">{COPY.lede.split('\n').map((line, i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</p>
        <button type="button" className="btn btn--go" onClick={() => d({ t: 'begin' })} autoFocus>{COPY.cta}</button>
        <p className="intro__fine">{COPY.disclosure} {COPY.persistence}</p>
      </div>
    </div>
  );
}

/* ---------- Drawer document ---------- */
export function DrawerDoc({ s, d }: { s: State; d: Dispatch<Action> }) {
  const id = s.panel?.t === 'drawer' ? s.panel.id : null;
  const dr = DRAWERS.find(x => x.id === id);
  const top = topPriorities(s);
  const close = () => d({ t: 'panel', p: null });
  return (
    <Modal open={!!dr} onClose={close} label={dr ? 'Drawer: ' + dr.name : 'Drawer'} className="modal--doc">
      {dr && (
        <div className="doc">
          <AssetImage k="OF_DOC_03_SupplementaryDrawerDoc_v01" alt="" className="doc__shell" />
          <X onClick={close} />
          <div className="doc__in">
            <span className="doc__kicker">FROM THE DRAWER · {dr.name.toUpperCase()}</span>
            {dr.pri.some(p => top.includes(p)) && s.priTouched && <span className="doc__ribbon">MATTERS TO YOUR TOP PRIORITIES</span>}
            <div className="doc__cols">
              {(['A', 'B'] as OfferId[]).map(o => (
                <section key={o} className={'doc__col doc__col--' + o}>
                  <h3>OFFER {o}<small>{OFFERS[o].org}</small></h3>
                  <p>{dr[o]}</p>
                  <p className="doc__missing"><b>Not in the letter</b>{o === 'A' ? dr.missingA : dr.missingB}</p>
                </section>
              ))}
            </div>
            <div className="doc__qs">
              <b>QUESTIONS THIS RAISES</b>
              {dr.questions.map(q => (
                <label key={q} className="qrow"><input type="checkbox" checked={s.selected.includes(q)} onChange={() => d({ t: 'select', q })} /><span>{q}</span></label>
              ))}
            </div>
            <p className="doc__fine">Constructed example. Details are fictional and illustrative.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Notebook: priorities (drag or buttons) + underlined lines ---------- */
export function Notebook({ s, d }: { s: State; d: Dispatch<Action> }) {
  const open = s.panel?.t === 'notebook';
  const close = () => d({ t: 'panel', p: null });
  const listRef = useRef<HTMLOListElement>(null);
  const drag = useRef<{ id: PriorityId; y: number } | null>(null);
  const [dragging, setDragging] = useState<PriorityId | null>(null);
  function onMove(e: React.PointerEvent) {
    const g = drag.current; if (!g || !listRef.current) return;
    const others = [...listRef.current.querySelectorAll<HTMLLIElement>('li')].filter(li => li.dataset.id !== g.id);
    const target = others.filter(li => { const r = li.getBoundingClientRect(); return e.clientY > r.top + r.height / 2; }).length;
    const order = s.priorities.filter(p => p !== g.id); order.splice(target, 0, g.id);
    if (order.join() !== s.priorities.join()) d({ t: 'reorder', order });
  }
  const underlined = (['A', 'B'] as OfferId[]).flatMap(o => OFFERS[o].lines.filter(l => s.underlined.includes(l.id)).map(l => ({ o, l })));
  return (
    <Modal open={open} onClose={close} label="Leather notebook: your priorities" className="modal--notebook">
      {open && (
        <div className="book">
          <X onClick={close} />
          <div className="book__page book__page--l">
            <span className="hand-h">What matters most to me?</span>
            <p className="book__hint">Drag to reorder, or use the arrows. Your top three change which evidence is highlighted. There is no score.</p>
            <ol className="prilist" ref={listRef} onPointerMove={onMove} onPointerUp={() => { drag.current = null; setDragging(null); }} onPointerCancel={() => { drag.current = null; setDragging(null); }}>
              {s.priorities.map((p, i) => (
                <li key={p} data-id={p} className={(i < 3 ? 'top ' : '') + (dragging === p ? 'dragging' : '')}>
                  <span className="grip" aria-hidden="true" onPointerDown={e => { drag.current = { id: p, y: e.clientY }; setDragging(p); (e.currentTarget.parentElement?.parentElement as HTMLElement)?.setPointerCapture(e.pointerId); }}>⋮⋮</span>
                  <span className="pri__n">{i + 1}</span>
                  <span className="pri__t"><b>{PRIORITIES[p].name}</b><small>{PRIORITIES[p].ask}</small></span>
                  <span className="pri__btns">
                    <button type="button" onClick={() => d({ t: 'move', id: p, dir: -1 })} disabled={i === 0} aria-label={`Move ${PRIORITIES[p].name} up`}>▲</button>
                    <button type="button" onClick={() => d({ t: 'move', id: p, dir: 1 })} disabled={i === s.priorities.length - 1} aria-label={`Move ${PRIORITIES[p].name} down`}>▼</button>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="book__page book__page--r">
            <span className="hand-h">Lines I underlined</span>
            {underlined.length ? <ul className="underlist">{underlined.map(({ o, l }) => <li key={l.id}><b>Offer {o} · {l.label}</b>{l.text}</li>)}</ul>
              : <p className="book__hint">Pick up the fountain pen and click a line in either letter to underline it here.</p>}
            <span className="hand-h hand-h--sm">Highlighted now</span>
            <p className="book__hint">{s.priTouched ? 'Lines and drawers tied to ' + topPriorities(s).map(p => PRIORITIES[p].name).join(', ') + ' are marked on the desk.' : 'Reorder the list to start highlighting.'}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Circumstance cards ---------- */
export function Cards({ s, d }: { s: State; d: Dispatch<Action> }) {
  const open = s.panel?.t === 'cards';
  const close = () => d({ t: 'panel', p: null });
  return (
    <Modal open={open} onClose={close} label="Circumstance cards" className="modal--cards">
      {open && (
        <div className="cardsp">
          <header><h2>What if…</h2><X onClick={close} /></header>
          <p className="cardsp__hint">Hypothetical situations, not about you. Pick any that you want to think through; each points you to drawers worth checking and adds a question.</p>
          <div className="cardgrid">
            {CIRCUMSTANCES.map((c, i) => {
              const on = s.circ.includes(c.id);
              return (
                <button key={c.id} type="button" className={'ccard' + (on ? ' on' : '')} aria-pressed={on} onClick={() => d({ t: 'circ', id: c.id })} style={{ ['--r' as string]: ((i % 3) - 1) * 1.6 + 'deg' }}>
                  <b>{c.text}</b>
                  <span>Look at: {c.look}</span>
                  <em>Drawers: {c.drawers.map(x => DRAWERS.find(dd => dd.id === x)!.name.replace('The ', '')).join(', ')}</em>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Calculator: working keypad + exact quick sums ---------- */
const KEYS = [['7', '8', '9', '÷'], ['4', '5', '6', '×'], ['1', '2', '3', '−'], ['0', '.', '=', '+']];
const COLS = [24.5, 41.2, 58.4, 75.5], ROWS = [50.3, 61.2, 71.8, 82.8];
function applyOp(a: number, b: number, op: string) { return op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : op === '÷' ? (b === 0 ? NaN : a / b) : b; }
function fmt(n: number) { if (!isFinite(n)) return 'ERROR'; const r = Math.round(n * 1e6) / 1e6; const t = String(r); return t.length > 12 ? r.toExponential(5) : t; }
export function Calc({ s, d }: { s: State; d: Dispatch<Action> }) {
  const open = s.panel?.t === 'calc';
  const close = () => d({ t: 'panel', p: null });
  const [disp, setDisp] = useState('0');
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const [commute, setCommute] = useState('');
  function press(k: string) {
    if (/[0-9]/.test(k)) { setDisp(fresh || disp === '0' ? k : (disp + k).slice(0, 12)); setFresh(false); return; }
    if (k === '.') { if (fresh) { setDisp('0.'); setFresh(false); } else if (!disp.includes('.')) setDisp(disp + '.'); return; }
    const cur = parseFloat(disp);
    if (k === '=') { if (op !== null && acc !== null) { setDisp(fmt(applyOp(acc, cur, op))); setAcc(null); setOp(null); setFresh(true); } return; }
    const res = op !== null && acc !== null && !fresh ? applyOp(acc, cur, op) : cur;
    setAcc(res); setOp(k); setDisp(fmt(res)); setFresh(true);
  }
  function clear() { setDisp('0'); setAcc(null); setOp(null); setFresh(true); }
  function load(n: number) { setDisp(fmt(n)); setAcc(null); setOp(null); setFresh(true); }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const m: Record<string, string> = { '/': '÷', '*': '×', '-': '−', '+': '+', Enter: '=', '=': '=' };
      if (/^[0-9.]$/.test(e.key)) press(e.key); else if (m[e.key] && (e.target as HTMLElement)?.tagName !== 'INPUT') { e.preventDefault(); press(m[e.key]); } else if (e.key === 'Backspace' && (e.target as HTMLElement)?.tagName !== 'INPUT') clear();
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });
  const c = Math.max(0, parseFloat(commute) || 0);
  const days = (o: OfferId) => OFFICE_DAYS_PER_WEEK[o] * 52 / 12;
  const after = (o: OfferId) => GROSS[o] - days(o) * c;
  const rows: [string, string, number][] = [
    ['A per year', '56,000 × 12', GROSS.A * 12], ['B per year', '40,000 × 12', GROSS.B * 12],
    ['Gap per month', '56,000 − 40,000', GROSS.A - GROSS.B], ['Gap per year', '16,000 × 12', (GROSS.A - GROSS.B) * 12]
  ];
  return (
    <Modal open={open} onClose={close} label="Mini calculator" className="modal--calc">
      {open && (
        <div className="calc">
          <X onClick={close} />
          <div className="calc__device">
            <AssetImage k="OF_PROP_14_MiniCalculator_v01" alt="" />
            <output className="calc__lcd" aria-live="polite" aria-label="Calculator display">{disp}{op && <small>{op}</small>}</output>
            {KEYS.map((row, r) => row.map((k, ci) => (
              <button key={k} type="button" className="ckey" style={{ left: COLS[ci] + '%', top: ROWS[r] + '%' }} onClick={() => press(k)} aria-label={{ '÷': 'divide', '×': 'multiply', '−': 'minus', '+': 'plus', '=': 'equals', '.': 'decimal point' }[k] ?? k} />
            )))}
            <button type="button" className="calc__clr" onClick={clear}>CLEAR</button>
          </div>
          <div className="calc__side">
            <h2>Run the numbers</h2>
            <p className="calc__note">Exact arithmetic on the illustrative gross figures. Tax, provident fund and other deductions are <b>not</b> included, so none of this is take-home pay. Tap a result to send it to the calculator.</p>
            <table className="sums"><tbody>
              {rows.map(([k, f, v]) => <tr key={k}><th scope="row">{k}</th><td className="f">{f}</td><td><button type="button" onClick={() => load(v)}>{inr(v)}</button></td></tr>)}
            </tbody></table>
            <label className="commute">Commute cost per office day (hypothetical) ₹
              <input type="number" inputMode="decimal" min="0" step="1" value={commute} onChange={e => setCommute(e.target.value)} placeholder="e.g. 150" />
            </label>
            <table className="sums"><tbody>
              {(['A', 'B'] as OfferId[]).map(o => (
                <tr key={o}><th scope="row">{o}: gross − commute</th><td className="f">{GROSS[o].toLocaleString('en-IN')} − {OFFICE_DAYS_PER_WEEK[o]}×52÷12 × {c || 0}</td><td><button type="button" onClick={() => load(after(o))}>{inr(after(o))}</button></td></tr>
              ))}
              <tr><th scope="row">Gap after commute</th><td className="f">A − B</td><td><button type="button" onClick={() => load(after('A') - after('B'))}>{inr(after('A') - after('B'))}</button></td></tr>
            </tbody></table>
            <p className="calc__note">Office days per month: A = 3 × 52 ÷ 12 = 13; B = 5 × 52 ÷ 12 ≈ 21.67. Rupee results are rounded to the nearest rupee.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Week (desk clock) ---------- */
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
export function Week({ s, d }: { s: State; d: Dispatch<Action> }) {
  const open = s.panel?.t === 'week';
  const close = () => d({ t: 'panel', p: null });
  return (
    <Modal open={open} onClose={close} label="A typical week" className="modal--week">
      {open && (
        <div className="week">
          <X onClick={close} />
          <span className="week__rings" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>
          <h2>A typical week</h2>
          <p className="week__note">Illustrative. Built from what each letter and drawer says; gaps are shown as gaps.</p>
          {(['A', 'B'] as OfferId[]).map(o => (
            <div key={o} className="week__row">
              <b>OFFER {o}<small>{WEEK[o].hours}</small></b>
              <div className="week__days">
                {WEEK[o].days.map((t, i) => <span key={i} className={'day day--' + t}><em>{DAYS[i]}</em>{t === 'unknown' ? '?' : t === 'off' ? '—' : t.toUpperCase()}</span>)}
              </div>
              <p>{WEEK[o].note}</p>
            </div>
          ))}
          <p className="week__legend"><span className="day day--office">OFFICE</span> <span className="day day--unknown">?</span> = which days isn’t stated</p>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Questions sheet + export ---------- */
export function sheetText(s: State): string {
  const L = ['QUESTIONS TO ASK BEFORE ACCEPTING', ''];
  const qs = [...s.selected, ...s.custom];
  qs.forEach((q, i) => L.push(`${i + 1}. ${q}`));
  if (!qs.length) L.push('(No questions selected yet.)');
  L.push('', 'MY PRIORITIES (in order): ' + s.priorities.map(p => PRIORITIES[p].name).join(', '));
  if (s.circ.length) L.push('CIRCUMSTANCES I CONSIDERED: ' + CIRCUMSTANCES.filter(c => s.circ.includes(c.id)).map(c => c.text).join('; '));
  if (s.first) L.push('FIRST GLANCE: ' + CHOICES[s.first].short);
  if (s.again) L.push('AFTER LOOKING CLOSER: ' + CHOICES[s.again].short);
  L.push('', COPY.end1, '', COPY.disclosure);
  return L.join('\n');
}
export function Questions({ s, d }: { s: State; d: Dispatch<Action> }) {
  const open = s.panel?.t === 'questions';
  const close = () => d({ t: 'panel', p: null });
  const [draft, setDraft] = useState('');
  const [msg, setMsg] = useState('');
  const sug = suggestions(s);
  const framed = (() => { try { return window.self !== window.top; } catch { return true; } })();
  function save() {
    try {
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([sheetText(s)], { type: 'text/plain;charset=utf-8' })); a.download = 'questions-to-ask-before-accepting.txt';
      document.body.appendChild(a); a.click(); a.remove(); setMsg(framed ? 'Download started, unless this preview blocks downloads. Copy always works.' : 'Saved as questions-to-ask-before-accepting.txt.');
    } catch { setMsg('Downloads are blocked here. Use Copy instead.'); }
  }
  async function copy() {
    const t = sheetText(s);
    try { await navigator.clipboard.writeText(t); setMsg('Question sheet copied.'); }
    catch { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); setMsg(ok ? 'Question sheet copied.' : 'Copy was blocked here.'); }
  }
  function print() { try { window.print(); setMsg(framed ? 'If no print dialog appeared, this preview blocks printing. Use Copy or Save.' : 'Print dialog opened: only the question sheet prints.'); } catch { setMsg('Printing is blocked here.'); } }
  return (
    <Modal open={open} onClose={close} label="Questions to ask before accepting" className="modal--questions">
      {open && (
        <div className="qsheet">
          <AssetImage k="OF_DOC_04_QuestionsToAskSheet_v01" alt="" className="qsheet__shell" />
          <X onClick={close} />
          <div className="qsheet__in">
            <div className="qsheet__list">
              {!sug.length && <p className="qsheet__empty">Open drawers or pick circumstance cards and questions will gather here. You can also write your own.</p>}
              {sug.map(x => (
                <label key={x.q} className={'qrow' + (x.hot ? ' hot' : '')}><input type="checkbox" checked={s.selected.includes(x.q)} onChange={() => d({ t: 'select', q: x.q })} /><span>{x.q}<small>{x.why}</small></span></label>
              ))}
              {s.custom.map(q => <div key={q} className="qrow mine"><span>✎ {q}</span><button type="button" className="linkbtn" onClick={() => d({ t: 'removeCustom', q })} aria-label={'Remove: ' + q}>remove</button></div>)}
              <form className="qadd" onSubmit={e => { e.preventDefault(); d({ t: 'custom', q: draft }); setDraft(''); }}>
                <label className="sr-only" htmlFor="qadd">Write your own question</label>
                <input id="qadd" value={draft} onChange={e => setDraft(e.target.value)} maxLength={200} placeholder="Write your own question…" />
                <button type="submit" className="btn btn--sm" disabled={!draft.trim()}>Add</button>
              </form>
            </div>
            <div className="qsheet__foot">
              <span>{s.selected.length + s.custom.length} on your sheet</span>
              <div className="btnrow">
                <button type="button" className="btn btn--sm" onClick={print}>Print sheet</button>
                <button type="button" className="btn btn--sm" onClick={save}>Save as text</button>
                <button type="button" className="btn btn--sm" onClick={copy}>Copy</button>
              </div>
              <p className="msg" role="status" aria-live="polite">{msg}</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** Print-only reconstruction of the question sheet: live typography, not the raster template. */
export function PrintSheet({ s }: { s: State }) {
  const qs = [...s.selected, ...s.custom];
  return (
    <section className="printsheet" aria-hidden="true">
      <h1>Questions to ask before accepting</h1>
      <ol>{qs.length ? qs.map(q => <li key={q}><span className="box" />{q}</li>) : <li><span className="box" />______________________________________________</li>}</ol>
      <p><b>My priorities, in order:</b> {s.priorities.map(p => PRIORITIES[p].name).join(' · ')}</p>
      {s.circ.length > 0 && <p><b>Circumstances I considered:</b> {CIRCUMSTANCES.filter(c => s.circ.includes(c.id)).map(c => c.text).join('; ')}</p>}
      {s.first && <p><b>First glance:</b> {CHOICES[s.first].short}{s.again ? <> · <b>After looking closer:</b> {CHOICES[s.again].short}</> : null}</p>}
      <p className="ps-end">{COPY.end1}</p>
      <p className="ps-fine">{COPY.disclosure} {COPY.attribution}.</p>
    </section>
  );
}

/* ---------- Sources ---------- */
export function SourcesPanel({ s, d }: { s: State; d: Dispatch<Action> }) {
  const open = s.panel?.t === 'sources';
  const close = () => d({ t: 'panel', p: null });
  return (
    <Modal open={open} onClose={close} label="Scenario disclosure and sources" className="modal--drawer">
      {open && (
        <div className="side">
          <header><h2>Scenario &amp; sources</h2><X onClick={close} /></header>
          <h3>About this scenario</h3>
          <ul className="disclaim">{DISCLAIMERS.map(t => <li key={t}>{t}</li>)}<li>{COPY.persistence}</li></ul>
          <h3>Why these drawers</h3>
          <p>The six drawers follow what an offer letter tends to leave out: the everyday work, the people, how feedback happens, how you learn, the hours and what the money really is. They draw on recurring themes in Studio Bridge interviews, and on published research.</p>
          <h3>Source register</h3>
          <ol className="srclist">{Object.entries(SOURCES).map(([k, x]) => (
            <li key={k}>{x.url ? <a href={x.url} target="_blank" rel="noopener noreferrer">{x.title} ↗</a> : <b>{x.title}</b>}<span>{x.publisher}</span><small>{x.note}</small></li>
          ))}</ol>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Finding ---------- */
export function Finding({ s, d }: { s: State; d: Dispatch<Action> }) {
  const changed = s.first && s.again && s.first !== s.again;
  return (
    <div className="finding" role="dialog" aria-modal="true" aria-labelledby="finding-h">
      <div className="finding__card">
        <span className="attribution">FINDING · {COPY.exhibit}</span>
        <h2 id="finding-h">{COPY.end1}</h2>
        <p className="finding__sub">{COPY.end2}</p>
        <dl className="finding__sum">
          <div><dt>First glance</dt><dd>{s.first ? CHOICES[s.first].short : '—'}</dd></div>
          <div><dt>After looking closer</dt><dd>{s.again ? CHOICES[s.again].short : '—'}</dd></div>
          <div><dt>Your top three</dt><dd>{topPriorities(s).map(p => PRIORITIES[p].name).join(', ')}</dd></div>
          <div><dt>Questions on your sheet</dt><dd>{s.selected.length + s.custom.length}</dd></div>
        </dl>
        <p className="finding__body">{changed ? 'Your choice moved once you saw what the letters left out.' : 'Your choice held, but now you know what to ask before you sign.'} The higher number, the bigger team or the closer studio only tells part of it; the rest is in the work, the people, the feedback and the terms.</p>
        <div className="btnrow">
          <button type="button" className="btn" onClick={() => { d({ t: 'backToDesk' }); d({ t: 'panel', p: { t: 'questions' } }); }}>Question sheet &amp; print</button>
          <button type="button" className="btn" onClick={() => d({ t: 'backToDesk' })}>Back to the desk</button>
          <button type="button" className="btn btn--go" onClick={() => d({ t: 'restart' })}>Start again</button>
        </div>
        <button type="button" className="linkbtn" onClick={() => { d({ t: 'backToDesk' }); d({ t: 'panel', p: { t: 'sources' } }); }}>Scenario &amp; sources</button>
      </div>
    </div>
  );
}
