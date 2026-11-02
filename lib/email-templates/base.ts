import { APP_URL } from "../config";

export { APP_URL };

export const LOGO_URL = `${APP_URL}/brand/hashcode-wordmark.png`;

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

/**
 * Gabarit commun de tous les emails HASHCODE.
 *
 * Architecture "defense in depth" pour les clients mail :
 *  1. Layout en tables + styles inline sur les éléments structurels
 *     (Outlook Desktop et les clients qui strippent le <style> rendent quand même).
 *  2. Bloc <style> conservé pour la typographie fine et les media queries
 *     (Gmail, Apple Mail, Outlook.com le supportent).
 *  3. Attributs bgcolor en secours sur chaque cellule clé.
 *
 * Les classes (.content, .btn, .card, .accent…) restent identiques pour ne pas
 * casser les ~25 templates existants.
 */
export const generateEmailTemplate = (
  content: string,
  previewText?: string,
  eyebrow?: string
) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>HASHCODE</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
    .content h1 { color: #ffffff; font-size: 23px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 18px; line-height: 1.3; }
    .content p { margin: 0 0 16px; }
    .content p:last-of-type { margin-bottom: 0; }
    .content strong { color: #fafafa; font-weight: 600; }
    .content a { color: #C5F441; }
    .content ul { margin: 0 0 16px; padding: 0; list-style: none; }
    .content ul li { position: relative; padding-left: 22px; margin-bottom: 10px; }
    .content ul li::before { content: "›"; position: absolute; left: 0; top: -1px; color: #C5F441; font-weight: 700; }
    .accent { color: #C5F441 !important; font-weight: 600; }
    .btn-wrap { text-align: center; margin: 30px 0 24px; }
    .btn { display: inline-block; background-color: #C5F441; color: #080808 !important; padding: 15px 34px; font-size: 13px; font-weight: 800; text-decoration: none; border-radius: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
    .btn-secondary { display: inline-block; background-color: transparent; color: #C5F441 !important; padding: 13px 28px; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 10px; border: 1px solid #C5F441; letter-spacing: 0.06em; text-transform: uppercase; }
    .card { background: #141417; border: 1px solid #26262B; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
    .card-value { font-size: 36px; font-weight: 800; color: #C5F441 !important; letter-spacing: 0.05em; font-family: 'Courier New', Courier, monospace; }
    .card-label { font-size: 11px; color: #5D5D64 !important; text-transform: uppercase; letter-spacing: 0.12em; margin-top: 6px; }
    .divider { border: none; border-top: 1px solid #1B1B1E; margin: 24px 0; }
    .note { font-size: 13px; color: #6B6B74 !important; }
    .accent-bar { height: 3px; background: linear-gradient(90deg, #C5F441 0%, rgba(197,244,65,0) 85%); }
    .tagline { font-size: 10px; color: #5d5d64 !important; text-transform: uppercase; letter-spacing: 0.18em; margin-top: 10px; }
    @media (max-width: 600px) {
      .wrapper { padding: 0 !important; }
      .container { border-radius: 0 !important; border-left: none !important; border-right: none !important; width: 100% !important; }
      .header { padding: 28px 24px 20px !important; }
      .content { padding: 30px 24px 28px !important; }
      .footer { padding: 22px 24px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#080808;">
  ${previewText ? `<div style="display:none;font-size:1px;color:#080808;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escHtml(previewText)}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#080808" class="wrapper" style="background-color:#080808;">
    <tr>
      <td align="center" style="padding:36px 12px;">

        <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" bgcolor="#0F0F10" class="container" style="width:580px; max-width:580px; background-color:#0F0F10; border:1px solid #232327; border-radius:16px; overflow:hidden;">

          <!-- Barre d'accent -->
          <tr>
            <td height="3" bgcolor="#C5F441" class="accent-bar" style="height:3px; line-height:3px; font-size:0; background-color:#C5F441; background-image:linear-gradient(90deg,#C5F441 0%,rgba(197,244,65,0) 85%);">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#0F0F10" class="header" style="padding:34px 40px 22px; border-bottom:1px solid #1B1B1E;">
              <img src="${LOGO_URL}" alt="HASHCODE" width="150" style="height:auto; display:block; margin:0 auto;">
              <div class="tagline" style="font-size:10px; color:#5D5D64; text-transform:uppercase; letter-spacing:0.18em; margin-top:10px;">Bâtir l'Afrique Tech — Ensemble</div>
            </td>
          </tr>

          ${
            eyebrow
              ? `<!-- Eyebrow -->
          <tr>
            <td bgcolor="#0F0F10" style="padding:26px 40px 0;">
              <span style="display:inline-block; padding:5px 12px; border:1px solid rgba(197,244,65,0.35); border-radius:999px; background-color:rgba(197,244,65,0.08); color:#C5F441; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase;">${escHtml(eyebrow)}</span>
            </td>
          </tr>`
              : ""
          }

          <!-- Contenu -->
          <tr>
            <td bgcolor="#0F0F10" class="content" style="padding:${eyebrow ? "20px" : "38px"} 40px 30px; color:#A9A9B2; font-size:15px; line-height:1.7; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#0B0B0D" class="footer" style="padding:24px 40px; border-top:1px solid #1B1B1E; text-align:center;">
              <p style="margin:0; font-size:11px; color:#4A4A52; letter-spacing:0.06em; text-transform:uppercase;">© ${new Date().getFullYear()} HASHCODE Community</p>
              <p style="margin:8px 0 0; font-size:12px; color:#55555E;">
                <a href="${APP_URL}/settings" style="color:#77777f; text-decoration:underline;">Gérer mes notifications</a>
              </p>
            </td>
          </tr>

        </table>

        <!-- Micro-copy hors carte -->
        <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="width:580px; max-width:580px;">
          <tr>
            <td align="center" style="padding:18px 12px 4px; font-size:10px; color:#3B3B42; letter-spacing:0.14em; text-transform:uppercase; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              Reçu cet email après une action sur ton compte HASHCODE
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
