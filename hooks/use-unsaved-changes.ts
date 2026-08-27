"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseUnsavedChangesOptions {
  isDirty: boolean;
  message?: string;
  enabled?: boolean;
}

export function useUnsavedChanges({
  isDirty,
  message = "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?",
  enabled = true,
}: UseUnsavedChangesOptions) {
  const [showWarning, setShowWarning] = useState(false);
  const isDirtyRef = useRef(isDirty);
  const messageRef = useRef(message);
  const enabledRef = useRef(enabled);

  isDirtyRef.current = isDirty;
  messageRef.current = message;
  enabledRef.current = enabled;

  useEffect(() => {
    if (!enabledRef.current) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = messageRef.current;
      return messageRef.current;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);

  const confirmLeave = useCallback(
    (onConfirm: () => void, onCancel?: () => void) => {
      if (!isDirtyRef.current || !enabledRef.current) {
        onConfirm();
        return;
      }
      setShowWarning(true);
      const handleConfirm = () => {
        setShowWarning(false);
        onConfirm();
      };
      const handleCancel = () => {
        setShowWarning(false);
        onCancel?.();
      };
      return { handleConfirm, handleCancel };
    },
    []
  );

  return {
    showWarning,
    setShowWarning,
    confirmLeave,
    isDirty: isDirtyRef.current,
  };
}