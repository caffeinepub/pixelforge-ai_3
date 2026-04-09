import Types "../types/image-generation";
import ImageLib "../lib/image-generation";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

mixin (state : ImageLib.State) {

  /// Transform callback required by the IC HTTP outcalls mechanism (used for any future outcalls)
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  /// Generate an image from a text prompt and add to the caller's gallery.
  /// Uses Pollinations.ai — the image URL is constructed deterministically from the prompt.
  /// The URL is stored as plain Text so the frontend can use it directly as an img src.
  public shared ({ caller }) func generateImage(prompt : Text) : async Types.GenerateResult {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };

    // Encode the prompt for use in a URL (replace spaces with +)
    let encodedPrompt = prompt.replace(#text " ", "+");
    let seed = state.nextId;
    let imageUrl = "https://image.pollinations.ai/prompt/" # encodedPrompt
      # "?nologo=true&width=768&height=768&seed=" # seed.toText();

    let id = state.nextId;
    state.nextId += 1;

    let entry : Types.GalleryEntry = {
      id;
      owner = caller;
      prompt;
      image = imageUrl;
      createdAt = Time.now();
    };

    ImageLib.addEntry(state, caller, entry);

    #ok(ImageLib.toPublic(entry));
  };

  /// List all gallery entries for the calling user
  public shared query ({ caller }) func listGallery() : async [Types.GalleryEntryPublic] {
    if (caller.isAnonymous()) {
      return [];
    };
    ImageLib.listEntries(state, caller);
  };

  /// Delete a gallery entry by ID (caller must be the owner)
  public shared ({ caller }) func deleteGalleryEntry(id : Types.ImageId) : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    switch (ImageLib.deleteEntry(state, caller, id)) {
      case null { false };
      case (?_) { true };
    };
  };

  /// Generate a comic-style image by automatically enhancing the prompt with professional
  /// comic art style descriptors. No questions asked — professional defaults applied.
  public shared ({ caller }) func generateComicImage(prompt : Text) : async Types.GenerateResult {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };

    let enhancedPrompt = prompt # ", professional comic book art, bold ink outlines, vibrant colors, cel shading, manga/comic illustration style, dynamic composition, studio quality";
    let encodedPrompt = enhancedPrompt.replace(#text " ", "+");
    let seed = state.nextId;
    let imageUrl = "https://image.pollinations.ai/prompt/" # encodedPrompt
      # "?nologo=true&width=768&height=768&seed=" # seed.toText() # "&model=turbo";

    let id = state.nextId;
    state.nextId += 1;

    let entry : Types.GalleryEntry = {
      id;
      owner = caller;
      prompt;
      image = imageUrl;
      createdAt = Time.now();
    };

    ImageLib.addEntry(state, caller, entry);
    #ok(ImageLib.toPublic(entry));
  };

  /// Store a photo URL (e.g. uploaded from device gallery) as a gallery entry.
  /// The caller provides the URL and an optional prompt/label for the image.
  public shared ({ caller }) func storePhoto(url : Text, prompt : Text) : async Types.GenerateResult {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };

    let id = state.nextId;
    state.nextId += 1;

    let entry : Types.GalleryEntry = {
      id;
      owner = caller;
      prompt;
      image = url;
      createdAt = Time.now();
    };

    ImageLib.addEntry(state, caller, entry);
    #ok(ImageLib.toPublic(entry));
  };
};
