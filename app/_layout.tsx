import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/src/theme';

export default function RootLayout() {
  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" backgroundColor={colors.background} />
      <View style={styles.responsiveContainer}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.textPrimary,
            contentStyle: {
              backgroundColor: colors.background,
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              headerStyle: { backgroundColor: colors.surface },
            }}
          />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#060913',
  },
  responsiveContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1024 : undefined,
    marginHorizontal: Platform.OS === 'web' ? 'auto' : undefined,
    backgroundColor: colors.background,
    // Tablet/Desktop Web border & shadow
    ...(Platform.OS === 'web'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.6,
          shadowRadius: 24,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: colors.border,
        }
      : {}),
  },
});
