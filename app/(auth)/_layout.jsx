import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

// import { Loader } from "../../components";
// import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  const { darkTheme } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
        <Stack>
            <Stack.Screen
                name="sign_in"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="sign_up"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="forgot-password"
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

export default AuthLayout;
