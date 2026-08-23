// Campagne de réactivation one-shot : email aux membres qui ont complété le
// quiz mais jamais validé la Mission 01, pour annoncer la validation
// instantanée (~15 min, +150 XP).
//
// Usage :
//   npx tsx scripts/reactivate-dormant.ts           → DRY RUN (liste seulement)
//   npx tsx scripts/reactivate-dormant.ts --send    → envoi réel
//
// Sécurités : exclut ADMIN/bannis/désactivés, emails non vérifiés ou invalides,
// et les users ayant déjà un attempt/submission APPROVED. Anti-bounce : pause
// entre chaque envoi.

import { prisma } from "../lib/prisma";
import { emailService } from "../lib/email";

const SEND = process.argv.includes("--send");
const PAUSE_MS = 1200;

async function main() {
  const targets = await prisma.user.findMany({
    where: {
      class: { not: null },
      emailVerified: true,
      emailStatus: "VALID",
      role: { not: "ADMIN" },
      banned: false,
      deactivatedAt: null,
      AND: [
        { missionAttempts: { none: { status: "APPROVED" } } },
        { missionSubmissions: { none: { status: "APPROVED" } } },
      ],
    },
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  console.log(`🎯 Cibles : ${targets.length} membre(s)`);
  for (const t of targets) {
    console.log(`   - ${t.email} (${t.name || "sans nom"}, inscrit le ${t.createdAt.toISOString().slice(0, 10)})`);
  }

  if (!SEND) {
    console.log("\n🟡 DRY RUN — aucun email envoyé. Relance avec --send pour l'envoi réel.");
    return;
  }
  if (targets.length === 0) return;

  let sent = 0;
  let failed = 0;
  for (const t of targets) {
    try {
      const res = await emailService.sendReactivation({ email: t.email, name: t.name || "" });
      if ((res as { success?: boolean })?.success === false) throw new Error("envoi refusé");
      sent++;
      console.log(`   ✉️  envoyé → ${t.email}`);
    } catch (e) {
      failed++;
      console.error(`   ✗ échec → ${t.email}:`, e instanceof Error ? e.message : e);
    }
    await new Promise((r) => setTimeout(r, PAUSE_MS));
  }

  console.log(`\n✅ Terminé : ${sent} envoyé(s), ${failed} échec(s).`);
}

main()
  .catch((e) => {
    console.error("❌ Campagne échouée:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
