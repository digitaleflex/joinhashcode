import { generateEmailTemplate, stripHtml } from "./base";

export interface MagicLinkEmailParams {
  url: string;
}

export function getMagicLinkEmailContent({ url }: MagicLinkEmailParams) {
  const content = `
      <h1>Ton lien de connexion</h1>
      <p>Quelqu'un a demandé un accès sécurisé à ton compte HASHCODE avec cette adresse email. Si c'est toi, clique sur le bouton ci-dessous.</p>
      <div class="btn-wrap">
        <a href="${url}" class="btn">Se connecter à HASHCODE →</a>
      </div>
      <hr class="divider">
      <p class="note">Ce lien est à usage unique et expire dans <strong>10 minutes</strong>. Si tu n'es pas à l'origine de cette demande, ignore simplement cet email — ton compte reste sécurisé.</p>
    `;

  const html = generateEmailTemplate(content, "Clique pour te connecter — lien valable 10 minutes.");
  return {
    subject: "Ton lien de connexion HASHCODE (expire dans 10 min)",
    html,
    text: stripHtml(content),
  };
}
