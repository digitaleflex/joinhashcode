import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient<typeof auth>({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient()
    ]
})

export const { signIn, signUp, signOut, useSession } = authClient
