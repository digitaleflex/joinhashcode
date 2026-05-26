import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient, organizationClient, twoFactorClient } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient(),
        organizationClient(),
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = "/2fa";
            },
        })
    ]
})

export const { signIn, signUp, signOut, useSession } = authClient
