import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PreQuizDiagnostic } from '../components/quiz/pre-quiz-diagnostic'

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

beforeEach(() => localStorageMock.clear())

describe('PreQuizDiagnostic', () => {
  it('affiche la première question au chargement', () => {
    render(<PreQuizDiagnostic onComplete={vi.fn()} />)
    expect(screen.getByText(/As-tu un projet informatique terminé/i)).toBeDefined()
  })

  it('avance à la question suivante après un choix', () => {
    render(<PreQuizDiagnostic onComplete={vi.fn()} />)
    fireEvent.click(screen.getByText('Pas encore'))
    expect(screen.getByText(/dans quel métier tu veux travailler/i)).toBeDefined()
  })

  it('appelle onComplete avec les réponses après la dernière question', () => {
    const onComplete = vi.fn()
    render(<PreQuizDiagnostic onComplete={onComplete} />)
    fireEvent.click(screen.getByText('Pas encore'))
    fireEvent.click(screen.getByText('Pas vraiment'))
    fireEvent.click(screen.getByText('4+'))
    fireEvent.click(screen.getByText('Non'))
    fireEvent.click(screen.getByText('Souvent'))
    expect(onComplete).toHaveBeenCalledOnce()
    expect(onComplete).toHaveBeenCalledWith({
      project: 'no',
      direction: 'no',
      languages: 'many',
      mentor: 'no',
      lost: 'often',
    })
  })

  it('stocke les réponses dans localStorage à la fin', () => {
    render(<PreQuizDiagnostic onComplete={vi.fn()} />)
    fireEvent.click(screen.getByText('Pas encore'))
    fireEvent.click(screen.getByText('Pas vraiment'))
    fireEvent.click(screen.getByText('4+'))
    fireEvent.click(screen.getByText('Non'))
    fireEvent.click(screen.getByText('Souvent'))
    expect(localStorageMock.getItem('hashcode_diagnostic_done')).toBe('true')
  })
})
