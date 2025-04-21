import { getData, useGlobalContext } from '@/context/GlobalProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { Stack, router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';

const AppLayout = () => {
    const pathname = usePathname();
    const { locked, isLogged, loading, setDarkTheme,darkTheme} = useGlobalContext(); // Now this works inside the provider
    const colorScheme = useColorScheme();
    
    const goToPageA = () => {
      
        // if(
        //     router && locked 
        //     && currentRouteName !== "index"
        //     && otherScreen !== "sign_in"
        //     && otherScreen !== "sign_up"
        //     && currentRouteName !== "/"
        // ){
        if(
            router && locked 
            && !pathname.startsWith("/index")
            && !pathname.startsWith("index")
            && !pathname.startsWith("/sign_in")
            && !pathname.startsWith("/sign_up")
            && !pathname.startsWith("/")
        ){
            router.replace({
                pathname: '/', 
                params: { returnUrl: pathname },
            });
        }
    };
    const navigation = useNavigation();
    const currentState = navigation.getState();
    // const currentRouteName = currentState?.routes[currentState.index]?.params?.returnUrl;
    // const otherScreen = currentState?.routes[currentState.index]?.params?.screen;
    
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

    
    useEffect(() => {
        const defScreen = async()=>{
            const screenCol= await getData("NairafolioColorScheme")
            const isDefault= await getData("defaultColorScheme")
            if(!screenCol || isDefault){
                setDarkTheme(colorScheme);
            }
        }
        defScreen()

    }, [colorScheme]);
    useEffect(() => {
        if (locked) {
            goToPageA()
        }
    }, [locked]);

    useEffect(()=>{
        if(
            router && locked 
            // && currentRouteName !== "index"
            // && otherScreen !== "sign_in"
            // && otherScreen !== "sign_up"
            // && currentRouteName !== "/"
            && !pathname.startsWith("/index")
            && !pathname.startsWith("index")
            && !pathname.startsWith("/sign_in")
            && !pathname.startsWith("/sign_up")
            && !pathname.startsWith("/")
        ){
            router.replace("/")
        }
    },[pathname,locked, router])
// },[currentRouteName,otherScreen,locked, router])
    useEffect(()=>{
        if(
            router && !loading && !isLogged 
            && pathname !== "index"
            && pathname !== "/index"
            && pathname !== "/sign_in"
            && pathname !== "/sign_up"
            && pathname !== "/"
        ){
            router.replace("/sign_in")
        }
    },[pathname,loading,isLogged, router])
// },[currentRouteName,otherScreen,loading,isLogged, router])
    
    return (
        <ThemeProvider value={darkTheme === 'dark' ? DarkTheme : DefaultTheme}>
            {Platform.OS === 'ios' && (
                <View className='relative'>
                    <View className='absolute top-0 z-10 left-0 right-0' style={{ height: 44, backgroundColor: darkTheme === 'dark' ? "#1D1E25" : '#EAF6E4' }} />
                </View>
            )}
            {/* <View className={darkTheme === 'dark' ? "dark" : ""}> */}
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
                        <Stack.Screen name="investment/user_offer/[id]" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                </Stack>
            {/* </View> */}
            <StatusBar backgroundColor={darkTheme === "dark" ? "#1D1E25" : "#FFFFFF"} style={darkTheme === "dark" ? "light" : "dark"}/>

        </ThemeProvider>
    );
};

export default AppLayout;
