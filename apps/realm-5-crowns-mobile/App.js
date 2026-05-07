import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { initSupabase } from './src/hooks/useHydraEyes';
import { PlayerProvider } from './src/hooks/usePlayer';
import { supabase } from './src/lib/supabase';
import CrownSelectScreen from './src/screens/CrownSelectScreen';
import HomeScreen from './src/screens/HomeScreen';
import CodexScreen from './src/screens/CodexScreen';
import RealmViewerScreen from './src/screens/RealmViewerScreen';

const Tab = createBottomTabNavigator();

if (supabase) {
  initSupabase(supabase);
}

const NAV_THEME = {
  dark: true,
  colors: {
    primary: '#7c3aed',
    background: '#0a0a0f',
    card: '#0d0d14',
    text: '#e5e7eb',
    border: '#1a1a2e',
    notification: '#7c3aed',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0d0d14', borderTopColor: '#1a1a2e' },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#4b5563',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        headerStyle: { backgroundColor: '#0d0d14' },
        headerTintColor: '#e5e7eb',
        headerTitleStyle: { fontWeight: '700', fontSize: 15 },
      }}
    >
      <Tab.Screen
        name="Crown"
        component={CrownSelectScreen}
        options={{
          title: 'Crown',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👑</Text>,
          headerTitle: 'Choose Your Crown',
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏰</Text>,
          headerTitle: 'Shadow Crown',
        }}
      />
      <Tab.Screen
        name="Codex"
        component={CodexScreen}
        options={{
          title: 'Codex',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📜</Text>,
          headerTitle: 'Codex Vault',
        }}
      />
      <Tab.Screen
        name="Realm"
        component={RealmViewerScreen}
        options={{
          title: 'Realm',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🌀</Text>,
          headerTitle: 'Obsidian Gate',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <NavigationContainer theme={NAV_THEME}>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        <MainTabs />
      </NavigationContainer>
    </PlayerProvider>
  );
}
