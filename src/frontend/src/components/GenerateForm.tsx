import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useRef } from "react";

interface GenerateFormProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  currentPrompt: string;
  onPromptChange: (val: string) => void;
}

const EXAMPLE_PROMPTS = [
  "A neon-lit cyberpunk city at night, reflections on wet pavement",
  "Ethereal forest spirit made of glowing moss and fireflies",
  "Minimalist geometric landscape at golden hour, long shadows",
];

export function GenerateForm({
  onGenerate,
  isGenerating,
  currentPrompt,
  onPromptChange,
}: GenerateFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = currentPrompt.trim();
    if (!trimmed || isGenerating) return;
    onGenerate(trimmed);
  }

  function handleExampleClick(prompt: string) {
    onPromptChange(prompt);
    textareaRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" data-ocid="generate-form">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={currentPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the image you want to create…"
          rows={4}
          disabled={isGenerating}
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
            disabled={isGenerating}
            className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-accent/15 hover:text-accent border border-border transition-smooth text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed truncate max-w-[200px]"
            title={p}
            data-ocid="example-prompt-chip"
          >
            {p.length > 34 ? `${p.slice(0, 32)}…` : p}
          </button>
        ))}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isGenerating || !currentPrompt.trim()}
        className="w-full mt-4 h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-elevation transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
        data-ocid="btn-generate"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Image
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
