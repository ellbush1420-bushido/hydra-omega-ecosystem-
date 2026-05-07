import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { crowns } from '../data/crowns';
import { usePlayer } from '../hooks/usePlayer';

export default function HomeScreen({ route }) {
  const { state } = usePlayer();
  const defaultCrown = crowns.length > 0 ? crowns[0] : null;
  const selectedCrown = state.faction || route.params?.crown || defaultCrown;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedCrown?.name || 'Shadow Crown'}</Text>
      <Text style={styles.subtitle}>Realm: Obsidian Gate</Text>
      <Text style={styles.subtitle}>Trial: Steel</Text>
      <Text style={styles.description}>{selectedCrown?.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#aaa',
    marginTop: 10,
    fontSize: 16,
  },
  description: {
    color: '#777',
    marginTop: 18,
    lineHeight: 22,
  },
});
