"use client";

import dynamic from "next/dynamic";

const SquadJourney = dynamic(
    () => import("@/components/dashboard/squad-journey").then((mod) => mod.SquadJourney),
    { ssr: false }
);

export default function SquadPageClient({ user, squad }: { user: any, squad: any }) {
  return (
    <div id="tour-squad-journey" className="h-full w-full">
      <SquadJourney
        user={user}
        squad={squad}
      />
    </div>
  );
}
