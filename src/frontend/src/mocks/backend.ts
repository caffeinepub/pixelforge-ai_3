import type { Principal } from "@icp-sdk/core/principal";
import type { backendInterface, GalleryEntryPublic, GenerateResult, TransformationOutput, UserRole } from "../backend";

const sampleEntries: GalleryEntryPublic[] = [
  {
    id: BigInt(1),
    createdAt: BigInt(Date.now() * 1_000_000),
    prompt: "A serene mountain lake at sunset with vibrant cyan reflections",
    image: "https://picsum.photos/seed/mountain/800/600",
  },
  {
    id: BigInt(2),
    createdAt: BigInt((Date.now() - 60000) * 1_000_000),
    prompt: "Futuristic city skyline at night with neon lights",
    image: "https://picsum.photos/seed/city/800/600",
  },
  {
    id: BigInt(3),
    createdAt: BigInt((Date.now() - 120000) * 1_000_000),
    prompt: "Abstract digital art with flowing cyan and teal patterns",
    image: "https://picsum.photos/seed/abstract/800/600",
  },
];

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async (_hashes) => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async (_blobs) => {},
  _immutableObjectStorageCreateCertificate: async (_blobHash) => ({ method: "PUT", blob_hash: _blobHash }),
  _immutableObjectStorageRefillCashier: async (_refillInformation) => ({}),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => {},
  _initializeAccessControl: async () => {},
  assignCallerUserRole: async (_user: Principal, _role: UserRole) => {},
  getCallerUserRole: async () => "user" as UserRole,
  isCallerAdmin: async () => false,

  deleteGalleryEntry: async (_id) => true,

  generateImage: async (prompt: string): Promise<GenerateResult> => ({
    __kind__: "ok",
    ok: {
      id: BigInt(Date.now()),
      createdAt: BigInt(Date.now() * 1_000_000),
      prompt,
      image: "https://picsum.photos/seed/generated/800/600",
    },
  }),

  listGallery: async () => [...sampleEntries],

  generateComicImage: async (prompt: string): Promise<GenerateResult> => ({
    __kind__: "ok",
    ok: {
      id: BigInt(Date.now()),
      createdAt: BigInt(Date.now() * 1_000_000),
      prompt,
      image: "https://picsum.photos/seed/comic/800/600",
    },
  }),

  storePhoto: async (_url: string, prompt: string): Promise<GenerateResult> => ({
    __kind__: "ok",
    ok: {
      id: BigInt(Date.now()),
      createdAt: BigInt(Date.now() * 1_000_000),
      prompt,
      image: _url,
    },
  }),

  transform: async (_input) => ({
    status: BigInt(200),
    body: new Uint8Array(),
    headers: [],
  } as TransformationOutput),
};
