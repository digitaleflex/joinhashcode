import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface SquadMemberJoinedEmailParams {
  leaderName: string;
  newMemberName: string;
  squadName: string;
  memberCount: number;
}

export function getSquadMemberJoinedEmailContent({ leaderName, newMemberName, squadName, memberCount }: SquadMemberJoinedEmailParams) {
  const firstName = (leaderName || "Leader").split(" ")[0];
  const content = `
      <h1><span class="accent">${escHtml(newMemberName)}</span> a rejoint ta squad.</h1>
      <p>Bonne nouvelle, <strong>${escHtml(firstName)}</strong> — un nouveau membre vient de rejoindre <strong>${escHtml(squadName)}</strong>.</p>
      <div class="card">
        <div class="card-value">${memberCount} / 5</div>
        <div class="card-label">Membres dans ta squad</div>
      </div>
      <p>Accueille-le/la et synchronisez vos objectifs. Plus votre squad est soudée, plus votre score de cohésion grimpe — et plus les récompenses sont importantes.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/squad" class="btn">Voir ma squad →</a>
      </div>
    `;

  const html = generateEmailTemplate(content, `${newMemberName} a rejoint ${squadName}. Ta squad compte maintenant ${memberCount} membres.`);
  return {
    subject: `${escHtml(newMemberName)} vient de rejoindre ${escHtml(squadName)}`,
    html,
    text: stripHtml(content),
  };
}
