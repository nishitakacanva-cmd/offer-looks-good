import type { Dispatch } from 'react';
import { AssetImage } from '../components/AssetImage';
import { asset } from '../data/assets';
import { DecisionCard, NoteCards, OfferSlot, Prop } from '../components/Desk';
import { bothOpen, type Action, type State } from '../state';

type Props = { s: State; d: Dispatch<Action>; mode: 'stage' | 'stack'; scale: number; reduced: boolean };

/** Desktop: a top-down walnut desk (1376×768 plate) with every prop composited and live.
 *  Narrow screens: the same live components flow as readable panels. */
export function DeskScene({ s, d, mode, scale, reduced }: Props) {
  const open = bothOpen(s);
  const tools = (
    <>
      <Prop k="OF_PROP_07_MagnifyingGlass_v01" cls="p-lens" chip={s.tool === 'lens' ? 'LENS ON' : 'FINE PRINT'} pressed={s.tool === 'lens'} disabled={!s.opened.A && !s.opened.B}
        label={s.tool === 'lens' ? 'Put down the magnifying glass' : 'Pick up the magnifying glass to read the fine print'} onClick={() => d({ t: 'tool', tool: 'lens' })} />
      <Prop k="OF_PROP_05_FountainPen_v01" cls="p-pen" chip={s.tool === 'pen' ? 'PEN ON' : 'UNDERLINE'} pressed={s.tool === 'pen'} disabled={!s.opened.A && !s.opened.B}
        label={s.tool === 'pen' ? 'Put down the pen' : 'Pick up the fountain pen to underline lines'} onClick={() => d({ t: 'tool', tool: 'pen' })} />
      <Prop k="OF_PROP_11_BrassRuler_v01" cls="p-ruler" chip={s.tool === 'ruler' ? 'COMPARING' : 'LINE THEM UP'} pressed={s.tool === 'ruler'} disabled={!open}
        label={s.tool === 'ruler' ? 'Turn off the comparison light' : 'Lay the ruler across both letters: compare line by line and see what each leaves out'} onClick={() => d({ t: 'tool', tool: 'ruler' })} />
    </>
  );
  const kit = (
    <>
      <Prop k="OF_PROP_08_LeatherNotebook_v01" cls="p-notebook" chip="PRIORITIES" label="Open the leather notebook: rank your priorities" onClick={() => d({ t: 'panel', p: { t: 'notebook' } })} />
      <Prop k="OF_PROP_09_DeskClock_v01" cls="p-clock" chip="THE WEEK" label="Desk clock: open a typical week for both offers" onClick={() => d({ t: 'panel', p: { t: 'week' } })} />
      <Prop k="OF_PROP_14_MiniCalculator_v01" cls="p-calc" chip="CALCULATOR" label="Mini calculator: run the numbers" onClick={() => d({ t: 'panel', p: { t: 'calc' } })} />
      <Prop k="OF_DOC_04_QuestionsToAskSheet_v01" cls="p-qsheet" chip={`QUESTIONS (${s.selected.length + s.custom.length})`} label="Questions to ask before accepting: open the sheet" onClick={() => d({ t: 'panel', p: { t: 'questions' } })} />
    </>
  );
  const knife = <span className={'obj p-knife' + (s.opening ? ' slicing' : '') + (s.opened.A || s.opened.B ? ' aside' : '')} aria-hidden="true"><AssetImage k="OF_PROP_13_EnvelopeKnife_v01" alt="" /></span>;
  const lamp = (
    <button type="button" className="obj p-lamp" onClick={() => d({ t: 'lamp' })} aria-pressed={s.lamp} aria-label={s.lamp ? 'Dim the desk lamp' : 'Turn the desk lamp on'}>
      <span className="chip">{s.lamp ? 'LAMP ON' : 'LAMP OFF'}</span>
    </button>
  );

  if (mode === 'stage') {
    return (
      <div className="stage-wrap" style={{ height: 768 * scale }}>
        <div className="stage-wrap__blur" aria-hidden="true" style={{ backgroundImage: `url(${asset('OF_ENV_01_WalnutDecisionDesk_v01').path})` }} />
        <div className="stage" style={{ transform: `scale(${scale})` }}>
          <AssetImage k="OF_ENV_02_LowLightDesk_v01" className="stage__env" alt="" />
          <AssetImage k="OF_ENV_01_WalnutDecisionDesk_v01" className={'stage__env stage__env--lit' + (s.lamp ? '' : ' off')} alt="" label="Walnut desk" />
          {lamp}
          <NoteCards s={s} d={d} reduced={reduced} />
          {tools}{kit}{knife}
          <OfferSlot s={s} d={d} reduced={reduced} o="A" />
          <OfferSlot s={s} d={d} reduced={reduced} o="B" />
          <DecisionCard s={s} d={d} reduced={reduced} />
          <span className="stage__disclosure">CONSTRUCTED EXAMPLES · FICTIONAL ORGANISATIONS · ILLUSTRATIVE AMOUNTS · A STUDIO BRIDGE RESEARCH EXHIBIT</span>
        </div>
      </div>
    );
  }
  const wood = { backgroundImage: `url(${asset('OF_ENV_01_WalnutDecisionDesk_v01').path})` };
  return (
    <div className="stack">
      <section style={wood} className="panel panel--letters" aria-label="The offers">
        <span className="stage__disclosure">CONSTRUCTED EXAMPLES · FICTIONAL ORGANISATIONS · ILLUSTRATIVE AMOUNTS</span>
        <OfferSlot s={s} d={d} reduced={reduced} o="A" />
        <OfferSlot s={s} d={d} reduced={reduced} o="B" />
      </section>
      <section style={wood} className="panel" aria-label="Decision"><DecisionCard s={s} d={d} reduced={reduced} /></section>
      <section style={wood} className="panel panel--tools" aria-label="Desk tools">{tools}{lamp}</section>
      <section style={wood} className="panel panel--kit" aria-label="Notebook, cards, calculator and week"><NoteCards s={s} d={d} reduced={reduced} />{kit}</section>
    </div>
  );
}
