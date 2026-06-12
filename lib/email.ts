import { Resend } from "resend";
import { APP_URL } from "./config";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const escHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

const LOGO_URL = `${APP_URL}/hashcode-logo.png`;

const PROFILE_DATA: Record<string, { headline: string; description: string; cta: string }> = {
  BUILDER: {
    headline: "Tu es un Bâtisseur.",
    description: "Tu transformes les idées en réalité. Méthodique, technique, orienté résultats — tu construis des choses qui durent. Les missions qui t'attendent sont conçues pour des esprits comme le tien : concrets, exigeants, ambitieux.",
    cta: "Voir mes missions Builder",
  },
  CREATOR: {
    headline: "Tu es un Créateur.",
    description: "Tu vois ce que les autres n'imaginent pas encore. Ta force : trouver des angles nouveaux, concevoir des expériences qui marquent. L'écosystème t'a réservé des missions qui valorisent ton originalité et ton sens de l'esthétique.",
    cta: "Voir mes missions Creator",
  },
  STRATEGIST: {
    headline: "Tu es un Stratège.",
    description: "Tu penses en systèmes. Là où d'autres voient un problème, tu vois un jeu d'échecs à trois coups d'avance. Les missions qui t'attendent exploitent ta capacité à structurer, planifier et optimiser.",
    cta: "Voir mes missions Strategist",
  },
  CATALYST: {
    headline: "Tu es un Catalyseur.",
    description: "Tu mets les équipes en mouvement. Ton énergie est contagieuse, ta capacité à fédérer est rare. L'écosystème t'attend pour ce qu'il y a de plus difficile : créer de la cohésion et transformer un groupe en force collective.",
    cta: "Voir mes missions Catalyst",
  },
};

const stripHtml = (html: string) =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

