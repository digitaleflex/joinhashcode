import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

async function main() {
  const missions = await prisma.mission.findMany({
    select: {
      title: true,
      slug: true,
      category: true,
      xp: true,
      missionLevel: true,
      isWeeklyChallenge: true,
    },
    orderBy: { createdAt: 'asc' }
  })

  console.log(JSON.stringify(missions, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
