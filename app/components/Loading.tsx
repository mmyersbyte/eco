import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// Paleta do app Eco
const COLORS = ['#4A90E2', '#E24A90', '#9A4AE2', '#DDD'];

export default function Loading({
  size = 38,
  colorIndex = 0,
}: {
  size?: number;
  colorIndex?: number;
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={COLORS[colorIndex % COLORS.length]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
