import { Resend } from "resend";
import { APP_URL } from "./config";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const escHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

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
      <h1 class="title">Transmission Initiale : <span class="highlight">Accès Autorisé</span></h1>
      <p>Bienvenue dans l'Écosystème, <span class="highlight">${name}</span>.</p>
      <p>Ton identifiant est désormais actif sur le réseau neuronal de HASHCODE. Tu ne rejoins pas qu'une plateforme, tu rejoins une force de frappe composée de bâtisseurs, de créateurs et de stratèges.</p>
      <p><strong>Prochaine étape :</strong> Complète ton profilage pour synchroniser tes objectifs avec les missions disponibles.</p>
      <center><a href="${APP_URL}/onboarding" class="btn">Initialiser mon profil</a></center>
      <p class="mono" style="font-size: 11px; text-align: center;">[ STATUS: READY_TO_BUILD ]</p>
    `;

    return this._send({
      to: email,
      subject: "Bienvenue sur HASHCODE : Ton accès est activé",
      html: generateEmailTemplate(content)
    });
  },

  async sendMagicLink({ email, url }: { email: string; url: string }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Protocole de Connexion</h1>
      <p>Une demande d'accès sécurisé a été détectée pour ton compte.</p>
      <p>Clique sur le bouton ci-dessous pour forcer la connexion à ton espace de build.</p>
      <center><a href="${url}" class="btn">Entrer dans le Dashboard</a></center>
      <p style="font-size: 13px; color: #71717a;">Ce lien est à usage unique et expirera dans 10 minutes. Si tu n'es pas à l'origine de cette transmission, ignore cet email.</p>
    `;

    return this._send({
      to: email,
      subject: "Ton accès sécurisé HASHCODE",
      html: generateEmailTemplate(content)
    });
  },

  async sendOtpEmail({ email, otp, type }: { email: string; otp: string; type: string }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Protocole d'Authentification</h1>
      <p>Une demande d'accès sécurisé a été détectée pour ton compte.</p>
      <p>Voici ton code de sécurité à usage unique :</p>
      <div style="background: #111; padding: 20px; border: 1px solid #C5F441; border-radius: 12px; text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: 900; color: #C5F441; letter-spacing: 0.2em; font-family: 'Courier New', Courier, monospace;">${otp}</span>
      </div>
      <p style="font-size: 13px; color: #71717a;">Ce code expirera dans 5 minutes. Si tu n'es pas à l'origine de cette transmission, ignore cet email.</p>
    `;

    return this._send({
      to: email,
      subject: "Ton code d'accès HASHCODE",
      html: generateEmailTemplate(content)
    });
  },

  async sendQuizResults({ email, name, profileType }: { email: string; name: string; profileType: string }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Analyse Terminée : <span class="highlight">Hypothèse Confirmée</span></h1>
      <p>Félicitations <span class="highlight">${name}</span>, ton profilage comportemental est désormais gravé dans la base de données.</p>
      <p>Tes vecteurs cognitifs indiquent une dominance critique : <strong class="highlight">${profileType.toUpperCase()}</strong>.</p>
      <p>L'écosystème vient de débloquer une série de missions spécifiquement calibrées pour ton mode d'action.</p>
      <center><a href="${APP_URL}/dashboard" class="btn">Prendre les commandes</a></center>
    `;

    return this._send({
      to: email,
      subject: `Analyse HASHCODE : Tu es un ${profileType.toUpperCase()}`,
      html: generateEmailTemplate(content)
    });
  },

  async sendMissionApproval({ email, name, missionTitle, xp }: { email: string; name: string; missionTitle: string; xp: number }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Mission Validée : <span class="highlight">Impact Détecté</span></h1>
      <p>Excellent travail, <span class="highlight">${name}</span>.</p>
      <p>Tes actes parlent pour toi. La mission <strong class="highlight">${missionTitle}</strong> a été approuvée par le protocole de vérification.</p>
      <div style="background: #111; padding: 20px; border: 1px solid #C5F441; border-radius: 12px; text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: 900; color: #C5F441; letter-spacing: 0.1em;">+${xp} XP</span>
        <p style="font-size: 10px; font-mono; color: #71717a; margin-top: 5px; text-transform: uppercase;">Injectés dans ton profil d'évolution</p>
      </div>
      <center><a href="${APP_URL}/missions" class="btn">Lancer la suite</a></center>
    `;

    return this._send({
      to: email,
      subject: `Transmission Reçue : +${xp} XP pour ${missionTitle}`,
      html: generateEmailTemplate(content)
    });
  },

  async sendDailyReminder({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Alerte : <span style="color: #ff4545;">Build Interrompu</span></h1>
      <p>Bâtisseur <span class="highlight">${name}</span>, le réseau détecte une baisse d'activité sur ton terminal.</p>
      <p>Chaque jour sans action est une opportunité qui s'évapore. Ton "Confidence Score" risque de stagner si tu n'ancres pas tes progrès aujourd'hui.</p>
      <p><strong>30 secondes suffisent :</strong> Signe ton check-in quotidien pour maintenir ta Vibrance et garder le rythme.</p>
      <center><a href="${APP_URL}/dashboard" class="btn" style="background-color: #ff4545; color: #fff;">Reprendre le Build</a></center>
      <p class="mono" style="font-size: 11px; text-align: center; color: #ff4545;">[ WARNING: SYSTEM_IDLE_DETECTED ]</p>
    `;

    return this._send({
      to: email,
      subject: "Alerte Build : Ton check-in quotidien t'attend",
      html: generateEmailTemplate(content)
    });
  },

  async sendContactNotification({ type, email, subject, content: messageContent }: { type: string; email: string; subject: string; content: string }) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@joinhashcode.com";
    if (!resend) return { success: true, mocked: true };

    const content = `
      <h1 class="title">Nouvelle Transmission</h1>
      <p><strong>Type :</strong> ${escHtml(type.toUpperCase())}</p>
      <p><strong>De :</strong> ${escHtml(email)}</p>
      <p><strong>Sujet :</strong> ${escHtml(subject)}</p>
      <div style="background: #111; padding: 20px; border: 1px solid #1a1a1a; border-radius: 8px; margin-top: 20px; color: #fff;">
        <p style="white-space: pre-wrap; font-size: 14px;">${escHtml(messageContent)}</p>
      </div>
    `;

    return this._send({
      to: adminEmail,
      subject: `[${escHtml(type.toUpperCase())}] ${escHtml(subject)}`,
      html: generateEmailTemplate(content)
    });
  },

  async sendFeedbackReceipt({ email, name, type }: { email: string; name: string; type: string }) {
    if (!resend) return { success: true, mocked: true };

    const typeLabels: Record<string, string> = {
      BUG: "Signalement de Bug",
      FEATURE_REQUEST: "Suggestion d'Idée",
      GENERAL: "Retour Général",
    };

    const content = `
      <h1 class="title">Transmission <span class="highlight">Reçue</span></h1>
      <p>Bâtisseur <span class="highlight">${name}</span>, ton feedback a bien été réceptionné par le centre de contrôle.</p>
      <p><strong>Type :</strong> ${typeLabels[type] || type}</p>
      <p>Nos équipes d'analyse vont examiner tes données pour optimiser l'écosystème. Tu recevras une notification dès que ton rapport aura été traité.</p>
      <p class="mono" style="font-size: 11px; text-align: center;">[ STATUS: UNDER_REVIEW ]</p>
    `;

    return this._send({
      to: email,
      subject: "Confirmation de réception : Ton feedback HASHCODE",
      html: generateEmailTemplate(content)
    });
  },

  async sendFeedbackUpdate({ email, name, status }: { email: string; name: string; status: string }) {
    if (!resend) return { success: true, mocked: true };

    const statusInfo: Record<string, { title: string; desc: string; highlight: string }> = {
      REVIEWED: {
        title: "Analyse en cours",
        desc: "Ton feedback est actuellement entre les mains de nos ingénieurs. Nous étudions la meilleure façon d'intégrer tes remarques.",
        highlight: "#C5F441"
      },
      RESOLVED: {
        title: "Mission terminée",
        desc: "Excellente nouvelle ! Les mesures nécessaires ont été prises suite à ton retour. Ton impact sur l'écosystème est désormais concret.",
        highlight: "#C5F441"
      }
    };

    const info = statusInfo[status] || statusInfo.REVIEWED;

    const content = `
      <h1 class="title" style="color: ${info.highlight};">${info.title}</h1>
      <p>Bâtisseur <span class="highlight">${name}</span>, le statut de ta transmission a évolué.</p>
      <p>${info.desc}</p>
      <center><a href="${APP_URL}/dashboard" class="btn">Retourner au Terminal</a></center>
      <p class="mono" style="font-size: 11px; text-align: center;">[ STATUS: ${status} ]</p>
    `;

    return this._send({
      to: email,
      subject: `Mise à jour : Ton feedback HASHCODE est ${status}`,
      html: generateEmailTemplate(content)
    });
  },

  async _send({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!resend) return { success: false, error: "Resend not configured" };
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "HASHCODE <noreply@joinhashcode.com>",
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
