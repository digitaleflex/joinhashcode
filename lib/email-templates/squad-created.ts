import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface SquadCreatedEmailParams {
  name: string;
  squadName: string;
}

export function getSquadCreatedEmailContent({ name, squadName }: SquadCreatedEmailParams) {
  const firstName = (name || "Leader").split(" ")[0];
  const content = `
      <h1>L'aventure commence en équipe, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Félicitations pour la création de <strong>${escHtml(squadName)}</strong>. Tu viens de poser la première pierre d'une unité d'élite.</p>
      <div class="card">
        <div class="card-value">SQUAD ACTIVÉE</div>
        <div class="card-label">${escHtml(squadName)}</div>
      </div>
      <p><strong>Ton rôle de leader commence maintenant.</strong> Recrute des membres dont les talents complètent le tien (Bâtisseurs, Créateurs, Stratèges, Catalyseurs) pour maximiser votre score de cohésion.</p>
      <p>Une squad complète progresse 3x plus vite qu'un bâtisseur seul.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/squad" class="btn">Gérer ma Squad →</a>
      </div>
      <hr class="divider">
      <p class="note">N'oublie pas : la force de la meute, c'est le loup, et la force du loup, c'est la meute.</p>
    `;

  const html = generateEmailTemplate(content, `Ta squad "${squadName}" est prête. Recrute tes alliés et domine le classement.`);
  return {
    subject: `🤝 Esprit de Corps : Ta Squad "${escHtml(squadName)}" est née !`,
    html,
    text: stripHtml(content),
  };
}
