"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export default function SignInPage() {
    const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null)

    const handleSocialSignIn = async (provider: "google" | "github") => {
        setLoadingProvider(provider)
        try {
            const { data, error } = await authClient.signIn.social({
                provider,
                callbackURL: "/quiz",
                errorCallbackURL: "/signin",
                disableRedirect: true,
            })

            if (error) {
                throw new Error(error.message || "Social sign-in failed")
            }

            if (!data?.url) {
                throw new Error("Missing social sign-in redirect URL")
            }

            window.location.href = data.url
        } catch {
            toast.error("Erreur lors de la connexion")
            setLoadingProvider(null)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <Link href="/" className="mb-8 relative z-10 transition-transform hover:scale-105">
                <Image
                    src="/hashcodejoin.png"
                    alt="HASHCODE"
                    width={180}
                    height={48}
                    className="h-10 w-auto object-contain"
                />
            </Link>

            <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur-xl relative z-10 shadow-2xl">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-medium tracking-tight">Connexion</CardTitle>
                    <CardDescription>
                        Identifie-toi pour commencer ton profilage HASHCODE.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSocialSignIn("google")}
                        disabled={!!loadingProvider}
                        className="w-full bg-background/50 hover:bg-primary/10 hover:text-foreground border-border/60 hover:border-primary/30 transition-all h-12"
                    >
                        {loadingProvider === "google" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <FcGoogle className="mr-2 h-5 w-5" />
                                Continuer avec Google
                            </>
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleSocialSignIn("github")}
                        disabled={!!loadingProvider}
                        className="w-full bg-background/50 hover:bg-primary/10 hover:text-foreground border-border/60 hover:border-primary/30 transition-all h-12"
                    >
                        {loadingProvider === "github" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <FaGithub className="mr-2 h-5 w-5" />
                                Continuer avec GitHub
                            </>
                        )}
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-[10px] text-center w-full text-muted-foreground uppercase tracking-widest leading-relaxed">
                        En te connectant, tu acceptes notre{" "}
                        <Link href="/terms" className="underline hover:text-primary">politique de confidentialité</Link>.
                    </p>
                </CardFooter>
            </Card>

            {/* Redirection overlay */}
            {loadingProvider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-sm font-medium text-foreground animate-pulse">
                            Redirection vers {loadingProvider === "google" ? "Google" : "GitHub"}...
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
