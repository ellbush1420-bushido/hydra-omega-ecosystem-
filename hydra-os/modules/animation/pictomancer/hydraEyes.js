// hydra-os/modules/animation/pictomancer/hydraEyes.js

export function createHydraEyesAnimationEvent({
  animationId,
  faction,
  gate,
  outcome,
  playerId
}) {
  return {
    type: "PICTOMANCER_ANIMATION",
    timestamp: Date.now(),
    payload: {
      animationId,
      faction,
      gate,
      outcome,
      playerId
    }
  };
}

export function emitHydraEyesAnimationEvent(event, telemetryAdapter) {
  if (!telemetryAdapter || typeof telemetryAdapter.track !== "function") {
    console.warn("Hydra Eyes telemetry adapter unavailable");
    return;
  }

  telemetryAdapter.track(event.type, event.payload);
}
