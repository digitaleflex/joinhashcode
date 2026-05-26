import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient, organizationClient } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient(),
        organizationClient()
    ]
})

export const { signIn, signUp, signOut, useSession } = authClient
