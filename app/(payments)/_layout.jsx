import { useGlobalContext } from "@/context/GlobalProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";


const PaymentLayout = () => {
    const { darkTheme } = useGlobalContext();
  return (
    <>
        <Stack>
            <Stack.Screen
                name="pay-investment/[id]"
                options={{
                    headerShown: false,
                }}
            />
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
                name="pay-with-card"
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
