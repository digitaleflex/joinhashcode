import { prisma } from "./prisma";

export async function purgeOldLocations(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const result = await prisma.userLocation.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return result.count;
}
