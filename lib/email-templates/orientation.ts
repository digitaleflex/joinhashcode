import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface OrientationEmailParams {
  name: string;
  specialization: string;
  goal90days: string;
  outcomes: string[];
  atelierTitle: string;
  atelierDuration: string;
  atelierDescription: string;
}

export function getOrientationEmailContent({
  name,
  specialization,
  goal90days,
  outcomes,
  atelierTitle,
  atelierDuration,
  atelierDescription,
}: OrientationEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const outcomesList = outcomes.map(o => `<li>${escHtml(o)}</li>`).join("");

  const content = `
      <h1><span class="accent">${escHtml(firstName)}</span>, ton plan d'action pour les 90 prochains jours est prêt.</h1>

      <p>Tu as choisi une direction. Voici ce que ça signifie concrètement.</p>

      <div class="card">
        <div class="card-value">${escHtml(specialization)}</div>
        <div class="card-label">Ta spécialisation</div>
      </div>

      <p><strong>Objectif 90 jours :</strong> ${escHtml(goal90days)}</p>

      <p><strong>Dans 90 jours, tu seras capable de :</strong></p>
      <ul style="color: #a1a1aa; padding-left: 20px; line-height: 1.8;">
        ${outcomesList}
      </ul>

      <hr class="divider">

      <p><strong>Première étape :</strong></p>
      <div class="card" style="text-align: left;">
        <p style="font-size: 18px; font-weight: 700; color: #C5F441; margin: 0 0 4px;">🎓 ${escHtml(atelierTitle)}</p>
        <p style="font-size: 13px; color: #52525b; margin: 0;">${escHtml(atelierDuration)} · ${escHtml(atelierDescription)}</p>
      </div>

      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">Commencer l'atelier →</a>
      </div>

      <hr class="divider">
      <p class="note">Une étape à la fois. On est là pour t'accompagner.</p>
    `;

  const html = generateEmailTemplate(content, `${firstName}, ton plan d'action pour les 90 prochains jours.`);
  return {
    subject: `${escHtml(firstName)}, ton plan d'action pour les 90 prochains jours`,
    html,
    text: stripHtml(content),
  };
}
