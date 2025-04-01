import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

// import { useGlobalContext } from "../../context/GlobalProvider";

const NotificationLayout = () => {
  const { darkTheme } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;

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
