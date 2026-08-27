"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient, organizationClient, multiSessionClient, twoFactorClient } from "better-auth/client/plugins"

const client = createAuthClient({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient(),
        organizationClient(),
        multiSessionClient(),
        twoFactorClient(),
    ],
})

export interface AuthClientExtra {
  admin: {
    setRole: (args: { userId: string; role: string }) => Promise<unknown>
    banUser: (args: { userId: string; banReason?: string; expiresAt?: Date }) => Promise<unknown>
    unbanUser: (args: { userId: string }) => Promise<unknown>
    impersonate: (args: { userId: string }) => Promise<unknown>
    stopImpersonating: () => Promise<unknown>
  }
  emailOtp: {
    sendVerificationOtp: (args: { email: string; type: string }) => Promise<{ error?: unknown }>
  }
}

export const authClient = client as typeof client & AuthClientExtra

export type Session = typeof client.$Infer.Session

export const { signIn, signUp, signOut, useSession } = authClient
