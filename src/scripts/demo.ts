/**
 * Concept demo of the Səssiz Sifariş ordering flow.
 *
 * A small state machine rendered into the phone mockup. No data leaves the
 * page and no payment is taken. Accessibility notes:
 *  - all controls are native buttons / radios / checkboxes;
 *  - on every step change, focus moves to the screen heading;
 *  - progress, voice prompts and confirmations are announced via a polite live region;
 *  - optional browser speech (off by default) reads voice prompts aloud.
 */
import type { Dictionary } from '../content/en';
import { format } from '../content';

type Text = Dictionary['demo'];
type Question = Text['questions'][number];
type Mode = 'standard' | 'voice';

interface Prices {
  currency: string;
  hunger: Record<string, number>;
  side: Record<string, number>;
}

interface Pending {
  /** Human-readable choice the "AI" heard. */
  label: string;
  /** Applies the choice to state when the user confirms. */
  apply: () => void;
}

interface State {
  mode: Mode;
  step: number;
  lang: string | null;
  contact: string;
  marketing: boolean;
  answers: Record<string, string | string[]>;
  pickup: string;
  orderNumber: string;
  staffOpen: boolean;
  pending: Pending | null;
  /** Last thing the simulated user said, shown as a caption. */
  said: string | null;
  error: string | null;
}

const ICONS = {
  speaker:
    '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  staff:
    '<circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.8-4 3.5-6.5 7-6.5s6.2 2.5 7 6.5"/><path d="M12 14.5v3"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
  repeat:
    '<path d="M4 11V9a3 3 0 0 1 3-3h12M16 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H5M8 21l-3-3 3-3"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/>',
  apple:
    '<path d="M16.4 12.6c0-2 1.6-3 1.7-3a3.8 3.8 0 0 0-3-1.6c-1.3-.1-2.5.8-3.1.8-.7 0-1.6-.8-2.7-.8a4 4 0 0 0-3.4 2c-1.4 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.5 2 1 0 1.4-.6 2.6-.6s1.6.6 2.6.6c1.1 0 1.8-1 2.4-2a8.5 8.5 0 0 0 1.1-2.3s-2.1-.8-2.1-3.4ZM14.4 6.5c.6-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-1 1.5-.8 2.4.9.1 1.7-.4 2.3-1.1Z"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/>',
} as const;

