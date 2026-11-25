import { useEffect, useRef, useState, type Dispatch } from 'react';
import { AssetImage } from './AssetImage';
import { CHOICES, CIRCUMSTANCES, COMPARE, DRAWERS, OFFERS, type Choice, type OfferId } from '../data/content';
import { MIN_DRAWERS_TO_DECIDE, bothOpen, topPriorities, type Action, type State } from '../state';

type P = { s: State; d: Dispatch<Action>; reduced: boolean };

/* ---------- Offer slot: sealed envelope → seal breaks → letter slides out ---------- */
export function OfferSlot({ s, d, reduced, o }: P & { o: OfferId }) {
  const off = OFFERS[o];
  const opening = s.opening === o, open = s.opened[o];
  const lens = useRef<HTMLDivElement>(null);
  const [lp, setLp] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!opening) return;
    const t = window.setTimeout(() => d({ t: 'openDone', o }), reduced ? 60 : 1250);
    return () => window.clearTimeout(t);
  }, [opening, o, d, reduced]);
  const top = topPriorities(s);

  if (!open) {
    return (
      <div className={'obj obj--env env--' + o + (opening ? ' is-opening' : '')}>
        <button type="button" className="env__btn" onClick={() => d({ t: 'openStart', o })} disabled={!!s.opening}
          aria-label={`Sealed envelope from ${off.org}. Break the seal and open it.`}>
          <span className="env__sealed"><AssetImage k={off.envelope} alt="" /></span>
          <span className="env__opened" aria-hidden="true"><AssetImage k={off.opened} alt="" /></span>
          <span className="seal seal--l" aria-hidden="true"><AssetImage k={off.envelopeSeal} alt="" /></span>
          <span className="seal seal--r" aria-hidden="true"><AssetImage k={off.envelopeSeal} alt="" /></span>
          <span className="env__label">OFFER {o}<small>{opening ? 'opening…' : 'break the seal'}</small></span>
        </button>
      </div>
    );
  }
  const move = (e: React.PointerEvent) => {
    if (s.tool !== 'lens' || !lens.current) return;
    const r = lens.current.getBoundingClientRect();
    setLp({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <>
      <div className={'obj obj--openenv openenv--' + o} aria-hidden="true"><AssetImage k={off.opened} alt="" /></div>
      <article className={'obj obj--letter letter--' + o + (s.tool ? ' tool-' + s.tool : '')} aria-label={`Offer letter ${o}: ${off.org}, ${off.role}`}
        ref={lens} onPointerMove={move} onPointerLeave={() => setLp(null)}>
        <AssetImage k={off.doc} alt="" className="letter__shell" label={off.org} />
        <span className="sr-only">{off.org}. {off.tag}. {off.role}.</span>
        <div className="letter__body">
          <p className="letter__sal">{off.salutation}</p>
          <p>We are pleased to offer you the role of <b>{off.role}</b>.</p>
          {off.lines.map(l => {
            const hot = l.pri.some(p => top.includes(p)) && (s.priTouched || s.circ.length > 0);
            const under = s.underlined.includes(l.id);
            const inner = (<><span className="ln__k">{l.label}</span>{l.text}{under && <svg className="ink" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true"><path d="M1 4 C 20 1, 40 6, 60 3 S 90 2, 99 4" /></svg>}</>);
            return s.tool === 'pen'
              ? <button key={l.id} type="button" className={'ln ln--pen' + (hot ? ' hot' : '') + (under ? ' under' : '')} aria-pressed={under} onClick={() => d({ t: 'underline', id: l.id })}>{inner}</button>
              : <p key={l.id} className={'ln' + (hot ? ' hot' : '') + (under ? ' under' : '')}>{inner}</p>;
          })}
          <p className="letter__close">{off.closing}</p>
          <p className="letter__sign">{off.signoff}</p>
        </div>
        <span className="letter__stamp">CONSTRUCTED EXAMPLE · NOT A REAL OFFER</span>
        {s.tool === 'lens' && (
          <>
            <div className="fine-layer" aria-hidden="true" style={{ clipPath: lp ? `circle(17% at ${lp.x}% ${lp.y}%)` : 'circle(0 at 50% 50%)' }}>
              <div className="letter__body">
                <p className="letter__sal ghost-t">{off.salutation}</p>
                <p className="ghost-t">We are pleased to offer you the role of <b>{off.role}</b>.</p>
                {off.lines.map(l => <p key={l.id} className="ln ghost-t"><span className="ln__k">{l.label}</span>{l.text}<span className="fine">{l.fine}</span></p>)}
              </div>
            </div>
            {lp && <span className="lens-ring" style={{ left: lp.x + '%', top: lp.y + '%' }} aria-hidden="true" />}
            <ul className="sr-only">{off.lines.map(l => <li key={l.id}>{l.label}: {l.fine}</li>)}</ul>
          </>
        )}
        {s.tool === 'ruler' && (
          <div className="cmp-layer" aria-label={'What offer ' + o + ' states and leaves out'}>
            <i className="cmp-sweep" aria-hidden="true" />
            {COMPARE.map(r => (
              <div key={r.label} className={'cmp-row' + (r[o] ? '' : ' gap')}>
                <span>{r.label}</span><b>{r[o] ?? 'NOT STATED'}</b>
              </div>
            ))}
          </div>
        )}
      </article>
    </>
  );
}

/* ---------- Decision card (cream sheets) ---------- */
export function DecisionCard({ s, d }: P) {
  const ready = bothOpen(s);
  const canAgain = s.drawers.length >= MIN_DRAWERS_TO_DECIDE;
  const opts: Choice[] = ['A', 'B', 'more'];
  return (
    <section className={'obj obj--decision' + (ready ? ' ready' : '')} aria-label="Decision card">
      <AssetImage k="OF_PROP_04_CreamLetterSheets_v01" alt="" className="decision__paper" />
      <div className="decision__in">
        {!ready && <p className="decision__wait">Open both envelopes first.</p>}
        {ready && !s.first && (
          <>
            <b className="decision__h">FIRST IMPRESSION</b>
            {opts.map(c => <button key={c} type="button" className={'pick pick--' + c} onClick={() => d({ t: 'first', c })}>{CHOICES[c].first}</button>)}
          </>
        )}
        {s.first && (
          <>
            <b className="decision__h">YOUR CHOICE</b>
            <p className="decision__row"><span>FIRST GLANCE</span>{CHOICES[s.first].short}</p>
            <p className={'decision__row' + (s.again ? ' now' : '')}><span>NOW</span>{s.again ? CHOICES[s.again].short : canAgain ? 'Ready to decide again' : `Open ${MIN_DRAWERS_TO_DECIDE - s.drawers.length} more drawer${MIN_DRAWERS_TO_DECIDE - s.drawers.length === 1 ? '' : 's'}`}</p>
            {canAgain && <div className="decision__again" role="group" aria-label="Decide again">{opts.map(c => <button key={c} type="button" aria-pressed={s.again === c} className={'pick pick--sm' + (s.again === c ? ' on' : '')} onClick={() => d({ t: 'again', c })}>{c === 'more' ? 'NEED MORE INFO' : 'CHOOSE ' + c}</button>)}</div>}
            {s.again && <button type="button" className="pick pick--go" onClick={() => d({ t: 'finding' })}>SEE THE FINDING</button>}
          </>
        )}
      </div>
    </section>
  );
}

/* ---------- Small desk props ---------- */
export function Prop({ k, label, cls, onClick, pressed, disabled, chip }: { k: string; label: string; cls: string; onClick: () => void; pressed?: boolean; disabled?: boolean; chip: string }) {
  return (
    <button type="button" className={'obj prop ' + cls + (pressed ? ' on' : '')} onClick={onClick} aria-pressed={pressed} disabled={disabled} aria-label={label}>
      <AssetImage k={k} alt="" />
      <span className="chip">{chip}</span>
    </button>
  );
}

export function NoteCards({ s, d }: P) {
  return (
    <div className={'obj obj--cards' + (s.weightMoved ? ' lifted' : '')}>
      <button type="button" className="cards__stack" onClick={() => { if (!s.weightMoved) d({ t: 'weight' }); d({ t: 'panel', p: { t: 'cards' } }); }} aria-label="Circumstance cards: read them">
        <AssetImage k="OF_PROP_12_BlankNoteCards_v01" alt="" />
        <span className="cards__text" aria-hidden="true">WHAT IF…<small>{s.circ.length ? s.circ.length + ' picked' : '7 cards'}</small></span>
      </button>
      <button type="button" className="weight" onClick={() => d({ t: 'weight' })} aria-pressed={s.weightMoved} aria-label={s.weightMoved ? 'Put the paperweight back on the cards' : 'Move the brass paperweight off the cards'}>
        <AssetImage k="OF_PROP_06_BrassPaperweight_v01" alt="" />
      </button>
      <span className="chip">CIRCUMSTANCES</span>
    </div>
  );
}

/* ---------- Drawer cabinet (front view, below the desk) ---------- */
export function Cabinet({ s, d }: { s: State; d: Dispatch<Action> }) {
  const locked = !s.first;
  const top = topPriorities(s);
  return (
    <section className="cabinet" aria-labelledby="cab-h">
      <header className="cabinet__head">
        <h2 id="cab-h">THE DRAWERS</h2>
        <span>{locked ? 'Make a first choice to unlock' : `${s.drawers.length} of 6 opened · open ${MIN_DRAWERS_TO_DECIDE} to decide again`}</span>
      </header>
      <div className="cabinet__units">
        {[0, 1, 2].map(u => (
          <div className="unit" key={u}>
            <AssetImage k="OF_PROP_10_DocumentDrawers_v01" alt="" className="unit__img" />
            {DRAWERS.slice(u * 2, u * 2 + 2).map((dr, i) => {
              const seen = s.drawers.includes(dr.id);
              const matters = (s.priTouched && dr.pri.some(p => top.includes(p)));
              const check = s.circ.length > 0 && DRAWER_CIRC(s).includes(dr.id);
              return (
                <button key={dr.id} type="button" className={'drawer drawer--' + i + (seen ? ' seen' : '')} disabled={locked}
                  onClick={() => d({ t: 'panel', p: { t: 'drawer', id: dr.id } })} aria-label={`Open drawer: ${dr.name}${seen ? ' (opened)' : ''}${matters ? ', matters to your top priorities' : ''}`}>
                  <span className="drawer__label">{dr.name.replace('The ', '').toUpperCase()}</span>
                  {seen && <span className="drawer__seen" aria-hidden="true">✓</span>}
                  {(matters || check) && <span className={'ribbon' + (check ? ' ribbon--c' : '')} aria-hidden="true">{check ? 'CHECK' : 'MATTERS'}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
function DRAWER_CIRC(s: State) { return CIRCUMSTANCES.filter(c => s.circ.includes(c.id)).flatMap(c => c.drawers); }
