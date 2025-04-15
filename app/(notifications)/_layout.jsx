import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect, Stack, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar"

// import { useGlobalContext } from "../../context/GlobalProvider";

const NotificationLayout = () => {
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
                    name="notification"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>

            {/* <Loader isLoading={loading} /> */}
            {/* <StatusBar style={Platform.OS === 'ios' ? "dark" : "auto" }/> */}
            <StatusBar backgroundColor={darkTheme === "dark" ? "#1D1E25" : "#EAF6E4"} style={darkTheme === "dark" ? "light" : "dark"}/>
        </>
    );
};

export default NotificationLayout;
