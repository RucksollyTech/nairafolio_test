import { View, Text, ImageBackground, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import { CustomButton, FormField } from '@/components'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getCurrentUser, saveExpoPushToken, signIn, signOut } from '@/lib/appwrite'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from '../_layout'
import { myClassConverter } from '@/lib/performActions'

const sign_in = () => {
    const { setUser, setIsLogged, setLastActive,setLocked, darkTheme } = useGlobalContext();
    const [errorMessage, setErrorMessage] = useState("");

    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        setErrorMessage("")
        if (form.email === "" || form.password === "") {
            return
        }
    
        setSubmitting(true);
        try {
            await signIn(form.email, form.password);
            const result = await getCurrentUser();
            setUser(result);
            setIsLogged(true);
            await AsyncStorage.setItem('isSignedUp', JSON.stringify(true));
            setLocked(false);
            try {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    await saveExpoPushToken(token);
                }
            } catch (error) {
                // throw new Error("Could not get devTo");
            }
        
            router.replace("/home");
        } catch (error) {
            setErrorMessage("Invalid credentials");
        } finally {
            setSubmitting(false);
        }
    };
    const handleNotificationSetup = async()=>{
        try {
            await registerForPushNotificationsAsync()
        } catch (error) {
        }
    }
    useEffect(()=>{
        const logOutUserControl = async()=>{
            setUser(null)
            setIsLogged(false);
            await signOut()
            // await registerForPushNotificationsAsync()
        }
        logOutUserControl()
        setLocked(false);
        handleNotificationSetup()
    },[])
    return (
        <SafeAreaView
            className={`flex-1 ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <ScrollView
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className='relative h-full'>
                    <ImageBackground
                        source={images.regular_bg}
                        resizeMode='cover'
                        className='w-full min-h-[25vh] relative'
                    >
                        <View className='pt-3 pl-2'>
                            <Link href={"/"}>
                                <Image 
                                    source={icons.left_arrow}
                                    resizeMode='contain'
                                    tintColor={darkTheme=== "dark" ? "#FFFFFF" : "#000000"}
                                />
                            </Link>
                        </View>
                        <View className='absolute bottom-12 w-full'>
                            <Image 
                                source={darkTheme === "dark" ? icons.inverted_logo : icons.logo_name_big}
                                resizeMode='contain'
                                className='w-[150px] mx-auto'
                            />
                        </View>
                    </ImageBackground>
                    <View 
                        className='px-5'
                    >
                        <View className='w-full'>
                            <View className='mt-5'>
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `text-center font-psans text-3xl`,
                                    "text-white",
                                    ""
                                )}>Welcome back</Text>
                            </View>
                            <View className='mt-2'>
                                <Text className='
                                    text-lg 
                                    font-pregular
                                    font-semibold 
                                    text-center
                                    text-muted
                                '>
                                    Please enter your details to log in.
                                </Text>
                                <View className='pt-8'>
                                    <FormField 
                                        title="Email"
                                        value={form.email}
                                        keyboardType={"email-address"}
                                        placeholder="Email address"
                                        handleChangeText={(e)=>setForm({...form, email: e})}
                                        darkTheme={darkTheme}
                                    />
                                </View>
                                <View className='pt-4'>
                                    <FormField 
                                        title="Password"
                                        value={form.password}
                                        placeholder="Password"
                                        handleChangeText={(e)=>setForm({...form, password: e})}
                                        darkTheme={darkTheme}
                                    />
                                </View>
                                <View className='mt-1.5'>
                                    <Link
                                        href={"/forgot-password"}
                                    >
                                        <Text 
                                            className={myClassConverter(
                                                darkTheme,
                                                `text-base 
                                                text-right
                                                font-pregular `,
                                                "text-[#00A651]",
                                                "text-primary"
                                            )}
                                        >
                                            Forgot password?
                                        </Text>
                                    </Link>
                                </View>
                            </View>
                        </View>
                    
                        <View className='mt-[100px] w-full'>
                            <View className="items-center justify-center mt-3 mb-2">
                                <Text className="text-red-500 font-pmedium">
                                    {errorMessage}
                                </Text>
                            </View>
                            <View className='mb-6'>
                                <CustomButton 
                                    title="Login"
                                    containerStyles="h-[50px]"
                                    textStyles={darkTheme !== "dark" && "text-white"}
                                    handlePress={submit}
                                    isLoading={isSubmitting}
                                    darkTheme={darkTheme}
                                    loading={form.email === "" || form.password === ""}
                                />
                            </View>
                            <View className='mb-10'>
                                <Text className='text-center text-base font-pregular text-muted'>
                                    Don't have an account yet? {" "} 
                                    <Link 
                                        href={"/sign_up"}
                                        className='text-[#00A651]'
                                    >
                                        Sign up now
                                    </Link>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default sign_in