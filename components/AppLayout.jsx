import { useGlobalContext } from '@/context/GlobalProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { Stack, router, usePathname } from 'expo-router';
import { useEffect } from 'react';

const AppLayout = () => {
    const pathname = usePathname();
    const { locked } = useGlobalContext(); // Now this works inside the provider
    const colorScheme = useColorScheme();
    const goToPageA = () => {
      
        if(
            router && locked 
            && currentRouteName !== "index"
            && otherScreen !== "sign_in"
            && otherScreen !== "sign_up"
            && currentRouteName !== "/"
        ){
            router.replace({
                pathname: '/', 
                params: { returnUrl: pathname },
            });
        }
    };
    const navigation = useNavigation();
    const currentState = navigation.getState();
    const currentRouteName = currentState.routes[currentState.index]?.params?.returnUrl;
    const otherScreen = currentState.routes[currentState.index]?.params?.screen;
    
    useEffect(() => {
        if (locked) {
            goToPageA()
        }
    }, [locked]);

    useEffect(()=>{
        if(
            router && locked 
            && currentRouteName !== "index"
            && otherScreen !== "sign_in"
            && otherScreen !== "sign_up"
            && currentRouteName !== "/"
        ){
            router.replace("/")
        }
    },[currentRouteName,otherScreen,locked, router])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(notifications)" options={{ headerShown: false }} />
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
