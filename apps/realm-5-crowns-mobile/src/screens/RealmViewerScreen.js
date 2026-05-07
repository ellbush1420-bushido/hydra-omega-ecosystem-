import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RealmViewerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>3D Realm Viewer Loading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 18,
  },
});
