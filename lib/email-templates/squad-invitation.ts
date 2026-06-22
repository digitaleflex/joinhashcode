import { escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface SquadInvitationEmailParams {
  name: string;
  leaderName: string;
  squadName: string;
  invitationLink: string;
}

export function getSquadInvitationEmailContent({ name, leaderName, squadName, invitationLink }: SquadInvitationEmailParams) {
  const firstName = (name || "Talent").split(" ")[0];
  const content = `
      <h1>Ta place dans l'escouade t'attend, <span class="accent">${escHtml(firstName)}</span> !</h1>
      <p><strong>${escHtml(leaderName)}</strong> t'invite à rejoindre son escouade <strong>${escHtml(squadName)}</strong> sur HASHCODE.</p>
      <div class="card">
        <div class="card-value">INVITATION RECUE</div>
        <div class="card-label">${escHtml(squadName)}</div>
      </div>
      <p>Rejoindre une escouade te permet de collaborer sur des projets réels, de participer aux missions collectives et de bénéficier d'un multiplicateur d'XP de groupe basé sur la Cohésion.</p>
      <div class="btn-wrap">
        <a href="${invitationLink}" class="btn">Répondre à l'invitation →</a>
      </div>
      <hr class="divider">
      <p class="note">Si tu fais déjà partie d'une escouade, tu devras la quitter pour pouvoir accepter celle-ci.</p>
    `;

  const html = generateEmailTemplate(content, `Tu as reçu une invitation pour rejoindre l'escouade ${squadName}`);
  return {
    subject: `🤝 Recrutement : Rejoins l'escouade "${escHtml(squadName)}" !`,
    html,
    text: stripHtml(content),
  };
}
