import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GalleryEntryPublic } from "../types";

interface GalleryCardProps {
  entry: GalleryEntryPublic;
  index: number;
  onOpen: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export function GalleryCard({
  entry,
  index,
  onOpen,
  onDelete,
  isDeleting,
}: GalleryCardProps) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const imageUrl = entry.image;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await onDelete();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative rounded-xl overflow-hidden bg-card border border-border cursor-pointer shadow-elevation hover:shadow-hover transition-smooth"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setConfirmDelete(false);
      }}
      onClick={onOpen}
      data-ocid="gallery-card"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={entry.prompt}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Hover Overlay — prompt text */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/70 backdrop-blur-sm flex flex-col justify-end p-4"
            data-ocid="gallery-card-overlay"
          >
            <p className="text-sm font-medium leading-snug line-clamp-4 text-card">
              {entry.prompt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete button */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-2 right-2"
          >
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 px-3 text-xs font-semibold shadow-elevation"
              aria-label={confirmDelete ? "Confirm delete" : "Delete image"}
              data-ocid="btn-card-delete"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {confirmDelete ? "Sure?" : "Delete"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
