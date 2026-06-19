"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient, organizationClient, multiSessionClient } from "better-auth/client/plugins"

import { AuthClient } from "./types"

const client = createAuthClient({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient(),
        organizationClient() as any,
        multiSessionClient(),
    ]
})

export const authClient = client as unknown as AuthClient

export type Session = typeof authClient.$Infer.Session

export const { signIn, signUp, signOut, useSession } = authClient
