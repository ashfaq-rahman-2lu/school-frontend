import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SchoolShell, UnavailableSchool } from '../src/components/school-shell';

describe('public school shell', () => {
  it('names the current school and offers only available navigation', () => {
    render(<SchoolShell name="North School" />);
    expect(screen.getByRole('heading', { name: 'North School', level: 1 })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'School navigation' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: /sign in|portal|students/i })).not.toBeInTheDocument();
  });
  it('provides keyboard access to skip repeated navigation', async () => {
    render(<SchoolShell name="North School" />);
    await userEvent.tab();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });
  it('replaces the school presentation when navigation changes schools', () => {
    const { rerender } = render(<SchoolShell name="North School" />);
    rerender(<SchoolShell name="South School" />);
    expect(screen.getByRole('heading', { name: 'South School' })).toBeVisible();
    expect(screen.queryByText('North School')).not.toBeInTheDocument();
  });
  it('presents unavailable schools without private directory details', () => {
    render(<UnavailableSchool />);
    expect(screen.getByRole('heading', { name: 'School unavailable' })).toBeVisible();
    expect(screen.getByText('Please try again later.')).toBeVisible();
    expect(screen.queryByText(/schema|provisioning|North School/i)).not.toBeInTheDocument();
  });
});
