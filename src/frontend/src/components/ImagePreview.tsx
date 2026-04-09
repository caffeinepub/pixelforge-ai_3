import { Button } from "@/components/ui/button";
import type { GalleryEntryPublic } from "@/types";
import { Link } from "@tanstack/react-router";
import { Images, RefreshCw } from "lucide-react";

interface ImagePreviewProps {
  entry: GalleryEntryPublic;
  onGenerateAnother: () => void;
}

export function ImagePreview({ entry, onGenerateAnother }: ImagePreviewProps) {
  const imageUrl = entry.image;

  return (
    <div
      className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
      data-ocid="image-preview"
    >
      {/* Image */}
      <div className="relative rounded-xl overflow-hidden border border-border shadow-elevation bg-muted aspect-square sm:aspect-[4/3]">
        <img
          src={imageUrl}
          alt={entry.prompt}
          className="w-full h-full object-cover transition-smooth"
          loading="eager"
          data-ocid="generated-image"
        />
      </div>

      {/* Prompt display */}
      <div className="rounded-lg bg-muted/50 border border-border px-4 py-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
          Prompt
        </p>
        <p
          className="text-sm text-foreground leading-relaxed"
          data-ocid="preview-prompt-text"
        >
          {entry.prompt}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onGenerateAnother}
          className="flex-1 h-11 font-medium border-accent/40 text-accent hover:bg-accent/10 hover:border-accent transition-smooth"
          data-ocid="btn-generate-another"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Another
        </Button>
        <Link to="/gallery" className="flex-1" data-ocid="link-view-gallery">
          <Button
            variant="default"
            className="w-full h-11 font-medium bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Images className="w-4 h-4 mr-2" />
            View in Gallery
          </Button>
        </Link>
      </div>
    </div>
  );
}
