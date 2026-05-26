import { XP_THRESHOLDS } from "./missions";
import { checkAndAwardBadges } from "./badge-engine";

export async function calculateAndSetLevel(userId: string, currentExperience: number, prisma: any) {
  let newLevel = 1;
  
  // Find the highest level where experience >= threshold
  const thresholds = Object.entries(XP_THRESHOLDS).sort((a, b) => Number(b[0]) - Number(a[1]));
  
  for (const [levelStr, threshold] of Object.entries(XP_THRESHOLDS).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    if (currentExperience >= threshold) {
      newLevel = Number(levelStr);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { level: newLevel },
  });

  // Trigger badge check after level update
  await checkAndAwardBadges(userId);

  return updatedUser;
}
