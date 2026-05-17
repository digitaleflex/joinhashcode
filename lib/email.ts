import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://joinhashcode.com";
const LOGO_URL = `${APP_URL}/hashcode-logo.png`;

const generateEmailTemplate = (content: string, previewText?: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HASHCODE</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #000; color: #fff; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; }
    .header { padding: 40px 20px; text-align: center; border-bottom: 1px solid #1a1a1a; }
    .content { padding: 40px 30px; line-height: 1.6; color: #d4d4d8; }
    .footer { padding: 30px; text-align: center; border-top: 1px solid #1a1a1a; color: #52525b; font-size: 12px; }
    .btn { display: inline-block; background-color: #C5F441; color: #000; padding: 14px 28px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; margin: 25px 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .logo { height: 40px; margin-bottom: 10px; }
    .title { color: #fff; font-size: 24px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
    .highlight { color: #C5F441; font-weight: 700; }
    .mono { font-family: 'Courier New', Courier, monospace; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="HASHCODE" class="logo">
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} HASHCODE COMMUNITY. TOUS DROITS RÉSERVÉS.</p>
      <p class="mono">[ CONNECTED // BUILD_THE_FUTURE ]</p>
      <p style="margin-top: 15px;">
        <a href="${APP_URL}/settings" style="color: #52525b; text-decoration: underline;">Préférences de notification</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

export const emailService = {
  async sendWelcomeEmail({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Bienvenue dans l'Écosystème, <span class="highlight">${name}</span>.</h1>
      <p>Ton accès à HASHCODE est maintenant activé. Tu rejoins une communauté de bâtisseurs, de créateurs et de stratèges déterminés à repousser les limites du possible.</p>
      <p>Commence par compléter ton profilage pour débloquer tes premières missions personnalisées.</p>
      <center><a href="${APP_URL}/onboarding" class="btn">Commencer l'aventure</a></center>
      <p>Prépare-toi. Le build ne s'arrête jamais.</p>
    `;

    return this._send({
      to: email,
      subject: "Bienvenue sur HASHCODE",
      html: generateEmailTemplate(content)
    });
  },

  async sendMagicLink({ email, url }: { email: string; url: string }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Protocole de Connexion</h1>
      <p>Une demande de connexion a été initiée pour ton compte HASHCODE.</p>
      <p>Clique sur le bouton ci-dessous pour accéder à ton espace de build.</p>
      <center><a href="${url}" class="btn">Accéder au Dashboard</a></center>
      <p style="font-size: 13px; color: #71717a;">Ce lien est à usage unique et expirera bientôt. Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
    `;

    return this._send({
      to: email,
      subject: "Ton accès HASHCODE",
      html: generateEmailTemplate(content)
    });
  },

  async sendQuizResults({ email, name, profileType }: { email: string; name: string; profileType: string }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Analyse Terminée</h1>
      <p>Félicitations <span class="highlight">${name}</span>, ton profilage comportemental est terminé.</p>
      <p>Tes vecteurs cognitifs indiquent une dominance : <strong class="highlight">${profileType.toUpperCase()}</strong>.</p>
      <p>Tes premières missions de guilde ont été débloquées sur ton dashboard.</p>
      <center><a href="${APP_URL}/dashboard" class="btn">Voir mes missions</a></center>
    `;

    return this._send({
      to: email,
      subject: "Résultats de ton analyse HASHCODE",
      html: generateEmailTemplate(content)
    });
  },

  async sendMissionApproval({ email, name, missionTitle, xp }: { email: string; name: string; missionTitle: string; xp: number }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Mission Validée</h1>
      <p>Excellent travail <span class="highlight">${name}</span>.</p>
      <p>Ta mission <strong class="highlight">${missionTitle}</strong> a été approuvée par le protocole de vérification.</p>
      <p style="font-size: 20px; font-weight: 800;">+${xp} XP AJOUTÉS À TON PROFIL</p>
      <center><a href="${APP_URL}/missions" class="btn">Prochaine mission</a></center>
    `;

    return this._send({
      to: email,
      subject: `Mission validée : ${missionTitle}`,
      html: generateEmailTemplate(content)
    });
  },

  async sendContactNotification({ type, email, subject, content: messageContent }: { type: string; email: string; subject: string; content: string }) {
    const adminEmail = "admin@joinhashcode.com";
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Nouvelle Transmission</h1>
      <p><strong>Type :</strong> ${type.toUpperCase()}</p>
      <p><strong>De :</strong> ${email}</p>
      <p><strong>Sujet :</strong> ${subject}</p>
      <div style="background: #111; padding: 20px; border: 1px solid #1a1a1a; border-radius: 8px; margin-top: 20px; color: #fff;">
        <p style="white-space: pre-wrap; font-size: 14px;">${messageContent}</p>
      </div>
    `;

    return this._send({
      to: adminEmail,
      subject: `[${type.toUpperCase()}] ${subject}`,
      html: generateEmailTemplate(content)
    });
  },

  async _send({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!resend) return { success: false, error: "Resend not configured" };
    try {
      const { data, error } = await resend.emails.send({
        from: "HASHCODE <noreply@joinhashcode.com>",
        to,
        subject,
        html,
      });
      if (error) return { success: false, error };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err };
    }
  },

  async getStatus() {
    return {
      connected: !!resend,
      provider: resend ? "Resend" : "Mock (Missing API Key)",
    };
  }
};
