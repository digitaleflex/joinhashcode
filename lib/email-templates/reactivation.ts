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
        <li>Validation <strong>instantanée</strong> dès que tu termines : +150 XP immédiatement</li>
        <li>Ton <strong>profil HashCode officiel</strong> est généré à la fin</li>
      </ul>
      <div style="text-align:center; margin:26px 0; padding:18px 20px; background-color:#131316; border:1px dashed rgba(197,244,65,0.35); border-radius:12px;">
        <span style="font-size:11px; color:#77777f; text-transform:uppercase; letter-spacing:0.14em;">Récompense à la clé</span>
        <div style="font-size:34px; font-weight:800; color:#C5F441; letter-spacing:0.03em; font-family:'Courier New',Courier,monospace; margin-top:4px;">+150 XP</div>
      </div>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions/mission-01-decouverte" class="btn">Terminer ma première mission →</a>
      </div>
      <p class="note">15 minutes aujourd'hui, et ton parcours démarre pour de bon.</p>
    `;

  const html = generateEmailTemplate(
    content,
    "Ta première mission se valide maintenant en 15 minutes — +150 XP.",
    "Nouveauté"
  );
  return {
    subject: `${subjectPrefix}ta première mission se valide en 15 min maintenant`,
    html,
    text: stripHtml(content),
  };
}
