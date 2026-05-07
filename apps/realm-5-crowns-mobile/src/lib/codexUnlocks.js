import { normalizeCodexKey } from './codex';
import { unlockCodexEntry } from './supabase';

export function unlockCodexIfNeeded({ codexKey, codexUnlocks, dispatch, trackCodexUnlock }) {
  const normalizedKey = normalizeCodexKey(codexKey);
  if (!normalizedKey || codexUnlocks.includes(normalizedKey)) return false;

  dispatch({ type: 'UNLOCK_CODEX', codexId: codexKey });
  trackCodexUnlock(codexKey);
  unlockCodexEntry(codexKey);
  return true;
}
