import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { PlayerProvider } from './src/hooks/usePlayer';
import { initSupabase } from './src/hooks/useHydraEyes';
import { isSupabaseConfigured, supabase } from './src/lib/supabase';

import HomeScreen from './src/screens/HomeScreen';
import FactionSelectScreen from './src/screens/FactionSelectScreen';
import ScenariosHubScreen from './src/screens/ScenariosHubScreen';
import ScenarioScreen from './src/screens/ScenarioScreen';
import CodexScreen from './src/screens/CodexScreen';
import CodexDetailScreen from './src/screens/CodexDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RealmViewerScreen from './src/screens/RealmViewerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

const SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: '#0d0d14' },
  headerTintColor: '#e5e7eb',
  headerTitleStyle: { fontWeight: '700', fontSize: 15 },
};

function ScenariosStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name="ScenariosHub"
        component={ScenariosHubScreen}
        options={{ title: '⚔️ Realm Gate' }}
      />
      <Stack.Screen
        name="Scenario"
        component={ScenarioScreen}
        options={({ route }) => ({ title: route.params?.trialTitle || 'Encounter' })}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: '🜁 Realm Home' }}
      />
      <Stack.Screen
        name="RealmViewer"
        component={RealmViewerScreen}
        options={{ title: '🜁 3D Realm Viewer' }}
      />
    </Stack.Navigator>
  );
}

function CodexStack() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="CodexVault" component={CodexScreen} options={{ title: '📜 Codex Vault' }} />
      <Stack.Screen
        name="CodexDetail"
        component={CodexDetailScreen}
        options={({ route }) => ({ title: route.params?.entry?.title || 'Codex Entry' })}
      />
    </Stack.Navigator>
  );
}

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
        name="Home"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🜁</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="FactionSelect"
        component={FactionSelectScreen}
        options={{
          title: 'Crown',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👑</Text>,
          headerTitle: 'Choose Your Crown',
        }}
      />
      <Tab.Screen
        name="Scenarios"
        component={ScenariosStack}
        options={{
          title: 'Gates',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚔️</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Codex"
        component={CodexStack}
        options={{
          title: 'Codex',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📜</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👁</Text>,
          headerTitle: 'Operative Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    if (isSupabaseConfigured) {
      initSupabase(supabase);
    }
  }, []);

  return (
    <PlayerProvider>
      <NavigationContainer theme={NAV_THEME}>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        <MainTabs />
      </NavigationContainer>
    </PlayerProvider>
  );
}
