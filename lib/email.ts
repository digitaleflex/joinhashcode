import { Resend } from "resend";
import { getWelcomeEmailContent } from "./email-templates/welcome";
import { getWelcomeProfileEmailContent } from "./email-templates/welcome-profile";
import { getMissionProtocolEmailContent } from "./email-templates/mission-protocol";
import { getDigitalIdentityEmailContent } from "./email-templates/digital-identity";
import { getBetaKeyVerifiedEmailContent } from "./email-templates/beta-key-verified";
import { getOnboardingCompletedEmailContent } from "./email-templates/onboarding-completed";
import { getMagicLinkEmailContent } from "./email-templates/magic-link";
import { getOtpEmailContent } from "./email-templates/otp";
import { getQuizResultsEmailContent } from "./email-templates/quiz-results";
import { getMissionApprovedEmailContent } from "./email-templates/mission-approved";
import { getDailyReminderEmailContent } from "./email-templates/daily-reminder";
import { getReactivationEmailContent } from "./email-templates/reactivation";
import { getContactNotificationEmailContent } from "./email-templates/contact-notification";
import { getFeedbackReceiptEmailContent } from "./email-templates/feedback-receipt";
import { getFeedbackUpdateEmailContent } from "./email-templates/feedback-update";
import { getMissionSubmittedEmailContent } from "./email-templates/mission-submitted";
import { getMissionNeedsRevisionEmailContent } from "./email-templates/mission-needs-revision";
import { getMissionRejectedEmailContent } from "./email-templates/mission-rejected";
import { getAdminAccountDeletedEmailContent } from "./email-templates/admin-account-deleted";
import { getAccountDeletedEmailContent } from "./email-templates/account-deleted";
import { getAdminCoreMissionPendingEmailContent } from "./email-templates/admin-core-mission-pending";
import { getOrientationEmailContent } from "./email-templates/orientation";
import { getOpsReminderEmailContent, type OpsReminderStep } from "./email-templates/ops-reminder";

const resendApiKey = process.env.RESEND_API_KEY;
// CI placeholders never send real email: treat them as a mock.
const isMockResendKey =
  !resendApiKey || resendApiKey === "test" || resendApiKey.startsWith("re_ci_");
const resend = isMockResendKey ? null : new Resend(resendApiKey);

const EMAIL_WARNING_THROTTLE_MS = 300_000;
let lastWarningTime = 0;

function warnEmailMissing(context: string) {
  const now = Date.now();
  if (now - lastWarningTime > EMAIL_WARNING_THROTTLE_MS) {
    lastWarningTime = now;
    console.warn(`[EMAIL_WARN] ${context}: RESEND_API_KEY manquant — emails en mode mock silencieux. Définissez RESEND_API_KEY pour envoyer les vrais emails.`);
  }
}

export { warnEmailMissing };

