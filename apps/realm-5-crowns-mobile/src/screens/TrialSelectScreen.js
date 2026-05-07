import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';

import { trials } from '../data/trials';
import { supabase } from '../lib/supabase';

async function saveTrialSelection(playerId, trialId) {
  if (!supabase) return;

  try {
    await supabase.from('player_state').upsert({
      player_id: playerId,
      trial_id: trialId,
      updated_at: new Date().toISOString(),
    });
  } catch (_err) {
    // Non-fatal when Supabase is unavailable or the table is not configured yet.
  }
}

export default function TrialSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Trial</Text>

        <FlatList
          data={trials}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={async () => {
                await saveTrialSelection('elliott', item.id);
                navigation.navigate('Scenarios');
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
  },
  cardTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  cardDescription: { color: '#aaa', marginTop: 5, lineHeight: 20 },
});
