import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivationChecklist } from '@/components/dashboard/activation-checklist';
import type { UserProfile } from '@/lib/types';

vi.mock('@/lib/features', () => ({
  isFeatureEnabled: () => true,
}));

vi.mock('@/lib/features', () => ({
  isFeatureEnabled: () => true,
}));

describe('ActivationChecklist Component', () => {
  // Membre sans pseudo ni soumission : aucune étape complétée
  const mockUser = {
    pseudo: '',
    githubUrl: null,
    linkedinUrl: null,
    j7Activated: false, // Nouveau : pas encore activé J+7
  };

  it('renders correctly and shows progress', () => {
    render(<ActivationChecklist user={mockUser as UserProfile} hasSubmission={false} />);
    
    // Header
    expect(screen.getByText('progression')).toBeDefined();
    // Le quiz n'est plus une étape (D-030) : 3 étapes, aucune complétée
    expect(screen.getByText(/0 \/ 3 ÉTAPES/)).toBeDefined();
    // Next step is profile
    expect(screen.getByText(/Prochaine étape : Identité configurée/)).toBeDefined();
  });

  it('hides when all steps are completed', () => {
    const fullUser = { ...mockUser, linkedinUrl: 'linked', j7Activated: true };
    // Now all 5 steps completed: quiz (pseudo=''), profile (with linkedin), squad, mission, j7
    // Wait - pseudo='' means profile step is NOT completed. Let me reconsider.
    // Actually for "all steps completed", we need: pseudo set, squad=true, submission=true, j7Activated=true
    const fullUser2 = { 
      pseudo: 'testuser', 
      githubUrl: 'https://github.com/test', 
      linkedinUrl: 'linked', 
      j7Activated: true 
    };
    const { container } = render(
      <ActivationChecklist user={fullUser2 as UserProfile} hasSubmission={true} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('shows 0/3 progress for incomplete user', () => {
    // Membre sans pseudo ni soumission
    const incompleteUser = { pseudo: '', githubUrl: null, linkedinUrl: null, j7Activated: false };
    render(<ActivationChecklist user={incompleteUser as UserProfile} hasSubmission={false} />);
    
    // Aucune étape complétée
    expect(screen.getByText(/0 \/ 3 ÉTAPES/)).toBeDefined();
    // Next step is profile
    expect(screen.getByText(/Prochaine étape : Identité configurée/)).toBeDefined();
  });
});
