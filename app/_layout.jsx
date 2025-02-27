import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import GlobalProvider from "../context/GlobalProvider";

import "../global.css";
import AppLayout from '@/components/AppLayout';
import { saveExpoPushToken } from '@/lib/appwrite';
import { router } from 'expo-router';
import { View } from 'react-native';


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
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
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

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  
  // useEffect(() => {
  //   const notificationSetter = async()=>{
  //     await registerForPushNotificationsAsync();
  //   }
  //   notificationSetter()
  // }, []);
  useEffect(() => {
      registerForPushNotificationsAsync()

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification Received:', notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          // console.log('Notification Clicked:', response);
          router.push("/notification")
      });

      return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
      };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
        {Platform.OS === 'ios' && (
            <View className='relative'>
                <View className='absolute top-0 z-10 left-0 right-0' style={{ height: 44, backgroundColor: '#EAF6E4' }} />
            </View>
        )}
        <AppLayout />
        <StatusBar style="auto" />
    </GlobalProvider>
  );
}
