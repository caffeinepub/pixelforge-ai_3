import { Link, createRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, ImageIcon, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Layout } from "../Layout";
import { GenerateForm } from "../components/GenerateForm";
import { ImagePreview } from "../components/ImagePreview";
import { useAuth } from "../hooks/useAuth";
import {
  useGenerateComicImage,
  useGenerateImage,
  useStorePhoto,
} from "../hooks/useQueries";
import type { GalleryEntryPublic } from "../types";
import { Route as RootRoute } from "./__root";

type GenerationState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "uploading" }
  | { status: "success"; entry: GalleryEntryPublic }
  | { status: "uploaded"; dataUrl: string; entry: GalleryEntryPublic }
  | { status: "error"; message: string };

function GeneratePage() {
  const { isAuthenticated, isLoading, isInitializing, login } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [comicMode, setComicMode] = useState(false);
  const [state, setState] = useState<GenerationState>({ status: "idle" });

  const generateMutation = useGenerateImage();
  const generateComicMutation = useGenerateComicImage();
  const storePhotoMutation = useStorePhoto();

  // Keep ref to uploaded preview data URL for display
  const uploadedDataUrlRef = useRef<string>("");

  useEffect(() => {
    // Wait for initialization to complete before redirecting
    if (!isInitializing && !isAuthenticated && !isLoading) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, isInitializing, navigate]);

  async function handleGenerate(trimmedPrompt: string) {
    setState({ status: "generating" });
    try {
      const mutation = comicMode ? generateComicMutation : generateMutation;
      const entry = await mutation.mutateAsync(trimmedPrompt);
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

  async function handleUpload(file: File) {
    setState({ status: "uploading" });
    try {
      const dataUrl = await readFileAsDataUrl(file);
      uploadedDataUrlRef.current = dataUrl;
      const label = file.name
        ? `Uploaded: ${file.name.replace(/\.[^.]+$/, "")}`
        : "Uploaded from gallery";
      const entry = await storePhotoMutation.mutateAsync({
        url: dataUrl,
        prompt: label,
      });
      setState({ status: "uploaded", dataUrl, entry });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Upload failed. Please try again.",
      });
    }
  }

  function handleGenerateAnother() {
    setState({ status: "idle" });
    setPrompt("");
  }

  if (!isAuthenticated && !isLoading && !isInitializing) {
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

  const isGenerating = state.status === "generating";
  const isUploading = state.status === "uploading";
  const showForm = state.status !== "success" && state.status !== "uploaded";

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
            Describe anything — or upload from your device gallery.
          </p>
        </div>

        {/* Panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation">
          {showForm ? (
            <>
              <GenerateForm
                onGenerate={handleGenerate}
                onUpload={handleUpload}
                isGenerating={isGenerating}
                isUploading={isUploading}
                currentPrompt={prompt}
                onPromptChange={setPrompt}
                comicMode={comicMode}
                onComicModeChange={setComicMode}
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
          ) : state.status === "success" ? (
            <ImagePreview
              entry={state.entry}
              onGenerateAnother={handleGenerateAnother}
            />
          ) : (
            /* Uploaded preview */
            <UploadedPreview
              dataUrl={state.dataUrl}
              entry={state.entry}
              onGenerateAnother={handleGenerateAnother}
            />
          )}
        </div>

        {/* Gallery hint */}
        {(state.status === "idle" || state.status === "error") && (
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

interface UploadedPreviewProps {
  dataUrl: string;
  entry: GalleryEntryPublic;
  onGenerateAnother: () => void;
}

function UploadedPreview({ dataUrl, onGenerateAnother }: UploadedPreviewProps) {
  return (
    <div
      className="flex flex-col items-center gap-4"
      data-ocid="uploaded-preview"
    >
      <div className="w-full rounded-xl overflow-hidden border border-border bg-muted/30">
        <img
          src={dataUrl}
          alt="Uploaded from your gallery"
          className="w-full object-contain max-h-72"
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-accent font-medium">
        <ImageIcon className="w-4 h-4" />
        Photo saved to your gallery
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Link
          to="/gallery"
          className="flex-1 h-10 flex items-center justify-center rounded-lg bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 transition-smooth text-sm font-medium"
          data-ocid="link-view-in-gallery"
        >
          View in Gallery
        </Link>
        <button
          type="button"
          onClick={onGenerateAnother}
          className="flex-1 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border hover:text-foreground hover:bg-muted/70 transition-smooth text-sm font-medium"
          data-ocid="btn-upload-another"
        >
          Upload / Generate Another
        </button>
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
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
