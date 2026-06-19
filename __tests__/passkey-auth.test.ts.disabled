import { describe, it, expect } from 'vitest';
import { auth } from '../lib/auth';

describe('Better Auth Passkey Configuration Verification', () => {
  it('should have the passkey plugin correctly initialized in options', () => {
    // Vérification fondamentale : le plugin est présent dans la liste des plugins configurés
    const options = (auth as any).options;
    const passkeyPlugin = options.plugins.find((p: any) => p.id === 'passkey');
    
    expect(passkeyPlugin).toBeDefined();
    expect(passkeyPlugin.id).toBe('passkey');
  });

  it('should have access to passkey internal handlers', () => {
    // Better Auth enregistre les endpoints dans son routeur interne
    // On vérifie que les endpoints passkey existent dans la liste des routes
    const endpoints = Object.keys((auth as any).api || {});
    
    // On cherche n'importe quel endpoint contenant "passkey"
    const hasPasskeyEndpoints = endpoints.some(e => e.toLowerCase().includes('passkey'));
    
    expect(hasPasskeyEndpoints).toBe(true);
  });
});
