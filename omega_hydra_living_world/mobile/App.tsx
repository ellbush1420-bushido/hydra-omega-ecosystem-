import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Faction = {
  id: string;
  name: string;
  crown: string;
  style: string;
  power: number;
  influence: number;
  loyalty: number;
  zone: string;
};

type WorldState = {
  world: string;
  mode: string;
  generated_at: string;
  active_event: {
    faction: string;
    zone: string;
    event: string;
    lore: string;
  };
  arena: {
    name: string;
    status: string;
    matrix: string;
  };
  factions: Faction[];
};

const MOCK_WORLD: WorldState = {
  world: 'Omega Hydra v3 Living World OS',
  mode: "Bird's-Eye Mobile Command View",
  generated_at: new Date().toISOString(),
  active_event: {
    faction: 'Shadow Monastery',
    zone: 'North Gate',
    event: 'Shadow Arena duel declared',
    lore: 'Violet bells sound beneath the Ninth Gate as the factions gather for judgment.',
  },
  arena: {
    name: 'Shadow Arena',
    status: 'active',
    matrix: '9x9x9',
  },
  factions: [
    { id: 'shadow_monastery', name: 'Shadow Monastery', crown: 'Crown of Shadow', style: 'obsidian, violet, sacred geometry', power: 86, influence: 78, loyalty: 91, zone: 'North Gate' },
    { id: 'spider_seminary', name: 'Spider Seminary', crown: 'Crown of Web', style: 'black silk, silver, neon white', power: 82, influence: 88, loyalty: 76, zone: 'Web Cathedral' },
    { id: 'crown_order', name: 'Crown Order Universe', crown: 'Crown of Dominion', style: 'gold, white, crimson', power: 90, influence: 84, loyalty: 80, zone: 'Central Throne' },
    { id: 'ophiuchus', name: 'Cult of Ophiuchus', crown: 'Crown of Serpents', style: 'green, silver, neon yellow', power: 79, influence: 85, loyalty: 69, zone: 'Serpent Gate' },
    { id: 'asclepius', name: 'Knights of Asclepius', crown: 'Crown of Healing', style: 'black, green, hospitalar gold', power: 74, influence: 72, loyalty: 93, zone: 'Sanctuary Ward' },
    { id: 'black_sun', name: 'Order of the Black Sun', crown: 'Crown of Judgment', style: 'black, gold, eclipse', power: 88, influence: 70, loyalty: 87, zone: 'Eclipse Court' },
    { id: 'velvet_python', name: 'Velvet Python Agency', crown: 'Crown of Conversion', style: 'velvet purple, black, gold', power: 71, influence: 96, loyalty: 73, zone: 'Market Coil' },
    { id: 'wuxia_hydra', name: 'Wuxia Hydra Houses', crown: 'Crown of Flow', style: 'jade, black, mist', power: 84, influence: 67, loyalty: 86, zone: 'Mist Pavilion' },
    { id: 'hydra_labyrinth', name: 'Hydra Labyrinth', crown: 'Crown of Trials', style: 'blue-black grid lines', power: 77, influence: 81, loyalty: 82, zone: 'Ninefold Maze' },
  ],
};

const API_URL = 'http://127.0.0.1:5050/api/world';

