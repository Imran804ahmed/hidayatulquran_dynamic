"use client";

import { createContext, Fragment, useActionState, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { initialActionState, type ActionState } from "@/lib/portal/form-types";

/*
 * Client form toolkit for portal Server Actions.
 *  - <ActionForm> wraps useActionState; after each submission the fields re-mount with the
 *    values the server returned, so validation errors never wipe what the user typed.
 *  - Fields read their value / error from context and wire aria-invalid + aria-describedby.
 *  - <SubmitButton> disables itself while pending (prevents duplicate submissions) and can ask
 *    for confirmation in an accessible dialog before destructive actions.
 *  - Unsaved changes trigger a warning on tab close and on in-app link clicks.
 */

type Ctx = { state: ActionState; pending: boolean; markDirty: () => void };
const FormCtx = createContext<Ctx>({ state: initialActionState, pending: false, markDirty: () => {} });
export const useFormCtx = () => useContext(FormCtx);

type Action = (state: ActionState, fd: FormData) => Promise<ActionState>;

export function ActionForm({ action, children, className, guard = true, id, successMessage }: {
  action: Action; children: ReactNode; className?: string; guard?: boolean; id?: string; successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);
  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  // A completed submission that stayed on the page: clear the dirty flag when it succeeded.
  const [handledState, setHandledState] = useState(state);
  if (handledState !== state) {
    setHandledState(state);
    if (state.nonce > 0 && state.ok) setDirty(false);
  }

  useEffect(() => {
    if (!guard) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!dirtyRef.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      if (!window.confirm("You have unsaved changes. Leave this page and discard them?")) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        dirtyRef.current = false;
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [guard]);

  // Focus the first invalid field after a failed submission.
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.nonce > 0 && Object.keys(state.errors).length) {
      formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
    }
  }, [state]);

  return (
    <FormCtx.Provider value={{ state, pending, markDirty: () => setDirty(true) }}>
      <form
        ref={formRef}
        id={id}
        className={className}
        action={formAction}
        noValidate
        onInput={() => guard && setDirty(true)}
        onChange={() => guard && setDirty(true)}
        onSubmit={() => { dirtyRef.current = false; }}
        aria-busy={pending}
      >
        {state.message && (
          <div className={`alert ${state.ok ? "alert-success" : "alert-error"}`} role={state.ok ? "status" : "alert"}>
            <i className={`bi ${state.ok ? "bi-check-circle-fill" : "bi-exclamation-octagon-fill"}`} aria-hidden="true" />
            <p>{state.message}</p>
          </div>
        )}
        {state.ok && state.nonce > 0 && !state.message && successMessage && (
          <div className="alert alert-success" role="status"><i className="bi bi-check-circle-fill" aria-hidden="true" /><p>{successMessage}</p></div>
        )}
        <Fragment key={state.nonce}>{children}</Fragment>
      </form>
    </FormCtx.Provider>
  );
}

function useField(name: string, defaultValue?: string | number | null) {
  const { state } = useFormCtx();
  const value = state.values && name in state.values ? state.values[name] : defaultValue === null || defaultValue === undefined ? "" : String(defaultValue);
  const error = state.errors[name];
  const errId = `err-${name}`;
  return { value, error, aria: error ? { "aria-invalid": true as const, "aria-describedby": errId } : {}, errId };
}

function Label({ htmlFor, label, required, optional }: { htmlFor: string; label: ReactNode; required?: boolean; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor}>
      {label}
      {required && <><span className="req" aria-hidden="true">*</span><span className="sr-only"> (required)</span></>}
      {optional && <span className="opt">(optional)</span>}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return error ? <p className="field-error" id={id}><i className="bi bi-exclamation-circle" aria-hidden="true" /> {error}</p> : null;
}

type BaseProps = { name: string; label: ReactNode; required?: boolean; optional?: boolean; hint?: ReactNode; className?: string };

