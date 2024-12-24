import { View, Text, Image, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images,icons } from "../constants";
import {CustomButton} from "../components"
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const index = () => {
    return (
        <SafeAreaView className='bg-white flex-1 font-bold h-[100vh]'>
            <View className='relative w-full flex h-full items-center justify-center'>
                <Image 
                    source={images.onboarding}
                    className="w-[80%]"
                    resizeMode="contain"
                />
                
                <View className='absolute bottom-0 w-full '>
                    <LinearGradient
                        colors={['rgba(255, 255, 255, 0)', '#FFFFFF']} // Start and end colors
                        locations={[0, 0.1626]} // Matching the 16.26% stop
                        start={{ x: 0.5, y: 0 }} // From the top center
                        end={{ x: 0.5, y: 1 }} 
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
                                    max-w-[400px] 
                                    w-full text-center
                                    leading-[42px]
                                '>
                                    Grow financially with our investments
                                </Text>
                            </View>
                            <View className='my-8'>
                                <View>
                                    <CustomButton 
                                        title="Get started"
                                        containerStyles="h-[50px] mx-8 max-w-[400px]"
                                        textStyles="text-white"
                                        handlePress={()=>router.push("/sign_up")}
                                    />
                                </View>
                                <View>
                                    <CustomButton 
                                        title="Login"
                                        containerStyles="h-[50px] border border-border mt-5 bg-white mx-8 max-w-[400px]"
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


