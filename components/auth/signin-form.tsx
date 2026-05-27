"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Mail } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

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
    const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | "email" | "otp" | null>(null)
    const [step, setStep] = useState<"initial" | "otp">("initial")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [consent, setConsent] = useState(false)
    const [consentError, setConsentError] = useState(false)

    const triggerConsentError = () => {
        setConsentError(true)
        toast.error("Merci d'accepter les conditions avant de continuer.")
        setTimeout(() => setConsentError(false), 500)
    }

    const handleSocialSignIn = async (provider: "google" | "github") => {
        if (!consent) {
            triggerConsentError()
            return
        }
        setLoadingProvider(provider)
        try {
            const callbackURL = getSafeCallbackUrl()

            const { data, error } = await authClient.signIn.social({
                provider,
                callbackURL,
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
        if (!consent) {
            triggerConsentError()
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
            window.location.href = getSafeCallbackUrl()
        } catch (error) {
            console.error(error)
            toast.error("Code invalide ou expiré")
        } finally {
            setLoadingProvider(null)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Cyberpunk Animated Background Elements */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-[0.06] animate-grid-drift z-0" />
            
            <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[130px] z-0" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] z-0" />

            <Link href="/" className="mb-8 relative z-10 transition-all hover:scale-105 active:scale-95 duration-300">
                <Image
                    src="/hashcodejoin.png"
                    alt="HASHCODE"
                    width={180}
                    height={48}
                    className="h-9 w-auto object-contain brightness-110 drop-shadow-[0_0_15px_rgba(197,244,65,0.15)]"
                />
            </Link>

            <Card className="w-full max-w-md border border-white/[0.08] glass-card relative z-10 shadow-2xl rounded-2xl overflow-hidden cyber-notch-sm transition-all duration-300">
                {/* Decorative neon top border */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                <CardHeader className="text-center space-y-2 pt-8 pb-6">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight text-white italic leading-none">
                        {step === "initial" ? "Connexion" : "Vérification"}
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400 font-medium max-w-[280px] mx-auto leading-relaxed">
                        {step === "initial" 
                            ? "Connecte-toi pour révéler tes forces et propulser ton parcours tech."
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

                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/[0.06]" />
                                </div>
                                <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
                                    <span className="bg-[#0a0a0a] px-3 text-zinc-600">Ou</span>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Button
                                    variant="outline"
                                    onClick={() => handleSocialSignIn("google")}
                                    disabled={!!loadingProvider}
                                    className="w-full bg-white/[0.01] hover:bg-white/[0.06] text-zinc-300 hover:text-white border-white/[0.06] hover:border-white/20 transition-all duration-300 h-11 rounded-xl cursor-pointer font-bold text-xs"
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
                                    className="w-full bg-white/[0.01] hover:bg-white/[0.06] text-zinc-300 hover:text-white border-white/[0.06] hover:border-white/20 transition-all duration-300 h-11 rounded-xl cursor-pointer font-bold text-xs"
                                >
                                    {loadingProvider === "github" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <FaGithub className="mr-2 h-4 w-4 text-white" />
                                            Continuer avec GitHub
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Corrected & premium consent checkbox container - Positioned at the bottom */}
                            <div className={`flex items-start gap-3 rounded-xl border p-3.5 mt-2 transition-all duration-300 ${
                                consentError 
                                    ? "border-red-500/40 bg-red-950/15 animate-shake shadow-[0_0_15px_rgba(239,68,68,0.12)]" 
                                    : "border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03]"
                            }`}>
                                <Checkbox
                                    id="consent"
                                    checked={consent}
                                    onCheckedChange={(v) => {
                                        setConsent(v === true)
                                        if (v === true) setConsentError(false)
                                    }}
                                    className="mt-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                                <label 
                                    htmlFor="consent" 
                                    className="text-[11px] leading-relaxed text-zinc-400 font-medium cursor-pointer select-none"
                                >
                                    J&apos;accepte que HASHCODE analyse mes réponses pour établir mon diagnostic, et j&apos;ai lu les{" "}
                                    <Link href="/terms" className="text-primary hover:underline font-bold transition-colors">conditions</Link> et la{" "}
                                    <Link href="/privacy" className="text-primary hover:underline font-bold transition-colors">politique de confidentialité</Link>.
                                </label>
                            </div>
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
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep("initial")}
                                className="w-full text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors duration-200"
                            >
                                Annuler et revenir
                            </Button>
                        </form>
                    )}
                </CardContent>
                
                <CardFooter className="bg-white/[0.01] border-t border-white/[0.04] py-4 px-6">
                    <p className="text-[9px] text-center w-full text-zinc-500 font-mono uppercase tracking-wider leading-relaxed">
                        Tes données sont traitées conformément à notre{" "}
                        <Link href="/privacy" className="text-zinc-400 hover:text-primary underline transition-colors">politique de confidentialité</Link>.
                    </p>
                </CardFooter>
            </Card>

            {/* Redirection overlay */}
            {(loadingProvider === "google" || loadingProvider === "github") && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-xs font-mono uppercase tracking-widest text-foreground animate-pulse">
                            Redirection vers {loadingProvider === "google" ? "Google" : "GitHub"}...
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
