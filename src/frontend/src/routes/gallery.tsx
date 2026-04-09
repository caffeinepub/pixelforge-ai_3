import { createRoute, useNavigate } from "@tanstack/react-router";
import { Images } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Layout } from "../Layout";
import { GalleryGrid } from "../components/GalleryGrid";
import { useAuth } from "../hooks/useAuth";
import { useDeleteGalleryEntry, useGallery } from "../hooks/useQueries";
import { Route as RootRoute } from "./__root";

function GalleryPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const { data: entries = [], isLoading: galleryLoading } = useGallery();
  const deleteMutation = useDeleteGalleryEntry();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!isAuthenticated) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8"
        data-ocid="gallery-unauth"
      >
        <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
          <Images className="w-7 h-7 text-accent" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Sign in to View Gallery
          </h2>
          <p className="text-muted-foreground">
            Your generated images are saved securely with your identity.
          </p>
        </div>
        <button
          type="button"
          onClick={login}
          className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-smooth"
          data-ocid="btn-gallery-login"
        >
          Sign In with Internet Identity
        </button>
      </div>
    );
  }

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Image deleted from your gallery.");
    } catch {
      toast.error("Failed to delete image. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Your Gallery
        </h1>
        <p className="text-muted-foreground mt-1">
          {galleryLoading
            ? "Loading your images…"
            : entries.length === 0
              ? "No images yet — generate your first one!"
              : `${entries.length} image${entries.length === 1 ? "" : "s"} generated`}
        </p>
      </div>

      <GalleryGrid
        entries={entries}
        isLoading={galleryLoading}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: "/gallery",
  component: function Gallery() {
    return (
      <Layout requireAuth={false}>
        <GalleryPage />
      </Layout>
    );
  },
});
