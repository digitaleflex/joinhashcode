/**
 * @deprecated Generic XP gamification is frozen by product decision D-015.
 *
 * Keep this compatibility module while older Academy integrations are retired.
 * Do not write XP/level fields here: they are not part of the current User schema.
 */

export enum ActivityType {
  COMPLETE_LESSON = "COMPLETE_LESSON",
  FINISH_COURSE = "FINISH_COURSE",
  FORUM_POST = "FORUM_POST",
  QUIZ_SUCCESS = "QUIZ_SUCCESS",
  STREAK_DAY = "STREAK_DAY",
  START_COURSE = "START_COURSE",
}

export async function onActivity(
  _userId: string,
  _activity: ActivityType,
): Promise<{ success: false; disabled: true }> {
  return { success: false, disabled: true };
}
