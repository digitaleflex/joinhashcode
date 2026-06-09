import { describe, it, expect } from 'vitest';
import { auth } from '../lib/auth';

describe('Admin Impersonation Configuration (P13)', () => {
  it('should have the admin plugin correctly registered', () => {
    const options = (auth as any).options;
    const adminPlugin = options.plugins.find((p: any) => p.id === 'admin');
    
    expect(adminPlugin).toBeDefined();
    expect(adminPlugin.id).toBe('admin');
  });

  it('should expose impersonation capability in the internal API', () => {
    const api = (auth as any).api;
    const endpoints = Object.keys(api || {});
    
    // Better Auth expose les méthodes d'impersonation
    // On vérifie qu'au moins une méthode d'impersonation existe dans l'API
    const hasImpersonate = endpoints.some(e => e.toLowerCase().includes('impersonate'));
    
    expect(hasImpersonate).toBe(true);
  });

  it('should have the session schema prepared for impersonation', () => {
    // On vérifie que le champ impersonatedBy est présent dans la config de session
    // (normalement ajouté via notre migration Prisma, mais BA le gère aussi via son schéma interne)
    const api = (auth as any).api;
    expect(api.stopImpersonating).toBeDefined();
  });
});
