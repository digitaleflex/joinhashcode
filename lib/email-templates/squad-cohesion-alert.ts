import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface SquadCohesionAlertEmailParams {
  leaderName: string;
  squadName: string;
  cohesionScore: number;
  level: "low" | "critical";
}

export function getSquadCohesionAlertEmailContent({ leaderName, squadName, cohesionScore, level }: SquadCohesionAlertEmailParams) {
  const firstName = (leaderName || "Leader").split(" ")[0];
  const isCritical = level === "critical";
  const scorePercent = Math.round(cohesionScore * 100);

  const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ${isCritical ? "ta squad est en danger." : "la cohésion de ta squad baisse."}</h1>
      <p>Le score de cohésion de <strong>${escHtml(squadName)}</strong> est passé à <strong>${scorePercent}%</strong>${isCritical ? " — niveau critique" : ""}.</p>
      <div class="card">
        <div class="card-value" style="color: ${isCritical ? "#ef4444" : "#f97316"};">${scorePercent}%</div>
        <div class="card-label">Score de cohésion actuel</div>
      </div>
      <p>${isCritical
        ? "Sans action rapide, la dynamique de ta squad va continuer à se dégrader. Encourage tes membres à faire un check-in dès aujourd'hui."
        : "Un check-in quotidien de chaque membre suffit à inverser la tendance. Partage le lien de ta squad pour relancer la dynamique."
      }</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/squad" class="btn">Voir ma squad →</a>
      </div>
    `;
  const preview = isCritical
    ? `Cohésion critique à ${scorePercent}% — action immédiate requise.`
    : `La cohésion de ${squadName} est à ${scorePercent}%. Relance ta squad.`;
  const html = generateEmailTemplate(content, preview);
  return {
    subject: isCritical
      ? `🔴 Alerte critique — ${escHtml(squadName)} à ${scorePercent}% de cohésion`
      : `Cohésion en baisse — ${escHtml(squadName)} à ${scorePercent}%`,
    html,
    text: stripHtml(content),
  };
}
