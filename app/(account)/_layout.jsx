import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect, Stack, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar"
import { useEffect } from "react";

// import { Loader } from "../../components";
// import { useGlobalContext } from "../../context/GlobalProvider";

const AccountLayout = () => {
  const { darkTheme } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;
    // useEffect(() => {
    //     if(Platform.OS === "android"){
    //         NavigationBar.setPositionAsync("absolute")
    //         NavigationBar.setVisibilityAsync('hidden');
    //     }
    // }, [])
    // useFocusEffect(() => {
    //     let timeout;
    //     if (Platform.OS === 'android') {
    //         NavigationBar.setBehaviorAsync('inset-swipe');
    //         NavigationBar.setVisibilityAsync('visible');

    //         timeout = setTimeout(() => {
    //             NavigationBar.setVisibilityAsync('hidden');
    //         }, 3000);
    //     }

    //     return () => {
    //         if (timeout) clearTimeout(timeout);
    //     };
    // })
  return (
    <>
        <Stack>
            <Stack.Screen
                name="edit-account"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="verify-account"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="verify-with-nin"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="security"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="change-password"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="change-passcode"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="transactions"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="update/[id]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="sales/[id]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="dollar/[id]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>

        {/* <Loader isLoading={loading} /> */}
        <StatusBar backgroundColor={darkTheme === "dark" ? "#1D1E25" : "#EAF6E4"} style={darkTheme === "dark" ? "light" : "dark"}/>

        {/* <StatusBar backgroundColor="#FFFFFF" style={Platform.OS === 'ios' ? "dark" : "light" }/> */}
    </>
  );
};

export default AccountLayout;
