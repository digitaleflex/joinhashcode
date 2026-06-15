import { PrismaClient } from '../generated/prisma'

async function main() {
  const urls = [
    'postgresql://postgres:localpassword@localhost:5432/hashcode?schema=public',
    'postgresql://postgres:localpassword@localhost:5433/hashcode?schema=public',
    'postgresql://postgres:localpassword@localhost:5434/hashcode?schema=public',
  ]

  for (const url of urls) {
    console.log(`Trying URL: ${url}`)
    process.env.DATABASE_URL = url
    const prisma = new PrismaClient()

    try {
      const count = await prisma.user.count()
      console.log(`Success! Count for ${url}: ${count}`)
      const memberCount = await prisma.user.count({
        where: { role: "MEMBER", banned: false }
      })
      console.log(`Member Count (not banned): ${memberCount}`)
      break
    } catch (error: any) {
      console.error(`Failed for ${url}: ${error.message}`)
    } finally {
      await prisma.$disconnect()
    }
  }
}

main()
