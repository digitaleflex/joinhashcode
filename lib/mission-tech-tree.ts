import { prisma } from "./prisma";

export type UserClass = "BUILDER" | "CREATOR" | "STRATEGIST" | "CATALYST";

export type SpecializationId =
  | "BACKEND_DEV"
  | "DEVOPS"
  | "MOBILE"
  | "UI_UX"
  | "CONTENT"
  | "BRAND"
  | "PRODUCT"
  | "BUSINESS"
  | "GROWTH"
  | "COMMUNITY"
  | "MENTORING"
  | "EVENTS";

export interface Specialization {
  id: SpecializationId;
  class: UserClass;
  name: string;
  description: string;
  missions: SpecializationMission[];
}

export interface SpecializationMission {
  missionId: string;
  order: number;
  prerequisites: string[];
  xp: number;
}

export const SPECIALIZATIONS: Specialization[] = [
  {
    id: "BACKEND_DEV",
    class: "BUILDER",
    name: "Backend Developer",
    description: "Maîtrise les APIs, bases de données, architecture serveur et scalabilité.",
    missions: [
      { missionId: "mission-api-design", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-database-modeling", order: 2, prerequisites: ["mission-api-design"], xp: 250 },
      { missionId: "mission-auth-system", order: 3, prerequisites: ["mission-database-modeling"], xp: 300 },
      { missionId: "mission-caching-layer", order: 4, prerequisites: ["mission-auth-system"], xp: 350 },
      { missionId: "mission-microservices", order: 5, prerequisites: ["mission-caching-layer"], xp: 500 },
    ],
  },
  {
    id: "DEVOPS",
    class: "BUILDER",
    name: "DevOps Engineer",
    description: "Automatise le déploiement, l'infrastructure as code, CI/CD et observabilité.",
    missions: [
      { missionId: "mission-docker-fundamentals", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-ci-cd-pipeline", order: 2, prerequisites: ["mission-docker-fundamentals"], xp: 250 },
      { missionId: "mission-kubernetes-basics", order: 3, prerequisites: ["mission-ci-cd-pipeline"], xp: 350 },
      { missionId: "mission-terraform-iac", order: 4, prerequisites: ["mission-kubernetes-basics"], xp: 400 },
      { missionId: "mission-observability-stack", order: 5, prerequisites: ["mission-terraform-iac"], xp: 500 },
    ],
  },
  {
    id: "MOBILE",
    class: "BUILDER",
    name: "Mobile Developer",
    description: "Conçoit des applications natives et cross-platform performantes.",
    missions: [
      { missionId: "mission-mobile-setup", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-native-navigation", order: 2, prerequisites: ["mission-mobile-setup"], xp: 250 },
      { missionId: "mission-offline-first", order: 3, prerequisites: ["mission-native-navigation"], xp: 300 },
      { missionId: "mission-push-notifications", order: 4, prerequisites: ["mission-offline-first"], xp: 350 },
      { missionId: "mission-app-store-deploy", order: 5, prerequisites: ["mission-push-notifications"], xp: 400 },
    ],
  },
  {
    id: "UI_UX",
    class: "CREATOR",
    name: "UI/UX Designer",
    description: "Crée des expériences utilisateur intuitives et des interfaces esthétiques.",
    missions: [
      { missionId: "mission-user-research", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-wireframing", order: 2, prerequisites: ["mission-user-research"], xp: 250 },
      { missionId: "mission-design-system", order: 3, prerequisites: ["mission-wireframing"], xp: 350 },
      { missionId: "mission-prototyping", order: 4, prerequisites: ["mission-design-system"], xp: 300 },
      { missionId: "mission-usability-testing", order: 5, prerequisites: ["mission-prototyping"], xp: 400 },
    ],
  },
  {
    id: "CONTENT",
    class: "CREATOR",
    name: "Content Creator",
    description: "Produit du contenu technique engageant : articles, vidéos, newsletters.",
    missions: [
      { missionId: "mission-tech-writing", order: 1, prerequisites: [], xp: 150 },
      { missionId: "mission-video-production", order: 2, prerequisites: ["mission-tech-writing"], xp: 250 },
      { missionId: "mission-newsletter-growth", order: 3, prerequisites: ["mission-video-production"], xp: 300 },
      { missionId: "mission-seo-content", order: 4, prerequisites: ["mission-newsletter-growth"], xp: 250 },
      { missionId: "mission-content-strategy", order: 5, prerequisites: ["mission-seo-content"], xp: 400 },
    ],
  },
  {
    id: "BRAND",
    class: "CREATOR",
    name: "Brand Designer",
    description: "Façonne l'identité visuelle et narrative des produits tech.",
    missions: [
      { missionId: "mission-brand-strategy", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-logo-identity", order: 2, prerequisites: ["mission-brand-strategy"], xp: 250 },
      { missionId: "mission-motion-design", order: 3, prerequisites: ["mission-logo-identity"], xp: 300 },
      { missionId: "mission-brand-guidelines", order: 4, prerequisites: ["mission-motion-design"], xp: 350 },
      { missionId: "mission-rebrand-project", order: 5, prerequisites: ["mission-brand-guidelines"], xp: 500 },
    ],
  },
  {
    id: "PRODUCT",
    class: "STRATEGIST",
    name: "Product Manager",
    description: "Définit la vision produit, priorise le backlog et mesure l'impact.",
    missions: [
      { missionId: "mission-product-discovery", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-roadmap-planning", order: 2, prerequisites: ["mission-product-discovery"], xp: 250 },
      { missionId: "mission-metrics-kpis", order: 3, prerequisites: ["mission-roadmap-planning"], xp: 300 },
      { missionId: "mission-user-feedback-loop", order: 4, prerequisites: ["mission-metrics-kpis"], xp: 350 },
      { missionId: "mission-product-launch", order: 5, prerequisites: ["mission-user-feedback-loop"], xp: 500 },
    ],
  },
  {
    id: "BUSINESS",
    class: "STRATEGIST",
    name: "Business Strategist",
    description: "Analyse le marché, modélise le business et lève des fonds.",
    missions: [
      { missionId: "mission-market-analysis", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-business-model", order: 2, prerequisites: ["mission-market-analysis"], xp: 250 },
      { missionId: "mission-go-to-market", order: 3, prerequisites: ["mission-business-model"], xp: 350 },
      { missionId: "mission-fundraising", order: 4, prerequisites: ["mission-go-to-market"], xp: 400 },
      { missionId: "mission-unit-economics", order: 5, prerequisites: ["mission-fundraising"], xp: 500 },
    ],
  },
  {
    id: "GROWTH",
    class: "STRATEGIST",
    name: "Growth Hacker",
    description: "Optimise l'acquisition, l'activation et la rétention par l'expérimentation.",
    missions: [
      { missionId: "mission-growth-loops", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-ab-testing", order: 2, prerequisites: ["mission-growth-loops"], xp: 250 },
      { missionId: "mission-viral-mechanics", order: 3, prerequisites: ["mission-ab-testing"], xp: 300 },
      { missionId: "mission-retention-cohorts", order: 4, prerequisites: ["mission-viral-mechanics"], xp: 350 },
      { missionId: "mission-growth-model", order: 5, prerequisites: ["mission-retention-cohorts"], xp: 500 },
    ],
  },
  {
    id: "COMMUNITY",
    class: "CATALYST",
    name: "Community Builder",
    description: "Anime et fait grandir des communautés tech engagées.",
    missions: [
      { missionId: "mission-community-strategy", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-onboarding-flow", order: 2, prerequisites: ["mission-community-strategy"], xp: 250 },
      { missionId: "mission-ambassador-program", order: 3, prerequisites: ["mission-onboarding-flow"], xp: 300 },
      { missionId: "mission-community-events", order: 4, prerequisites: ["mission-ambassador-program"], xp: 350 },
      { missionId: "mission-community-scaling", order: 5, prerequisites: ["mission-community-events"], xp: 500 },
    ],
  },
  {
    id: "MENTORING",
    class: "CATALYST",
    name: "Mentor",
    description: "Guide les développeurs juniors et partage son expertise.",
    missions: [
      { missionId: "mission-mentoring-basics", order: 1, prerequisites: [], xp: 150 },
      { missionId: "mission-code-review-mentor", order: 2, prerequisites: ["mission-mentoring-basics"], xp: 200 },
      { missionId: "mission-career-coaching", order: 3, prerequisites: ["mission-code-review-mentor"], xp: 250 },
      { missionId: "mission-group-mentoring", order: 4, prerequisites: ["mission-career-coaching"], xp: 300 },
      { missionId: "mission-mentorship-program", order: 5, prerequisites: ["mission-group-mentoring"], xp: 400 },
    ],
  },
  {
    id: "EVENTS",
    class: "CATALYST",
    name: "Event Organizer",
    description: "Organise meetups, hackathons et conférences tech mémorables.",
    missions: [
      { missionId: "mission-meetup-organization", order: 1, prerequisites: [], xp: 200 },
      { missionId: "mission-hackathon-planning", order: 2, prerequisites: ["mission-meetup-organization"], xp: 300 },
      { missionId: "mission-speaker-curation", order: 3, prerequisites: ["mission-hackathon-planning"], xp: 250 },
      { missionId: "mission-event-marketing", order: 4, prerequisites: ["mission-speaker-curation"], xp: 300 },
      { missionId: "mission-conference-production", order: 5, prerequisites: ["mission-event-marketing"], xp: 500 },
    ],
  },
];

export function getSpecializationsForClass(userClass: UserClass): Specialization[] {
  return SPECIALIZATIONS.filter((s) => s.class === userClass);
}

export function getSpecializationById(id: SpecializationId): Specialization | undefined {
  return SPECIALIZATIONS.find((s) => s.id === id);
}

export async function getAvailableSpecializations(userId: string): Promise<{
  specialization: Specialization;
  progress: { completed: number; total: number; nextMissionId?: string };
}[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { class: true, missionsCompletedCount: true },
  });

  if (!user?.class) return [];

  const userClass = user.class as UserClass;
  const specs = getSpecializationsForClass(userClass);

  const completedMissionIds = await prisma.missionSubmission.findMany({
    where: { userId, status: "APPROVED" },
    select: { missionId: true },
  });
  const completedSet = new Set(completedMissionIds.map((m) => m.missionId));

  return specs.map((spec) => {
    const completed = spec.missions.filter((m) => completedSet.has(m.missionId)).length;
    const nextMission = spec.missions.find(
      (m) => !completedSet.has(m.missionId) && m.prerequisites.every((p) => completedSet.has(p))
    );
    return {
      specialization: spec,
      progress: {
        completed,
        total: spec.missions.length,
        nextMissionId: nextMission?.missionId,
      },
    };
  });
}

export async function getNextMissionsInPath(
  userId: string,
  specializationId: SpecializationId
): Promise<SpecializationMission[]> {
  const spec = getSpecializationById(specializationId);
  if (!spec) return [];

  const completedMissionIds = await prisma.missionSubmission.findMany({
    where: { userId, status: "APPROVED" },
    select: { missionId: true },
  });
  const completedSet = new Set(completedMissionIds.map((m) => m.missionId));

  return spec.missions.filter(
    (m) => !completedSet.has(m.missionId) && m.prerequisites.every((p) => completedSet.has(p))
  );
}

export function getAllSpecializations(): Specialization[] {
  return SPECIALIZATIONS;
}