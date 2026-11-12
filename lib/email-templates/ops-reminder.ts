import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export type OpsReminderStep = "onboarding" | "domain" | "activation";

const STEPS: Record<
  OpsReminderStep,
  { title: string; body: string; cta: string; href: string }
> = {
  onboarding: {
    title: "Ton inscription n'est pas terminée",
    body: "Il reste une étape pour créer ton profil et accéder à ton parcours. Cela prend moins de 5 minutes.",
    cta: "Terminer mon inscription",
    href: "/onboarding",
  },
  domain: {
    title: "Choisis ton domaine",
    body: "Web, cybersécurité ou IA appliquée : choisis ton terrain de progression pour débloquer ta première action.",
    cta: "Choisir mon domaine",
    href: "/dashboard",
  },
  activation: {
    title: "Ta première action t'attend",
    body: "Ton profil est prêt. Il ne reste plus qu'à commencer ta première action concrète et à la marquer comme terminée.",
    cta: "Voir ma première action",
    href: "/dashboard",
  },
};

export function getOpsReminderEmailContent({
  name,
  step,
  unsubscribeUrl,
}: {
  name: string;
  step: OpsReminderStep;
  unsubscribeUrl?: string;
}) {
  const firstName = (name || "").split(" ")[0] || "toi";
  const content = STEPS[step];
  const unsubscribe = unsubscribeUrl
    ? `<p style="margin-top:22px; font-size:12px; color:#77777f;">
         Tu ne veux plus de relances d'activation ?
         <a href="${escHtml(unsubscribeUrl)}" style="color:#77777f; text-decoration:underline;">Se désabonner</a>.
       </p>`
    : "";
  const html = generateEmailTemplate(
  `<h1>${escHtml(content.title)}, <span class="accent">${escHtml(firstName)}</span>.</h1>
   <p>${escHtml(content.body)}</p>
   <div class="btn-wrap">
     <a href="${APP_URL}${content.href}" class="btn">${escHtml(content.cta)} →</a>
   </div>
   ${unsubscribe}`,
    content.body,
  );

  const text = unsubscribeUrl
    ? `${stripHtml(content.body)}\n\nSe désabonner : ${unsubscribeUrl}`
    : stripHtml(content.body);

  return {
    subject: `${firstName}, ${content.title.toLowerCase()}`,
    html,
    text,
  };
}
