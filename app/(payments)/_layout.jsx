import { useGlobalContext } from "@/context/GlobalProvider";
import { useFocusEffect } from "expo-router";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar"


const PaymentLayout = () => {
    const { darkTheme } = useGlobalContext();
    useEffect(() => {
        if(Platform.OS === "android"){
            NavigationBar.setVisibilityAsync('hidden');
        }
    }, [])
    useFocusEffect(() => {
        let timeout;
        if (Platform.OS === 'android') {
            NavigationBar.setBehaviorAsync('inset-swipe');
            NavigationBar.setVisibilityAsync('visible');

            timeout = setTimeout(() => {
                NavigationBar.setVisibilityAsync('hidden');
            }, 3000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    })
  return (
    <>
        <Stack>
            <Stack.Screen
                name="wallet"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="pay-with/[mode]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="payment-success/[action]"
                options={{
                    headerShown: false,
                }}
            />
            
            <Stack.Screen
                name="withdrawal"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>

        {/* <Loader isLoading={loading} /> */}
        <StatusBar backgroundColor={darkTheme === "dark" ? "#1D1E25" : "#EAF6E4"} style={darkTheme === "dark" ? "light" : "dark"}/>
        {/* <StatusBar style={Platform.OS === 'ios' ? "dark" : "auto" }/> */}
    </>
  );
};

export default PaymentLayout;
