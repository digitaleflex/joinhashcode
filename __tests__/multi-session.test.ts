import { describe, it, expect } from 'vitest';
import { auth } from '../lib/auth';

describe('Better Auth Multi-Session Management (P12)', () => {
  it('should expose session management API endpoints', () => {
    const api = (auth as any).api;
    const endpoints = Object.keys(api || {});
    
    // Better Auth nativement gère les sessions, nous vérifions que les 
    // méthodes de l'API appelées par listSessions(), revokeSession() etc.
    // sont bien présentes et n'ont pas été désactivées.
    
    expect(endpoints).toContain('listSessions');
    expect(endpoints).toContain('revokeSession');
    expect(endpoints).toContain('revokeOtherSessions');
  });

  it('should have session strategy set to database', () => {
    // Pour que la gestion multi-session et la révocation fonctionnent, 
    // l'account strategy doit être stockée en base de données.
    const options = (auth as any).options;
    
    // Vérification de la stratégie de session/compte
    // Par défaut, si database est défini, les sessions sont en BDD.
    expect(options.database).toBeDefined();
    expect(options.account?.storeStateStrategy).toBe('database');
  });
});
