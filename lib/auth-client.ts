"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient, organizationClient, twoFactorClient } from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"
import type { auth } from "./auth"

export const authClient = createAuthClient({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient(),
        organizationClient(),
        twoFactorClient({
            onTwoFactorRedirect() {
                if (typeof window !== "undefined") {
                    window.location.href = "/2fa";
                }
            },
        }),
        passkeyClient()
    ]
})

export const { signIn, signUp, signOut, useSession } = authClient
