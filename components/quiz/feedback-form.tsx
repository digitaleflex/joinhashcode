"use client"

import { useState } from "react"
import { MessageSquarePlus, Loader2, Send, AlertTriangle, Lightbulb, MessageSquare, ArrowLeft, Paperclip, X } from "lucide-react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function FeedbackForm() {
    const [type, setType] = useState<string>("GENERAL")
    const [content, setContent] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null
        if (!selected) return

        // Validate size (< 3MB)
        if (selected.size > 3 * 1024 * 1024) {
            toast.error("Fichier trop lourd. La limite est de 3 Mo.")
            return
        }

        // Validate type
        const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
        if (!allowed.includes(selected.type)) {
            toast.error("Format de fichier non supporté. Utilisez JPEG, PNG, WEBP ou PDF.")
            return
        }

        setFile(selected)
        if (selected.type.startsWith("image/")) {
            setFilePreview(URL.createObjectURL(selected))
        } else {
            setFilePreview(null) // PDFs don't get image previews
        }
    }

    const removeFile = () => {
        setFile(null)
        setFilePreview(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (content.length < 10) {
            toast.error("Ton message est un peu court (minimum 10 caractères).")
            return
        }

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("type", type)
            formData.append("content", content)
            if (file) {
                formData.append("file", file)
            }

            const response = await fetch("/api/feedback", {
                method: "POST",
                body: formData,
            })

            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.error || "Échec de l'envoi")
            }

            toast.success("Transmission reçue ! Merci pour ton aide.")
            setContent("")
            setFile(null)
            setFilePreview(null)
            // Redirect after successful submission
            setTimeout(() => router.push("/dashboard"), 1500)
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'envoi du feedback.")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/5">
                    <Link href="/dashboard">
                        <ArrowLeft className="size-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white">Feedback</h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">Amélioration continue · bêta</p>
                </div>
            </div>

            <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl overflow-hidden relative group">
                <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-[80px]" />
                
                <CardHeader className="relative border-b border-white/5 pb-8">
                    <CardTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                        <MessageSquarePlus className="size-5 text-primary" />
                        Transmettre un rapport
                    </CardTitle>
                    <CardDescription className="text-zinc-400 max-w-md">
                        Ton expérience nous aide à forger HASHCODE. Que ce soit un bug, une idée de fonctionnalité ou un ressenti général, nous lisons chaque transmission.
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="type" className="text-xs uppercase font-mono text-zinc-500 tracking-wider">Nature de ta transmission</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger id="type" className="h-12 bg-black/40 border-white/10 focus:ring-primary/20">
                                    <SelectValue placeholder="Choisis un type" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-white/10">
                                    <SelectItem value="BUG" className="focus:bg-red-500/10 focus:text-red-500">
                                        <div className="flex items-center gap-2 py-1">
                                            <AlertTriangle className="size-4" />
                                            <span className="font-medium text-sm">Signaler un Bug</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="FEATURE_REQUEST" className="focus:bg-blue-500/10 focus:text-blue-500">
                                        <div className="flex items-center gap-2 py-1">
                                            <Lightbulb className="size-4" />
                                            <span className="font-medium text-sm">Suggérer une Idée</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="GENERAL" className="focus:bg-zinc-800">
                                        <div className="flex items-center gap-2 py-1">
                                            <MessageSquare className="size-4" />
                                            <span className="font-medium text-sm">Retour Général</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="content" className="text-xs uppercase font-mono text-zinc-500 tracking-wider">Ton message détaillé</Label>
                            <div className="relative">
                                <Textarea
                                    id="content"
                                    placeholder="Explique-nous tout ici..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[200px] bg-black/40 border-white/10 focus:ring-primary/20 resize-none p-4 text-base leading-relaxed"
                                    maxLength={2000}
                                />
                                <div className="absolute bottom-3 right-3 text-[10px] text-zinc-600 font-mono bg-black/40 px-2 py-1 rounded">
                                    {content.length}/2000
                                </div>
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-3 pt-2">
                            <Label className="text-xs uppercase font-mono text-zinc-500 tracking-wider">Pièce jointe (Optionnel)</Label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all cursor-pointer text-xs font-mono uppercase tracking-wider text-zinc-300 w-fit">
                                    <Paperclip className="size-4 text-primary" />
                                    <span>Ajouter une capture</span>
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, image/webp, application/pdf" 
                                        onChange={handleFileChange} 
                                        className="hidden" 
                                    />
                                </label>
                                <span className="text-[10px] text-zinc-600 font-mono uppercase">Images (PNG, JPG, WEBP) ou PDF, max 3 Mo</span>
                            </div>

                            {file && (
                                <div className="mt-3 p-3 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between gap-4 max-w-md animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {filePreview ? (
                                            <div className="relative size-12 rounded-lg border border-white/10 overflow-hidden shrink-0">
                                                <Image src={filePreview} alt="Aperçu" width={48} height={48} className="object-cover size-full" />
                                            </div>
                                        ) : (
                                            <div className="size-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-xs font-mono text-zinc-400 shrink-0">
                                                PDF
                                            </div>
                                        )}
                                        <div className="text-left min-w-0">
                                            <p className="text-xs font-bold text-white truncate">{file.name}</p>
                                            <p className="text-[9px] font-mono text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} Mo</p>
                                        </div>
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={removeFile}
                                        className="rounded-full hover:bg-red-500/10 hover:text-red-500 h-8 w-8 shrink-0"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                            <Button 
                                type="submit" 
                                className="w-full sm:w-auto px-8 btn-primary-glow font-bold uppercase tracking-wide h-12"
                                disabled={isSubmitting || content.length < 10}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="size-5 animate-spin mr-2" />
                                ) : (
                                    <>
                                        <Send className="mr-2 size-4" />
                                        Envoyer la transmission
                                    </>
                                )}
                            </Button>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">
                                [ Protocol: Secure_Transmission_V1 ]
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="rounded-2xl border border-dashed border-white/5 p-8 text-center bg-white/[0.01]">
                <p className="text-zinc-500 text-sm italic">
                    &quot;La perfection n&apos;est pas une destination, c&apos;est une série d&apos;itérations basées sur vos retours.&quot;
                </p>
            </div>
        </div>
    )
}
