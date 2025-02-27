import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';



export default function RootLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="(investment)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style={Platform.OS === 'ios' ? "dark" : "auto" }/>
        </>
    );
}
