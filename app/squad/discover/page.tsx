import { SquadDiscovery } from "@/components/dashboard/squad/SquadDiscovery";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Découvrir des Escouades | HASHCODE",
  description: "Trouve ton unité et synchronise tes efforts.",
};

export default async function DiscoverSquadsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Découverte d'escouades</h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-wider">Trouve ton unité et synchronise tes efforts.</p>
      </div>
      <SquadDiscovery />
    </div>
  );
}
