// hydra-os/modules/animation/pictomancer/warpVisualizer.js

export function buildWarpVisualizerState({
  gate,
  hall,
  animation,
  faction,
  sovereignty = 0,
  systemEfficiency = 0,
  threatVelocity = 0
}) {
  return {
    gate,
    hall,
    animation,
    faction,
    telemetry: {
      sovereignty,
      systemEfficiency,
      threatVelocity
    },
    visualState: resolveVisualState({
      sovereignty,
      systemEfficiency,
      threatVelocity
    })
  };
}

function resolveVisualState({
  sovereignty,
  systemEfficiency,
  threatVelocity
}) {
  if (threatVelocity > 0.8) {
    return "IRON_WIND_REDIRECT";
  }

  if (systemEfficiency > 0.7) {
    return "STABLE_ALIGNMENT";
  }

  if (sovereignty > 0.85) {
    return "CROWN_ASCENDANT";
  }

  return "TRANSITIONAL_FLOW";
}
