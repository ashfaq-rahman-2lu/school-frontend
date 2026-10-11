import { useId, type ComponentProps } from 'react';

export function Field({ label, error, id, name, ...props }: ComponentProps<'input'> & { label: string; error?: string }) {
  const generatedId = useId();
  const fieldId = id ?? name ?? generatedId;
  const errorId = `${fieldId}-error`;
  return <div className="field">
    <label htmlFor={fieldId}>{label}</label>
    <input {...props} name={name} id={fieldId} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} />
    {error ? <p id={errorId} className="field-error">{error}</p> : null}
  </div>;
}

export function Button({ pending, children, disabled, ...props }: ComponentProps<'button'> & { pending?: boolean }) {
  return <button {...props} disabled={pending || disabled} aria-busy={pending ? true : undefined}>{pending ? 'Saving…' : children}</button>;
}

export function EmptyState({ message }: { message: string }) { return <p>{message}</p>; }
export function LoadingState() { return <p role="status">Loading…</p>; }
