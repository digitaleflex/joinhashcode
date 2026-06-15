import { render, screen } from '@testing-library/react'
import { describe, it, expect, test, vi } from 'vitest'
import { SquadJourney } from '@/components/dashboard/squad-journey'

// Mock better-auth client completely
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useSession: () => ({ data: null, isLoading: false }),
    signOut: vi.fn(),
    signIn: {
      social: vi.fn(),
    },
    organization: {
      useActiveOrganization: () => ({ data: null, isLoading: false }),
    }
  }
}))

// Simple mocks for test
const mockUser = { id: 'user_1' }
const mockSquad = { id: 'squad_1', name: 'Test Squad' }

describe('Smoke Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should render a basic element', () => {
    render(<div data-testid="test">Hashcode</div>)
    expect(screen.getByTestId('test')).toHaveTextContent('Hashcode')
  })

  test("affiche l'annonce si elle existe", () => {
    const squadWithAnnouncement = { ...mockSquad, announcement: "Test annonce" };
    render(<SquadJourney user={mockUser} squad={squadWithAnnouncement} />);
    expect(screen.getByText("ANNONCE ÉPINGLÉE")).toBeDefined();
    expect(screen.getByText("Test annonce")).toBeDefined();
  });
})
