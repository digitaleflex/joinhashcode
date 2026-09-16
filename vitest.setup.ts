import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { config as loadEnv } from 'dotenv'

// Fix #355: Vitest n'injecte pas les variables d'environnement.
// Sans cela, `DATABASE_URL` est undefined et le client `pg` échoue avec
// « SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string ».
// dotenv ne surcharge pas les variables déjà définies → `.env.local` gagne
// sur `.env`, comme le fait Next.js.
loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

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
  usePathname: () => '/',
}))

// Cleanup after each test
afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

// Fix ReferenceError: window is not defined for better-auth in Node environment
if (typeof window === 'undefined') {
  (global as any).window = global;
  (global as any).BroadcastChannel = class {
    postMessage() {}
    close() {}
    onmessage = null;
    onmessageerror = null;
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return true; }
  };
}
