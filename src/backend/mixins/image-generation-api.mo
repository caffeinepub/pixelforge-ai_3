import Types "../types/image-generation";
import ImageLib "../lib/image-generation";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Storage "mo:caffeineai-object-storage/Storage";
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
  /// The URL is stored as a Blob so the frontend can retrieve and display it.
  public shared ({ caller }) func generateImage(prompt : Text) : async Types.GenerateResult {
    if (caller.isAnonymous()) {
      return #err("Authentication required");
    };

    // Encode the prompt for use in a URL (replace spaces with +)
    let encodedPrompt = prompt.replace(#text " ", "+");
    let seed = state.nextId;
    let imageUrl = "https://image.pollinations.ai/prompt/" # encodedPrompt
      # "?nologo=true&width=768&height=768&seed=" # seed.toText();

    // Store the image URL as a UTF-8 blob (ExternalBlob = Blob)
    let imageBlob : Storage.ExternalBlob = imageUrl.encodeUtf8();

    let id = state.nextId;
    state.nextId += 1;

    let entry : Types.GalleryEntry = {
      id;
      owner = caller;
      prompt;
      image = imageBlob;
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
};
