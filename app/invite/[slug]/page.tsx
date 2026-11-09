import { redirect } from "next/navigation";

// Les invitations de squad sont supprimées (D-027). Les anciens liens
// partagés (/invite/<slug>, /invite/accept) mènent à l'inscription.
export default function LegacyInvitePage() {
  redirect("/signin");
}
