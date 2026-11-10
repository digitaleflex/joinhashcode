import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface ReactivationEmailParams {
  name: string;
}

export function getReactivationEmailContent({ name }: ReactivationEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const salutation = firstName ? `, <span class="accent">${escHtml(firstName)}</span>` : "";
  const subjectPrefix = firstName ? `${escHtml(firstName)}, ` : "";
  const content = `
      <h1>15 minutes. Et tu es officiellement membre${salutation}.</h1>
      <p>La dernière fois, ta première mission ressemblait à un formulaire sans fin suivi d'une attente indéterminée. <strong>C'est fini.</strong></p>
      <p><strong>Ce qui a changé :</strong></p>
      <ul>
        <li>Ton diagnostic pré-remplit déjà l'essentiel — <strong>tu confirmes, tu ne répètes pas</strong></li>
        <li>Validation <strong>instantanée</strong> dès que tu termines</li>
        <li>Ton <strong>profil HashCode officiel</strong> est généré à la fin</li>
      </ul>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions/mission-01-decouverte" class="btn">Terminer ma première mission →</a>
      </div>
      <p class="note">15 minutes aujourd'hui, et ton parcours démarre pour de bon.</p>
    `;

  const html = generateEmailTemplate(
    content,
    "Ta première mission se valide maintenant en 15 minutes.",
    "Nouveauté"
  );
  return {
    subject: `${subjectPrefix}ta première mission se valide en 15 min maintenant`,
    html,
    text: stripHtml(content),
  };
}
