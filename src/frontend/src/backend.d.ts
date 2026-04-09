import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ImageId = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type GenerateResult = {
    __kind__: "ok";
    ok: GalleryEntryPublic;
} | {
    __kind__: "err";
    err: string;
};
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface GalleryEntryPublic {
    id: ImageId;
    createdAt: bigint;
    prompt: string;
    image: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGalleryEntry(id: ImageId): Promise<boolean>;
    generateComicImage(prompt: string): Promise<GenerateResult>;
    generateImage(prompt: string): Promise<GenerateResult>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    listGallery(): Promise<Array<GalleryEntryPublic>>;
    storePhoto(url: string, prompt: string): Promise<GenerateResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
