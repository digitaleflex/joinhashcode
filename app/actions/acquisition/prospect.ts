"use server";

import { prisma } from "@/lib/prisma";
import { logError, logInfo } from "@/lib/logger";
import { z } from "zod";

/**
 * Crée (ou met à jour) le prospect issu du funnel d'acquisition.
 *
 * POURQUOI CETTE ACTION EXISTE
 * ----------------------------
 * Le profiling collecte prénom, email et une dizaine de champs qualifiants,
 * puis… rien n'était conservé : les réponses vivaient dans le `sessionStorage`
 * et disparaissaient à la fermeture de l'onglet. Résultat : aucun prospect
 * exploitable, aucune conversion mesurable, et l'utilisateur devait tout
 * ressaisir s'il revenait.
 *
 * COMPORTEMENT
 * ------------
 * - IDEMPOTENT : même email = on met à jour, jamais de doublon.
 * - PRUDENT : si l'utilisateur existe déjà, on ne touche PAS à son `role`
 *   (un ADMIN ne doit pas devenir MEMBER) ni à ses identifiants.
 * - SÉPARÉ DU CONSENTEMENT : `recordProfilingConsent()` est appelé par la page
 *   au moment du clic, pas ici. Les deux sont indépendants.
 *
 * CE QU'IL NE FAIT PAS
 * --------------------
 * - Il ne crée pas de session (le magic link s'en charge — étape suivante).
 * - Il n'envoie pas d'email (l'utilisateur n'a pas encore confirmé).
 */

const prospectSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().max(80).optional().default(""),
  email: z.string().email(),
  phone: z.string().max(30).optional().default(""),
  country: z.string().max(80).optional().default(""),
  city: z.string().max(80).optional().default(""),
  gender: z.string().max(20).optional(),
  primaryDomain: z.string().max(40).optional(),
  domainSpecialty: z.array(z.string()).optional(),
  level: z.string().max(30).optional(),
  goal: z.string().max(40).optional(),
  goalProjectStage: z.string().max(60).optional(),
  goalSituation: z.string().max(60).optional(),
  availability: z.string().max(40).optional(),
  availabilityTimes: z.string().max(60).optional(),
  learningStyle: z.string().max(40).optional(),
  mentoringInterest: z.boolean().optional(),
  mentoringTypes: z.array(z.string()).optional(),
  mentoringFrequency: z.string().max(40).optional(),
  mentoringDomain: z.string().max(40).optional(),
  profileArchetype: z.string().max(60).optional(),
});

export type ProspectInput = z.input<typeof prospectSchema>;

export async function createProspectFromProfiling(input: ProspectInput) {
  let data: z.infer<typeof prospectSchema>;
  try {
    data = prospectSchema.parse(input);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Profil incomplet ou invalide" };
    }
    throw error;
  }

  try {
    // Le modèle `Member` vient de hashskills et exige une organisation.
    // L'acquisition alimente une organisation unique représentant la
    // communauté HASHCODE — les organisations thématiques viendront après.
    const org = await prisma.organization.upsert({
      where: { slug: "hashcode-community" },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: "HASHCODE Community",
        slug: "hashcode-community",
        createdAt: new Date(),
        description: "Communauté HASHCODE — issus du funnel d'acquisition.",
      },
      select: { id: true },
    });

    const user = await prisma.user.upsert({
      where: { email: data.email },
      // Ne JAMAIS écraser le rôle ni les champs sensibles d'un compte existant.
      // `primaryDomain` sert aux recommandations de cours sur /academy ; on ne
      // l'écrase que s'il est fourni.
      update: {
        name: data.firstName,
        ...(data.primaryDomain ? { primaryDomain: data.primaryDomain } : {}),
      },
      create: {
        id: crypto.randomUUID(),
        name: data.firstName,
        email: data.email,
        emailVerified: false, // confirmé au clic du magic link
        role: "MEMBER",
        language: "fr",
        primaryDomain: data.primaryDomain ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: { id: true, email: true },
    });

    const profile = {
      firstName: data.firstName,
      lastName: data.lastName || null,
      phone: data.phone || null,
      country: data.country || null,
      city: data.city || null,
      gender: data.gender ?? null,
      primaryDomain: data.primaryDomain ?? null,
      level: data.level ?? null,
      goal: data.goal ?? null,
      goalProjectStage: data.goalProjectStage ?? null,
      goalSituation: data.goalSituation ?? null,
      availability: data.availability ?? null,
      availabilityTimes: data.availabilityTimes ?? null,
      learningStyle: data.learningStyle ?? null,
      mentoringInterest: data.mentoringInterest ?? false,
      mentoringTypes: data.mentoringTypes ?? [],
      mentoringFrequency: data.mentoringFrequency ?? null,
      mentoringDomain: data.mentoringDomain ?? null,
      profileArchetype: data.profileArchetype ?? null,
    };

    await prisma.member.upsert({
      where: { userId: user.id },
      update: profile,
      create: {
        id: crypto.randomUUID(),
        userId: user.id,
        organizationId: org.id,
        role: "MEMBER",
        createdAt: new Date(),
        ...profile,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        userId: user.id,
        event: "prospect_created",
        data: {
          primaryDomain: data.primaryDomain ?? "",
          level: data.level ?? "",
          goal: data.goal ?? "",
          source: "acquisition_profiling",
        },
      },
    });

    logInfo(
      "Prospect créé depuis le profiling",
      `userId=${user.id}`,
      { domain: data.primaryDomain ?? "" }
    );

    return { success: true, userId: user.id };
  } catch (error: unknown) {
    logError("createProspectFromProfiling", error as Error, {
      email: data.email,
    });
    return { success: false, error: "Impossible d'enregistrer le profil" };
  }
}
