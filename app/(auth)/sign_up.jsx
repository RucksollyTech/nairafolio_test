import { View, Text, ImageBackground, Image, ScrollView, Dimensions, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import { CustomButton, FormField } from '@/components'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createUser, signOut } from '@/lib/appwrite'
import AsyncStorage from '@react-native-async-storage/async-storage'

const sign_up = () => {
    const { setUser, setIsLogged, setLastActive, setLocked, darkTheme } = useGlobalContext();
    const [errorMessage, setErrorMessage] = useState("");

    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        password_confirm: "",
        name: "",
        phone: "",
    });

    const submit = async () => {
        setErrorMessage("")
        if (
            form.name === "" || 
            form.email === "" || 
            form.password === "" ||
            form.phone === ""  
        ) {
            return
        }

        setSubmitting(true);
        try {
            const result = await createUser(form.email, form.password, form.name,form.phone);
            setUser(result);
            setIsLogged(true);
            await AsyncStorage.setItem('isSignedUp', JSON.stringify(true));
            setLocked(false)
            router.replace("/home");
        } catch (error) {
            setErrorMessage("Please use another email address. That email is taken");
        } finally {
            setSubmitting(false);
        }
    };
    useEffect(()=>{
        const logOutUserControl = async()=>{
            setUser(null)
            setIsLogged(false);
            await signOut()
        }
        logOutUserControl()
    },[])
    return (
        <SafeAreaView className={`flex-1 ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <ScrollView
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
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
                <View className="w-full px-5 flex justify-center h-full"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <View>
                        <View>
                            <Text className='font-psans dark:text-white text-3xl'>Sign up</Text>
                        </View>
                        <View className='mt-2'>
                            <Text className='
                                text-lg 
                                font-pregular
                                font-semibold 
                                text-muted
                            '>
                                Create an account and start investing.
                            </Text>
                        </View>
                        <View className='w-full'>
                            <View className='pt-8'>
                                <FormField 
                                    title="Name"
                                    value={form.name}
                                    placeholder="Surname FirstName OtherName"
                                    handleChangeText={(e)=>setForm({...form, name: e})}
                                    darkTheme={darkTheme}
                                />
                            </View>
                            <View className='pt-4'>
                                <FormField 
                                    title="Email"
                                    value={form.email}
                                    placeholder="Email address"
                                    handleChangeText={(e)=>setForm({...form, email: e})}
                                    darkTheme={darkTheme}
                                />
                            </View>
                            <View className='flex flex-row pt-4 gap-3'>
                                <View className='
                                    flex px-4
                                    bg-[#FDFDFD] 
                                    dark:bg-[#27282F]
                                    rounded-2xl 
                                    flex-row
                                    border border-border dark:border-[#3B3C43] 
                                    focus:border-primary 
                                    items-center'
                                >
                                    <Image 
                                        source={icons.ngLogo}
                                        resizeMode='contain'
                                        className='my-auto'
                                    />
                                    <Text className='text-sm text-muted dark:text-[#FFFFFFB2] pl-1'>
                                        +234
                                    </Text>
                                </View>
                                <View className='w-full flex-1'>
                                    <FormField 
                                        title="Phone"
                                        value={form.phone}
                                        placeholder="8160000031"
                                        handleChangeText={(e)=>setForm({...form, phone: e})}
                                        otherStyles="w-full"
                                        darkTheme={darkTheme}
                                    />
                                </View>
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
                            <View className='pt-4'>
                                <FormField 
                                    title="Password"
                                    value={form.password_confirm}
                                    placeholder="Confirm password"
                                    handleChangeText={(e)=>setForm({...form, password_confirm: e})}
                                    darkTheme={darkTheme}
                                />
                            </View>
                        </View>
                    </View>
                    <View className="items-center justify-center mt-3 mb-2">
                        <Text className="text-red-500 font-pmedium">
                            {errorMessage}
                        </Text>
                    </View>
                    <View className='w-full mt-[50px]'>
                        <View className='mb-6'>
                            <CustomButton 
                                title="Sign up"
                                containerStyles="h-[50px]"
                                textStyles={darkTheme !== "dark" && "text-white"}
                                handlePress={submit}
                                isLoading={isSubmitting}
                                darkTheme={darkTheme}
                            />
                        </View>
                        <View className='mb-10'>
                            <Text className='text-center text-base font-pregular text-muted'>
                                Already have an account? {" "} 
                                <Link 
                                    href={"/sign_in"}
                                    className='text-[#00A651]'
                                >
                                    Log in
                                </Link>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default sign_up