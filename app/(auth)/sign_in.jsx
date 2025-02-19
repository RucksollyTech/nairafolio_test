import { View, Text, ImageBackground, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import { CustomButton, FormField } from '@/components'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getCurrentUser, signIn, signOut } from '@/lib/appwrite'
import AsyncStorage from '@react-native-async-storage/async-storage';

const sign_in = () => {
    const { setUser, setIsLogged, setLastActive } = useGlobalContext();
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
        
            router.replace("/home");
        } catch (error) {
            setErrorMessage("Invalid credentials");
        } finally {
            setSubmitting(false);
        }
    };
    
    useEffect(()=>{
        signOut()
    },[])
    return (
        <SafeAreaView className='bg-white flex-1'>
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
                                />
                            </Link>
                        </View>
                        <View className='absolute bottom-12 w-full'>
                            <Image 
                                source={icons.logo_name_big}
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
                                <Text className='text-center font-psans text-3xl'>Welcome back</Text>
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
                                        placeholder="Email address"
                                        handleChangeText={(e)=>setForm({...form, email: e})}
                                    />
                                </View>
                                <View className='pt-4'>
                                    <FormField 
                                        title="Password"
                                        value={form.password}
                                        placeholder="Password"
                                        handleChangeText={(e)=>setForm({...form, password: e})}
                                    />
                                </View>
                                <View className='mt-1.5'>
                                    <Link
                                        href={"/forgot-password"}
                                    >
                                        <Text 
                                            className='
                                                text-base 
                                                text-right
                                                font-pregular 
                                                text-primary
                                            '
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
                                    textStyles="text-white"
                                    handlePress={submit}
                                    isLoading={isSubmitting}
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