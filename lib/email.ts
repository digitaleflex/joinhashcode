import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export const emailService = {
  async sendMagicLink({ email, url }: { email: string; url: string }) {
    if (!resend) {
      console.log(`[Email Mock] Sending magic link to ${email}: ${url}`);
      return { success: true, mocked: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "HASHCODE <noreply@joinhashcode.com>",
        to: email,
        subject: "Ton lien de connexion HASHCODE",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 600; margin-bottom: 16px;">Bienvenue sur HASHCODE</h1>
            <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
              Clique sur le bouton ci-dessous pour te connecter à ton espace HASHCODE.
            </p>
            <a href="${url}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; font-size: 16px; font-weight: 500; text-decoration: none; border-radius: 6px;">
              Se connecter
            </a>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 32px;">
              Si tu n'as pas demandé ce lien, tu peux ignorer cet email.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Failed to send email:", err);
      return { success: false, error: err };
    }
  },
  async sendQuizResults({ email, name, profileType }: { email: string; name: string; profileType: string }) {
    if (!resend) {
      console.log(`[Email Mock] Sending quiz results to ${email}: Profile = ${profileType}`);
      return { success: true, mocked: true };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "HASHCODE <noreply@joinhashcode.com>",
        to: email,
        subject: "Ton Analyse de Profil HASHCODE est prête",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 600; margin-bottom: 16px;">Félicitations ${name} !</h1>
            <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
              Notre algorithme a terminé l'analyse de tes vecteurs cognitifs et temps de réponse.
              Ton profil dominant a été identifié en tant que : <strong style="color: #3b82f6;">${profileType.toUpperCase()}</strong>.
            </p>
            <a href="https://joinhashcode.com/dashboard" style="display: inline-block; background-color: #C5F441; color: #000; padding: 12px 24px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px;">
              Accéder à ton Dashboard
            </a>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 32px;">
              Prépare-toi à débloquer tes outils personnalisés.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Error sending results email:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Failed to send results email:", err);
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
