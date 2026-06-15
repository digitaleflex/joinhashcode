import { prisma } from "./prisma"

export interface LocationInput {
  latitude: number
  longitude: number
  accuracy: number
}

export async function saveUserLocation(userId: string, location: LocationInput, ip?: string) {
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        latitude: location.latitude,
        longitude: location.longitude,
        locationAccuracy: location.accuracy,
        locationUpdatedAt: new Date(),
      },
    })

    await tx.userLocation.create({
      data: {
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        ip: ip ?? null,
      },
    })
  })
}

export async function getLocationsForUser(userId: string, limit = 50) {
  return prisma.userLocation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getAllLocationsSince(since: Date) {
  return prisma.userLocation.findMany({
    where: { createdAt: { gte: since } },
    include: { user: { select: { id: true, pseudo: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function purgeOldLocations() {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

  const purged = await prisma.userLocation.deleteMany({
    where: { createdAt: { lt: cutoff } },
  })

  return purged.count
}
