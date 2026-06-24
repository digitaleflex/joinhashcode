import { prisma } from "./prisma"

export async function purgeOldLocations() {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  let totalDeleted = 0

  while (true) {
    const records = await prisma.userLocation.findMany({
      where: { createdAt: { lt: cutoff } },
      select: { id: true },
      take: 5000,
    })

    if (records.length === 0) break

    const ids = records.map((r) => r.id)
    const purged = await prisma.userLocation.deleteMany({
      where: { id: { in: ids } },
    })

    totalDeleted += purged.count

    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  return totalDeleted
}
