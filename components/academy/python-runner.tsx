"use client";

import * as React from "react";
import { CheckCircle2, Loader2, Play, RotateCcw, Terminal, XCircle } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
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

interface TestResultItem {
  nom: string;
  ok: boolean;
  detail?: string;
}

interface TestResult {
  ok: boolean;
  resultats: TestResultItem[];
  erreur?: PythonError | null;
  sortie?: string;
}

export function PythonRunner({
  initialCode,
  tests,
  contentId,
  isAuthenticated = false,
}: {
  initialCode: string;
  tests?: Array<[string, string]>;
  contentId?: string;
  isAuthenticated?: boolean;
}) {
  const [code, setCode] = React.useState(initialCode);
  const [result, setResult] = React.useState<ExecutionResult | null>(null);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [running, setRunning] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [testResult, setTestResult] = React.useState<TestResult | null>(null);
  const [autoValidated, setAutoValidated] = React.useState(false);

  const runRef = React.useRef<() => void>(() => undefined);
  const extensions = React.useMemo(
    () => [
      python(),
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            runRef.current();
            return true;
          },
        },
      ]),
    ],
    [],
  );
  const workerRef = React.useRef<Worker | null>(null);
  const readyRef = React.useRef<Promise<void> | null>(null);
  const pendingRef = React.useRef<Map<number, { resolve: (value: ExecutionResult) => void; reject: (reason: unknown) => void }>>(new Map());
  const idRef = React.useRef(0);

  const spawnWorker = React.useCallback(() => {
    workerRef.current?.terminate();
    const worker = new Worker("/playground/worker.js");
    workerRef.current = worker;
    setStatus("loading");

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
  }, []);

  React.useEffect(() => {
    spawnWorker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [spawnWorker]);

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
          // A runaway loop keeps the worker busy forever: terminate it and
          // start a fresh one so the next run is not blocked.
          workerRef.current?.terminate();
          spawnWorker();
          resolve({
            ok: false,
            sortie: "",
            erreur: {
              type: "Timeout",
              message: "L'exécution a dépassé 6 secondes. Le moteur a été redémarré.",
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

  const verify = async () => {
    if (!tests || tests.length === 0 || !workerRef.current || !readyRef.current) return;
    setChecking(true);
    setTestResult(null);
    try {
      await readyRef.current;
      const id = ++idRef.current;
      const data = await new Promise<TestResult>((resolve) => {
        const timeout = window.setTimeout(() => {
          pendingRef.current.delete(id);
          workerRef.current?.terminate();
          spawnWorker();
          resolve({
            ok: false,
            resultats: [],
            erreur: {
              type: "Timeout",
              message: "La vérification a dépassé 6 secondes. Le moteur a été redémarré.",
              titre: "Vérification trop longue",
              conseil: "Vérifie que tes boucles se terminent.",
            },
          });
        }, 6500);
        pendingRef.current.set(id, {
          resolve: (value) => {
            window.clearTimeout(timeout);
            resolve(value as unknown as TestResult);
          },
          reject: (reason) => {
            window.clearTimeout(timeout);
            resolve({
              ok: false,
              resultats: [],
              erreur: {
                type: "Runtime",
                message: String(reason),
                titre: "Le moteur de test a échoué",
                conseil: "Réessaie ou recharge la page.",
              },
            });
          },
        });
        workerRef.current?.postMessage({
          id,
          action: "tester",
          args: [
            code,
            JSON.stringify(tests.map(([nom, code]) => ({ nom, code }))),
            "{}",
          ],
        });
      });
      setTestResult(data);
      const allPassed = data.ok && data.resultats.length > 0 && data.resultats.every((item) => item.ok);
      if (allPassed && isAuthenticated && contentId) {
        try {
          const res = await fetch("/api/academy/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contentId, isCompleted: true }),
          });
          setAutoValidated(res.ok);
        } catch {
          setAutoValidated(false);
        }
      }
    } finally {
      setChecking(false);
    }
  };

  React.useEffect(() => {
    runRef.current = () => {
      void run();
    };
  });

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

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <CodeMirror
          value={code}
          height="340px"
          theme={oneDark}
          extensions={extensions}
          onChange={(value) => setCode(value)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            autocompletion: true,
            bracketMatching: true,
            closeBrackets: true,
            foldGutter: false,
          }}
          aria-label="Éditeur Python"
          className="text-[13px]"
        />
      </div>

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
        {tests && tests.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={verify}
            disabled={checking || status !== "ready"}
            className="h-10 rounded-xl px-4"
          >
            {checking ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden />
            )}
            Vérifier
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCode(initialCode);
            setResult(null);
            setTestResult(null);
            setAutoValidated(false);
          }}
          className="h-10 rounded-xl px-4"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
          Réinitialiser
        </Button>
        <span className="text-[11px] text-muted-foreground">Ctrl/⌘ + Entrée pour exécuter</span>
      </div>

      {testResult && (
        <div className="mt-4 rounded-xl border border-white/10 bg-background/40 p-4">
          <p className={cn("text-sm font-bold", testResult.ok ? "text-emerald-300" : "text-orange-300")}>
            {autoValidated
              ? "Tous les tests passent — lab validé automatiquement."
              : testResult.ok
                ? isAuthenticated
                  ? "Tests réussis."
                  : "Tests réussis — connecte-toi pour enregistrer la validation."
                : `${testResult.resultats.filter((item) => item.ok).length}/${testResult.resultats.length} tests réussis.`}
          </p>
          {testResult.erreur && (
            <p className="mt-2 text-xs text-red-300">
              {testResult.erreur.titre} : {testResult.erreur.message}
            </p>
          )}
          {testResult.resultats.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {testResult.resultats.map((item) => (
                <li key={item.nom} className="flex items-start gap-2 text-xs leading-relaxed">
                  {item.ok ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden />
                  ) : (
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" aria-hidden />
                  )}
                  <span className={item.ok ? "text-zinc-400" : "text-zinc-300"}>
                    {item.nom}
                    {item.detail && <span className="ml-1 text-zinc-500">— {item.detail}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