export const emailService = {
  async sendWelcomeEmail({ email, name }: { email: string; name: string }) {
    if (!resend) {
      warnEmailMissing("sendWelcomeEmail");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getWelcomeEmailContent({ name });
    return this._send({ to: email, subject, html, text });
  },

  async sendWelcomeProfileEmail({ email, name, profileType }: { email: string; name: string; profileType: string }) {
    if (!resend) {
      warnEmailMissing("sendWelcomeProfileEmail");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getWelcomeProfileEmailContent({ name, profileType });
    return this._send({ to: email, subject, html, text });
  },

  async sendWelcomePendingQuiz({ email, name }: { email: string; name: string }) {
    if (!resend) {
      warnEmailMissing("sendWelcomePendingQuiz");
      return { success: true, mocked: true };
    }
    return this.sendWelcomeEmail({ email, name });
  },

  async sendMissionProtocolEmail({ email, name, userClass }: { email: string; name: string; userClass?: string | null }) {
    if (!resend) {
      warnEmailMissing("sendMissionProtocolEmail");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getMissionProtocolEmailContent({ name, userClass });
    return this._send({ to: email, subject, html, text });
  },

  async sendDigitalIdentityEmail({ email, name }: { email: string; name: string }) {
    if (!resend) {
      warnEmailMissing("sendDigitalIdentityEmail");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getDigitalIdentityEmailContent({ name });
    return this._send({ to: email, subject, html, text });
  },

  async sendBetaKeyVerifiedEmail({ email, name }: { email: string; name: string }) {
    if (!resend) {
      warnEmailMissing("sendBetaKeyVerifiedEmail");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getBetaKeyVerifiedEmailContent({ name });
    return this._send({ to: email, subject, html, text });
  },

  async sendOnboardingCompletedEmail({ email, name }: { email: string; name: string }) {
    if (!resend) {
      warnEmailMissing("sendOnboardingCompletedEmail");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getOnboardingCompletedEmailContent({ name });
    return this._send({ to: email, subject, html, text });
  },

  async sendMagicLink({ email, url }: { email: string; url: string }) {
    if (!resend) {
      warnEmailMissing("sendMagicLink");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getMagicLinkEmailContent({ url });
    return this._send({ to: email, subject, html, text });
  },

  async sendOtpEmail({ email, otp, type: _type }: { email: string; otp: string; type: string }) {
    if (!resend) {
      warnEmailMissing("sendOtpEmail");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getOtpEmailContent({ otp, type: _type });
    return this._send({ to: email, subject, html, text });
  },

  async sendQuizResults({ email, name, profileType }: { email: string; name: string; profileType: string }) {
    if (!resend) return { success: true, mocked: true };
    const { subject, html, text } = getQuizResultsEmailContent({ name, profileType });
    return this._send({ to: email, subject, html, text });
  },

  async sendMissionApproval({ email, name, missionTitle }: { email: string; name: string; missionTitle: string }) {
    if (!resend) return { success: true, mocked: true };
    const { subject, html, text } = getMissionApprovedEmailContent({ name, missionTitle });
    return this._send({ to: email, subject, html, text });
  },

  async sendDailyReminder({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };
    const { subject, html, text } = getDailyReminderEmailContent({ name });
    return this._send({ to: email, subject, html, text });
  },

  async sendOpsReminder({
    email,
    name,
    step,
    unsubscribeUrl,
  }: {
    email: string;
    name: string;
    step: OpsReminderStep;
    unsubscribeUrl?: string;
  }) {
    if (!resend) {
      warnEmailMissing("sendOpsReminder");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getOpsReminderEmailContent({
      name,
      step,
      unsubscribeUrl,
    });
    return this._send({ to: email, subject, html, text });
  },

  async sendReactivation({ email, name }: { email: string; name: string }) {
    if (!resend) return { success: true, mocked: true };
    const { subject, html, text } = getReactivationEmailContent({ name });
    return this._send({ to: email, subject, html, text });
  },

  async sendContactNotification({ type, email, subject, content: messageContent }: { type: string; email: string; subject: string; content: string }) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@joinhashcode.com";
    if (!resend) {
      warnEmailMissing("sendContactNotification");
      return { success: true, mocked: true };
    }
    const { subject: emailSubject, html, text } = getContactNotificationEmailContent({ type, email, subject, content: messageContent });
    return this._send({ to: adminEmail, subject: emailSubject, html, text });
  },

  async sendFeedbackReceipt({ email, name, type }: { email: string; name: string; type: string }) {
    if (!resend) {
      warnEmailMissing("sendFeedbackReceipt");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getFeedbackReceiptEmailContent({ name, type });
    return this._send({ to: email, subject, html, text });
  },

  async sendFeedbackUpdate({ email, name, status }: { email: string; name: string; status: string }) {
    if (!resend) {
      warnEmailMissing("sendFeedbackUpdate");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getFeedbackUpdateEmailContent({ name, status });
    return this._send({
      to: email,
      subject,
      html,
      text,
    });
  },

  async sendMissionSubmitted({ email, name, missionTitle }: { email: string; name: string; missionTitle: string }) {
    if (!resend) {
      warnEmailMissing("sendMissionSubmitted");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getMissionSubmittedEmailContent({ name, missionTitle });
    return this._send({ to: email, subject, html, text });
  },

  async sendMissionNeedsRevision({ email, name, missionTitle, feedback, revisionCount }: { email: string; name: string; missionTitle: string; feedback: string; revisionCount?: number }) {
    if (!resend) {
      warnEmailMissing("sendMissionNeedsRevision");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getMissionNeedsRevisionEmailContent({ name, missionTitle, feedback, revisionCount });
    return this._send({ to: email, subject, html, text });
  },

  async sendMissionRejected({ email, name, missionTitle, feedback }: { email: string; name: string; missionTitle: string; feedback?: string }) {
    if (!resend) {
      warnEmailMissing("sendMissionRejected");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getMissionRejectedEmailContent({ name, missionTitle, feedback });
    return this._send({ to: email, subject, html, text });
  },

  async sendAdminAccountDeleted({ adminEmail, adminName, deletedName, deletedEmail, memberNumber, level, missionsCount }: { adminEmail: string; adminName: string; deletedName: string; deletedEmail: string; memberNumber?: number | null; level: number; missionsCount: number }) {
    if (!resend) {
      warnEmailMissing("sendAdminAccountDeleted");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getAdminAccountDeletedEmailContent({ adminName, deletedName, deletedEmail, memberNumber, level, missionsCount });
    return this._send({ to: adminEmail, subject, html, text });
  },

  async sendOrientationEmail({
    email, name, specialization, goal90days, outcomes, atelierTitle, atelierDuration, atelierDescription
  }: {
    email: string; name: string; specialization: string;
    goal90days: string; outcomes: string[];
    atelierTitle: string; atelierDuration: string; atelierDescription: string;
  }) {
    if (!resend) return { success: true, mocked: true };
    const { subject, html, text } = getOrientationEmailContent({
      name, specialization, goal90days, outcomes, atelierTitle, atelierDuration, atelierDescription,
    });
    return this._send({ to: email, subject, html, text });
  },

  async sendAccountDeleted({ email, name }: { email: string; name: string }) {
    if (!resend) {
      warnEmailMissing("sendAccountDeleted");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getAccountDeletedEmailContent({ name });
    return this._send({ to: email, subject, html, text });
  },

  async sendAdminCoreMissionPending({ adminEmail, adminName, submitterName, missionTitle }: { adminEmail: string; adminName: string; submitterName: string; missionTitle: string }) {
    if (!resend) {
      warnEmailMissing("sendAdminCoreMissionPending");
      return { success: true, mocked: true };
    }
    const { subject, html, text } = getAdminCoreMissionPendingEmailContent({ adminName, submitterName, missionTitle });
    return this._send({ to: adminEmail, subject, html, text });
  },

  async sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
    return this._send({ to, subject, html, text });
  },

  async _send({ to, subject, html, text, attachments }: { to: string; subject: string; html: string; text?: string; attachments?: Record<string, unknown>[] }) {
    if (!resend) return { success: false, error: "Resend not configured" };
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "HASHCODE <noreply@joinhashcode.com>",
        to,
        subject,
        html,
        ...(text ? { text } : {}),
        ...(attachments ? { attachments } : {}),
      });
      if (error) return { success: false, error };
      return { success: true, data };
    } catch (error: unknown) {
      return { success: false, error };
    }
  },

  async getStatus() {
    return {
      connected: !!resend,
      provider: resend ? "Resend" : "Mock (Missing API Key)",
    };
  },
};
