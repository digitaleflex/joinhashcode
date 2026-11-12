import { isHttpUrl } from "@/lib/safe-url"

interface Artifact {
  key: string
  type: string
  label: string
  value: string | null
  fileUrl: string | null
  fileName: string | null
}

interface SubmissionDetailsProps {
  submitterName: string
  mission: { title: string; description: string; category: string; deliverables: string[] }
  content: string | null
  projectDescription: string | null
  artifacts: Artifact[]
}

function TextOrLink({ value }: { value: string }) {
  if (isHttpUrl(value)) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-primary hover:underline">
        {value}
      </a>
    )
  }
  return <p className="whitespace-pre-wrap break-words text-sm text-zinc-300">{value}</p>
}

/** Ce que le relecteur voit : le brief du lab et ce que le membre a livré. Jamais d'email ni de donnée privée. */
export function SubmissionDetails({ submitterName, mission, content, projectDescription, artifacts }: SubmissionDetailsProps) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
          {mission.category} · soumis par {submitterName}
        </p>
        <h2 className="text-xl font-black tracking-tight text-white">{mission.title}</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">{mission.description}</p>
        {mission.deliverables.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-400">
            {mission.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Livrable du membre</h3>
        {content && <TextOrLink value={content} />}
        {projectDescription && <p className="whitespace-pre-wrap break-words text-sm text-zinc-300">{projectDescription}</p>}
        {artifacts.map((a) => (
          <div key={a.key} className="space-y-1 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-sm font-medium text-zinc-200">
              {a.label} <span className="ml-1 text-xs font-mono text-zinc-500">{a.type}</span>
            </p>
            {a.value && <TextOrLink value={a.value} />}
            {a.fileUrl && isHttpUrl(a.fileUrl) && (
              <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" className="block break-all text-sm text-primary hover:underline">
                📎 {a.fileName ?? a.fileUrl}
              </a>
            )}
          </div>
        ))}
        {!content && !projectDescription && artifacts.length === 0 && (
          <p className="text-sm italic text-zinc-500">Aucun contenu soumis.</p>
        )}
      </section>
    </div>
  )
}
