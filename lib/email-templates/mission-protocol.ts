import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface MissionProtocolEmailParams {
  name: string;
  userClass: string;
}

export function getMissionProtocolEmailContent({ name, userClass }: MissionProtocolEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Ta première preuve de maîtrise t'attend, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Le réseau t'a identifié comme un <strong>${escHtml(userClass)}</strong>. Mais ton Dashboard ne montre pour l'instant que ton potentiel. Pour monter en grade, tu dois fournir des <strong>Preuves de Travail</strong>.</p>
      <p>Ici, on ne croit pas aux CV, on croit aux livrables fonctionnels.</p>
      <div class="card">
        <div class="card-label">Étape Suivante</div>
        <div class="card-value">PREMIÈRE MISSION</div>
      </div>
      <p>Choisis une mission <strong>INIT</strong> adaptée à ton vecteur. Soumets ton lien GitHub ou ton URL de projet. Vise le niveau 'Exemplaire' pour booster ton Score de Confiance.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Accéder à l'Arsenal →</a>
      </div>
      <hr class="divider">
      <p class="note">À toi de build. Montre au réseau ce que tu sais faire.</p>
    `;

  const html = generateEmailTemplate(content, "Passe du potentiel à l'action. Ta première mission t'attend.");
  return {
    subject: `[PROTOCOLE] Ta première mission HASHCODE — Prêt(e) ? 🎯`,
    html,
    text: stripHtml(content),
  };
}
