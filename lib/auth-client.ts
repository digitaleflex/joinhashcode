"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient, organizationClient, twoFactorClient, multiSessionClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"

import { AuthClient } from "./types"

const client = createAuthClient({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient(),
        organizationClient() as any,
        twoFactorClient({
            onTwoFactorRedirect() {
                if (typeof window !== "undefined") {
                    window.location.href = "/2fa";
                }
            },
        }),
        passkeyClient(),
        multiSessionClient()
    ]
})

export const authClient = client as unknown as AuthClient

export type Session = typeof authClient.$Infer.Session

export const { signIn, signUp, signOut, useSession } = authClient
