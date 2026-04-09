module {
  public type ImageId = Nat;
  public type UserId = Principal;

  /// Internal record stored in the gallery
  public type GalleryEntry = {
    id : ImageId;
    owner : UserId;
    prompt : Text;
    image : Text;
    createdAt : Int;
  };

  /// Public-facing record returned to the frontend (shared-safe)
  public type GalleryEntryPublic = {
    id : ImageId;
    prompt : Text;
    image : Text;
    createdAt : Int;
  };

  /// Result of a generate call
  public type GenerateResult = {
    #ok : GalleryEntryPublic;
    #err : Text;
  };
};
