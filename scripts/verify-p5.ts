import { prisma } from "../lib/prisma.ts"

async function main() {
  console.log("Verifying P5 Data Enrichment Logic...")

  // 1. Fetch completions count
  const completionsRaw = await prisma.missionSubmission.groupBy({
    by: ["missionId"],
    where: { status: "APPROVED" },
    _count: { _all: true },
  });
  console.log("Completions Raw:", completionsRaw);

  // 2. Fetch average ratings
  const ratingsRaw = await prisma.missionSubmission.groupBy({
    by: ["missionId"],
    where: {
      status: "APPROVED",
      userRating: { not: null },
    },
    _avg: { userRating: true },
    _count: { userRating: true },
  });
  console.log("Ratings Raw:", ratingsRaw);

  // 3. Build maps
  const completionsMap = Object.fromEntries(
    completionsRaw.map(c => [c.missionId, c._count._all])
  );
  console.log("Completions Map:", completionsMap);

  const ratingsMap = Object.fromEntries(
    ratingsRaw.map(r => [r.missionId, {
      avg: r._avg.userRating,
      count: r._count.userRating,
    }])
  );
  console.log("Ratings Map:", ratingsMap);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
