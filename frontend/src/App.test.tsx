import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

// Mock window.matchMedia since jsdom doesn't support it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('App Component', () => {
  it('should render the main application layout', () => {
    render(<App />);
    expect(screen.getByText('CalculaEng')).toBeInTheDocument();
    expect(screen.getAllByText('Cálculo Diferencial e Integral').length).toBeGreaterThan(0);
  });
});
