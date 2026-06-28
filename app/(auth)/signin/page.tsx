import { getSessionSafe } from "@/lib/get-session-safe"
import { redirect } from "next/navigation"
import { SignInForm } from "@/components/auth/signin-form"

export default async function SignInPage() {
    const session = await getSessionSafe()

    if (session) {
        redirect("/dashboard");
    }

    return <SignInForm />
}
