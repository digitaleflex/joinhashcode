import { escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface AccountDeletedEmailParams {
  name: string;
}

export function getAccountDeletedEmailContent({ name }: AccountDeletedEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Ton compte a été supprimé, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Comme demandé, ton compte HASHCODE et toutes les données associées ont été définitivement supprimés.</p>
      <p>Si tu n'es pas à l'origine de cette action ou si tu penses qu'il s'agit d'une erreur, contacte-nous immédiatement en répondant à cet email.</p>
      <hr class="divider">
      <p class="note">Tu pourras toujours créer un nouveau compte si tu souhaites rejoindre la communauté à nouveau. Ce sera reparti de zéro.</p>
    `;
  const html = generateEmailTemplate(content, "Ton compte HASHCODE a été supprimé. Réponds si ce n'est pas toi.");
  return {
    subject: "Confirmation : ton compte HASHCODE a été supprimé",
    html,
    text: stripHtml(content),
  };
}
