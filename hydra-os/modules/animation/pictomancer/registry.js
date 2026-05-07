// hydra-os/modules/animation/pictomancer/registry.js

const DEFAULT_BASE44_ASSET_ROOT = "/assets";

function resolveBase44Frame(frameRef, options = {}) {
  const assetRoot = options.assetRoot || DEFAULT_BASE44_ASSET_ROOT;
  const cleanRef = frameRef.replace("base44://", "").replace(/^\/+/, "");
  return `${assetRoot}/${cleanRef}.png`;
}

export function resolveFrame(frameRef, options = {}) {
  if (!frameRef || typeof frameRef !== "string") return frameRef;

  if (frameRef.startsWith("base44://")) {
    return resolveBase44Frame(frameRef, options);
  }

  return frameRef;
}

export function resolveFrames(frameRefs = [], options = {}) {
  return frameRefs.map(frameRef => resolveFrame(frameRef, options));
}

const animationRegistry = new Map();

export function registerAnimation(config) {
  if (!config || !config.id) {
    console.warn("Pictomancer: attempted to register animation without an id");
    return;
  }

  animationRegistry.set(config.id, config);
}

export function registerAnimations(configs = []) {
  configs.forEach(registerAnimation);
}

export function getAnimation(id) {
  return animationRegistry.get(id);
}

export function listAnimations() {
  return Array.from(animationRegistry.values());
}

export function clearAnimationRegistry() {
  animationRegistry.clear();
}
