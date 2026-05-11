"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isMagicLinkSent, setIsMagicLinkSent] = useState(false)

    const handleSocialSignIn = async (provider: "google" | "github") => {
        setIsLoading(true)
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/quiz"
            })
        } catch (error) {
            toast.error("Erreur lors de la connexion")
        } finally {
            setIsLoading(false)
        }
    }

    const handleMagicLinkSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return toast.error("Veuillez entrer votre email")

        setIsLoading(true)
        try {
            await authClient.signIn.magicLink({
                email,
                callbackURL: "/quiz"
            })
            setIsMagicLinkSent(true)
            toast.success("Lien magique envoyé !")
        } catch (error) {
            toast.error("Erreur lors de l'envoi du lien")
        } finally {
            setIsLoading(false)
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
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => handleSocialSignIn("google")}
                            disabled={isLoading}
                            className="bg-background/50 hover:bg-primary/10 hover:text-foreground border-border/60 hover:border-primary/30 transition-all"
                        >
                            <FcGoogle className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => handleSocialSignIn("github")}
                            disabled={isLoading}
                            className="bg-background/50 hover:bg-primary/10 hover:text-foreground border-border/60 hover:border-primary/30 transition-all"
                        >
                            <FaGithub className="mr-2 h-4 w-4 text-foreground group-hover:text-foreground" />
                            GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/60" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Ou avec email</span>
                        </div>
                    </div>

                    {!isMagicLinkSent ? (
                        <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background/50 border-border/60 focus:ring-primary"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                                disabled={isLoading}
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                {isLoading ? "Envoi..." : "Recevoir un lien magique"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                            <p className="text-sm text-foreground">
                                Un lien magique a été envoyé à <strong>{email}</strong>. 
                                Vérifie tes spams si tu ne le vois pas.
                            </p>
                            <Button 
                                variant="link" 
                                onClick={() => setIsMagicLinkSent(false)}
                                className="mt-2 text-xs text-primary"
                            >
                                Essayer une autre adresse
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                        En te connectant, tu acceptes notre <br />
                        <Link href="/terms" className="underline hover:text-primary">politique de confidentialité</Link>.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
