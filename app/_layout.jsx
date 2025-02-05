import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import GlobalProvider from "../context/GlobalProvider";
import { useColorScheme } from '@/hooks/useColorScheme';

import "../global.css";
import AppLayout from '@/components/AppLayout';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "SpaceMono": require('../assets/fonts/SpaceMono-Regular.ttf'),
    "GeneralSans-Variable": require('../assets/fonts/GeneralSans-Variable.ttf'),
    "GeneralSans-VariableItalic": require('../assets/fonts/GeneralSans-VariableItalic.ttf'),
    "GeneralSans-Regular": require('../assets/fonts/GeneralSans-Regular.otf'),
    "GeneralSans-Semibold": require('../assets/fonts/GeneralSans-Semibold.otf'),
    "GeneralSans-Medium": require('../assets/fonts/GeneralSans-Medium.otf'),
    "GeneralSans-Light": require('../assets/fonts/GeneralSans-Light.otf'),
    "Inter": require('../assets/fonts/Inter.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
        <AppLayout />
        <StatusBar style="auto" />
    </GlobalProvider>
  );
}
