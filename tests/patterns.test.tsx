import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Button, Field, EmptyState, LoadingState } from '../src/components/patterns';

it('associates field validation errors and preserves keyboard form submission', async () => {
  function Form() {
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    return <form onSubmit={(event) => { event.preventDefault(); const value = new FormData(event.currentTarget).get('name'); if (!value) setError('Enter a name'); else { setError(''); setSaved(true); } }}>
      <Field name="name" label="Name" error={error} />
      <Button>Save</Button>{saved ? <p role="status">Saved</p> : null}
    </form>;
  }
  render(<Form />);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  const input = screen.getByRole('textbox', { name: 'Name' });
  expect(input).toHaveAccessibleDescription('Enter a name');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  await userEvent.type(input, 'School{Enter}');
  expect(screen.getByRole('status')).toHaveTextContent('Saved');
  expect(input).not.toHaveAttribute('aria-invalid', 'true');
});
it('exposes progress and prevents duplicate submission', () => {
  render(<Button pending>Save</Button>);
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
});
it('announces loading and describes empty results', () => {
  render(<><LoadingState /><EmptyState message="No information available." /></>);
  expect(screen.getByRole('status')).toHaveTextContent('Loading…');
  expect(screen.getByText('No information available.')).toBeVisible();
});
