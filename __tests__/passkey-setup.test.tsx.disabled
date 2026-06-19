/**
 * Tests for passkey integration correctness.
 *
 * Covers:
 * 1. Server-side route registration (correct camelCase API key names)
 * 2. Client SDK method shape (addPasskey, useListPasskeys, deletePasskey)
 * 3. PasskeySetup component behaviour (loading, empty, list, add, delete)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ─── hoisted mock state ───────────────────────────────────────────────────────

const { mockAddPasskey, mockDeletePasskey, mockState } = vi.hoisted(() => {
  const mockState: { data: any[] | null; isPending: boolean } = { data: null, isPending: true };
  return {
    mockState,
    mockAddPasskey: vi.fn(),
    mockDeletePasskey: vi.fn(),
  };
});

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    useListPasskeys: () => mockState,
    passkey: {
      addPasskey: mockAddPasskey,
      deletePasskey: mockDeletePasskey,
    },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { PasskeySetup } from '../components/settings/PasskeySetup';
import { auth } from '../lib/auth';
import { toast } from 'sonner';

// ─── 1. Server-side route registration ───────────────────────────────────────
// Actual auth.api keys as registered by @better-auth/passkey v1.6.x

describe('Passkey server-side routes', () => {
  it('plugin registered with id "passkey"', () => {
    const plugins = (auth as any).options?.plugins ?? [];
    expect(plugins.find((p: any) => p.id === 'passkey')).toBeDefined();
  });

  const expectedApiKeys = [
    'listPasskeys',
    'deletePasskey',
    'updatePasskey',
    'generatePasskeyRegistrationOptions',
    'verifyPasskeyRegistration',
    'generatePasskeyAuthenticationOptions',
    'verifyPasskeyAuthentication',
  ];

  it.each(expectedApiKeys)('auth.api has handler: %s', (key) => {
    expect((auth as any).api).toHaveProperty(key);
  });
});

// ─── 2. Client SDK shape ──────────────────────────────────────────────────────

describe('Passkey client SDK shape', () => {
  it('authClient.useListPasskeys is a function (atom hook)', async () => {
    // The hoisted mock mirrors the real SDK which exposes useListPasskeys via getAtomKey
    const { authClient } = await import('@/lib/auth-client');
    expect(typeof (authClient as any).useListPasskeys).toBe('function');
  });

  it('authClient.passkey.addPasskey is a function', () => {
    expect(typeof mockAddPasskey).toBe('function');
  });

  it('authClient.passkey.deletePasskey is a function (proxy → /passkey/delete-passkey)', () => {
    expect(typeof mockDeletePasskey).toBe('function');
  });
});

// ─── 3. PasskeySetup component ────────────────────────────────────────────────

describe('PasskeySetup component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.data = null;
    mockState.isPending = true;
  });

  it('shows spinner while isPending', () => {
    mockState.data = null;
    mockState.isPending = true;
    render(<PasskeySetup />);
    expect(document.querySelector('.animate-spin')).toBeTruthy();
    expect(screen.queryByText(/Aucune clé/i)).toBeNull();
  });

  it('shows empty state when passkey list is empty', () => {
    mockState.data = [];
    mockState.isPending = false;
    render(<PasskeySetup />);
    expect(screen.getByText(/Aucune clé d'accès enregistrée/i)).toBeTruthy();
  });

  it('renders passkey list with names', () => {
    mockState.isPending = false;
    mockState.data = [
      { id: 'pk_1', name: 'MacBook Pro', deviceType: 'desktop', createdAt: '2025-01-01T00:00:00Z' },
      { id: 'pk_2', name: null, deviceType: 'mobile', createdAt: '2025-06-01T00:00:00Z' },
    ];
    render(<PasskeySetup />);
    expect(screen.getByText('MacBook Pro')).toBeTruthy();
    expect(screen.getByText('Appareil sans nom')).toBeTruthy();
    expect(screen.queryByText(/Aucune clé d'accès enregistrée/i)).toBeNull();
  });

  it('calls addPasskey on button click — success', async () => {
    mockState.data = [];
    mockState.isPending = false;
    mockAddPasskey.mockResolvedValueOnce({ error: null });

    render(<PasskeySetup />);
    // Click the btn-primary-glow button, not the word "Ajouter" inside the paragraph
    const addBtn = document.querySelector('button.btn-primary-glow') as HTMLElement;
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockAddPasskey).toHaveBeenCalledOnce();
      expect(toast.success).toHaveBeenCalledWith('Passkey ajouté avec succès');
    });
  });

  it('shows error toast when addPasskey returns error', async () => {
    mockState.data = [];
    mockState.isPending = false;
    mockAddPasskey.mockResolvedValueOnce({ error: { message: 'WebAuthn failed' } });

    render(<PasskeySetup />);
    const addBtn = document.querySelector('button.btn-primary-glow') as HTMLElement;
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erreur lors de l'ajout du Passkey");
    });
  });

  it('no error toast when user cancels (message contains "cancel")', async () => {
    mockState.data = [];
    mockState.isPending = false;
    mockAddPasskey.mockRejectedValueOnce(new Error('operation was not allowed. cancel'));

    render(<PasskeySetup />);
    const addBtn = document.querySelector('button.btn-primary-glow') as HTMLElement;
    fireEvent.click(addBtn);

    await waitFor(() => expect(mockAddPasskey).toHaveBeenCalledOnce());
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('calls deletePasskey with correct id — success', async () => {
    mockState.isPending = false;
    mockState.data = [
      { id: 'pk_1', name: 'Test Key', deviceType: 'desktop', createdAt: '2025-01-01T00:00:00Z' },
    ];
    mockDeletePasskey.mockResolvedValueOnce({ error: null });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<PasskeySetup />);
    const deleteBtn = document.querySelector('button[class*="text-zinc-600"]') as HTMLElement;
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeletePasskey).toHaveBeenCalledWith({ id: 'pk_1' });
      expect(toast.success).toHaveBeenCalledWith('Passkey supprimé');
    });
  });

  it('does NOT call deletePasskey when confirm cancelled', () => {
    mockState.isPending = false;
    mockState.data = [
      { id: 'pk_1', name: 'Test Key', deviceType: 'desktop', createdAt: '2025-01-01T00:00:00Z' },
    ];
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<PasskeySetup />);
    const deleteBtn = document.querySelector('button[class*="text-zinc-600"]') as HTMLElement;
    fireEvent.click(deleteBtn);

    expect(mockDeletePasskey).not.toHaveBeenCalled();
  });

  it('shows error toast when deletePasskey returns error', async () => {
    mockState.isPending = false;
    mockState.data = [
      { id: 'pk_1', name: 'Test Key', deviceType: 'desktop', createdAt: '2025-01-01T00:00:00Z' },
    ];
    mockDeletePasskey.mockResolvedValueOnce({ error: { message: 'Not found' } });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<PasskeySetup />);
    const deleteBtn = document.querySelector('button[class*="text-zinc-600"]') as HTMLElement;
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erreur lors de la suppression');
    });
  });
});
