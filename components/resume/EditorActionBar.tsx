"use client";

import { Lock, LockOpen, Save, Send, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "@/lib/context/dashboard-context";

export type EditorActionBarProps = {
  isLocked: boolean;
  hasUnsavedChanges: boolean;
  /** false when status is PENDING_APPROVAL — cannot unlock during HR review */
  canEdit: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
};

export function EditorActionBar({
  isLocked,
  hasUnsavedChanges,
  canEdit,
  isSaving,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
  onSubmit,
}: EditorActionBarProps) {
  const canSave = !isLocked && hasUnsavedChanges && !isSaving && !isSubmitting;
  const canSubmit =
    isLocked && !hasUnsavedChanges && !isSubmitting && !isSaving && canEdit;

  const { isEditHintActive } = useDashboard();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        {isLocked ? (
          <div className="relative">
            <AnimatePresence>
              {isEditHintActive && canEdit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { type: "spring", damping: 12, stiffness: 200 } 
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  className="absolute top-full left-1/2 mt-3 w-max -translate-x-1/2 z-[100] pointer-events-none"
                >
                  <div className="relative rounded-lg bg-primary px-3.5 py-2 text-[12px] font-bold text-white shadow-2xl ring-2 ring-white animate-bounce-subtle">
                    Click here to edit!
                    <div className="absolute bottom-full left-1/2 -mb-1.5 size-3 -translate-x-1/2 rotate-45 bg-primary ring-l-2 ring-t-2 ring-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canEdit || isSaving || isSubmitting}
              onClick={onEdit}
              className="h-9 gap-1.5 rounded-lg border-border bg-card text-[13px] font-medium text-foreground shadow-sm hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              <LockOpen className="size-3.5" />
              Edit
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!canEdit || isSaving || isSubmitting}
            onClick={onCancel}
            className="h-9 gap-1.5 rounded-lg border-border bg-card text-[13px] font-medium text-foreground shadow-sm hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          >
            <X className="size-3.5" />
            Cancel
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          disabled={!canSave}
          onClick={onSave}
          className="h-9 gap-1.5 rounded-lg bg-primary text-[13px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-40"
        >
          {isSaving ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Save className="size-3.5" />
          )}
          {isSaving ? "Saving…" : "Save"}
        </Button>


      </div>
    </div>
  );
}
