// hydra-os/modules/animation/pictomancer/aurelianMasks.js

export const AurelianHall5Masks = [
  {
    id: "calm",
    emotionalState: "regulated",
    tacticalState: "observe"
  },
  {
    id: "focused",
    emotionalState: "engaged",
    tacticalState: "precision"
  },
  {
    id: "feral",
    emotionalState: "aggressive",
    tacticalState: "pressure"
  },
  {
    id: "serene",
    emotionalState: "restored",
    tacticalState: "recovery"
  }
];

export function rotateHall5Mask(currentIndex = 0) {
  const nextIndex = (currentIndex + 1) % AurelianHall5Masks.length;

  return {
    index: nextIndex,
    mask: AurelianHall5Masks[nextIndex]
  };
}
