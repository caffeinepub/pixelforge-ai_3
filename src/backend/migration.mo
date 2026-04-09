import NewTypes "./types/image-generation";
import ImageLib "./lib/image-generation";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  // ── Old types (from previous version where image was Blob / Storage.ExternalBlob) ──
  type OldImageId = Nat;
  type OldUserId = Principal;

  type OldGalleryEntry = {
    id : OldImageId;
    owner : OldUserId;
    prompt : Text;
    image : Blob;
    createdAt : Int;
  };

  // ── Actor-level state shapes ──────────────────────────────────────────────
  type OldState = {
    gallery : Map.Map<OldUserId, List.List<OldGalleryEntry>>;
    var nextId : Nat;
  };

  type OldActor = {
    imageState : OldState;
  };

  type NewActor = {
    imageState : ImageLib.State;
  };

  // ── Migration function ────────────────────────────────────────────────────
  public func run(old : OldActor) : NewActor {
    let newGallery = old.imageState.gallery.map<OldUserId, List.List<OldGalleryEntry>, List.List<NewTypes.GalleryEntry>>(
      func(_owner, oldList) {
        oldList.map<OldGalleryEntry, NewTypes.GalleryEntry>(func(e) {
          let imageText = switch (e.image.decodeUtf8()) {
            case (?t) { t };
            case null { "" }; // Blob was always a UTF-8 URL string
          };
          {
            id = e.id;
            owner = e.owner;
            prompt = e.prompt;
            image = imageText;
            createdAt = e.createdAt;
          };
        });
      }
    );
    {
      imageState = {
        gallery = newGallery;
        var nextId = old.imageState.nextId;
      };
    };
  };
};
