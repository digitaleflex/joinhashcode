import { escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface AdminAccountDeletedEmailParams {
  adminName: string;
  deletedName: string;
  deletedEmail: string;
  memberNumber?: number | null;
  level: number;
  missionsCount: number;
}

export function getAdminAccountDeletedEmailContent({ adminName, deletedName, deletedEmail, memberNumber, level, missionsCount }: AdminAccountDeletedEmailParams) {
  const firstName = (adminName || "Admin").split(" ")[0];
  const content = `
      <h1>Suppression de compte, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Un utilisateur vient de supprimer son compte HASHCODE.</p>
      <div class="card" style="text-align: left;">
        <div class="card-label" style="margin-bottom: 12px;">Informations du compte supprimé</div>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Nom :</strong> ${escHtml(deletedName)}</p>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Email :</strong> ${escHtml(deletedEmail)}</p>
        ${memberNumber ? `<p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Membre #:</strong> ${memberNumber}</p>` : ""}
        <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Niveau :</strong> ${level}</p>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0;"><strong style="color: #e4e4e7;">Missions complétées :</strong> ${missionsCount}</p>
      </div>
      <p class="note">Ce compte et toutes ses données associées ont été définitivement supprimés. Aucune action supplémentaire n'est requise.</p>
    `;
  const html = generateEmailTemplate(content, `${deletedName} vient de supprimer son compte HASHCODE.`);
  return {
    subject: `Compte supprimé — ${escHtml(deletedName)} (${escHtml(deletedEmail)})`,
    html,
    text: stripHtml(content),
  };
}
