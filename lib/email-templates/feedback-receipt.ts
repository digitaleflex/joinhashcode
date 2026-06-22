import { escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface FeedbackReceiptEmailParams {
  name: string;
  type: string;
}

export function getFeedbackReceiptEmailContent({ name, type }: FeedbackReceiptEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const typeLabels: Record<string, string> = {
    BUG: "un signalement de bug",
    FEATURE_REQUEST: "une suggestion de fonctionnalité",
    GENERAL: "un retour général",
  };

  const content = `
      <h1>Merci, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>On a bien reçu ${typeLabels[type] ?? "ton retour"}. Ce genre de contribution compte vraiment — c'est comme ça qu'on construit quelque chose de solide ensemble.</p>
      <p>Notre équipe va l'examiner et tu recevras une mise à jour dès qu'une décision sera prise.</p>
      <hr class="divider">
      <p class="note">Tu peux continuer à utiliser HASHCODE normalement. On s'occupe du reste.</p>
    `;

  const html = generateEmailTemplate(content, "Ton retour a bien été reçu. On s'en occupe.");
  return {
    subject: "Feedback reçu — merci pour ta contribution",
    html,
    text: stripHtml(content),
  };
}
