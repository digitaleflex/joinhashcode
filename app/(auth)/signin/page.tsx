import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SignInForm } from "@/components/auth/signin-form"

export default async function SignInPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        const { user } = session;
        if (!user.currentSituation) {
            redirect("/onboarding");
        }
        if (!user.class) {
            redirect("/quiz");
        }
        if (!user.dreamStatement) {
            redirect("/onboarding/post-quiz");
        }
        redirect("/dashboard");
    }

    return <SignInForm />
}
