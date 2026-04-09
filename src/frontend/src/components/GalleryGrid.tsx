import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Images, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GalleryEntryPublic } from "../types";
import { GalleryCard } from "./GalleryCard";
import { Lightbox } from "./Lightbox";

interface GalleryGridProps {
  entries: GalleryEntryPublic[];
  isLoading: boolean;
  onDelete: (id: bigint) => Promise<void>;
  isDeleting: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-card border border-border">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center"
      data-ocid="gallery-empty"
    >
      <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 shadow-elevation">
        <Images className="w-9 h-9 text-accent" />
      </div>
      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
        No images yet
      </h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        Your generated images will appear here. Create your first masterpiece
        and it will be saved to your gallery automatically.
      </p>
      <button
        type="button"
        onClick={() => navigate({ to: "/generate" })}
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-smooth shadow-elevation"
        data-ocid="btn-empty-generate"
      >
        <Sparkles className="w-4 h-4" />
        Generate Your First Image
      </button>
    </motion.div>
  );
}

export function GalleryGrid({
  entries,
  isLoading,
  onDelete,
  isDeleting,
}: GalleryGridProps) {
  const [selectedEntry, setSelectedEntry] = useState<GalleryEntryPublic | null>(
    null,
  );

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        data-ocid="gallery-skeleton"
      >
        {Array.from({ length: 6 }, (_, i) => `sk-${i}`).map((key) => (
          <SkeletonCard key={key} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        data-ocid="gallery-grid"
      >
        <AnimatePresence mode="popLayout">
          {entries.length === 0 ? (
            <EmptyState />
          ) : (
            entries.map((entry, index) => (
              <GalleryCard
                key={entry.id.toString()}
                entry={entry}
                index={index}
                onOpen={() => setSelectedEntry(entry)}
                onDelete={async () => {
                  await onDelete(entry.id);
                }}
                isDeleting={isDeleting}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedEntry && (
          <Lightbox
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onDelete={async () => {
              await onDelete(selectedEntry.id);
              setSelectedEntry(null);
            }}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
