import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

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


describe('Smoke Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should render a basic element', () => {
    render(<div data-testid="test">Hashcode</div>)
    expect(screen.getByTestId('test')).toHaveTextContent('Hashcode')
  })

})
