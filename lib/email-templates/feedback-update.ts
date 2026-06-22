import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface FeedbackUpdateEmailParams {
  name: string;
  status: string;
}

export function getFeedbackUpdateEmailContent({ name, status }: FeedbackUpdateEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const statusInfo: Record<string, { headline: string; body: string; cta: boolean }> = {
    REVIEWED: {
      headline: "Ton feedback est en cours d'analyse.",
      body: "Notre équipe l'a pris en main et travaille dessus. On te recontacte dès qu'une décision est prise.",
      cta: false,
    },
    RESOLVED: {
      headline: "Ton feedback a été traité.",
      body: "Les mesures nécessaires ont été prises suite à ton retour. Ton impact sur la plateforme est concret et visible. Merci d'avoir pris le temps de contribuer.",
      cta: true,
    },
  };

  const info = statusInfo[status] ?? statusInfo.REVIEWED;

  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ${escHtml(info.headline)}</h1>
      <p>${escHtml(info.body)}</p>
      ${info.cta ? `<div class="btn-wrap"><a href="${APP_URL}/dashboard" class="btn">Retourner au tableau de bord →</a></div>` : ""}
      <hr class="divider">
      <p class="note">Des questions sur ce retour ? Réponds directement à cet email.</p>
    `;

  const preview = status === "RESOLVED" ? "Les mesures nécessaires ont été prises. Merci pour ta contribution." : "Notre équipe l'a pris en main.";
  const html = generateEmailTemplate(content, preview);
  return {
    subject: status === "RESOLVED" ? "Ton feedback a été résolu — merci ✓" : "Mise à jour : ton feedback HASHCODE est en cours d'analyse",
    html,
    text: stripHtml(content),
  };
}
