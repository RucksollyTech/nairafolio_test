import { useFonts } from 'expo-font';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import GlobalProvider from "../context/GlobalProvider";

import "../global.css";
import AppLayout from '@/components/AppLayout';
import { router } from 'expo-router';
import Constants from 'expo-constants';

SplashScreen.preventAutoHideAsync();
export  async function registerForPushNotificationsAsync() {
    let token
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            // alert('Permission to send notification not granted!');
            return;
        }
        // const projectId =
        //     Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        try {
            if (projectId) {
                token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

            } else {
                token = (await Notifications.getExpoPushTokenAsync()).data;
            }
        } catch (error) {
            console.log('Error getting Expo push token:', error);
            return null;
        }
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }
    return token;  
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

  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  
    useEffect(() => {
        const callForNotifications = async ()=>{
            const toks = await registerForPushNotificationsAsync();
            setExpoPushToken(toks)
        }
        callForNotifications()
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // console.log('Notification Clicked:', response);
            router.push("/notification")
        });

        return () => {
            // Delete the device notification from here
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
        {/* {Platform.OS === 'ios' && (
            <View className='relative'>
                <View className='absolute top-0 z-10 left-0 right-0' style={{ height: 44, backgroundColor: '#EAF6E4' }} />
            </View>
        )} */}
        <AppLayout />
        {/* <StatusBar style={Platform.OS === 'ios' ? "dark" : "auto" }/> */}
    </GlobalProvider>
  );
}
