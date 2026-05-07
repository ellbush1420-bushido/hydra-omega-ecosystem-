export function normalizeCodexKey(codexKey) {
  if (!codexKey) return '';
  return codexKey.toLowerCase().replace(/[.\s]+/g, '_');
}

export function formatStatLabel(stat) {
  if (!stat) return '';
  return stat[0].toUpperCase() + stat.slice(1);
}
