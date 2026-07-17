import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivationChecklist } from '@/components/dashboard/activation-checklist';
import type { UserProfile } from '@/lib/types';

vi.mock('@/lib/features', () => ({
  isFeatureEnabled: () => true,
}));

describe('ActivationChecklist Component', () => {
  const mockUser = {
    pseudo: 'testuser',
    githubUrl: 'https://github.com/test',
    linkedinUrl: null,
  };

  it('renders correctly and shows progress', () => {
    render(<ActivationChecklist user={mockUser as UserProfile} hasSquad={false} hasSubmission={false} />);
    
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
      <ActivationChecklist user={fullUser as UserProfile} hasSquad={true} hasSubmission={true} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('calculates profile completion correctly', () => {
    const incompleteUser = { pseudo: '', githubUrl: null, linkedinUrl: null };
    render(<ActivationChecklist user={incompleteUser as UserProfile} hasSquad={false} hasSubmission={false} />);
    
    const profileCard = screen.getByText('Identité configurée');
    expect(profileCard).toBeDefined();
    // Should show "Initialiser" button for profile
    const buttons = screen.getAllByText('Initialiser');
    expect(buttons.length).toBe(3); // Profile, Squad, Mission
  });
});
