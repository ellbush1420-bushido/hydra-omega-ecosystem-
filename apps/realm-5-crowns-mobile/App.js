import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { PlayerProvider } from './src/hooks/usePlayer';

import FactionSelectScreen from './src/screens/FactionSelectScreen';
import RealmSelectScreen from './src/screens/RealmSelectScreen';
import TrialSelectScreen from './src/screens/TrialSelectScreen';
import ScenarioScreen from './src/screens/ScenarioScreen';
import CodexScreen from './src/screens/CodexScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
        name="RealmSelect"
        component={RealmSelectScreen}
        options={{ title: '🜁 Realm Gates' }}
      />
      <Stack.Screen
        name="TrialSelect"
        component={TrialSelectScreen}
        options={{ title: '⚔️ Trial Select' }}
      />
      <Stack.Screen
        name="Scenario"
        component={ScenarioScreen}
        options={({ route }) => ({ title: route.params?.scenario?.title || 'Scenario' })}
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
        component={CodexScreen}
        options={{
          title: 'Codex',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📜</Text>,
          headerTitle: 'Codex Vault',
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
  return (
    <PlayerProvider>
      <NavigationContainer theme={NAV_THEME}>
        <StatusBar style="light" backgroundColor="#0a0a0f" />
        <MainTabs />
      </NavigationContainer>
    </PlayerProvider>
  );
}
