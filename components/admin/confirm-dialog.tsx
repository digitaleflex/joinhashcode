"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void;
  requireTyping?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  variant = "default",
  onConfirm,
  requireTyping,
}: ConfirmDialogProps) {
  const [typedValue, setTypedValue] = useState("");

  const isTypingValid = !requireTyping || typedValue === requireTyping;
  const isDestructive = variant === "destructive";

  const handleConfirm = useCallback(() => {
    if (!isTypingValid) return;
    onConfirm();
    onOpenChange(false);
    setTypedValue("");
  }, [isTypingValid, onConfirm, onOpenChange]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) setTypedValue("");
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {requireTyping && (
          <div className="space-y-2">
            <p className="text-sm text-zinc-400 font-mono">
              Tape <span className="text-primary font-bold">{requireTyping}</span> pour confirmer :
            </p>
            <Input
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={requireTyping}
              className="bg-zinc-900 border-zinc-800 font-mono"
              autoFocus
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "default"}
            disabled={!isTypingValid}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
