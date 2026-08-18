import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { LanguageProvider } from '../context/LanguageContext.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <LanguageProvider>{ui}</LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

export * from '@testing-library/react';
