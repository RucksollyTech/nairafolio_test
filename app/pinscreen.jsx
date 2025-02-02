import { View, Text, ScrollView, ActivityIndicator, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { confirmPassword } from '../lib/appwrite';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../constants';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';

const PinScreen = () => {
    const { setLocked, authenticateUser, user, loading } = useGlobalContext();
    const [pin, setPin] = useState("");
    const [hasBio, setHasBio] = useState(true);
    const [bodyLoader, setBodyLoader] = useState(true);
    const [userName, setUserName] = useState("--");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const verifyPin = async () => {
        setIsSubmitting(true)
        const {success,unAuth} = await confirmPassword(pin);
        if (success) {
            setLocked(false);
        } else if (!success){
            setPin("")
            Alert.alert("Incorrect PIN", "Please try again.");
        }else if (unAuth){
            return router.replace("/sign_in")
        }
        setIsSubmitting(false)
    };
    useEffect(()=>{
        setTimeout(async() => {
            // if(!loading && !user){
            //     return router.replace("/sign_in")
            // }
            // await AsyncStorage.setItem("nairaFolioUserName", user.name);
        }, 1000);
    },[user])
    useEffect(()=>{
        const setSecurityDetails= async ()=>{
            const getBiometrics = async()=>{
                await AsyncStorage.getItem("nairaFolioUseBiometrics")
                    .then(bio=>{
                        if(bio){
                            setHasBio(true)
                        }
                        else {
                            setHasBio(false)
                        }
                    })
                    .catch(error=>console.log("No bio found"))
            }
            const getUserName = async()=>{
                await AsyncStorage.getItem("nairaFolioUserName")
                    .then(userNames=>{
                        if(userNames){
                            setUserName(userNames)
                        }
                        else {
                            setUserName("")
                        }
                    })
                    .catch(error=>console.log("No bio found"))
            }
            await Promise.all([getBiometrics(),getUserName()])
        }
        setSecurityDetails()
        setBodyLoader(false)
    },[])
    return (
        <SafeAreaView className='bg-white flex-1'>
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className='relative h-full'>
                    {bodyLoader ? (
                        <View className='flex-1 justify-center items-center'>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    ):(
                        <>
                            <ImageBackground
                                source={images.regular_bg}
                                resizeMode='cover'
                                className='w-full min-h-[25vh] relative'
                            >
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
                                            {userName}
                                        </Text>
                                        <View className='pt-4'>
                                            <FormField 
                                                title="Password"
                                                value={pin}
                                                placeholder="Enter your 6-digit pin"
                                                handleChangeText={(e)=>setPin(e)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View className='mt-[100px] w-full'>
                                    <View className='mb-6'>
                                        <CustomButton 
                                            title="Login"
                                            containerStyles="h-[50px]"
                                            textStyles="text-white"
                                            handlePress={verifyPin}
                                            isLoading={isSubmitting}
                                        />
                                    </View>
                                </View>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PinScreen