export function TextField({ name, label, required, optional, hint, className, defaultValue, type = "text", autoComplete, placeholder, maxLength, min, max, inputMode }: BaseProps & {
  defaultValue?: string | number | null; type?: string; autoComplete?: string; placeholder?: string; maxLength?: number; min?: string | number; max?: string | number; inputMode?: "numeric" | "tel" | "email" | "text";
}) {
  const f = useField(name, defaultValue);
  const id = `f-${name}`;
  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      <Label htmlFor={id} label={label} required={required} optional={optional} />
      <input className="input" id={id} name={name} type={type} defaultValue={f.value} required={required} autoComplete={autoComplete}
        placeholder={placeholder} maxLength={maxLength} min={min} max={max} inputMode={inputMode} {...f.aria} />
      {hint && <p className="hint">{hint}</p>}
      <ErrorText id={f.errId} error={f.error} />
    </div>
  );
}

export function TextArea({ name, label, required, optional, hint, className, defaultValue, rows = 4, maxLength }: BaseProps & { defaultValue?: string | null; rows?: number; maxLength?: number }) {
  const f = useField(name, defaultValue);
  const id = `f-${name}`;
  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      <Label htmlFor={id} label={label} required={required} optional={optional} />
      <textarea className="input" id={id} name={name} rows={rows} defaultValue={f.value} required={required} maxLength={maxLength} {...f.aria} />
      {hint && <p className="hint">{hint}</p>}
      <ErrorText id={f.errId} error={f.error} />
    </div>
  );
}

export function SelectField({ name, label, required, optional, hint, className, defaultValue, options, placeholder, onValue }: BaseProps & {
  defaultValue?: string | number | null; options: [string, string][]; placeholder?: string; onValue?: (v: string) => void;
}) {
  const f = useField(name, defaultValue);
  const id = `f-${name}`;
  return (
    <div className={`field${className ? ` ${className}` : ""}`}>
      <Label htmlFor={id} label={label} required={required} optional={optional} />
      <select className="input" id={id} name={name} defaultValue={f.value} required={required} onChange={(e) => onValue?.(e.target.value)} {...f.aria}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      {hint && <p className="hint">{hint}</p>}
      <ErrorText id={f.errId} error={f.error} />
    </div>
  );
}

export function CheckboxGroup({ name, label, options, defaultValue, hint, optional }: { name: string; label: ReactNode; options: [string, string][]; defaultValue?: string[]; hint?: ReactNode; optional?: boolean }) {
  const { state } = useFormCtx();
  const selected = state.values && name in state.values ? state.values[name].split(",") : defaultValue ?? [];
  const error = state.errors[name];
  return (
    <fieldset className="field" style={{ border: 0, padding: 0, margin: "0 0 16px" }} aria-describedby={error ? `err-${name}` : undefined}>
      <legend className="label" style={{ marginBottom: 6 }}>{label}{optional && <span className="opt">(optional)</span>}</legend>
      <div className="checks">
        {options.map(([v, l]) => (
          <label key={v} className="check"><input type="checkbox" name={name} value={v} defaultChecked={selected.includes(v)} /> {l}</label>
        ))}
      </div>
      {hint && <p className="hint">{hint}</p>}
      <ErrorText id={`err-${name}`} error={error} />
    </fieldset>
  );
}

