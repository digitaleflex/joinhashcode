"use client";

import dynamic from "next/dynamic";

const SquadJourney = dynamic(
    () => import("@/components/dashboard/squad-journey").then((mod) => mod.SquadJourney),
    { ssr: false }
);

export default function SquadPageClient({ user, squad, incomingInvitations }: { user: any, squad: any, incomingInvitations?: any[] }) {
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
