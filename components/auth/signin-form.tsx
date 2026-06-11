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

/** Maps Better Auth / OAuth error messages to user-friendly French strings */
function getOAuthErrorMessage(error: unknown): string {
    const msg = (error as any)?.message?.toLowerCase() ?? ""
    if (msg.includes("access_denied") || msg.includes("cancelled") || msg.includes("cancel"))
        return "Connexion annulée. Tu as refusé l'accès à ton compte."
    if (msg.includes("banned") || msg.includes("suspended") || msg.includes("suspendu"))
        return "Ton compte a été suspendu. Contacte le support."
    if (msg.includes("email") && (msg.includes("exist") || msg.includes("taken")))
        return "Cet email est déjà associé à un autre compte. Essaie une autre méthode."
    if (msg.includes("rate") || msg.includes("limit") || msg.includes("too many"))
        return "Trop de tentatives. Attends quelques minutes avant de réessayer."
    if (msg.includes("network") || msg.includes("fetch") || msg.includes("timeout"))
        return "Problème réseau. Vérifie ta connexion et réessaie."
    const detail = (error as any)?.message
    return detail ? `Erreur de connexion : ${detail}` : "Erreur de connexion. Réessaie ou utilise un autre moyen."
}

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
    const [loadingProvider, setLoadingProvider] = useState<"email" | "otp" | "passkey" | null>(null)
    const [step, setStep] = useState<"initial" | "otp">("initial")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    // Show contextual messages from URL params set by middleware
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const error = params.get("error")
        const reason = params.get("reason")
        const ref = params.get("ref")

        if (ref) {
            // Store referral code in cookie for 24h
            document.cookie = `hashcode_ref=${ref}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`
        }

        if (error === "banned") {
            toast.error("Ton compte a été suspendu. Contacte le support pour plus d'informations.", { duration: 8000 })
        }
        if (reason === "auth_required") {
            toast.info("Connexion requise pour accéder à cette fonctionnalité.", { duration: 5000 })
        }
    }, [])

    // Countdown for OTP resend cooldown
    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setTimeout(() => {
            setResendCooldown(prev => prev - 1)
        }, 1000)
        return () => clearTimeout(timer)
    }, [resendCooldown])

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

    const handleSignInPasskey = async () => {
        setLoadingProvider("passkey")
        try {
            const { error } = await authClient.signIn.passkey()
            if (error) throw new Error(error.message)
            toast.success("Authentification Passkey réussie")
            window.location.href = getSafeCallbackUrl()
        } catch (error) {
            console.error(error)
            const msg = getOAuthErrorMessage(error)
            if (!msg.includes("annulée")) {
                toast.error("Échec de l'authentification Passkey")
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

                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                                <div className="relative flex justify-center text-[8px] uppercase font-mono text-zinc-600 bg-background px-2">Ou utiliser</div>
                            </div>

                            <Button 
                                variant="outline"
                                onClick={handleSignInPasskey}
                                className="w-full h-11 text-[11px] uppercase font-bold tracking-wider rounded-xl border-white/10 bg-white/1 hover:bg-white/5 transition-all cursor-pointer"
                                disabled={!!loadingProvider}
                            >
                                {loadingProvider === "passkey" ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Fingerprint className="mr-2 h-4 w-4 text-primary" />
                                        Passkey (Biométrie / Clé)
                                    </>
                                )}
                            </Button>

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
