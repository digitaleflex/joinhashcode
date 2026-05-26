import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.findFirst({ select: { id: true } });
  const mission = await prisma.mission.findFirst({ select: { id: true } });
  console.log(JSON.stringify({ userId: user?.id, missionId: mission?.id }));
}

main().catch(console.error);
