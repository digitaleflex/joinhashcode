import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LevelUpModal } from '@/components/dashboard/level-up-modal';

// Mock confetti to avoid canvas issues in jsdom
vi.mock('react-confetti', () => ({
  default: () => <div data-testid="confetti" />
}));

describe('LevelUpModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it('should open when level increases', () => {
    localStorage.setItem("hashcode_last_level", "1");
    render(<LevelUpModal currentLevel={2} userClass="BUILDER" />);
    
    // Check if dialog content exists (Radix Dialogs are portals, so we check screen)
    expect(screen.getByText(/OPÉRATEUR Core/i)).toBeDefined();
    expect(screen.getByText(/ACCÉDER AU NIVEAU 2/i)).toBeDefined();
    expect(screen.getByTestId('confetti')).toBeDefined();
  });

  it('should NOT open when level stays same', () => {
    localStorage.setItem("hashcode_last_level", "2");
    const { queryByText } = render(<LevelUpModal currentLevel={2} userClass="BUILDER" />);
    
    expect(queryByText('Niveau 2')).toBeNull();
  });

  it('should initialize last_level if not present', () => {
    render(<LevelUpModal currentLevel={1} userClass="BUILDER" />);
    expect(localStorage.getItem("hashcode_last_level")).toBe("1");
  });
});