export default function App() {
  const [world, setWorld] = useState<WorldState>(MOCK_WORLD);
  const [status, setStatus] = useState('Offline demo mode ready');

  async function loadWorld() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setWorld(data);
      setStatus('Live Hydra API connected');
    } catch (error) {
      setWorld({ ...MOCK_WORLD, generated_at: new Date().toISOString() });
      setStatus('Demo mode: API not reachable from iPhone yet');
    }
  }

  useEffect(() => {
    loadWorld();
    const timer = setInterval(loadWorld, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Omega Hydra v3</Text>
          <Text style={styles.title}>Bird's-Eye Living World</Text>
          <Text style={styles.subtitle}>{world.mode}</Text>
          <TouchableOpacity style={styles.button} onPress={loadWorld}>
            <Text style={styles.buttonText}>Refresh World Pulse</Text>
          </TouchableOpacity>
          <Text style={styles.status}>{status}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Active Lore Event</Text>
          <Text style={styles.event}>{world.active_event.event}</Text>
          <Text style={styles.body}>{world.active_event.lore}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.panel, styles.half]}>
            <Text style={styles.panelTitle}>Shadow Arena</Text>
            <Text style={styles.body}>{world.arena.name}</Text>
            <Text style={styles.gold}>{world.arena.status.toUpperCase()} · {world.arena.matrix}</Text>
          </View>
          <View style={[styles.panel, styles.half]}>
            <Text style={styles.panelTitle}>Hydra Eyes</Text>
            <Text style={styles.body}>Tracking faction pressure, loyalty, influence, and world pulse.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Faction Map</Text>
        {world.factions.map((faction) => (
          <View key={faction.id} style={styles.card}>
            <Text style={styles.cardTitle}>{faction.name}</Text>
            <Text style={styles.zone}>{faction.zone}</Text>
            <Text style={styles.gold}>{faction.crown}</Text>
            <Text style={styles.body}>{faction.style}</Text>
            <Meter label="Power" value={faction.power} />
            <Meter label="Influence" value={faction.influence} />
            <Meter label="Loyalty" value={faction.loyalty} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.meterWrap}>
      <Text style={styles.meterLabel}>{label}: {value}</Text>
      <View style={styles.meterBg}>
        <View style={[styles.meterFill, { width: `${value}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07050b' },
  container: { padding: 18, paddingBottom: 42 },
  hero: { borderWidth: 1, borderColor: 'rgba(214,170,75,0.35)', borderRadius: 28, padding: 24, backgroundColor: '#151020', marginBottom: 18 },
  eyebrow: { color: '#d6aa4b', letterSpacing: 3, textTransform: 'uppercase', fontSize: 12, marginBottom: 8 },
  title: { color: '#f4ecff', fontSize: 36, fontWeight: '900', lineHeight: 40 },
  subtitle: { color: '#b8a9c9', marginTop: 10, fontSize: 15 },
  button: { backgroundColor: '#d6aa4b', borderRadius: 999, paddingVertical: 13, paddingHorizontal: 18, marginTop: 18, alignSelf: 'flex-start' },
  buttonText: { color: '#120d08', fontWeight: '900' },
  status: { color: '#8d5cff', marginTop: 12, fontWeight: '700' },
  panel: { borderWidth: 1, borderColor: 'rgba(214,170,75,0.28)', borderRadius: 22, padding: 18, backgroundColor: '#151020', marginBottom: 14 },
  panelTitle: { color: '#d6aa4b', fontSize: 18, fontWeight: '900', marginBottom: 8 },
  event: { color: '#f4ecff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  body: { color: '#cfc1dc', lineHeight: 21 },
  gold: { color: '#d6aa4b', fontWeight: '800', marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  sectionTitle: { color: '#f4ecff', fontSize: 24, fontWeight: '900', marginVertical: 12 },
  card: { borderWidth: 1, borderColor: 'rgba(141,92,255,0.35)', borderRadius: 22, padding: 18, backgroundColor: '#120d1d', marginBottom: 14 },
  cardTitle: { color: '#f4ecff', fontSize: 22, fontWeight: '900' },
  zone: { color: '#b8a9c9', marginTop: 3, marginBottom: 6 },
  meterWrap: { marginTop: 12 },
  meterLabel: { color: '#f4ecff', marginBottom: 6, fontWeight: '700' },
  meterBg: { height: 9, borderRadius: 99, backgroundColor: '#2d2438', overflow: 'hidden' },
  meterFill: { height: '100%', backgroundColor: '#8d5cff' },
});
