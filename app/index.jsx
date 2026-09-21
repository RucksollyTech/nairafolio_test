// Remove <React.StrictMode>
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images,icons } from "../constants";
import {CustomButton, PinScreenComponent} from "../components"
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from '@/context/GlobalProvider';
import { signOut } from '@/lib/appwrite';
import { myClassConverter } from '@/lib/performActions';


const index = () => {
    const { loading, isLogged, setLocked,setIsLogged,darkTheme, locked, authenticateUser, user, setLastActive } = useGlobalContext();
    const { returnUrl } = useLocalSearchParams();

    if (!loading && isLogged && !locked) return <Redirect href={returnUrl ? returnUrl : "/home"} />;
    if(loading){
        return(
            <SafeAreaView 
                className={`bg-[#014148] flex-1 font-bold h-[100vh]`}
            >
                <View className='h-full items-center justify-center relative'>
                    <Image 
                        source={icons.logo}
                        resizeMode='cover'
                    />
                    <View className='absolute bottom-0 pb-10 items-center justify-center'>
                        <ActivityIndicator 
                            animating={loading}
                            color="#fff"
                            size="large"
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
    const switchClick = async() => {
        // try {
        //     await signOut();
        // } catch (error) {
        // }
        // if(user){
        //     setUser(null);
        //     setIsLogged(false);
        // }
        setLocked(false);

        router.replace('/sign_up');
    }
    if(locked && user){
        return(
            <SafeAreaView className={darkTheme === "dark" ? 'bg-dark_mode flex-1' : 'bg-white flex-1'}>
                <ScrollView
                    onTouchStart={() => setLastActive(Date.now())}
                    onScroll={() => setLastActive(Date.now())}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false} 
                    showsHorizontalScrollIndicator={false}
                >
                    <PinScreenComponent 
                        setLocked={setLocked} 
                        authenticateUser={authenticateUser} 
                        user={user}
                        loading={loading}
                        returnUrl={returnUrl}
                        darkTheme={darkTheme}
                    />
                </ScrollView>
                <View className='py-7 items-center justify-center flex-row gap-5'>
                    <Link href={"/forgot-password"}>
                        <Text className='text-secondary-100 '>
                            Forgot password
                        </Text>
                    </Link>
                    <Text className='text-secondary-100 '>
                        |
                    </Text>
                    <TouchableOpacity
                        onPress={switchClick}
                    >
                        <Text className='text-secondary-100 '>
                            Switch account
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
    return (
        <SafeAreaView 
            className={`bg-white flex-1 font-bold h-[100vh] relative z-10`}>
            <View className='relative w-full flex h-full items-center justify-center'>
                
                    <Image 
                        source={images.onboarding}
                        className="w-[100%] left-0 absolute -top-[300px]"
                        resizeMode="contain"
                        contentPosition="top"
                    />
                <View className='absolute bottom-0 w-full '>
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0)', '#FFFFFF']} // Start and end colors
                        locations={[0, 0.1626]} 
                        start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }} // From the top center
                        end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }} 
                    >
                        <View className='bg-white mt-20'>
                            <View className='my-12 flex items-center justify-center'>
                                <Image 
                                    source={icons.logo_name}
                                    resizeMode="contain"
                                />
                            </View>
                            
                            <View className='flex items-center justify-center'>
                                <Text className='
                                    text-black-100
                                    px-5 font-psans 
                                    font-semibold 
                                    text-[33px] 
                                    w-full text-center
                                    leading-[42px]
                                '>
                                    Clarity for every investment decision.
                                </Text>
                            </View>
                            <View className='my-8'>
                                <View>
                                    <CustomButton 
                                        title="Get started"
                                        containerStyles="h-[50px] mx-8"
                                        textStyles="text-white"
                                        handlePress={()=>router.push("/sign_up")}
                                    />
                                </View>
                                <View>
                                    <CustomButton 
                                        title="Login"
                                        containerStyles={myClassConverter(
                                            darkTheme,"h-[50px] border mt-5 bg-white mx-8",
                                            "border-[#3B3C43]","border-border"
                                        )}
                                        textStyles="text-dark-100"
                                        handlePress={()=>router.push("/sign_in")}
                                    />
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default index


