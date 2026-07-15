import { describe, it, expect } from 'vitest';
import { auth } from '../lib/auth';

describe('Squad RBAC Configuration (P14)', () => {
  it('should have the organization plugin with custom roles', () => {
    const options = (auth as any).options;
    const orgPlugin = options.plugins.find((p: any) => p.id === 'organization');
    
    expect(orgPlugin).toBeDefined();
    // Les rôles définis dans lib/auth.ts doivent être présents dans la config
    expect(orgPlugin.options.roles).toBeDefined();
    expect(orgPlugin.options.roles.owner).toBeDefined();
    expect(orgPlugin.options.roles.admin).toBeDefined();
    expect(orgPlugin.options.roles.member).toBeDefined();
  });

  it('should have the correct permissions for admin role', () => {
    const options = (auth as any).options;
    const orgPlugin = options.plugins.find((p: any) => p.id === 'organization');
    const adminPermissions = orgPlugin.options.roles.admin.statements;

    // Un Officier (admin) peut lister et mettre à jour l'organisation, et gérer les membres/invitations (mais pas supprimer l'org)
    expect(adminPermissions.organization).toContain('update');
    expect(adminPermissions.organization).not.toContain('delete');
    expect(adminPermissions.member).toContain('create');
    expect(adminPermissions.member).toContain('delete');
  });

  it('should restrict standard members to list only', () => {
    const options = (auth as any).options;
    const orgPlugin = options.plugins.find((p: any) => p.id === 'organization');
    const memberPermissions = orgPlugin.options.roles.member.statements;

    expect(memberPermissions.organization).toEqual(['list']);
    expect(memberPermissions.member).toEqual(['list']);
    expect(memberPermissions.invitation).toEqual(['list']);
  });
});
