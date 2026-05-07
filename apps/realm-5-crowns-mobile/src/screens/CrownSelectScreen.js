import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { crowns } from '../data/crowns';
import { useHydraEyes } from '../hooks/useHydraEyes';
import { usePlayer } from '../hooks/usePlayer';

export default function CrownSelectScreen({ navigation }) {
  const { dispatch } = usePlayer();
  const { trackClick, trackFactionSelect } = useHydraEyes();

  const handleSelect = (crown) => {
    trackClick('crown_card', crown.name);
    trackFactionSelect(crown.id);
    dispatch({ type: 'SET_FACTION', faction: crown });
    dispatch({ type: 'ADD_XP', amount: 25 });
    dispatch({
      type: 'LOG_SCENARIO',
      entry: { type: 'crown_select', crownId: crown.id, crownName: crown.name },
    });
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Crown</Text>
      <FlatList
        data={crowns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleSelect(item)}
            style={[styles.card, { borderLeftColor: item.color }]}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 32,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    marginBottom: 20,
    fontWeight: '700',
  },
  card: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#111',
    borderLeftWidth: 6,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  cardDescription: {
    color: '#aaa',
    marginTop: 5,
    lineHeight: 20,
  },
});
