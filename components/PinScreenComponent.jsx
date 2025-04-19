import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, usePathname } from "expo-router";
import { icons, images } from "@/constants";
import { confirmPassword } from "@/lib/appwrite";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { myClassConverter } from "@/lib/performActions";

const PinScreenComponent = ({ setLocked, authenticateUser, user, loading,returnUrl,darkTheme }) => {
    const [pin, setPin] = useState("");
    const [hasBio, setHasBio] = useState(true);
    const [bodyLoader, setBodyLoader] = useState(true);
    const [userName, setUserName] = useState("--");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const verifyPin = async () => {
        setErrorMessage("")
        if(!pin){
            return
        }
        setIsSubmitting(true)
        const {success,unAuth} = await confirmPassword(pin);
        if (success) {
            setLocked(false);
            if(returnUrl){
                router.replace(returnUrl)
            }else{
                router.replace("/home")
            }
        } else if (!success){
            setPin("")
            setErrorMessage("Incorrect password");
        }else if (unAuth){
            return router.replace("/sign_in")
        }
        setIsSubmitting(false)
    };
    useEffect(()=>{
        setTimeout(async() => {
            if(!loading && !user){
                return router.replace("/sign_in")
            }
            await AsyncStorage.setItem("nairaFolioUserName", user.name);
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
    // authenticateUser
    return (
        <View className={darkTheme === "dark" ? 'dark relative h-full' : 'relative h-full'}>
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
                                    {userName}
                                </Text>
                                <View className="items-center justify-center mt-3 mb-2">
                                    <Text className="text-red-500 font-pmedium">
                                        {errorMessage}
                                    </Text>
                                </View>
                                <View>
                                    <FormField 
                                        title="Password"
                                        value={pin}
                                        placeholder="Enter your password"
                                        handleChangeText={(e)=>setPin(e)}
                                        darkTheme={darkTheme}
                                    />
                                </View>
                            </View>
                        </View>
                        <View className='mt-14 w-full'>
                            <View className='mb-6'>
                                <CustomButton 
                                    title="Login"
                                    containerStyles="h-[50px]"
                                    textStyles={darkTheme !== "dark" && "text-white"}
                                    handlePress={verifyPin}
                                    loading={!pin}
                                    isLoading={isSubmitting}
                                    darkTheme={darkTheme}
                                />
                            </View>
                        </View>
                        {hasBio && (
                            <View className='flex justify-center items-center mt-[10vh]'>
                                <TouchableOpacity 
                                    onPress={authenticateUser}
                                >
                                    <Image 
                                        source={icons.bio}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

export default PinScreenComponent;