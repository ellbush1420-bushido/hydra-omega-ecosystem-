import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DEFAULT_CROWN } from '../data/crowns';
import { usePlayer } from '../hooks/usePlayer';

export default function HomeScreen() {
  const { state } = usePlayer();
  const selectedCrown = state.faction || DEFAULT_CROWN;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedCrown.name}</Text>
      <Text style={styles.subtitle}>Realm: {selectedCrown.realm}</Text>
      <Text style={styles.subtitle}>Trial: {selectedCrown.trial}</Text>
      <Text style={styles.description}>{selectedCrown.description}</Text>
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
