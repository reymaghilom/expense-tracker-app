import { Suspense, useEffect, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors } from '@/constants/theme';
import { AppSettingsProvider, useAppSettings } from '@/contexts/app-settings';
import { DATABASE_NAME, migrateDbIfNeeded } from '@/db/client';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense fallback={<LoadingFallback />}>
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded} useSuspense>
          <AppSettingsProvider>
            <AppReady>
              <ThemedStatusBar />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="add-expense" options={{ presentation: 'modal' }} />
                <Stack.Screen name="categories/index" />
                <Stack.Screen name="categories/[id]" options={{ presentation: 'modal' }} />
                <Stack.Screen name="backup-restore" />
                <Stack.Screen name="terms" />
                <Stack.Screen name="privacy" />
                <Stack.Screen name="about" />
              </Stack>
            </AppReady>
          </AppSettingsProvider>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}

function ThemedStatusBar() {
  const { colorScheme } = useAppSettings();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

function AppReady({ children }: { children: ReactNode }) {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <>{children}</>;
}

function LoadingFallback() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.background }}>
      <ActivityIndicator color={Colors.light.primary} size="large" />
    </View>
  );
}
