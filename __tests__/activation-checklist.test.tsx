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
    
    // Header
    expect(screen.getByText('progression')).toBeDefined();
    // 2/4 completed (quiz + profile)
    expect(screen.getByText('2 / 4 ÉTAPES')).toBeDefined();
    // Next step is Squad
    expect(screen.getByText(/Prochaine étape : Unité active/)).toBeDefined();
  });

  it('hides when all steps are completed', () => {
    const fullUser = { ...mockUser, linkedinUrl: 'linked' };
    const { container } = render(
      <ActivationChecklist user={fullUser as UserProfile} hasSquad={true} hasSubmission={true} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('shows 1/4 progress for incomplete user', () => {
    const incompleteUser = { pseudo: '', githubUrl: null, linkedinUrl: null };
    render(<ActivationChecklist user={incompleteUser as UserProfile} hasSquad={false} hasSubmission={false} />);
    
    // 1/4 completed (only quiz)
    expect(screen.getByText('1 / 4 ÉTAPES')).toBeDefined();
    // Next step is profile
    expect(screen.getByText(/Prochaine étape : Identité configurée/)).toBeDefined();
  });
});
