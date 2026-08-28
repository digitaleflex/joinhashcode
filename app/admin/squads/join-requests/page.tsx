import { prisma } from "@/lib/prisma"
import { Users, Shield, AlertTriangle, ClipboardList, Filter, X } from "lucide-react"
import { formatRelativeTime } from "@/lib/dates"

type JoinRequest = {
  id: string
  status: string
  createdAt: Date
  user: {
    id: string
    name: string
    pseudo: string | null
    email: string
    class: string | null
    image: string | null
  }
  organization: {
    id: string
    name: string
    slug: string | null
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return { label: "En attente", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" }
    case "ACCEPTED":
      return { label: "Acceptée", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" }
    case "REJECTED":
      return { label: "Rejetée", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" }
    default:
      return { label: status, color: "text-zinc-400", bg: "bg-zinc-500/10 border-zinc-500/20" }
  }
}

function classColor(cls: string | null) {
  if (!cls) return ""
  const colors: Record<string, string> = {
    BUILDER: "text-lime-400",
    CREATOR: "text-pink-400",
    STRATEGIST: "text-blue-400",
    CATALYST: "text-orange-400",
  }
  return colors[cls.toUpperCase()] ?? "text-white"
}

export default async function AdminSquadsJoinRequestsPage() {
  const squads = await prisma.organization.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  })

  const requests = await prisma.joinRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          pseudo: true,
          email: true,
          class: true,
          image: true,
        },
      },
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const total = requests.length
  const pending = requests.filter((r) => r.status === "PENDING").length
  const accepted = requests.filter((r) => r.status === "ACCEPTED").length
  const rejected = requests.filter((r) => r.status === "REJECTED").length

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <ClipboardList className="size-5 text-primary" />
          Demandes d&apos;Escouade
        </h1>
        <p className="text-sm text-muted-foreground font-mono">
          {total} demande{total !== 1 ? "s" : ""} · gestion globale des candidatures
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: total, icon: ClipboardList, color: "text-primary" },
          { label: "En attente", value: pending, icon: AlertTriangle, color: "text-amber-400" },
          { label: "Acceptées", value: accepted, icon: Users, color: "text-emerald-400" },
          { label: "Rejetées", value: rejected, icon: Shield, color: "text-rose-500" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3">
            <div className={`flex items-center gap-2 ${kpi.color}`}>
              <kpi.icon className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="text-4xl font-bold text-white tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Filtres</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              id="statusFilter"
              className="bg-zinc-900 border-white/5 text-white text-sm rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Acceptées</option>
              <option value="REJECTED">Rejetées</option>
            </select>
            <select
              id="squadFilter"
              className="bg-zinc-900 border-white/5 text-white text-sm rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Toutes les escouades</option>
              {squads.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.slug && `(@${s.slug})`}
                </option>
              ))}
            </select>
            <input
              type="date"
              id="dateFrom"
              className="bg-zinc-900 border-white/5 text-white text-sm rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Date début"
            />
            <input
              type="date"
              id="dateTo"
              className="bg-zinc-900 border-white/5 text-white text-sm rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Date fin"
            />
            <button
              id="clearFilters"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              <span className="font-mono text-xs uppercase">Effacer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {total === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-12 text-center">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">Aucune demande trouvée</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_120px_100px_140px_120px] gap-0 px-6 py-3 border-b border-white/5">
            {["Utilisateur", "Escouade", "Classe", "Statut", "Demandé le", "Actions"].map((h) => (
              <span key={h} className="text-3xs font-mono uppercase tracking-wider text-muted-foreground">{h}</span>
            ))}
          </div>
          {requests.map((request) => {
            const badge = statusBadge(request.status)
            return (
              <div
                key={request.id}
                data-join-requests-table="true"
                className="grid grid-cols-[1fr_1fr_120px_100px_140px_120px] gap-0 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
              >
                {/* User */}
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                      {request.user.image ? (
                        <img src={request.user.image} alt={request.user.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-zinc-500">{request.user.name.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {request.user.name}
                        {request.user.pseudo && (
                          <span className="text-zinc-500 ml-2 font-mono text-xs font-normal">@{request.user.pseudo}</span>
                        )}
                      </p>
                      <p className="text-xs font-mono text-zinc-500 truncate">{request.user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Squad */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{request.organization.name}</p>
                  <p className="text-xs font-mono text-zinc-600 truncate">
                    {request.organization.slug ? `/invite/${request.organization.slug}` : "Sans slug"}
                  </p>
                </div>

                {/* Class */}
                <span className={`text-xs font-mono uppercase tracking-wider font-bold ${classColor(request.user.class)}`}>
                  {request.user.class ?? "—"}
                </span>

                {/* Status */}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider w-fit ${badge.bg} ${badge.color}`}>
                  {badge.label}
                </span>

                {/* Date */}
                <span className="text-xs font-mono text-zinc-500">
                  {formatRelativeTime(request.createdAt)}
                </span>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  {request.status === "PENDING" && (
                    <>
                      <button
                        data-request-id={request.id}
                        data-action="accept"
                        className="px-3 py-1.5 text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                      >
                        Accepter
                      </button>
                      <button
                        data-request-id={request.id}
                        data-action="reject"
                        className="px-3 py-1.5 text-xs font-mono font-bold uppercase text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors"
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                  {request.status !== "PENDING" && (
                    <span className="text-xs font-mono text-zinc-600">Traitée</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const table = document.querySelector('[data-join-requests-table]');
              if (!table) return;

              const statusFilter = document.getElementById('statusFilter');
              const squadFilter = document.getElementById('squadFilter');
              const dateFrom = document.getElementById('dateFrom');
              const dateTo = document.getElementById('dateTo');
              const clearFilters = document.getElementById('clearFilters');
              const rows = table.querySelectorAll('div[class*="grid-cols"]:not(:first-child)');

              function filterRows() {
                const status = statusFilter.value;
                const squad = squadFilter.value;
                const from = dateFrom.value ? new Date(dateFrom.value).getTime() : null;
                const to = dateTo.value ? new Date(dateTo.value).getTime() : null;

                rows.forEach(row => {
                  const requestId = row.querySelector('[data-request-id]')?.dataset.requestId;
                  if (!requestId) return;

                  const statusCell = row.querySelector('span[class*="inline-flex"]');
                  const squadCell = row.querySelector('p[class*="text-zinc-600"]');
                  const dateCell = row.querySelector('span[class*="text-zinc-500"]:last-of-type');

                  let show = true;

                  if (status !== 'ALL' && statusCell) {
                    const statusText = statusCell.textContent?.trim().toLowerCase();
                    const statusMap = { 'en attente': 'PENDING', 'acceptée': 'ACCEPTED', 'rejetée': 'REJECTED' };
                    show = show && statusMap[statusText || ''] === status;
                  }

                  if (squad && squadCell) {
                    const squadText = squadCell.textContent?.trim();
                    show = show && squadText?.includes(squad);
                  }

                  if (from && dateCell) {
                    const dateText = dateCell.textContent?.trim();
                    const date = parseRelativeDate(dateText);
                    show = show && date && date >= from;
                  }

                  if (to && dateCell) {
                    const dateText = dateCell.textContent?.trim();
                    const date = parseRelativeDate(dateText);
                    show = show && date && date <= to;
                  }

                  row.style.display = show ? 'grid' : 'none';
                });
              }

              function parseRelativeDate(text) {
                if (!text) return null;
                const now = Date.now();
                if (text.includes('maintenant') || text.includes('secondes') || text.includes('minute')) return now;
                const match = text.match(/(\\d+)\\s*([mhdj])/);
                if (match) {
                  const val = parseInt(match[1]);
                  const unit = match[2];
                  const ms = unit === 'm' ? 60000 : unit === 'h' ? 3600000 : 86400000;
                  return now - val * ms;
                }
                return null;
              }

              [statusFilter, squadFilter, dateFrom, dateTo].forEach(el => {
                el.addEventListener('change', filterRows);
              });

              clearFilters.addEventListener('click', () => {
                statusFilter.value = 'ALL';
                squadFilter.value = '';
                dateFrom.value = '';
                dateTo.value = '';
                filterRows();
              });

              // Bulk actions via event delegation
              table.addEventListener('click', async (e) => {
                const btn = e.target.closest('[data-request-id]');
                if (!btn) return;

                const requestId = btn.dataset.requestId;
                const action = btn.dataset.action;
                if (!requestId || !action) return;

                btn.disabled = true;
                btn.textContent = action === 'accept' ? '...' : '...';

                try {
                  const res = await fetch('/api/admin/squads/join-requests', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ requestIds: [requestId], action }),
                  });
                  const data = await res.json();
                  if (res.ok && data.results?.[0]?.success) {
                    window.location.reload();
                  } else {
                    alert(data.message || 'Erreur');
                    btn.disabled = false;
                    btn.textContent = action === 'accept' ? 'Accepter' : 'Rejeter';
                  }
                } catch {
                  alert('Erreur réseau');
                  btn.disabled = false;
                  btn.textContent = action === 'accept' ? 'Accepter' : 'Rejeter';
                }
              });
            })();
          `,
        }}
      />
    </div>
  )
}