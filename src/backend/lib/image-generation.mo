import Types "../types/image-generation";
import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type State = {
    gallery : Map.Map<Types.UserId, List.List<Types.GalleryEntry>>;
    var nextId : Nat;
  };

  public func newState() : State {
    {
      gallery = Map.empty<Types.UserId, List.List<Types.GalleryEntry>>();
      var nextId = 0;
    };
  };

  /// Add a gallery entry for a user
  public func addEntry(state : State, owner : Types.UserId, entry : Types.GalleryEntry) {
    switch (state.gallery.get(owner)) {
      case (?list) { list.add(entry) };
      case null {
        let list = List.empty<Types.GalleryEntry>();
        list.add(entry);
        state.gallery.add(owner, list);
      };
    };
  };

  /// List all gallery entries for a user, newest first
  public func listEntries(state : State, owner : Types.UserId) : [Types.GalleryEntryPublic] {
    switch (state.gallery.get(owner)) {
      case null { [] };
      case (?list) {
        let reversed = list.reverse();
        reversed.map<Types.GalleryEntry, Types.GalleryEntryPublic>(func(e) { toPublic(e) }).toArray();
      };
    };
  };

  /// Delete a gallery entry; returns the removed entry or null if not found/not owner
  public func deleteEntry(state : State, owner : Types.UserId, id : Types.ImageId) : ?Types.GalleryEntry {
    switch (state.gallery.get(owner)) {
      case null { null };
      case (?list) {
        switch (list.findIndex(func(e : Types.GalleryEntry) : Bool { e.id == id })) {
          case null { null };
          case (?idx) {
            let entry = list.at(idx);
            // Remove by rebuilding without that entry
            let kept = list.filter(func(e : Types.GalleryEntry) : Bool { e.id != id });
            list.clear();
            list.append(kept);
            ?entry;
          };
        };
      };
    };
  };

  /// Convert internal entry to public entry
  public func toPublic(entry : Types.GalleryEntry) : Types.GalleryEntryPublic {
    {
      id = entry.id;
      prompt = entry.prompt;
      image = entry.image;
      createdAt = entry.createdAt;
    };
  };
};
