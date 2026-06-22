import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface AdminCoreMissionPendingEmailParams {
  adminName: string;
  submitterName: string;
  missionTitle: string;
}

export function getAdminCoreMissionPendingEmailContent({ adminName, submitterName, missionTitle }: AdminCoreMissionPendingEmailParams) {
  const firstName = (adminName || "Admin").split(" ")[0];
  const content = `
      <h1>Confirmation requise, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>La mission CORE <strong>${escHtml(missionTitle)}</strong> soumise par <strong>${escHtml(submitterName)}</strong> vient d'être validée par un pair et attend ta confirmation finale.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/admin/submissions" class="btn">Voir la soumission →</a>
      </div>
      <hr class="divider">
      <p class="note">Les missions CORE nécessitent une validation admin après la revue par pair. L'utilisateur attend ta décision.</p>
    `;
  const html = generateEmailTemplate(content, `${submitterName} attend la confirmation admin pour "${missionTitle}".`);
  return {
    subject: `[CORE] Validation requise — ${escHtml(missionTitle)}`,
    html,
    text: stripHtml(content),
  };
}
