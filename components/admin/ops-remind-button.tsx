"use client";

import * as React from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function OpsRemindButton({
  userId,
  recentlyReminded,
}: {
  userId: string;
  recentlyReminded: boolean;
}) {
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const disabled = loading || sent || recentlyReminded;

  const send = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/remind`, {
        method: "POST",
      });
      const payload = (await res.json().catch(() => null)) as { message?: string; mocked?: boolean } | null;
      if (!res.ok) {
        toast.error(payload?.message ?? "Relance impossible.");
        return;
      }
      setSent(true);
      toast.success(payload?.mocked ? "Relance simulée (email mocké)." : "Relance envoyée.");
    } catch {
      toast.error("Relance impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant={disabled ? "outline" : "default"}
      disabled={disabled}
      onClick={send}
      className="h-8 rounded-lg px-3 text-xs"
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
      ) : (
        <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden />
      )}
      {sent ? "Envoyée" : recentlyReminded ? "Relancé < 24 h" : "Relancer"}
    </Button>
  );
}
