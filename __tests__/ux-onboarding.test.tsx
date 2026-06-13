import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { TourButton } from '@/components/tour/tour-button'
import { usePathname } from 'next/navigation'
import { driver } from 'driver.js'

// Mock dependencies
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

vi.mock('driver.js', () => ({
  driver: vi.fn(() => ({
    drive: vi.fn(),
    destroy: vi.fn(),
    hasNextStep: vi.fn(() => true),
  })),
}))

describe('TourButton & Onboarding Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(usePathname).mockReturnValue('/dashboard')
  })

  it('renders correctly', () => {
    render(<TourButton />)
    expect(screen.getByRole('button')).toBeDefined()
  })

  it('should not auto-start if autoStart is false', () => {
    render(<TourButton autoStart={false} />)
    const driverMock = vi.mocked(driver)
    expect(driverMock).not.toHaveBeenCalled()
  })

  it('should auto-start if autoStart is true and not in localStorage', async () => {
    vi.useFakeTimers()
    render(<TourButton autoStart={true} />)
    
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    const driverMock = vi.mocked(driver)
    expect(driverMock).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('should NOT auto-start if already in localStorage', async () => {
    localStorage.setItem('tour_completed_/dashboard', 'true')
    vi.useFakeTimers()
    render(<TourButton autoStart={true} />)
    
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    const driverMock = vi.mocked(driver)
    expect(driverMock).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