const generateEmailTemplate = (content: string, previewText?: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HASHCODE</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #080808; color: #e4e4e7; -webkit-text-size-adjust: 100%; }
    .wrapper { padding: 40px 16px; background-color: #080808; }
    .container { max-width: 580px; margin: 0 auto; background-color: #0f0f0f; border: 1px solid #1f1f1f; border-radius: 12px; overflow: hidden; }
    .accent-bar { height: 3px; background: linear-gradient(90deg, #C5F441 0%, #8fd62a 100%); }
    .header { padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid #1a1a1a; }
    .logo { height: 56px; }
    .tagline { font-size: 11px; color: #52525b; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 10px; }
    .content { padding: 40px 40px 32px; line-height: 1.7; color: #a1a1aa; font-size: 15px; }
    .content h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 20px; line-height: 1.3; }
    .content p { margin: 0 0 16px; }
    .content p:last-of-type { margin-bottom: 0; }
    .content strong { color: #e4e4e7; font-weight: 600; }
    .accent { color: #C5F441; font-weight: 600; }
    .btn-wrap { text-align: center; margin: 32px 0 24px; }
    .btn { display: inline-block; background-color: #C5F441; color: #080808; padding: 14px 32px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; letter-spacing: 0.04em; text-transform: uppercase; }
    .btn-secondary { display: inline-block; background-color: transparent; color: #C5F441; padding: 12px 28px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; border: 1px solid #C5F441; letter-spacing: 0.04em; }
    .card { background: #161616; border: 1px solid #262626; border-radius: 10px; padding: 24px; margin: 24px 0; text-align: center; }
    .card-value { font-size: 36px; font-weight: 800; color: #C5F441; letter-spacing: 0.05em; font-family: 'Courier New', Courier, monospace; }
    .card-label { font-size: 11px; color: #52525b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px; }
    .divider { border: none; border-top: 1px solid #1a1a1a; margin: 24px 0; }
    .note { font-size: 13px; color: #52525b; }
    .footer { padding: 24px 40px; text-align: center; border-top: 1px solid #1a1a1a; }
    .footer p { font-size: 12px; color: #3f3f46; margin: 4px 0; }
    .footer a { color: #52525b; text-decoration: underline; }
    @media (max-width: 600px) {
      .wrapper { padding: 0; }
      .container { border-radius: 0; border-left: none; border-right: none; }
      .header { padding: 24px 24px 20px; }
      .content { padding: 28px 24px 24px; }
      .footer { padding: 20px 24px; }
    }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#080808;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escHtml(previewText)}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>` : ""}
  <div class="wrapper">
    <div class="container">
      <div class="accent-bar"></div>
      <div class="header">
        <img src="${LOGO_URL}" alt="HASHCODE" class="logo">
        <div class="tagline">Bâtir l'Afrique Tech — Ensemble</div>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} HASHCODE COMMUNITY. Tous droits réservés.</p>
        <p style="margin-top: 8px;"><a href="${APP_URL}/settings">Gérer mes notifications</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const emailService = {
  async sendWelcomeEmail({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1>Bienvenue, <span class="accent">${escHtml(firstName)}</span>. Tu es au bon endroit.</h1>
      <p>HASHCODE n'est pas une plateforme de plus. C'est un réseau de bâtisseurs africains qui choisissent d'agir — pas seulement d'apprendre.</p>
      <p>En rejoignant la communauté, tu accèdes à un système conçu pour te faire progresser : un profil psychométrique qui te connaît, des missions réelles qui testent tes capacités, et une guilde de pairs qui avancent avec toi.</p>
      <p><strong>Pour commencer, complète ton profil.</strong> Cela prend moins de 5 minutes et débloque l'intégralité de l'écosystème.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/onboarding" class="btn">Compléter mon profil →</a>
      </div>
      <hr class="divider">
      <p class="note">Des questions ? Réponds directement à cet email — on est là.</p>
    `;

    const html = generateEmailTemplate(content, "Ton aventure commence maintenant. Complète ton profil pour débloquer l'écosystème.");
    return this._send({ to: email, subject: `Bienvenue dans HASHCODE, ${escHtml(firstName)} 👋`, html, text: stripHtml(content) });
  },

  async sendBetaKeyVerifiedEmail({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1>Accès validé, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ta clé d'habilitation a été acceptée. Tu fais maintenant partie des rares agents à avoir accès à la phase de build Alpha de HASHCODE.</p>
      <div class="card">
        <div class="card-value">ACCÈS ALPHA</div>
        <div class="card-label">Statut de ton compte</div>
      </div>
      <p><strong>La prochaine étape ?</strong> Ton onboarding. C'est ici que tu définis qui tu es dans l'écosystème et quels sont tes objectifs prioritaires.</p>
      <p>Une fois l'onboarding terminé, tu passeras ton <strong>test de profilage</strong> pour découvrir ta classe de bâtisseur.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/onboarding" class="btn">Lancer mon Onboarding →</a>
      </div>
      <hr class="divider">
      <p class="note">Besoin d'un guide ? L'interface t'accompagnera pas à pas.</p>
    `;

    const html = generateEmailTemplate(content, "Ta clé a été validée. Prochaine étape : ton onboarding.");
    return this._send({ to: email, subject: "Accès HASHCODE activé — Prochaine étape 🚀", html, text: stripHtml(content) });
  },

  async sendOnboardingCompletedEmail({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1>Profil initial complété, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Excellent travail. Tes objectifs et ton contexte sont désormais synchronisés avec la plateforme.</p>
      <p><strong>Mais ce n'est que le début.</strong> Pour que le système puisse t'assigner les bonnes missions, nous devons identifier ton "archétype de bâtisseur".</p>
      <div class="card">
        <div class="card-label">Étape Suivante</div>
        <div class="card-value">LE QUIZ</div>
      </div>
      <p>Le test de profilage HASHCODE n'est pas un questionnaire classique. Il analyse ta manière de réagir face aux défis réels.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/quiz" class="btn">Passer mon test de profilage →</a>
      </div>
      <hr class="divider">
      <p class="note">Prépare-toi, c'est l'étape qui définit ton parcours.</p>
    `;

    const html = generateEmailTemplate(content, "Onboarding terminé. Passe ton test de profilage pour découvrir ta classe.");
    return this._send({ to: email, subject: "Onboarding validé — Découvre ta classe de bâtisseur 🎯", html, text: stripHtml(content) });
  },

  async sendMagicLink({ email, url }: { email: string; url: string }) {
    if (!resend) return { success: true, mocked: true };

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
    return this._send({ to: email, subject: "Ton lien de connexion HASHCODE (expire dans 10 min)", html, text: stripHtml(content) });
  },

  async sendOtpEmail({ email, otp, type }: { email: string; otp: string; type: string }) {
    if (!resend) return { success: true, mocked: true };

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
    return this._send({ to: email, subject: `${escHtml(otp)} — Ton code de vérification HASHCODE`, html, text: stripHtml(content) });
  },

  async sendQuizResults({ email, name, profileType }: { email: string; name: string; profileType: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const profile = PROFILE_DATA[profileType.toUpperCase()] ?? PROFILE_DATA.BUILDER;

    const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ${escHtml(profile.headline)}</h1>
      <p>${escHtml(profile.description)}</p>
      <div class="card">
        <div class="card-value">${escHtml(profileType.toUpperCase())}</div>
        <div class="card-label">Ton profil HASHCODE</div>
      </div>
      <p>Ton espace de travail est prêt. Missions, guilde, tableau de bord — tout est calibré pour ton mode d'action.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">${escHtml(profile.cta)} →</a>
      </div>
      <hr class="divider">
      <p class="note">Tu peux consulter le détail de ton profil à tout moment depuis ton tableau de bord.</p>
    `;

    const html = generateEmailTemplate(content, `${profile.headline} Découvre tes missions.`);
    return this._send({ to: email, subject: `${escHtml(firstName)}, tu es un·e ${escHtml(profileType.toUpperCase())} — voici ce que ça signifie`, html, text: stripHtml(content) });
  },

  async sendMissionApproval({ email, name, missionTitle, xp }: { email: string; name: string; missionTitle: string; xp: number }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1>Mission validée, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ta soumission pour <strong>${escHtml(missionTitle)}</strong> a été examinée et approuvée. Le travail que tu as fourni fait la différence.</p>
      <div class="card">
        <div class="card-value">+${xp} XP</div>
        <div class="card-label">Ajoutés à ton profil</div>
      </div>
      <p>Continue sur cette lancée. Chaque mission validée renforce ta réputation dans la communauté et te rapproche du niveau suivant.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir les prochaines missions →</a>
      </div>
    `;

    const html = generateEmailTemplate(content, `+${xp} XP crédités pour "${missionTitle}". Continue sur ta lancée.`);
    return this._send({ to: email, subject: `✓ Mission validée — +${xp} XP pour "${escHtml(missionTitle)}"`, html, text: stripHtml(content) });
  },

  async sendDailyReminder({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };

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
    return this._send({ to: email, subject: `${escHtml(firstName)}, ton check-in quotidien t'attend`, html, text: stripHtml(content) });
  },

  async sendContactNotification({ type, email, subject, content: messageContent }: { type: string; email: string; subject: string; content: string }) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@joinhashcode.com";
    if (!resend) return { success: true, mocked: true };

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
    return this._send({ to: adminEmail, subject: `[${escHtml(type.toUpperCase())}] ${escHtml(subject)}`, html, text: stripHtml(content) });
  },

  async sendFeedbackReceipt({ email, name, type }: { email: string; name: string; type: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const typeLabels: Record<string, string> = {
      BUG: "un signalement de bug",
      FEATURE_REQUEST: "une suggestion de fonctionnalité",
      GENERAL: "un retour général",
    };

    const content = `
      <h1>Merci, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>On a bien reçu ${typeLabels[type] ?? "ton retour"}. Ce genre de contribution compte vraiment — c'est comme ça qu'on construit quelque chose de solide ensemble.</p>
      <p>Notre équipe va l'examiner et tu recevras une mise à jour dès qu'une décision sera prise.</p>
      <hr class="divider">
      <p class="note">Tu peux continuer à utiliser HASHCODE normalement. On s'occupe du reste.</p>
    `;

    const html = generateEmailTemplate(content, "Ton retour a bien été reçu. On s'en occupe.");
    return this._send({ to: email, subject: "Feedback reçu — merci pour ta contribution", html, text: stripHtml(content) });
  },

  async sendFeedbackUpdate({ email, name, status }: { email: string; name: string; status: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const statusInfo: Record<string, { headline: string; body: string; cta: boolean }> = {
      REVIEWED: {
        headline: "Ton feedback est en cours d'analyse.",
        body: "Notre équipe l'a pris en main et travaille dessus. On te recontacte dès qu'une décision est prise.",
        cta: false,
      },
      RESOLVED: {
        headline: "Ton feedback a été traité.",
        body: "Les mesures nécessaires ont été prises suite à ton retour. Ton impact sur la plateforme est concret et visible. Merci d'avoir pris le temps de contribuer.",
        cta: true,
      },
    };

    const info = statusInfo[status] ?? statusInfo.REVIEWED;

    const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ${escHtml(info.headline)}</h1>
      <p>${escHtml(info.body)}</p>
      ${info.cta ? `<div class="btn-wrap"><a href="${APP_URL}/dashboard" class="btn">Retourner au tableau de bord →</a></div>` : ""}
      <hr class="divider">
      <p class="note">Des questions sur ce retour ? Réponds directement à cet email.</p>
    `;

    const preview = status === "RESOLVED" ? "Les mesures nécessaires ont été prises. Merci pour ta contribution." : "Notre équipe l'a pris en main.";
    const html = generateEmailTemplate(content, preview);
    return this._send({
      to: email,
      subject: status === "RESOLVED" ? "Ton feedback a été résolu — merci ✓" : "Mise à jour : ton feedback HASHCODE est en cours d'analyse",
      html,
      text: stripHtml(content),
    });
  },

  async sendMissionSubmitted({ email, name, missionTitle, bonusXp }: { email: string; name: string; missionTitle: string; bonusXp: number }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1>Soumission reçue, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Ta soumission pour <strong>${escHtml(missionTitle)}</strong> a bien été enregistrée. Tu seras notifié(e) par email dès qu'un pair l'aura examinée.</p>
      <div class="card">
        <div class="card-value">+${bonusXp} XP</div>
        <div class="card-label">Bonus de synchronisation — déjà crédité</div>
      </div>
      <p><strong>Et maintenant ?</strong> Un membre de la communauté va prendre en charge ta soumission pour la passer en revue. Le processus prend généralement 24 à 48 heures.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Voir mes missions →</a>
      </div>
      <hr class="divider">
      <p class="note">En attendant, tu peux explorer d'autres missions ou suivre l'avancement de ta squad.</p>
    `;

    const html = generateEmailTemplate(content, `Ta soumission pour "${missionTitle}" est en attente de revue. +${bonusXp} XP déjà crédités.`);
    return this._send({ to: email, subject: `Soumission reçue — "${escHtml(missionTitle)}"`, html, text: stripHtml(content) });
  },

  async sendMissionNeedsRevision({ email, name, missionTitle, feedback, revisionCount }: { email: string; name: string; missionTitle: string; feedback: string; revisionCount?: number }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ta soumission demande quelques ajustements.</h1>
      <p>Ton travail sur <strong>${escHtml(missionTitle)}</strong> a été examiné. Le reviewer a identifié des points à améliorer avant de pouvoir valider.</p>
      <div class="card" style="text-align: left;">
        <div class="card-label" style="margin-bottom: 12px;">Feedback du reviewer</div>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0; white-space: pre-wrap;">${escHtml(feedback)}</p>
      </div>
      <p>Prends le temps de relire ce feedback, apporte les corrections nécessaires, et resoumet ta mission. Chaque itération te rend meilleur(e).</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Retravailler ma soumission →</a>
      </div>
      ${revisionCount && revisionCount >= 2 ? `<hr class="divider"><p class="note">Attention : tu as atteint ${revisionCount}/3 révisions autorisées pour cette mission.</p>` : ""}
    `;

    const html = generateEmailTemplate(content, `Quelques ajustements sont nécessaires pour valider "${missionTitle}".`);
    return this._send({ to: email, subject: `Révision requise — "${escHtml(missionTitle)}"`, html, text: stripHtml(content) });
  },

  async sendMissionRejected({ email, name, missionTitle, feedback }: { email: string; name: string; missionTitle: string; feedback?: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> ta soumission n'a pas été retenue.</h1>
      <p>Après examen, la soumission pour <strong>${escHtml(missionTitle)}</strong> n'a pas pu être validée.</p>
      ${feedback ? `
      <div class="card" style="text-align: left;">
        <div class="card-label" style="margin-bottom: 12px;">Retour de l'équipe</div>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0; white-space: pre-wrap;">${escHtml(feedback)}</p>
      </div>` : ""}
      <p>Ce n'est pas une fin — c'est un cap. Les builders qui progressent le plus vite sont ceux qui tirent les leçons de chaque tentative. D'autres missions t'attendent.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/missions" class="btn">Explorer d'autres missions →</a>
      </div>
    `;

    const html = generateEmailTemplate(content, `Ta soumission pour "${missionTitle}" n'a pas été retenue. D'autres missions t'attendent.`);
    return this._send({ to: email, subject: `Résultat de ta soumission — "${escHtml(missionTitle)}"`, html, text: stripHtml(content) });
  },

  async sendLevelUp({ email, name, newLevel }: { email: string; name: string; newLevel: number }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1><span class="accent">${escHtml(firstName)},</span> tu viens de passer un cap.</h1>
      <p>Ton travail constant porte ses fruits. Tu as officiellement atteint un nouveau niveau dans l'écosystème HASHCODE.</p>
      <div class="card">
        <div class="card-value">Niveau ${newLevel}</div>
        <div class="card-label">Ton nouveau rang dans la communauté</div>
      </div>
      <p>Ce niveau te donne accès à de nouvelles missions et renforce ta position dans ta guilde. Continue sur cette lancée.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/dashboard" class="btn">Voir mon tableau de bord →</a>
      </div>
    `;

    const html = generateEmailTemplate(content, `Niveau ${newLevel} atteint. De nouvelles missions s'ouvrent à toi.`);
    return this._send({ to: email, subject: `${escHtml(firstName)}, tu es maintenant niveau ${newLevel} sur HASHCODE 🎯`, html, text: stripHtml(content) });
  },

  async sendSquadMemberJoined({ leaderEmail, leaderName, newMemberName, squadName, memberCount }: { leaderEmail: string; leaderName: string; newMemberName: string; squadName: string; memberCount: number }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (leaderName || "Leader").split(" ")[0];
    const content = `
      <h1><span class="accent">${escHtml(newMemberName)}</span> a rejoint ta squad.</h1>
      <p>Bonne nouvelle, <strong>${escHtml(firstName)}</strong> — un nouveau membre vient de rejoindre <strong>${escHtml(squadName)}</strong>.</p>
      <div class="card">
        <div class="card-value">${memberCount} / 5</div>
        <div class="card-label">Membres dans ta squad</div>
      </div>
      <p>Accueille-le/la et synchronisez vos objectifs. Plus votre squad est soudée, plus votre score de cohésion grimpe — et plus les récompenses sont importantes.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/squad" class="btn">Voir ma squad →</a>
      </div>
    `;

    const html = generateEmailTemplate(content, `${newMemberName} a rejoint ${squadName}. Ta squad compte maintenant ${memberCount} membres.`);
    return this._send({ to: leaderEmail, subject: `${escHtml(newMemberName)} vient de rejoindre ${escHtml(squadName)}`, html, text: stripHtml(content) });
  },

  async sendAdminAccountDeleted({ adminEmail, adminName, deletedName, deletedEmail, memberNumber, level, missionsCount }: { adminEmail: string; adminName: string; deletedName: string; deletedEmail: string; memberNumber?: number | null; level: number; missionsCount: number }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (adminName || "Admin").split(" ")[0];
    const content = `
      <h1>Suppression de compte, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Un utilisateur vient de supprimer son compte HASHCODE.</p>
      <div class="card" style="text-align: left;">
        <div class="card-label" style="margin-bottom: 12px;">Informations du compte supprimé</div>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Nom :</strong> ${escHtml(deletedName)}</p>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Email :</strong> ${escHtml(deletedEmail)}</p>
        ${memberNumber ? `<p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Membre #:</strong> ${memberNumber}</p>` : ""}
        <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 6px;"><strong style="color: #e4e4e7;">Niveau :</strong> ${level}</p>
        <p style="font-size: 14px; color: #a1a1aa; margin: 0;"><strong style="color: #e4e4e7;">Missions complétées :</strong> ${missionsCount}</p>
      </div>
      <p class="note">Ce compte et toutes ses données associées ont été définitivement supprimés. Aucune action supplémentaire n'est requise.</p>
    `;
    const html = generateEmailTemplate(content, `${deletedName} vient de supprimer son compte HASHCODE.`);
    return this._send({ to: adminEmail, subject: `Compte supprimé — ${escHtml(deletedName)} (${escHtml(deletedEmail)})`, html, text: stripHtml(content) });
  },

  async sendAccountDeleted({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (name || "Builder").split(" ")[0];
    const content = `
      <h1>Ton compte a été supprimé, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>Comme demandé, ton compte HASHCODE et toutes les données associées ont été définitivement supprimés.</p>
      <p>Si tu n'es pas à l'origine de cette action ou si tu penses qu'il s'agit d'une erreur, contacte-nous immédiatement en répondant à cet email.</p>
      <hr class="divider">
      <p class="note">Tu pourras toujours créer un nouveau compte si tu souhaites rejoindre la communauté à nouveau. Ce sera reparti de zéro.</p>
    `;
    const html = generateEmailTemplate(content, "Ton compte HASHCODE a été supprimé. Réponds si ce n'est pas toi.");
    return this._send({ to: email, subject: "Confirmation : ton compte HASHCODE a été supprimé", html, text: stripHtml(content) });
  },

  async sendAdminCoreMissionPending({ adminEmail, adminName, submitterName, missionTitle }: { adminEmail: string; adminName: string; submitterName: string; missionTitle: string }) {
    if (!resend) return { success: true, mocked: true };

    const firstName = (adminName || "Admin").split(" ")[0];
    const content = `
      <h1>Confirmation requise, <span class="accent">${escHtml(firstName)}</span>.</h1>
      <p>La mission CORE <strong>${escHtml(missionTitle)}</strong> soumise par <strong>${escHtml(submitterName)}</strong> vient d'être validée par un pair et attend ta confirmation finale.</p>
      <div class="btn-wrap">
        <a href="${APP_URL}/admin/submissions" class="btn">Voir la soumission →</a>
      </div>
      <hr class="divider">
      <p class="note">Les missions CORE nécessitent une validation admin après la revue par pair. L'utilisateur attend ta décision.</p>
    `;
    const html = generateEmailTemplate(content, `${submitterName} attend la confirmation admin pour "${missionTitle}".`);
    return this._send({ to: adminEmail, subject: `[CORE] Validation requise — ${escHtml(missionTitle)}`, html, text: stripHtml(content) });
  },

  async sendSquadCohesionAlert({ leaderEmail, leaderName, squadName, cohesionScore, level }: { leaderEmail: string; leaderName: string; squadName: string; cohesionScore: number; level: "low" | "critical" }) {
    if (!resend) return { success: true, mocked: true };

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
    return this._send({
      to: leaderEmail,
      subject: isCritical
        ? `🔴 Alerte critique — ${escHtml(squadName)} à ${scorePercent}% de cohésion`
        : `Cohésion en baisse — ${escHtml(squadName)} à ${scorePercent}%`,
      html,
      text: stripHtml(content),
    });
  },

  async sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
    return this._send({ to, subject, html, text });
  },

  async _send({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
    if (!resend) return { success: false, error: "Resend not configured" };
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "HASHCODE <noreply@joinhashcode.com>",
        to,
        subject,
        html,
        ...(text ? { text } : {}),
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
  },
};
