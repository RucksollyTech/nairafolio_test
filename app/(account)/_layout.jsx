import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

// import { Loader } from "../../components";
// import { useGlobalContext } from "../../context/GlobalProvider";

const AccountLayout = () => {
//   const { loading, isLogged } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;

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
        <StatusBar backgroundColor="#FFFFFF" style={Platform.OS === 'ios' ? "dark" : "light" }/>
    </>
  );
};

export default AccountLayout;
