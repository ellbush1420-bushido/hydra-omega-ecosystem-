import { getPlayerStateDeviceId, supabase } from './supabase';

async function loadPlayerStateBy(column, value) {
  const { data, error } = await supabase.from('player_state').select('*').eq(column, value).maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function loadFullPlayerState(playerId) {
  if (!supabase) {
    return null;
  }

  const lookups = [];

  if (playerId) {
    lookups.push(['player_id', playerId], ['device_id', playerId]);
  } else {
    lookups.push(['device_id', await getPlayerStateDeviceId()]);
  }

  let lastError = null;

  for (const [column, value] of lookups) {
    try {
      const data = await loadPlayerStateBy(column, value);
      if (data) {
        return data;
      }
    } catch (error) {
      lastError = error;

      if (column === 'player_id') {
        continue;
      }
    }
  }

  if (lastError) {
    console.log('Error loading full player state:', lastError);
  }

  return null;
}
