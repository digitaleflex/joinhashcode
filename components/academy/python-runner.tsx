"use client";

import * as React from "react";
import { Loader2, Play, RotateCcw, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PythonError {
  type: string;
  message: string;
  ligne?: number | null;
  titre: string;
  conseil: string;
}

interface ExecutionResult {
  ok: boolean;
  sortie: string;
  erreur: PythonError | null;
}

export function PythonRunner({ initialCode }: { initialCode: string }) {
  const [code, setCode] = React.useState(initialCode);
  const [result, setResult] = React.useState<ExecutionResult | null>(null);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [running, setRunning] = React.useState(false);

  const workerRef = React.useRef<Worker | null>(null);
  const readyRef = React.useRef<Promise<void> | null>(null);
  const pendingRef = React.useRef<Map<number, { resolve: (value: ExecutionResult) => void; reject: (reason: unknown) => void }>>(new Map());
  const idRef = React.useRef(0);

  React.useEffect(() => {
    const worker = new Worker("/playground/worker.js");
    workerRef.current = worker;

    readyRef.current = new Promise<void>((resolve, reject) => {
      worker.onmessage = (event: MessageEvent) => {
        const message = event.data as
          | { type: "pret" }
          | { type: "echec"; message: string }
          | { type: "resultat"; id: number; data?: ExecutionResult; erreurInterne?: string };

        if (message.type === "pret") {
          setStatus("ready");
          resolve();
        } else if (message.type === "echec") {
          setStatus("error");
          reject(new Error(message.message));
        } else if (message.type === "resultat") {
          const pending = pendingRef.current.get(message.id);
          if (!pending) return;
          pendingRef.current.delete(message.id);
          if (message.erreurInterne) pending.reject(new Error(message.erreurInterne));
          else pending.resolve(message.data as ExecutionResult);
        }
      };
    });

    readyRef.current.catch(() => undefined);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const run = async () => {
    if (!workerRef.current || !readyRef.current) return;
    setRunning(true);
    setResult(null);
    try {
      await readyRef.current;
      const id = ++idRef.current;
      const data = await new Promise<ExecutionResult>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          pendingRef.current.delete(id);
          resolve({
            ok: false,
            sortie: "",
            erreur: {
              type: "Timeout",
              message: "L'exécution a dépassé 6 secondes.",
              titre: "Boucle infinie ou calcul trop long",
              conseil: "Vérifie tes boucles et ajoute une condition d'arrêt.",
            },
          });
        }, 6500);
        pendingRef.current.set(id, {
          resolve: (value) => {
            window.clearTimeout(timeout);
            resolve(value);
          },
          reject: (reason) => {
            window.clearTimeout(timeout);
            reject(reason);
          },
        });
        workerRef.current?.postMessage({ id, action: "executer", args: [code, "[]"] });
      });
      setResult(data);
    } catch {
      setResult({
        ok: false,
        sortie: "",
        erreur: {
          type: "Runtime",
          message: "Le moteur Python n'a pas pu démarrer.",
          titre: "Moteur indisponible",
          conseil: "Vérifie ta connexion puis recharge la page.",
        },
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="mt-10 rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Atelier Python
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-bold text-foreground">
            <Terminal className="h-4 w-4 text-primary" aria-hidden />
            Exécute ton code
          </h2>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
            status === "ready"
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
              : status === "error"
                ? "border-red-400/25 bg-red-400/10 text-red-300"
                : "border-white/10 bg-white/5 text-zinc-400",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              status === "ready" ? "bg-emerald-400" : status === "error" ? "bg-red-400" : "bg-zinc-500",
            )}
            aria-hidden
          />
          {status === "ready" ? "Python prêt" : status === "error" ? "Python indisponible" : "Chargement…"}
        </span>
      </div>

      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            void run();
          }
          if (event.key === "Tab") {
            event.preventDefault();
            const target = event.currentTarget;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const next = `${code.slice(0, start)}    ${code.slice(end)}`;
            setCode(next);
            window.requestAnimationFrame(() => {
              target.selectionStart = target.selectionEnd = start + 4;
            });
          }
        }}
        spellCheck={false}
        rows={14}
        aria-label="Éditeur Python"
        className="mt-4 w-full rounded-2xl border border-white/10 bg-[#0b0b0d] p-4 font-mono text-[13px] leading-6 text-zinc-200 outline-none transition-colors focus:border-primary/50"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={run}
          disabled={running || status !== "ready"}
          className="btn-primary-glow h-10 rounded-xl px-4"
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Play className="mr-2 h-4 w-4" aria-hidden />
          )}
          Exécuter
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCode(initialCode);
            setResult(null);
          }}
          className="h-10 rounded-xl px-4"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
          Réinitialiser
        </Button>
        <span className="text-[11px] text-muted-foreground">Ctrl/⌘ + Entrée pour exécuter</span>
      </div>

      {result && (
        <div className="mt-4 space-y-3">
          {result.sortie && (
            <pre className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-200">
              {result.sortie}
            </pre>
          )}
          {result.erreur ? (
            <div className="rounded-xl border border-red-400/25 bg-red-400/[0.06] p-4">
              <p className="text-sm font-bold text-red-200">
                {result.erreur.titre}
                {result.erreur.ligne ? ` (ligne ${result.erreur.ligne})` : ""}
              </p>
              <p className="mt-1 font-mono text-xs text-red-200/80">
                {result.erreur.type} : {result.erreur.message}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{result.erreur.conseil}</p>
            </div>
          ) : (
            <p className="text-xs font-semibold text-emerald-300">Programme exécuté sans erreur.</p>
          )}
        </div>
      )}
    </section>
  );
}
