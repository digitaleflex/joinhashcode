"use client";

import dynamic from "next/dynamic";
import type { SquadData, UserData, IncomingInvitation } from "@/components/dashboard/squad-journey";

const SquadJourney = dynamic(
    () => import("@/components/dashboard/squad-journey").then((mod) => mod.SquadJourney),
    { ssr: false }
);

export default function SquadPageClient({ user, squad, incomingInvitations }: { user: UserData, squad: SquadData | null, incomingInvitations?: IncomingInvitation[] }) {
  return (
    <div id="tour-squad-journey" className="h-full w-full">
      <SquadJourney
        user={user}
        squad={squad}
        incomingInvitations={incomingInvitations}
      />
    </div>
  );
}
