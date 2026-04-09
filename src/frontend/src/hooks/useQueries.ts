import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { GalleryEntryPublic, GenerateResult, ImageId } from "../types";

// Interface for gallery actor methods (populated by bindgen from backend mixins)
interface GalleryActor {
  listGallery: () => Promise<GalleryEntryPublic[]>;
  deleteGalleryEntry: (id: ImageId) => Promise<boolean>;
  generateImage: (prompt: string) => Promise<GenerateResult>;
}

export function useGallery() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GalleryEntryPublic[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as GalleryActor).listGallery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteGalleryEntry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, ImageId>({
    mutationFn: async (id: ImageId) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as unknown as GalleryActor).deleteGalleryEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}

export function useGenerateImage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<GalleryEntryPublic, Error, string>({
    mutationFn: async (prompt: string) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (actor as unknown as GalleryActor).generateImage(
        prompt,
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
}
