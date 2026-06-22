import { escHtml, generateEmailTemplate, stripHtml } from "./base";

export interface ContactNotificationEmailParams {
  type: string;
  email: string;
  subject: string;
  content: string;
}

export function getContactNotificationEmailContent({ type, email, subject, content: messageContent }: ContactNotificationEmailParams) {
  const content = `
      <h1>Nouveau message reçu</h1>
      <p><strong>Type :</strong> ${escHtml(type.toUpperCase())}</p>
      <p><strong>De :</strong> ${escHtml(email)}</p>
      <p><strong>Sujet :</strong> ${escHtml(subject)}</p>
      <hr class="divider">
      <div class="card" style="text-align: left;">
        <p style="white-space: pre-wrap; font-size: 14px; color: #a1a1aa; margin: 0;">${escHtml(messageContent)}</p>
      </div>
    `;

  const html = generateEmailTemplate(content);
  return {
    subject: `[${escHtml(type.toUpperCase())}] ${escHtml(subject)}`,
    html,
    text: stripHtml(content),
  };
}
