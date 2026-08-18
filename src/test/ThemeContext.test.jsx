import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext.jsx';

function ToggleProbe() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} data-testid="toggle">
      {theme}
    </button>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('applies data-theme to the document root and flips it on toggle', () => {
    render(
      <ThemeProvider>
        <ToggleProbe />
      </ThemeProvider>
    );

    const before = document.documentElement.getAttribute('data-theme');
    expect(['light', 'dark']).toContain(before);

    act(() => {
      fireEvent.click(screen.getByTestId('toggle'));
    });

    const after = document.documentElement.getAttribute('data-theme');
    expect(after).not.toBe(before);
    expect(localStorage.getItem('theme')).toBe(after);
  });
});
