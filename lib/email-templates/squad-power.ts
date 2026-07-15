import { APP_URL, escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface SquadPowerEmailParams {
  name: string;
}

export function getSquadPowerEmailContent({ name }: SquadPowerEmailParams) {
  const firstName = (name || "").split(" ")[0];
  const content = `
      <h1>Tu avances bien. Une équipe peut t'aider à aller plus loin, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Sur HASHCODE, tu peux rejoindre ou créer une <strong>Squad</strong> : une équipe de 5 personnes maximum qui progressent ensemble.</p>
      <p>Les membres d'une même squad échangent, travaillent sur des projets communs et valident mutuellement leurs compétences. C'est plus motivant et plus efficace.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/squad" class="btn">Découvrir les Squads →</a>
      </div>
      <hr class="divider">
      <p class="note">Pas d'obligation — tu peux continuer seul aussi longtemps que tu veux.</p>
    `;

  const html = generateEmailTemplate(content, "Progresse plus vite avec une Squad.");
  return {
    subject: `${escHtml(firstName)}, qui pourrait t'aider à progresser ?`,
    html,
    text: stripHtml(content),
  };
}
