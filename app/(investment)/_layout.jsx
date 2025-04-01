import { useGlobalContext } from '@/context/GlobalProvider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';



export default function RootLayout() {
  const { darkTheme } = useGlobalContext();

    return (
        <>
            <Stack>
                <Stack.Screen name="(investment)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar backgroundColor={darkTheme === "dark" ? "#1D1E25" : "#EAF6E4"} style={darkTheme === "dark" ? "light" : "dark"}/>
            {/* <StatusBar style={Platform.OS === 'ios' ? "dark" : "auto" }/> */}
        </>
    );
}
