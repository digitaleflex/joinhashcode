import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface DailyReminderEmailParams {
  name: string;
}

export function getDailyReminderEmailContent({ name }: DailyReminderEmailParams) {
  const firstName = (name || "Builder").split(" ")[0];
  const content = `
      <h1>Ça fait un moment, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>On ne veut pas te brusquer — mais ton tableau de bord te réclame. Ton score de cohésion et ta progression t'attendent.</p>
      <p>Un check-in quotidien suffit à maintenir ton élan. <strong>Moins de 30 secondes.</strong> Et chaque jour compté renforce ta position dans ta guilde.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">Reprendre là où j'en étais →</a>
      </div>
      <hr class="divider">
      <p class="note">Tu ne veux plus recevoir ces rappels ? <a href="${APP_URL}/settings">Gère tes préférences ici.</a></p>
    `;

  const html = generateEmailTemplate(content, "Un check-in rapide suffit pour maintenir ton élan. 30 secondes.");
  return {
    subject: `${escHtml(firstName)}, ton check-in quotidien t'attend`,
    html,
    text: stripHtml(content),
  };
}
