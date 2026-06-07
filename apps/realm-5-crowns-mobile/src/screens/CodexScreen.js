import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';

const CODEX_CATALOG = [
  { id: 'serpent_cipher_vol_i', title: 'Serpent Cipher Vol. I', faction: 'SERPENT', emoji: '🐍', tier: '$9' },
  { id: 'crimson_codex_vol_i', title: 'Crimson Codex Vol. I', faction: 'SCARLET', emoji: '🔴', tier: '$9' },
  { id: 'ophiuchus_prophecy_scroll_i', title: 'Ophiuchus Prophecy Scroll I', faction: 'WEB', emoji: '🌀', tier: '$9' },
  { id: 'black_sun_ledger_vol_i', title: 'Black Sun Ledger Vol. I', faction: 'SUN', emoji: '☀️', tier: '$9' },
  { id: 'lazarus_codex_vol_i', title: 'Lazarus Codex Vol. I', faction: 'LAZARUS', emoji: '⚔️', tier: '$9' },
  { id: 'cipher_vol_ii', title: 'Cipher Codex Vol. II', faction: 'ALL', emoji: '📜', tier: '$27' },
  { id: 'merchant_scroll_i', title: 'Merchant Quarter Scroll I', faction: 'ALL', emoji: '📜', tier: '$27' },
  { id: 'vault_fragment_i', title: 'Vault Fragment I', faction: 'ALL', emoji: '🔑', tier: '$27' },
  { id: 'vault_membership', title: 'Codex Vault Membership', faction: 'ALL', emoji: '🏛️', tier: '$47/mo' },
];

export default function CodexScreen({ navigation }) {
  const { state } = usePlayer();
  const { trackClick, trackSale, trackCodexUnlock } = useHydraEyes();
  const { codexUnlocks } = state;

  // Normalize unlocked IDs (lowercase, spaces→underscore)
  const normalizedUnlocks = new Set(
    codexUnlocks.map((id) => id.toLowerCase().replace(/\s/g, '_').replace(/\./g, ''))
  );

  const isUnlocked = (id) => {
    return normalizedUnlocks.has(id) ||
      normalizedUnlocks.has(id.replace(/_/g, ' '));
  };

  const handleMockPurchase = (codex) => {
    trackClick('codex_purchase', codex.id);
    const amount = parseFloat(codex.tier.replace(/\$/g, '').replace(/\/mo/g, ''));
    trackSale(codex.title, amount);
    trackCodexUnlock(codex.id);
  };

  const unlocked = CODEX_CATALOG.filter((c) => isUnlocked(c.id));
  const locked = CODEX_CATALOG.filter((c) => !isUnlocked(c.id));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — COMMERCE EYE</Text>
        <Text style={styles.title}>Codex Vault</Text>
        <Text style={styles.subtitle}>
          Unlock faction codices through arena trials or the product ladder.
        </Text>

        {unlocked.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>✅ Unlocked ({unlocked.length})</Text>
            {unlocked.map((c) => (
              <View key={c.id} style={[styles.card, styles.cardUnlocked]}>
                <Text style={styles.cardEmoji}>{c.emoji}</Text>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{c.title}</Text>
                  <Text style={styles.cardFaction}>{c.faction} · {c.tier}</Text>
                </View>
                <Text style={styles.unlockedBadge}>✓</Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.sectionLabel}>🔒 Locked ({locked.length})</Text>
        {locked.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handleMockPurchase(c)}
          >
            <Text style={[styles.cardEmoji, styles.lockedEmoji]}>{c.emoji}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardFaction}>{c.faction} · {c.tier}</Text>
            </View>
            <Text style={styles.mockBuyBtn}>Mock Buy</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.productLadder}>
          <Text style={styles.ladderTitle}>Product Ladder</Text>
          {[
            { tier: '$9', name: 'Shadow Moon Prompt Pack', desc: 'Faction codex entry' },
            { tier: '$27', name: 'Initiate Founders Pack', desc: 'Advanced codex + arena keys' },
            { tier: '$47/mo', name: 'Codex Vault Membership', desc: 'Full vault + all scenarios' },
          ].map((p) => (
            <View key={p.tier} style={styles.ladderRow}>
              <Text style={styles.ladderTier}>{p.tier}</Text>
              <View>
                <Text style={styles.ladderName}>{p.name}</Text>
                <Text style={styles.ladderDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { padding: 16, paddingBottom: 40 },
  eyeLabel: {
    color: '#4b5563',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { color: '#e5e7eb', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 13, marginBottom: 16, lineHeight: 20 },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0d14',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  cardUnlocked: {
    borderColor: '#059669',
    backgroundColor: '#0a1a10',
  },
  cardEmoji: { fontSize: 24 },
  lockedEmoji: { opacity: 0.4 },
  cardBody: { flex: 1 },
  cardTitle: { color: '#e5e7eb', fontSize: 13, fontWeight: '600' },
  cardFaction: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  unlockedBadge: { color: '#059669', fontSize: 18, fontWeight: '700' },
  mockBuyBtn: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#7c3aed',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  productLadder: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 14,
    marginTop: 16,
  },
  ladderTitle: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  ladderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  ladderTier: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '700',
    width: 56,
  },
  ladderName: { color: '#e5e7eb', fontSize: 12, fontWeight: '600' },
  ladderDesc: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  backBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  backBtnText: { color: '#9ca3af', fontSize: 13, fontWeight: '600' },
});
