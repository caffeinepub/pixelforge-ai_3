export type ImageId = bigint;

export interface GalleryEntryPublic {
  id: ImageId;
  prompt: string;
  image: string;
  createdAt: bigint;
}

export type GenerateResult =
  | { __kind__: "ok"; ok: GalleryEntryPublic }
  | { __kind__: "err"; err: string };

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
