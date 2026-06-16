"use client"

import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Fingerprint } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"

/** Only allow same-origin relative paths — rejects // protocol-relative and path-traversal attempts */
function getSafeCallbackUrl(fallback = "/quiz"): string {
    if (typeof window === "undefined") return fallback
    const cb = new URLSearchParams(window.location.search).get("callbackURL")
    if (!cb || !cb.startsWith("/") || cb.startsWith("//")) return fallback
    try {
        const resolved = new URL(cb, window.location.origin)
        return resolved.origin === window.location.origin ? cb : fallback
    } catch {
        return fallback
    }
}

export function SignInForm() {
    const [loadingProvider, setLoadingProvider] = useState<"email" | "otp" | "passkey" | "google" | "github" | null>(null)
    const [step, setStep] = useState<"initial" | "otp">("initial")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        const ref = new URLSearchParams(window.location.search).get("ref")
        if (ref && /^[a-zA-Z0-9_-]{3,50}$/.test(ref)) {
            document.cookie = `hashcode_ref=${encodeURIComponent(ref)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax; Secure`
        }
    }, [])

    const handleSignInGoogle = async () => {
        setLoadingProvider("google")
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: getSafeCallbackUrl()
            })
        } catch (error: unknown) {
            console.error(error)
            toast.error("Échec de la connexion Google. Réessaie ou utilise l'email.")
        } finally {
            // Usually redirects, but safety first
            setLoadingProvider(null)
        }
    }

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!email) {
            toast.error("Veuillez entrer une adresse e-mail")
            return
        }

        setLoadingProvider("email")
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in"
            })
            
            if (error) throw new Error(error.message)
            
            toast.success("Code de sécurité envoyé !")
            setStep("otp")
            setResendCooldown(60) // Start 60s cooldown
        } catch (error: unknown) {
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
            const { error } = await authClient.signIn.emailOtp({
                email,
                otp
            })

            if (error) throw new Error(error.message)

            toast.success("Authentification réussie")
            window.location.href = getSafeCallbackUrl()
        } catch (error: unknown) {
            console.error(error)
            toast.error("Code invalide ou expiré")
        } finally {
            setLoadingProvider(null)
        }
    }

    const handleSignInGitHub = async () => {
        setLoadingProvider("github")
        try {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: getSafeCallbackUrl()
            })
        } catch (error: unknown) {
            console.error(error)
            toast.error("Échec de la connexion GitHub. Réessaie ou utilise l'email.")
        } finally {
            setLoadingProvider(null)
        }
    }

    const handleSignInPasskey = async () => {
        setLoadingProvider("passkey")
        try {
            const { error } = await authClient.signIn.passkey()
            if (error) throw new Error(error.message)
            toast.success("Authentification Passkey réussie")
            window.location.href = getSafeCallbackUrl()
        } catch (error: any) {
            console.error(error)
            const errorMsg = error?.message || ""
            const isUserCancel = errorMsg.toLowerCase().includes("cancel") || 
                               errorMsg.toLowerCase().includes("abort") || 
                               errorMsg.toLowerCase().includes("annul")
            
            if (!isUserCancel) {
                toast.error(
                    "Aucune clé enregistrée sur cet appareil. Connecte-toi par e-mail, Google ou GitHub pour enregistrer ta clé dans tes paramètres.",
                    { duration: 6000 }
                )
            }
        } finally {
            setLoadingProvider(null)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Cyberpunk Animated Background Elements */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-6 animate-grid-drift z-0" />
            
            <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/5 rounded-full blur-[130px] z-0" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-10 right-10 w-75 h-75 bg-purple-500/5 rounded-full blur-[100px] z-0" />

            <Link href="/" className="mb-8 relative z-10 transition-all hover:scale-105 active:scale-95 duration-300">
                <Image
                    src="/hashcodejoin.png"
                    alt="HASHCODE"
                    width={180}
                    height={48}
                    className="h-9 w-auto object-contain brightness-110 drop-shadow-[0_0_15px_rgba(197,244,65,0.15)]"
                />
            </Link>

            <Card className="w-full max-w-md border border-white/8 glass-card relative z-10 shadow-2xl rounded-2xl overflow-hidden cyber-notch-sm transition-all duration-300">
                {/* Decorative neon top border */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent" />
                
                <CardHeader className="text-center space-y-2 pt-8 pb-6">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight text-white italic leading-none">
                        {step === "initial" ? "Connexion" : "Vérification"}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400 font-medium max-w-80 mx-auto leading-relaxed">
                        {step === "initial" 
                            ? "Rejoins ta Squad de 5 développeurs, accomplis des missions réelles et propulse ton parcours tech grâce à notre système d'évolution."
                            : `Saisis le code à 8 caractères envoyé à ${email}`}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-5 px-6 sm:px-8 pb-6">
                    {step === "initial" ? (
                        <>
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                        Adresse Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="hacker@hashcode.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-premium h-11 text-sm font-medium tracking-tight rounded-xl placeholder:text-zinc-700 border-white/10"
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full btn-primary-glow h-11 text-[11px] uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer"
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

                            <div className="relative my-3">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5"></span>
                                </div>
                                <div className="relative flex justify-center text-[9px] uppercase font-mono text-zinc-600 bg-transparent px-2">
                                    Ou accès rapide
                                </div>
                            </div>

                            <Button 
                                variant="outline"
                                onClick={handleSignInGoogle}
                                className="w-full h-11 text-[11px] uppercase font-bold tracking-wider rounded-xl border-white/10 bg-white/1 hover:bg-white/5 transition-all cursor-pointer gap-3"
                                disabled={!!loadingProvider}
                            >
                                {loadingProvider === "google" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" className="size-4" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.27 3.28-8.11 3.28-13.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                                        </svg>
                                        Continuer avec Google
                                    </>
                                )}
                            </Button>


                            {/* 
                            <Button 
                                variant="outline"
                                onClick={handleSignInGitHub}
                                className="w-full h-11 text-[11px] uppercase font-bold tracking-wider rounded-xl border-white/10 bg-white/1 hover:bg-white/5 transition-all cursor-pointer gap-3"
                                disabled={!!loadingProvider}
                            >
                                {loadingProvider === "github" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                               ) : (
                                    <>
                                        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                                        </svg>
                                        Continuer avec GitHub
                                    </>
                                )}
                            </Button>
                            */}

                            <Button 
                                variant="outline"
                                onClick={handleSignInPasskey}
                                className="w-full h-11 text-[11px] uppercase font-bold tracking-wider rounded-xl border-white/10 bg-white/1 hover:bg-white/5 transition-all cursor-pointer gap-3"
                                disabled={!!loadingProvider}
                            >
                                {loadingProvider === "passkey" ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Fingerprint className="size-4 text-primary" />
                                        Passkey (Biométrie / Clé)
                                    </>
                                )}
                            </Button>
                            <p className="text-[9px] text-zinc-600 text-center -mt-1">
                                À configurer dans <Link href="/settings" className="text-zinc-500 hover:text-primary underline">Paramètres</Link> après connexion
                            </p>

                                <p className="text-[10px] leading-normal text-zinc-500 font-medium text-center px-1 pt-2 select-none">
                                    En continuant, tu acceptes nos{" "}
                                    <Link href="/terms" className="text-primary hover:underline font-bold transition-colors">Conditions</Link> et notre{" "}
                                    <Link href="/privacy" className="text-primary hover:underline font-bold transition-colors">Politique de confidentialité</Link>, et tu autorises HASHCODE à analyser tes réponses pour établir ton diagnostic.
                                </p>
                        </>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                    Code de sécurité (8 caractères)
                                </Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Ex: A4B7X9Z2"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                                    className="input-premium h-12 text-center text-lg font-mono tracking-widest rounded-xl border-white/10"
                                    maxLength={8}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full btn-primary-glow h-11 text-[11px] uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer"
                                disabled={!!loadingProvider || otp.length !== 8}
                            >
                                {loadingProvider === "otp" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Valider l'accès"
                                )}
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={resendCooldown > 0 || loadingProvider === "email"}
                                    onClick={() => handleSendOtp()}
                                    className="flex-1 text-[10px] font-mono uppercase tracking-widest h-10 border-white/10 bg-white/1 hover:bg-white/5 cursor-pointer"
                                >
                                    {loadingProvider === "email" ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : resendCooldown > 0 ? (
                                        `Renvoyer (${resendCooldown}s)`
                                    ) : (
                                        "Renvoyer le code"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setStep("initial")}
                                    className="flex-1 text-[10px] font-mono uppercase tracking-widest h-10 text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer"
                                >
                                    Annuler et revenir
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
                
                <CardFooter className="bg-white/1 border-t border-white/4 py-4 px-6">
                    <p className="text-[9px] text-center w-full text-zinc-500 font-mono uppercase tracking-wider leading-relaxed">
                        Tes données sont traitées conformément à notre{" "}
                        <Link href="/privacy" className="text-zinc-400 hover:text-primary underline transition-colors">politique de confidentialité</Link>.
                    </p>
                </CardFooter>
            </Card>


        </div>
    )
}