export function Checkbox({ name, label, defaultChecked, value = "1", hint }: { name: string; label: ReactNode; defaultChecked?: boolean; value?: string; hint?: ReactNode }) {
  const { state } = useFormCtx();
  const checked = state.values ? state.values[name] === value : Boolean(defaultChecked);
  return (
    <div className="field">
      <label className="check"><input type="checkbox" name={name} value={value} defaultChecked={checked} /> {label}</label>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Hidden({ name, value }: { name: string; value: string | number }) {
  return <input type="hidden" name={name} value={String(value)} />;
}

export function PasswordField({ name, label, autoComplete, hint, required = true }: { name: string; label: ReactNode; autoComplete: string; hint?: ReactNode; required?: boolean }) {
  const [show, setShow] = useState(false);
  const { state } = useFormCtx();
  const error = state.errors[name];
  const id = `f-${name}`;
  return (
    <div className="field">
      <Label htmlFor={id} label={label} required={required} />
      <div className="password-wrap">
        <input className="input" id={id} name={name} type={show ? "text" : "password"} autoComplete={autoComplete} required={required}
          {...(error ? { "aria-invalid": true, "aria-describedby": `err-${name}` } : {})} />
        <button type="button" className="password-toggle" aria-controls={id} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
          <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true" />
        </button>
      </div>
      {hint && <p className="hint">{hint}</p>}
      <ErrorText id={`err-${name}`} error={error} />
    </div>
  );
}

/** Accessible confirmation dialog built on <dialog>. */
export function useConfirm() {
  const [req, setReq] = useState<{ message: string; title: string; ok: string; danger: boolean; resolve: (v: boolean) => void } | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (req && ref.current && !ref.current.open) ref.current.showModal();
  }, [req]);
  const close = (v: boolean) => {
    ref.current?.close();
    req?.resolve(v);
    setReq(null);
  };
  const ask = (message: string, opts: { title?: string; ok?: string; danger?: boolean } = {}) =>
    new Promise<boolean>((resolve) => setReq({ message, title: opts.title ?? "Please confirm", ok: opts.ok ?? "Confirm", danger: Boolean(opts.danger), resolve }));
  const dialog = req ? (
    <dialog ref={ref} className="modal" aria-labelledby="confirm-title" onCancel={(e) => { e.preventDefault(); close(false); }}>
      <div className="modal-body">
        <h2 id="confirm-title">{req.danger && <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" style={{ color: "var(--danger)" }} />}{req.title}</h2>
        <p>{req.message}</p>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" autoFocus onClick={() => close(false)}>Cancel</button>
        <button type="button" className={`btn ${req.danger ? "btn-danger" : "btn-primary"}`} onClick={() => close(true)}>{req.ok}</button>
      </div>
    </dialog>
  ) : null;
  return { ask, dialog };
}

export function SubmitButton({ children, variant = "primary", name, value, confirm, confirmTitle, confirmOk, danger, size, icon, pendingLabel = "Saving…", className }: {
  children: ReactNode; variant?: "primary" | "secondary" | "gold" | "danger" | "ghost"; name?: string; value?: string;
  confirm?: string; confirmTitle?: string; confirmOk?: string; danger?: boolean; size?: "sm"; icon?: string; pendingLabel?: string; className?: string;
}) {
  const { pending } = useFormCtx();
  const { ask, dialog } = useConfirm();
  return (
    <>
      <button
        type="submit"
        name={name}
        value={value}
        className={`btn btn-${variant}${size ? ` btn-${size}` : ""}${className ? ` ${className}` : ""}`}
        disabled={pending}
        aria-disabled={pending}
        onClick={async (e) => {
          if (!confirm) return;
          // requestSubmit() below does not fire another click, so no loop.
          e.preventDefault();
          const btn = e.currentTarget;
          if (await ask(confirm, { title: confirmTitle, ok: confirmOk, danger })) btn.form?.requestSubmit(btn);
        }}
      >
        {pending ? <span className="spinner" aria-hidden="true" /> : icon ? <i className={`bi bi-${icon}`} aria-hidden="true" /> : null}
        {pending ? pendingLabel : children}
      </button>
      {dialog}
    </>
  );
}

/** Field-independent message for errors not tied to a single input. */
export function FormError({ name }: { name: string }) {
  const { state } = useFormCtx();
  const error = state.errors[name];
  return error ? <p className="field-error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" /> {error}</p> : null;
}

/** Shows children only while another field has one of the given values (e.g. rejection reason). */
export function ShowWhen({ field, values, initial, children }: { field: string; values: string[]; initial: string; children: ReactNode }) {
  const { state } = useFormCtx();
  const start = state.values?.[field] ?? initial;
  const [current, setCurrent] = useState(start);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement;
      if (t.name !== field) return;
      if (t.type === "checkbox") setCurrent(t.checked ? t.value : "");
      else if (t.type !== "radio" || t.checked) setCurrent(t.value);
    };
    form.addEventListener("change", onChange);
    return () => form.removeEventListener("change", onChange);
  }, [field]);
  const show = values.includes(current);
  return <div ref={ref} hidden={!show}>{show ? children : null}</div>;
}
