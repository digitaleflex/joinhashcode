import { prisma } from '../lib/prisma'

async function main() {
  try {
    const count = await prisma.user.count()
    const memberCount = await prisma.user.count({
      where: { role: "MEMBER", banned: false }
    })
    console.log('Total Users:', count)
    console.log('Member Count (not banned):', memberCount)
  } catch (error) {
    console.error('Error fetching user count:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // await prisma.$disconnect() // Optionnel si on utilise l'instance globale
  })
