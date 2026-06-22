import { APP_URL } from "../config";

export { APP_URL };

export const LOGO_URL = `${APP_URL}/hashcode-logo.png`;

export const escHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

export const PROFILE_DATA: Record<string, { headline: string; description: string; cta: string }> = {
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

export const stripHtml = (html: string) =>
  html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

export const generateEmailTemplate = (content: string, previewText?: string) => `
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
