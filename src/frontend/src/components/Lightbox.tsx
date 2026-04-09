import { Button } from "@/components/ui/button";
import { Download, Loader2, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import type { GalleryEntryPublic } from "../types";

interface LightboxProps {
  entry: GalleryEntryPublic;
  onClose: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

function formatDate(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Lightbox({
  entry,
  onClose,
  onDelete,
  isDeleting,
}: LightboxProps) {
  const imageUrl = entry.image;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixelforge-${entry.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80 backdrop-blur-md"
      onClick={onClose}
      data-ocid="lightbox-backdrop"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 12 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative bg-card border border-border rounded-2xl shadow-hover overflow-hidden max-w-3xl w-full max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        data-ocid="lightbox-modal"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-foreground/20 hover:bg-foreground/30 text-card backdrop-blur-sm transition-smooth"
          aria-label="Close lightbox"
          data-ocid="btn-lightbox-close"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Image */}
        <div className="flex-1 overflow-hidden bg-muted min-h-0">
          <img
            src={imageUrl}
            alt={entry.prompt}
            className="w-full h-full object-contain max-h-[60vh]"
          />
        </div>

        {/* Info panel */}
        <div className="p-5 border-t border-border space-y-4 bg-card">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Prompt
            </p>
            <p
              className="text-sm text-foreground leading-relaxed"
              data-ocid="lightbox-prompt"
            >
              {entry.prompt}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-xs text-muted-foreground">
              Generated {formatDate(entry.createdAt)}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-1.5 text-xs"
                data-ocid="btn-lightbox-download"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="gap-1.5 text-xs"
                data-ocid="btn-lightbox-delete"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                {isDeleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
