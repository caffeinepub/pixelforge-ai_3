import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "../Layout";
import { GenerateForm } from "../components/GenerateForm";
import { ImagePreview } from "../components/ImagePreview";
import { useAuth } from "../hooks/useAuth";
import { useGenerateImage } from "../hooks/useQueries";
import type { GalleryEntryPublic } from "../types";
import { Route as RootRoute } from "./__root";

type GenerationState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "success"; entry: GalleryEntryPublic }
  | { status: "error"; message: string };

function GeneratePage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<GenerationState>({ status: "idle" });
  const generateMutation = useGenerateImage();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  async function handleGenerate(trimmedPrompt: string) {
    setState({ status: "generating" });
    try {
      const entry = await generateMutation.mutateAsync(trimmedPrompt);
      setState({ status: "success", entry });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Generation failed. Please try again.",
      });
    }
  }

  function handleGenerateAnother() {
    setState({ status: "idle" });
    setPrompt("");
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8"
        data-ocid="generate-unauth"
      >
        <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-accent" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Sign in to Generate
          </h2>
          <p className="text-muted-foreground">
            You need to be signed in to generate images.
          </p>
        </div>
        <button
          type="button"
          onClick={login}
          className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-smooth"
          data-ocid="btn-unauth-login"
        >
          Sign In with Internet Identity
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/15 mb-4">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight mb-2">
            Generate an Image
          </h1>
          <p className="text-muted-foreground text-sm">
            Describe anything — our AI will bring it to life.
          </p>
        </div>

        {/* Panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation">
          {state.status !== "success" ? (
            <>
              <GenerateForm
                onGenerate={handleGenerate}
                isGenerating={state.status === "generating"}
                currentPrompt={prompt}
                onPromptChange={setPrompt}
              />

              {state.status === "error" && (
                <div
                  className="mt-4 flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive"
                  data-ocid="generate-error"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{state.message}</span>
                </div>
              )}
            </>
          ) : (
            <ImagePreview
              entry={state.entry}
              onGenerateAnother={handleGenerateAnother}
            />
          )}
        </div>

        {/* Gallery hint (shown only when idle and authenticated) */}
        {state.status === "idle" && (
          <p className="text-center text-xs text-muted-foreground mt-5">
            Your past generations are saved in your{" "}
            <Link
              to="/gallery"
              className="text-accent hover:underline underline-offset-2"
              data-ocid="link-gallery-hint"
            >
              Gallery
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/generate",
  component: function Generate() {
    return (
      <Layout requireAuth={false}>
        <GeneratePage />
      </Layout>
    );
  },
});
