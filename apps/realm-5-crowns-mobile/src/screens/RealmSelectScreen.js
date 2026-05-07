import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';

import { realms } from '../data/realms';
import { supabase } from '../lib/supabase';

async function saveRealmSelection(playerId, realmId) {
  if (!supabase) return;

  try {
    await supabase.from('player_state').upsert({
      player_id: playerId,
      realm_id: realmId,
      updated_at: new Date().toISOString(),
    });
  } catch (_err) {
    // Non-fatal when Supabase is unavailable or the table is not configured yet.
  }
}

export default function RealmSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Realm</Text>

        <FlatList
          data={realms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { borderLeftColor: item.color }]}
              onPress={async () => {
                await saveRealmSelection('elliott', item.id);
                navigation.navigate('RealmViewer', { realm: item });
              }}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, padding: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 },
  card: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#111',
    borderLeftWidth: 6,
  },
  cardTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  cardDescription: { color: '#aaa', marginTop: 5, lineHeight: 20 },
});
