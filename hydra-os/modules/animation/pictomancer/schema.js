// hydra-os/modules/animation/pictomancer/schema.js

export const PictomancerSchema = {
  type: "object",
  required: ["id", "animation", "frames", "duration"],
  properties: {
    id: { type: "string" },
    animation: {
      type: "string",
      enum: [
        "sequence",
        "veil-transition",
        "transformation-sequence",
        "mask-cycle",
        "face-swap"
      ]
    },
    frames: {
      type: "array",
      items: { type: "string" }
    },
    duration: { type: "number", minimum: 1 },
    loop: { type: "boolean" },
    bind: {
      type: "object",
      properties: {
        matrix: { type: "string" },
        ritual: { type: "string" },
        identityState: { type: "string" }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};
