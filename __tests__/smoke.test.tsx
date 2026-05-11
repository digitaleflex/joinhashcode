import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Smoke Test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })

  it('should render a basic element', () => {
    render(<div data-testid="test">Hashcode</div>)
    expect(screen.getByTestId('test')).toHaveTextContent('Hashcode')
  })
})
