import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import App from '../App.jsx';
import { content } from '../data/content.js';
import { renderWithProviders } from './test-utils.jsx';

describe('App routing', () => {
  it('renders the home page at /', () => {
    renderWithProviders(<App />, { route: '/' });
    expect(screen.getByRole('heading', { level: 1, name: content.en.hero.name })).toBeInTheDocument();
  });

  it('renders the projects page at /projects', async () => {
    renderWithProviders(<App />, { route: '/projects' });
    expect(await screen.findByText(content.en.projectsPage.heading)).toBeInTheDocument();
  });

  it('renders the about page at /about', async () => {
    renderWithProviders(<App />, { route: '/about' });
    expect(await screen.findByText(content.en.aboutPage.heading)).toBeInTheDocument();
  });

  it('renders the blog page at /blog', async () => {
    renderWithProviders(<App />, { route: '/blog' });
    expect(await screen.findByText(content.en.blogPage.heading)).toBeInTheDocument();
  });

  it('renders the contact page at /contact', async () => {
    renderWithProviders(<App />, { route: '/contact' });
    expect(await screen.findByText(content.en.contactPage.heading)).toBeInTheDocument();
  });
});
