import { createAuthClient } from "better-auth/react"
import { magicLinkClient, emailOTPClient, adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [
        magicLinkClient(),
        emailOTPClient(),
        adminClient()
    ]
})

export const { signIn, signUp, signOut, useSession } = authClient
