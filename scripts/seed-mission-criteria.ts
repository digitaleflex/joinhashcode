import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma"
import { getCriteriaForMission } from "../lib/acceptance-criteria"
import * as dotenv from "dotenv"

dotenv.config()

// Bypass TLS for Windows/Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const missions = await prisma.mission.findMany()

  for (const mission of missions) {
    const criteria = getCriteriaForMission(mission.category)
    await prisma.mission.update({
      where: { id: mission.id },
      data: { acceptanceCriteria: criteria },
    })
    console.log(`✓ ${mission.title} — ${criteria.length} critères`)
  }

  console.log(`\nSeed terminé : ${missions.length} missions mises à jour.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
