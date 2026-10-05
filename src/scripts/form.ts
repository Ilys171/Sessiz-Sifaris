/**
 * Pilot request form: accessible client-side validation and submission to
 * `siteConfig.formEndpoint` (see src/config.ts). With no endpoint configured,
 * nothing is sent and the visitor is pointed to the contact email.
 */
interface FormText {
  required: string;
  email: string;
  summary: string;
  sending: string;
  submit: string;
  success: string;
  failure: string;
  notConnected: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initPilotForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-pilot-form]');
  if (!form) return;

  const text = JSON.parse(form.dataset.text || '{}') as FormText;
  const endpoint = (form.dataset.endpoint || '').trim();
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const summary = form.querySelector<HTMLElement>('[data-form-summary]')!;
  const summaryText = form.querySelector<HTMLElement>('[data-form-summary-text]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const inputs = [...form.querySelectorAll<HTMLInputElement>('input[required]')];

  const setError = (input: HTMLInputElement, message: string | null) => {
    const box = document.getElementById(`${input.id}-error`);
    const slot = box?.querySelector<HTMLElement>('[data-error-text]');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (slot) slot.textContent = message;
      box?.classList.replace('hidden', 'flex');
    } else {
      input.removeAttribute('aria-invalid');
      if (slot) slot.textContent = '';
      box?.classList.replace('flex', 'hidden');
    }
  };

  const validate = (input: HTMLInputElement): string | null => {
    const v = input.value.trim();
    if (!v) return text.required;
    if (input.type === 'email' && !EMAIL.test(v)) return text.email;
    return null;
  };

  // Re-validate a field once it has been flagged, so errors clear as the user fixes them.
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setError(input, validate(input));
    });
  });

  const showStatus = (message: string, kind: 'ok' | 'info' | 'error') => {
    const styles = {
      ok: 'rounded-xl border-2 border-cobalt bg-cobalt-tint p-4 font-semibold text-ink',
      info: 'rounded-xl border-2 border-border bg-bg p-4 font-semibold text-ink',
      error: 'rounded-xl border-2 border-error bg-white p-4 font-semibold text-error',
    };
    status.className = `mt-5 ${styles[kind]}`;
    status.textContent = message;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'mt-5 empty:hidden';

    let firstInvalid: HTMLInputElement | null = null;
    for (const input of inputs) {
      const err = validate(input);
      setError(input, err);
      if (err && !firstInvalid) firstInvalid = input;
    }

    if (firstInvalid) {
      summaryText.textContent = text.summary;
      summary.classList.replace('hidden', 'flex');
      firstInvalid.focus();
      return;
    }
    summary.classList.replace('flex', 'hidden');

    if (!endpoint) {
      showStatus(text.notConnected, 'info');
      return;
    }

    submit.disabled = true;
    submit.textContent = text.sending;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      showStatus(text.success, 'ok');
    } catch {
      showStatus(text.failure, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = text.submit;
    }
  });
}