const icon = (name: keyof typeof ICONS, size = 20, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="shrink-0 ${extra}">${ICONS[name]}</svg>`;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const BTN = 'btn w-full';
const OPTION =
  'flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-border bg-surface px-4 py-3 text-left text-[1.0625rem] font-semibold text-ink transition-colors hover:border-cobalt has-[:checked]:border-cobalt has-[:checked]:bg-cobalt-tint has-[:disabled]:cursor-not-allowed has-[:disabled]:border-dashed has-[:disabled]:bg-bg has-[:disabled]:text-muted';

export function initDemo(): void {
  const root = document.querySelector<HTMLElement>('[data-demo-root]');
  const live = document.querySelector<HTMLElement>('[data-demo-live]');
  const dataEl = document.querySelector<HTMLScriptElement>('[data-demo-content]');
  if (!root || !live || !dataEl) return;

  const { text: T, prices: P } = JSON.parse(dataEl.textContent || '{}') as { text: Text; prices: Prices };
  const speakToggle = document.querySelector<HTMLInputElement>('[data-demo-speak]');
  const speakWrap = document.querySelector<HTMLElement>('[data-speak-wrap]');
  const canSpeak = 'speechSynthesis' in window;

  // Steps: language, contact, 6 questions, cart, payment, done.
  const STEPS = ['language', 'contact', ...T.questions.map((_, i) => `q${i}`), 'cart', 'payment', 'done'] as const;
  const TOTAL_VISIBLE = STEPS.length - 1; // "done" is not counted as a step

  const initial = (): State => ({
    mode: (document.querySelector<HTMLInputElement>('input[name="demo-mode"]:checked')?.value as Mode) || 'standard',
    step: 0,
    lang: null,
    contact: '',
    marketing: false,
    answers: {},
    pickup: 'here',
    orderNumber: '',
    staffOpen: false,
    pending: null,
    said: null,
    error: null,
  });
  let state = initial();

  /* ---------------- helpers ---------------- */

  const money = (n: number) => `${n.toFixed(2)} ${P.currency}`;
  const question = (i: number): Question => T.questions[i]!;
  const optLabel = (q: Question, id: string) => q.options.find((o) => o.id === id)?.label ?? id;

  const answerLabel = (q: Question): string | null => {
    const a = state.answers[q.id];
    if (a === undefined) return null;
    if (Array.isArray(a)) {
      return a.length ? a.map((id) => optLabel(q, id)).join(', ') : ('noneLabel' in q ? q.noneLabel : '') || '';
    }
    return optLabel(q, a);
  };

  const total = () => {
    const h = state.answers.hunger as string | undefined;
    const s = state.answers.side as string | undefined;
    return (h ? P.hunger[h] ?? 0 : 0) + (s ? P.side[s] ?? 0 : 0);
  };

  /** Short spoken/visible summary of the order so far. */
  const summaryParts = () =>
    T.questions.map((q) => ({ q, label: answerLabel(q) })).filter((x): x is { q: Question; label: string } => !!x.label);

  const summaryText = () => summaryParts().map((x) => x.label).join(', ');

  const stepName = () => STEPS[state.step]!;

  const announce = (msg: string) => {
    // Clear first so repeated identical messages are announced again.
    live.textContent = '';
    window.setTimeout(() => {
      live.textContent = msg;
    }, 60);
  };

  const speak = (msg: string) => {
    if (!canSpeak || !speakToggle?.checked || state.mode !== 'voice') return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = 'en-US';
    u.rate = 0.98;
    window.speechSynthesis.speak(u);
  };

  /** The AI prompt for the current screen (voice path). */
  const promptFor = (): string => {
    if (state.staffOpen) return T.staff.voicePrompt;
    const name = stepName();
    if (name === 'language') return T.language.voicePrompt;
    if (name === 'contact') return T.contact.voicePrompt;
    if (name.startsWith('q')) return question(Number(name.slice(1))).voicePrompt;
    if (name === 'cart') return format(T.cart.voicePrompt, { summary: summaryText(), total: money(total()) });
    if (name === 'payment') return format(T.payment.voicePrompt, { total: money(total()) });
    return format(T.done.voicePrompt, { number: state.orderNumber });
  };

  const progressText = () =>
    format(T.progress, { current: Math.min(state.step + 1, TOTAL_VISIBLE), total: TOTAL_VISIBLE });

  /* ---------------- rendering ---------------- */

  const header = (title: string, opts: { progress?: boolean; titleLang?: string } = {}) => {
    const showProgress = opts.progress !== false;
    const pct = Math.round(((state.step + 1) / TOTAL_VISIBLE) * 100);
    return `
      ${
        showProgress
          ? `<div class="flex items-center gap-3">
               <p class="shrink-0 text-sm font-semibold text-muted">${esc(progressText())}</p>
               <div class="h-2 flex-1 overflow-hidden rounded-full bg-cobalt-tint" aria-hidden="true">
                 <div class="h-full rounded-full bg-cobalt" style="width:${pct}%"></div>
               </div>
             </div>`
          : ''
      }
      <h3 data-demo-heading tabindex="-1" class="mt-4 text-[1.625rem] leading-tight"${opts.titleLang ? ` lang="${opts.titleLang}"` : ''}>${esc(title)}</h3>`;
  };

  const aiBubble = () => {
    if (state.mode !== 'voice') return '';
    const msg = state.pending ? format(T.heard, { choice: state.pending.label }) : promptFor();
    return `
      <div class="mt-4 space-y-2">
        ${
          state.said
            ? `<p class="ml-8 rounded-2xl rounded-br-md border border-border bg-bg px-4 py-3 text-base">
                 <span class="block text-xs font-bold uppercase tracking-wider text-muted">${esc(T.youSaid)}</span>
                 “${esc(state.said)}”
               </p>`
            : ''
        }
        <p class="mr-6 flex gap-3 rounded-2xl rounded-bl-md bg-cobalt-tint px-4 py-3 text-base text-ink">
          ${icon('speaker', 20, 'mt-0.5 text-cobalt')}
          <span><span class="block text-xs font-bold uppercase tracking-wider text-cobalt-dark">${esc(T.aiSays)}</span>${esc(msg)}</span>
        </p>
      </div>`;
  };

  /** Simulated utterance buttons for the voice path. */
  const sayButtons = (items: { label: string; lang?: string; key: string }[]) => `
    <ul class="mt-4 space-y-2">
      ${items
        .map(
          (it) => `<li>
            <button type="button" data-say="${esc(it.key)}" data-key="say-${esc(it.key)}" class="${OPTION}">
              ${icon('mic', 20, 'text-cobalt')}
              <span>${esc(T.sayPrefix)} “<span${it.lang ? ` lang="${it.lang}"` : ''}>${esc(it.label)}</span>”</span>
            </button>
          </li>`,
        )
        .join('')}
    </ul>`;

  const confirmButtons = () => `
    <div class="mt-4 grid gap-2">
      <button type="button" data-action="confirm-yes" data-key="confirm-yes" class="${BTN} btn-primary">${icon('check')}${esc(T.confirmYes)}</button>
      <button type="button" data-action="confirm-repeat" data-key="confirm-repeat" class="${BTN} btn-secondary">${icon('repeat')}${esc(T.confirmRepeat)}</button>
    </div>`;

  const errorMsg = (id: string) =>
    state.error
      ? `<p id="${id}" class="mt-3 flex items-start gap-2 font-semibold text-error">${icon('alert', 20, 'mt-0.5')}<span>${esc(state.error)}</span></p>`
      : '';

  const navRow = (nextLabel?: string, nextAction = 'next') => `
    <div class="mt-auto grid gap-2 pt-6">
      ${nextLabel ? `<button type="button" data-action="${nextAction}" data-key="${nextAction}" class="${BTN} btn-primary">${esc(nextLabel)}</button>` : ''}
      ${
        state.step > 0
          ? `<button type="button" data-action="back" data-key="back" class="${BTN} btn-secondary">${icon('back')}${esc(T.back)}</button>`
          : ''
      }
    </div>`;

  const commandBar = () => {
    const name = stepName();
    if (name === 'done') return '';
    const repeat =
      state.mode === 'voice'
        ? `<button type="button" data-action="repeat" data-key="cmd-repeat" class="btn btn-secondary !min-h-11 flex-1 !px-3 !text-[0.9375rem]">${icon('repeat', 18)}${esc(T.commands.repeat)}</button>`
        : '';
    return `
      <div class="border-t border-border bg-bg px-4 py-3">
        ${state.mode === 'voice' ? `<p class="mb-2 text-xs font-bold uppercase tracking-wider text-muted" id="demo-cmds">${esc(T.commandsLabel)}</p>` : ''}
        <div class="flex gap-2"${state.mode === 'voice' ? ' role="group" aria-labelledby="demo-cmds"' : ''}>
          ${repeat}
          <button type="button" data-action="staff" data-key="cmd-staff" class="btn btn-lime !min-h-11 flex-1 !px-3 !text-[0.9375rem]">${icon('staff', 18)}${esc(state.mode === 'voice' ? T.commands.staff : T.staffButton)}</button>
        </div>
      </div>`;
  };

  /* ----- screens ----- */

  const screenLanguage = () => {
    const opts = T.language.options;
    const body =
      state.mode === 'voice'
        ? state.pending
          ? confirmButtons()
          : sayButtons(opts.map((o) => ({ label: o.label, lang: o.lang, key: o.code })))
        : `<ul class="mt-5 space-y-3">
            ${opts
              .map(
                (o) => `<li><button type="button" data-lang="${o.code}" data-key="lang-${o.code}" class="${OPTION} !min-h-16 !text-xl">
                  <span class="flex h-10 w-10 items-center justify-center rounded-full bg-cobalt-tint text-sm font-bold text-cobalt" aria-hidden="true">${o.code}</span>
                  <span lang="${o.lang}">${esc(o.label)}</span></button></li>`,
              )
              .join('')}
          </ul>`;
    return `${header(T.language.title)}${aiBubble()}${body}
      <p class="mt-4 text-sm text-muted">${esc(T.language.demoNote)}</p>${navRow()}`;
  };

  const screenContact = () => {
    if (state.mode === 'voice') {
      const body = state.pending
        ? confirmButtons()
        : sayButtons([{ label: T.contact.voiceSample, key: 'contact' }]);
      return `${header(T.contact.title)}${aiBubble()}${body}
        <p class="mt-4 text-sm text-muted">${esc(T.contact.privacy)}</p>${navRow()}`;
    }
    const invalid = !!state.error;
    return `${header(T.contact.title)}
      <div class="mt-5">
        <label for="demo-contact" class="block font-semibold">${esc(T.contact.fieldLabel)}</label>
        <p id="demo-contact-hint" class="text-sm text-muted">${esc(T.contact.fieldHint)}</p>
        <input id="demo-contact" data-key="contact-input" type="text" inputmode="email" autocomplete="off"
          value="${esc(state.contact)}"
          aria-describedby="demo-contact-hint${invalid ? ' demo-contact-error' : ''}"
          ${invalid ? 'aria-invalid="true"' : ''}
          class="mt-2 block min-h-13 w-full rounded-xl border-2 ${invalid ? 'border-error' : 'border-border'} bg-surface px-4 py-3 text-lg text-ink focus:border-cobalt" />
        ${errorMsg('demo-contact-error')}
      </div>
      <label class="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-base">
        <input type="checkbox" data-marketing data-key="marketing" class="mt-0.5 h-6 w-6 shrink-0 accent-[var(--cobalt)]" ${state.marketing ? 'checked' : ''} />
        <span>${esc(T.contact.marketing)}</span>
      </label>
      <p class="mt-3 text-sm text-muted">${esc(T.contact.privacy)}</p>
      ${navRow(T.next)}`;
  };

  const screenQuestion = (qi: number) => {
    const q = question(qi);
    const note = 'note' in q && q.note ? `<p class="mt-2 text-base text-muted">${esc(q.note)}</p>` : '';
    const isMulti = 'multi' in q && q.multi;

    if (state.mode === 'voice') {
      const items = q.options
        .filter((o) => !('unavailable' in o && o.unavailable))
        .map((o) => ({ label: o.label, key: o.id }));
      if (isMulti && 'noneLabel' in q) items.push({ label: q.noneLabel ?? '', key: '__none' });
      const body = state.pending ? confirmButtons() : sayButtons(items);
      return `${header(q.title)}${note}${aiBubble()}${body}${navRow()}`;
    }

    const current = state.answers[q.id];
    const selected = (id: string) => (Array.isArray(current) ? current.includes(id) : current === id);
    const type = isMulti ? 'checkbox' : 'radio';
    const options = q.options
      .map((o) => {
        const off = 'unavailable' in o && o.unavailable;
        const control = `<input type="${type}" name="q-${q.id}" value="${o.id}" data-q="${q.id}" data-key="opt-${q.id}-${o.id}"
            class="h-5 w-5 shrink-0 accent-[var(--cobalt)]" ${selected(o.id) ? 'checked' : ''} ${off ? 'disabled aria-describedby="na-' + o.id + '"' : ''} />`;
        return `<li><label class="${OPTION}">${control}<span class="flex-1">${esc(o.label)}</span>
          ${off ? `<span id="na-${o.id}" class="text-sm font-medium">${esc(T.unavailable)}</span>` : ''}
          </label></li>`;
      })
      .join('');
    const none =
      isMulti && 'noneLabel' in q
        ? `<li><label class="${OPTION}"><input type="checkbox" data-none="${q.id}" data-key="none-${q.id}" class="h-5 w-5 shrink-0 accent-[var(--cobalt)]"
              ${Array.isArray(current) && current.length === 0 ? 'checked' : ''} /><span>${esc(q.noneLabel ?? '')}</span></label></li>`
        : '';
    return `${header(q.title)}${note}
      <fieldset class="mt-5"${state.error ? ' aria-describedby="demo-q-error"' : ''}>
        <legend class="sr-only">${esc(q.title)}</legend>
        <ul class="space-y-2.5">${options}${none}</ul>
      </fieldset>
      ${errorMsg('demo-q-error')}
      ${navRow(T.next)}`;
  };

  const cartDetails = () => {
    const parts = summaryParts();
    const hungerQ = question(0);
    const sideQ = question(T.questions.length - 1);
    const fillings = parts.filter((p) => p.q.id !== hungerQ.id && p.q.id !== sideQ.id).map((p) => p.label);
    const h = state.answers.hunger as string | undefined;
    const s = state.answers.side as string | undefined;
    return `
      <ul class="mt-5 divide-y divide-border rounded-2xl border border-border">
        <li class="flex justify-between gap-3 p-4">
          <span><span class="font-semibold">${esc(T.cart.itemName)}</span>${h ? ` · ${esc(optLabel(hungerQ, h))}` : ''}
            <span class="block text-sm text-muted">${esc(fillings.join(' · '))}</span></span>
          <span class="shrink-0 font-semibold tabular-nums">${h ? money(P.hunger[h] ?? 0) : ''}</span>
        </li>
        ${
          s
            ? `<li class="flex justify-between gap-3 p-4"><span class="font-semibold">${esc(optLabel(sideQ, s))}</span>
               <span class="shrink-0 font-semibold tabular-nums">${money(P.side[s] ?? 0)}</span></li>`
            : ''
        }
      </ul>
      <dl class="mt-4 space-y-2 text-base">
        <div><dt class="inline font-semibold">${esc(T.cart.allergens)}:</dt> <dd class="inline text-muted">${esc(T.cart.allergensValue)}</dd></div>
        <div class="flex items-center gap-2"><dt class="sr-only">${esc(T.cart.availabilityLabel)}</dt><dd class="flex items-center gap-2 font-semibold text-cobalt">${icon('check', 18)}${esc(T.cart.availability)}</dd></div>
      </dl>`;
  };

  const screenCart = () => {
    const totalRow = `<p class="mt-5 flex items-baseline justify-between text-xl font-bold"><span>${esc(T.cart.total)}</span><span class="tabular-nums">${money(total())}</span></p>
      <p class="text-sm text-muted">${esc(T.cart.priceNote)}</p>`;
    if (state.mode === 'voice') {
      const body = state.pending
        ? confirmButtons()
        : sayButtons(T.cart.pickup.map((p) => ({ label: p.label, key: p.id })));
      return `${header(T.cart.title)}${aiBubble()}${body}${cartDetails()}${totalRow}${navRow()}`;
    }
    const pickup = `
      <fieldset class="mt-5">
        <legend class="font-semibold">${esc(T.cart.pickupLabel)}</legend>
        <div class="mt-2 grid grid-cols-2 gap-2">
          ${T.cart.pickup
            .map(
              (p) => `<label class="${OPTION} !min-h-12 !py-2"><input type="radio" name="pickup" value="${p.id}" data-pickup data-key="pickup-${p.id}"
                class="h-5 w-5 shrink-0 accent-[var(--cobalt)]" ${state.pickup === p.id ? 'checked' : ''} /><span>${esc(p.label)}</span></label>`,
            )
            .join('')}
        </div>
      </fieldset>`;
    return `${header(T.cart.title)}${cartDetails()}${pickup}${totalRow}
      ${navRow(format(T.cart.confirm, { total: money(total()) }))}`;
  };

  const screenPayment = () => {
    const title = format(T.payment.title, { total: money(total()) });
    const note = `<p class="mt-4 flex items-start gap-2 rounded-xl bg-bg p-3 text-sm text-muted">${icon('alert', 18, 'mt-0.5')}<span>${esc(T.payment.note)}</span></p>`;
    if (state.mode === 'voice') {
      const body = state.pending
        ? confirmButtons()
        : sayButtons([
            { label: T.payment.voiceOptions.apple, key: 'apple' },
            { label: T.payment.voiceOptions.card, key: 'card' },
          ]);
      return `${header(title)}${aiBubble()}${body}${note}${navRow()}`;
    }
    return `${header(title)}
      <div class="mt-6 grid gap-3">
        <button type="button" data-pay="apple" data-key="pay-apple" class="${BTN} bg-ink text-white hover:bg-[#1c2450]">${icon('apple', 22)}${esc(T.payment.applePay)}</button>
        <button type="button" data-pay="card" data-key="pay-card" class="${BTN} btn-secondary">${icon('card', 22)}${esc(T.payment.card)}</button>
      </div>
      ${note}${navRow()}`;
  };

  const screenDone = () => {
    const contact = state.contact || T.done.receiptFallback;
    return `${header(format(T.done.title, { number: state.orderNumber }), { progress: false })}
      ${aiBubble()}
      <div class="mt-6 rounded-2xl bg-cobalt p-6 text-center text-white">
        <p class="text-sm font-semibold uppercase tracking-wider">${esc(T.done.statusLabel)}</p>
        <p class="mt-1 text-2xl font-bold">${esc(T.done.status)}</p>
        <p class="mt-4 text-5xl font-extrabold tracking-tight">${esc(state.orderNumber)}</p>
      </div>
      <p class="mt-5 flex items-start gap-2 text-base">${icon('receipt', 20, 'mt-0.5 text-cobalt')}<span>${esc(format(T.done.receiptTo, { contact }))}</span></p>
      <div class="mt-auto pt-6">
        <button type="button" data-action="restart" data-key="restart" class="${BTN} btn-secondary">${icon('repeat')}${esc(T.restart)}</button>
      </div>`;
  };

  const screenStaff = () => {
    const parts = summaryParts();
    return `${header(T.staff.title, { progress: false })}
      ${aiBubble()}
      <p class="mt-4">${esc(T.staff.text)}</p>
      <div class="mt-5 rounded-2xl border-2 border-[#bfe23a] bg-lime-tint p-4">
        <dl class="space-y-3 text-base">
          <div><dt class="font-semibold">${esc(T.staff.reasonLabel)}</dt><dd>${esc(T.staff.reason)}</dd></div>
          <div><dt class="font-semibold">${esc(T.staff.cartLabel)}</dt>
            <dd>${parts.length ? `<ul class="list-disc pl-5">${parts.map((p) => `<li>${esc(p.label)}</li>`).join('')}</ul>` : esc(T.staff.emptyCart)}</dd></div>
        </dl>
      </div>
      <div class="mt-auto pt-6">
        <button type="button" data-action="staff-back" data-key="staff-back" class="${BTN} btn-primary">${icon('back')}${esc(T.staff.back)}</button>
      </div>`;
  };

  const screen = () => {
    if (state.staffOpen) return screenStaff();
    const name = stepName();
    if (name === 'language') return screenLanguage();
    if (name === 'contact') return screenContact();
    if (name.startsWith('q')) return screenQuestion(Number(name.slice(1)));
    if (name === 'cart') return screenCart();
    if (name === 'payment') return screenPayment();
    return screenDone();
  };

  /**
   * Render the phone. `focus`:
   *  - 'heading' moves focus to the screen title (step changes);
   *  - 'keep' restores focus to the control with the same data-key;
   *  - 'none' leaves focus alone.
   */
  const render = (focus: 'heading' | 'keep' | 'none' = 'keep', focusKey?: string) => {
    const active = document.activeElement as HTMLElement | null;
    const key = focusKey ?? (active && root.contains(active) ? active.dataset.key : undefined);

    root.innerHTML = `
      <div class="flex flex-1 flex-col px-5 pb-6 pt-4">${screen()}</div>
      ${state.staffOpen ? '' : commandBar()}`;

    if (focus === 'heading') {
      root.querySelector<HTMLElement>('[data-demo-heading]')?.focus();
    } else if (focus === 'keep' && key) {
      const el =
        root.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`) ??
        root.querySelector<HTMLElement>('[data-demo-heading]');
      el?.focus();
    }
  };

  /** Announce the current screen to assistive tech (and speak it in voice mode). */
  const announceScreen = () => {
    const parts: string[] = [];
    const isDone = !state.staffOpen && stepName() === 'done';
    if (!state.staffOpen && !isDone) parts.push(progressText());
    if (state.mode === 'voice') {
      const p = promptFor();
      parts.push(`${T.aiSays}: ${p}`);
      speak(p);
    } else if (isDone) {
      parts.push(
        `${T.done.statusLabel}: ${T.done.status}`,
        format(T.done.receiptTo, { contact: state.contact || T.done.receiptFallback }),
      );
    } else if (state.staffOpen) {
      parts.push(T.staff.text);
    }
    announce(parts.join('. '));
  };

  const goTo = (step: number) => {
    state.step = Math.max(0, Math.min(STEPS.length - 1, step));
    state.pending = null;
    state.said = null;
    state.error = null;
    if (stepName() === 'done' && !state.orderNumber) {
      state.orderNumber = `A-${String(Math.floor(10 + Math.random() * 89))}`;
    }
    render('heading');
    announceScreen();
  };

  const next = () => goTo(state.step + 1);

  /* ---------------- voice path ---------------- */

  const hear = (label: string, apply: () => void) => {
    state.said = label;
    state.pending = { label, apply };
    const msg = format(T.heard, { choice: label });
    render('none');
    // After hearing, move focus to the "Yes" button so the confirmation is one key away.
    root.querySelector<HTMLElement>('[data-key="confirm-yes"]')?.focus();
    announce(`${T.youSaid}: ${label}. ${T.aiSays}: ${msg}`);
    speak(msg);
  };

  const handleSay = (key: string) => {
    const name = stepName();
    if (name === 'language') {
      const o = T.language.options.find((x) => x.code === key)!;
      hear(o.label, () => (state.lang = o.code));
    } else if (name === 'contact') {
      hear(T.contact.voiceSample, () => (state.contact = T.contact.voiceSample));
    } else if (name.startsWith('q')) {
      const q = question(Number(name.slice(1)));
      const isMulti = 'multi' in q && q.multi;
      if (key === '__none' && 'noneLabel' in q) {
        hear(q.noneLabel ?? '', () => (state.answers[q.id] = []));
      } else {
        hear(optLabel(q, key), () => (state.answers[q.id] = isMulti ? [key] : key));
      }
    } else if (name === 'cart') {
      const p = T.cart.pickup.find((x) => x.id === key)!;
      hear(p.label, () => (state.pickup = p.id));
    } else if (name === 'payment') {
      hear(key === 'apple' ? T.payment.voiceOptions.apple : T.payment.voiceOptions.card, () => {});
    }
  };

  /* ---------------- events ---------------- */

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLElement>('button');
    if (!btn || !root.contains(btn)) return;

    if (btn.dataset.lang) {
      state.lang = btn.dataset.lang;
      next();
      return;
    }
    if (btn.dataset.say) {
      handleSay(btn.dataset.say);
      return;
    }
    if (btn.dataset.pay) {
      next();
      return;
    }

    switch (btn.dataset.action) {
      case 'next':
        return onNext();
      case 'back':
        return goTo(state.step - 1);
      case 'restart': {
        const mode = state.mode;
        state = initial();
        state.mode = mode;
        window.speechSynthesis?.cancel();
        return goTo(0);
      }
      case 'confirm-yes': {
        state.pending?.apply();
        return next();
      }
      case 'confirm-repeat':
        state.pending = null;
        state.said = null;
        render('none');
        root.querySelector<HTMLElement>('[data-say]')?.focus();
        announceScreen();
        return;
      case 'repeat':
        state.pending = null;
        state.said = null;
        render('keep', 'cmd-repeat');
        announceScreen();
        return;
      case 'staff':
        state.staffOpen = true;
        state.pending = null;
        render('heading');
        announceScreen();
        return;
      case 'staff-back':
        state.staffOpen = false;
        render('heading');
        announceScreen();
        return;
    }
  });

  const onNext = () => {
    const name = stepName();
    if (name === 'contact' && state.mode === 'standard') {
      const v = state.contact.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/\D/g, '').length >= 7;
      if (!ok) {
        state.error = T.contact.error;
        render('none');
        root.querySelector<HTMLElement>('#demo-contact')?.focus();
        announce(T.contact.error);
        return;
      }
    }
    if (name.startsWith('q') && state.mode === 'standard') {
      const q = question(Number(name.slice(1)));
      const isMulti = 'multi' in q && q.multi;
      if (isMulti && state.answers[q.id] === undefined) state.answers[q.id] = [];
      if (!isMulti && state.answers[q.id] === undefined) {
        state.error = T.chooseError;
        render('none');
        root.querySelector<HTMLElement>('input:not(:disabled)')?.focus();
        announce(state.error);
        return;
      }
    }
    next();
  };

  root.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.id === 'demo-contact') state.contact = el.value;
  });

  root.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.dataset.marketing !== undefined) {
      state.marketing = el.checked;
      return;
    }
    if (el.dataset.pickup !== undefined) {
      state.pickup = el.value;
      return;
    }
    if (el.dataset.none) {
      const qid = el.dataset.none;
      if (el.checked) state.answers[qid] = [];
      else delete state.answers[qid];
      render('keep');
      return;
    }
    if (el.dataset.q) {
      const q = T.questions.find((x) => x.id === el.dataset.q)!;
      const isMulti = 'multi' in q && q.multi;
      if (isMulti) {
        const cur = new Set(Array.isArray(state.answers[q.id]) ? (state.answers[q.id] as string[]) : []);
        if (el.checked) cur.add(el.value);
        else cur.delete(el.value);
        state.answers[q.id] = [...cur];
        render('keep'); // keeps "No vegetables" in sync
      } else {
        state.answers[q.id] = el.value;
        if (state.error) {
          state.error = null;
          render('keep');
        }
      }
    }
  });

  // Enter in the contact field submits the step.
  root.addEventListener('keydown', (e) => {
    const el = e.target as HTMLElement;
    if (e.key === 'Enter' && el.id === 'demo-contact') {
      e.preventDefault();
      onNext();
    }
  });

  document.querySelectorAll<HTMLInputElement>('input[name="demo-mode"]').forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      state.mode = input.value as Mode;
      state.pending = null;
      state.said = null;
      state.error = null;
      if (speakWrap) speakWrap.hidden = !(canSpeak && state.mode === 'voice');
      if (state.mode !== 'voice') window.speechSynthesis?.cancel();
      render('none');
      announce(`${T.modeAnnounce[state.mode]} ${state.mode === 'voice' ? `${T.aiSays}: ${promptFor()}` : ''}`);
      speak(promptFor());
    });
  });

  speakToggle?.addEventListener('change', () => {
    if (speakToggle.checked) speak(promptFor());
    else window.speechSynthesis?.cancel();
  });

  if (speakWrap) speakWrap.hidden = !(canSpeak && state.mode === 'voice');
  render('none');
}
