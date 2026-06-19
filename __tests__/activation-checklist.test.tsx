import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivationChecklist } from '@/components/dashboard/activation-checklist';

vi.mock('@/lib/features', () => ({
  isFeatureEnabled: (name: string) => name === 'squads' ? true : false,
}));

describe('ActivationChecklist Component', () => {
  const mockUser = {
    pseudo: 'testuser',
    githubUrl: 'https://github.com/test',
    linkedinUrl: null,
  };

  it('renders correctly and shows progress', () => {
    render(<ActivationChecklist user={mockUser} hasSquad={false} hasSubmission={false} />);
    
    // Quiz is always completed by default in logic
    expect(screen.getByText('Calibration terminée')).toBeDefined();
    
    // Profile should be completed based on mockUser
    expect(screen.getByText('Identité configurée')).toBeDefined();
    
    // Squad and Mission should be pending
    expect(screen.getAllByText('Initialiser')).toHaveLength(2);
  });

  it('hides when all steps are completed', () => {
    const fullUser = { ...mockUser, linkedinUrl: 'linked' };
    const { container } = render(
      <ActivationChecklist user={fullUser} hasSquad={true} hasSubmission={true} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('calculates profile completion correctly', () => {
    const incompleteUser = { pseudo: '', githubUrl: null, linkedinUrl: null };
    render(<ActivationChecklist user={incompleteUser} hasSquad={false} hasSubmission={false} />);
    
    const profileCard = screen.getByText('Identité configurée');
    expect(profileCard).toBeDefined();
    // Should show "Initialiser" button for profile
    const buttons = screen.getAllByText('Initialiser');
    expect(buttons.length).toBe(3); // Profile, Squad, Mission
  });
});
