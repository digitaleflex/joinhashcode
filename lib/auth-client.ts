"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient, organizationClient, twoFactorClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"

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
        }) as any,
        passkeyClient() as any
    ]
})

export const authClient = client as any

export type Session = typeof client.$Infer.Session

export const { signIn, signUp, signOut, useSession } = authClient
