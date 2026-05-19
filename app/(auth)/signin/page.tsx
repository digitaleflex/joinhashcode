"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export default function SignInPage() {
    const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | "email" | "otp" | null>(null)
    const [step, setStep] = useState<"initial" | "otp">("initial")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")

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

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Veuillez entrer une adresse e-mail")
            return
        }
        
        setLoadingProvider("email")
        try {
            // @ts-ignore
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in"
            })
            
            if (error) throw new Error(error.message)
            
            toast.success("Code de sécurité envoyé !")
            setStep("otp")
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de l'envoi du code")
        } finally {
            setLoadingProvider(null)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!otp || otp.length !== 8) {
            toast.error("Le code doit contenir 8 caractères")
            return
        }

        setLoadingProvider("otp")
        try {
            // @ts-ignore
            const { error } = await authClient.signIn.emailOtp({
                email,
                otp
            })

            if (error) throw new Error(error.message)

            toast.success("Authentification réussie")
            window.location.href = "/quiz"
        } catch (error) {
            console.error(error)
            toast.error("Code invalide ou expiré")
        } finally {
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
                    <CardTitle className="text-2xl font-medium tracking-tight">
                        {step === "initial" ? "Connexion" : "Vérification"}
                    </CardTitle>
                    <CardDescription>
                        {step === "initial" 
                            ? "Identifie-toi pour commencer ton profilage HASHCODE."
                            : `Saisis le code à 8 caractères envoyé à ${email}`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === "initial" ? (
                        <>
                            <form onSubmit={handleSendOtp} className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="hacker@hashcode.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-background/50 border-border/60"
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full btn-primary-glow"
                                    disabled={!!loadingProvider}
                                >
                                    {loadingProvider === "email" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Recevoir un code sécurisé
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border/60" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-2 text-muted-foreground">Ou</span>
                                </div>
                            </div>

                            <div className="space-y-3">
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
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Code de sécurité (8 caractères)</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Ex: A4B7X9Z2"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                                    className="bg-background/50 border-border/60 text-center text-lg tracking-[0.2em] font-mono"
                                    maxLength={8}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full btn-primary-glow"
                                disabled={!!loadingProvider || otp.length !== 8}
                            >
                                {loadingProvider === "otp" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Valider l'accès"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep("initial")}
                                className="w-full text-xs text-muted-foreground hover:text-foreground"
                            >
                                Annuler et revenir
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter>
                    <p className="text-[10px] text-center w-full text-muted-foreground uppercase tracking-widest leading-relaxed">
                        En te connectant, tu acceptes notre{" "}
                        <Link href="/terms" className="underline hover:text-primary">politique de confidentialité</Link>.
                    </p>
                </CardFooter>
            </Card>

            {/* Redirection overlay */}
            {(loadingProvider === "google" || loadingProvider === "github") && (
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
