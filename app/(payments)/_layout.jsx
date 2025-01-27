import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const PaymentLayout = () => {

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
        <StatusBar style="auto" />
    </>
  );
};

export default PaymentLayout;
