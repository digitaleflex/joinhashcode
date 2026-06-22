import { escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface OtpEmailParams {
  otp: string;
  type: string;
}

export function getOtpEmailContent({ otp, type: _type }: OtpEmailParams) {
  const content = `
      <h1>Ton code de vérification</h1>
      <p>Utilise ce code pour confirmer ton accès à HASHCODE. Il est valable pendant <strong>5 minutes</strong>.</p>
      <div class="card">
        <div class="card-value">${escHtml(otp)}</div>
        <div class="card-label">Code de vérification</div>
      </div>
      <p class="note">Ne partage jamais ce code. Si tu n'as pas demandé cette vérification, ignore cet email.</p>
    `;

  const html = generateEmailTemplate(content, `Ton code : ${otp} — valable 5 minutes.`);
  return {
    subject: `${escHtml(otp)} — Ton code de vérification HASHCODE`,
    html,
    text: stripHtml(content),
  };
}
