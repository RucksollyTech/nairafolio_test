import { useGlobalContext } from '@/context/GlobalProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Stack, router, usePathname } from 'expo-router';
import { useEffect } from 'react';

const AppLayout = () => {
    const pathname = usePathname();
    const { locked } = useGlobalContext(); // Now this works inside the provider
    const colorScheme = useColorScheme();
    const goToPageA = () => {
        router.push({
            pathname: '/', 
            params: { returnUrl: pathname }, // Pass Page B's URL
        });
    };
    useEffect(() => {
        if (locked) {
            goToPageA()
        }
    }, [locked]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(account)" options={{ headerShown: false }} />
            <Stack.Screen name="(investment)" options={{ headerShown: false }} />
            <Stack.Screen name="(payments)" options={{ headerShown: false }} />
            <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
            <Stack.Screen name="investment/new/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="investment/active/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
};

export default AppLayout;
