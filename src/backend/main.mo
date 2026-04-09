import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ImageMixin "mixins/image-generation-api";
import ImageLib "lib/image-generation";

actor {
  // Object storage infrastructure (required by caffeineai-object-storage)
  include MixinObjectStorage();

  // Image generation domain state
  let imageState = ImageLib.newState();

  // Image generation API
  include ImageMixin(imageState);
};
