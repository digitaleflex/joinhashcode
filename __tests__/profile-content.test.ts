import { describe, it, expect } from 'vitest'
import {
  PROFILE_CONTENT,
  PROFILE_COLORS,
  getProfileContent,
  getHybridContent,
  type ProfileType,
} from '../lib/profile-content'
import { APP_URL } from '../lib/config'

describe('PROFILE_CONTENT', () => {
  const profiles: ProfileType[] = ['builder', 'creator', 'strategist', 'catalyst']

  it('contient les 4 profils', () => {
    profiles.forEach(p => expect(PROFILE_CONTENT[p]).toBeDefined())
  })

  it('chaque profil a 3 vérités', () => {
    profiles.forEach(p => {
      expect(PROFILE_CONTENT[p].truths).toHaveLength(3)
    })
  })

  it('chaque profil a 2 missions déverrouillées et au moins 3 verrouillées', () => {
    profiles.forEach(p => {
      const { unlockedMissions, lockedMissions } = PROFILE_CONTENT[p]
      expect(unlockedMissions).toHaveLength(2)
      expect(lockedMissions.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('getProfileContent retourne le bon contenu', () => {
    expect(getProfileContent('builder').name).toBe('Builder')
    expect(getProfileContent('creator').name).toBe('Créateur')
  })

  it('getHybridContent combine 2 vérités du primaire et 1 du secondaire', () => {
    const hybrid = getHybridContent('builder', 'creator')
    expect(hybrid.truths).toHaveLength(3)
    expect(hybrid.truths[0]).toEqual(PROFILE_CONTENT['builder'].truths[0])
    expect(hybrid.truths[1]).toEqual(PROFILE_CONTENT['builder'].truths[1])
    expect(hybrid.truths[2]).toEqual(PROFILE_CONTENT['creator'].truths[0])
  })

  it('PROFILE_COLORS contient une couleur hex pour chaque profil', () => {
    profiles.forEach(p => {
      expect(PROFILE_COLORS[p]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })

  it('whatsappText contient APP_URL pour tous les profils', () => {
    profiles.forEach(p => {
      expect(PROFILE_CONTENT[p].whatsappText).toContain(APP_URL)
    })
  })
})
