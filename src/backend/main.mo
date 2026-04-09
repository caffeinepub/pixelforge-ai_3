import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AccessControl "mo:caffeineai-authorization/access-control";
import ImageMixin "mixins/image-generation-api";
import ImageLib "lib/image-generation";

actor {
  // Object storage infrastructure (required by caffeineai-object-storage)
  include MixinObjectStorage();

  // Authorization state (Internet Identity sign-in)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Image generation domain state
  let imageState = ImageLib.newState();

  // Image generation API
  include ImageMixin(imageState);
};
