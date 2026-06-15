import '@testing-library/jest-dom'
import { vi } from 'vitest'

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
