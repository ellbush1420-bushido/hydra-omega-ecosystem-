// hydra-os/modules/animation/pictomancer/discordSync.js

export function buildDiscordRankAnimationPayload({
  userId,
  rank,
  faction,
  xp,
  animationId
}) {
  return {
    userId,
    rank,
    faction,
    xp,
    animationId,
    timestamp: Date.now()
  };
}

export async function syncDiscordRankAnimation(payload, webhookAdapter) {
  if (!webhookAdapter || typeof webhookAdapter.send !== "function") {
    console.warn("Discord webhook adapter unavailable");
    return false;
  }

  await webhookAdapter.send(payload);
  return true;
}
