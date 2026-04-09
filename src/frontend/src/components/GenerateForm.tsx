import { Button } from "@/components/ui/button";
import { BookImage, Loader2, Sparkles, Upload, Wand2 } from "lucide-react";
import { useRef } from "react";

const STANDARD_PROMPTS = [
  "A neon-lit cyberpunk city at night, reflections on wet pavement",
  "Ethereal forest spirit made of glowing moss and fireflies",
  "Minimalist geometric landscape at golden hour, long shadows",
];

const COMIC_PROMPTS = [
  "Superhero portrait, city background, bold ink outlines",
  "Villain reveal scene, dramatic lighting, comic book style",
  "Space explorer in retro comic art, halftone dots, vivid colors",
];

interface GenerateFormProps {
  onGenerate: (prompt: string) => void;
  onUpload: (file: File) => void;
  isGenerating: boolean;
  isUploading: boolean;
  currentPrompt: string;
  onPromptChange: (val: string) => void;
  comicMode: boolean;
  onComicModeChange: (val: boolean) => void;
}

export function GenerateForm({
  onGenerate,
  onUpload,
  isGenerating,
  isUploading,
  currentPrompt,
  onPromptChange,
  comicMode,
  onComicModeChange,
}: GenerateFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isWorking = isGenerating || isUploading;

  const EXAMPLE_PROMPTS = comicMode ? COMIC_PROMPTS : STANDARD_PROMPTS;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = currentPrompt.trim();
    if (!trimmed || isWorking) return;
    onGenerate(trimmed);
  }

  function handleExampleClick(prompt: string) {
    onPromptChange(prompt);
    textareaRef.current?.focus();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    // reset so same file can be re-selected
    e.target.value = "";
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" data-ocid="generate-form">
      {/* Comic Mode Toggle */}
      <div
        className="flex items-center gap-2 mb-4"
        data-ocid="comic-mode-toggle"
      >
        <span className="text-xs text-muted-foreground">Style:</span>
        <button
          type="button"
          onClick={() => onComicModeChange(false)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
            !comicMode
              ? "bg-accent/20 text-accent border-accent/50 shadow-sm"
              : "bg-muted/50 text-muted-foreground border-border hover:border-accent/30 hover:text-accent/70"
          }`}
          data-ocid="btn-style-standard"
        >
          <Wand2 className="w-3 h-3" />
          Standard
        </button>
        <button
          type="button"
          onClick={() => onComicModeChange(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-smooth ${
            comicMode
              ? "bg-accent/20 text-accent border-accent/50 shadow-sm"
              : "bg-muted/50 text-muted-foreground border-border hover:border-accent/30 hover:text-accent/70"
          }`}
          data-ocid="btn-style-comic"
        >
          <BookImage className="w-3 h-3" />
          Comic Style
        </button>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={currentPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={
            comicMode
              ? "Describe your comic scene — hero, villain, action…"
              : "Describe the image you want to create…"
          }
          rows={4}
          disabled={isWorking}
          className="w-full resize-none rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/60 focus:border-accent px-4 py-3.5 text-sm leading-relaxed transition-smooth disabled:opacity-60 disabled:cursor-not-allowed"
          data-ocid="input-prompt"
        />
        {isGenerating && (
          <div className="absolute inset-0 rounded-xl bg-card/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        )}
      </div>

      {/* Example prompts */}
      <div className="mt-3 flex flex-wrap gap-2" data-ocid="example-prompts">
        <span className="text-xs text-muted-foreground self-center">Try:</span>
        {EXAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handleExampleClick(p)}
            disabled={isWorking}
            className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-accent/15 hover:text-accent border border-border transition-smooth text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed truncate max-w-[200px]"
            title={p}
            data-ocid="example-prompt-chip"
          >
            {p.length > 34 ? `${p.slice(0, 32)}…` : p}
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={isWorking || !currentPrompt.trim()}
        className="w-full mt-4 h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-elevation transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        data-ocid="btn-generate"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {comicMode ? "Rendering Comic…" : "Generating…"}
          </>
        ) : (
          <>
            {comicMode ? (
              <BookImage className="w-4 h-4 mr-2" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {comicMode ? "Generate Comic Image" : "Generate Image"}
          </>
        )}
      </Button>

      {/* Upload from Gallery Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        data-ocid="input-file-upload"
        aria-label="Upload image from device gallery"
      />
      <Button
        type="button"
        variant="outline"
        disabled={isWorking}
        onClick={() => fileInputRef.current?.click()}
        className="w-full mt-2 h-11 text-sm font-medium border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        data-ocid="btn-upload-gallery"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload from Gallery
          </>
        )}
      </Button>

      {/* Unlimited note */}
      <p className="mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-accent" />
        Unlimited generations — no quota or rate limits
      </p>
    </form>
  );
}
