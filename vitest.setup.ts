import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de Next.js router si besoin
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))
