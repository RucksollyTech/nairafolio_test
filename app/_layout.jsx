import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import GlobalProvider from "../context/GlobalProvider";

import "../global.css";
import AppLayout from '@/components/AppLayout';
import { saveExpoPushToken } from '@/lib/appwrite';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export  async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
      Alert.alert("Error", "Push notifications only work on a real device.");
      return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
  }

  if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Enable push notifications in settings.');
      return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await saveExpoPushToken(token)
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;  // Save this token in your Appwrite database for each user
}

export default function RootLayout() {
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
  
  useEffect(() => {
    const notificationSetter = async()=>{
      await registerForPushNotificationsAsync();
    }
    notificationSetter()
  }, []);

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
