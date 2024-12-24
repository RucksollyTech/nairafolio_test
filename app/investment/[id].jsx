import { View, Text, ScrollView, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons, images } from '../../constants'
import Money from '../../components/Money'
import { useNavigation } from '@react-navigation/native'

const Investment = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className="flex-1 h-full">
                    <LinearGradient
                        colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    >
                        <View className="px-5">
                            <TouchableOpacity
                                className="pt-5"
                                onPress={()=>navigation.goBack()}
                            >
                                <Image
                                    source={icons.arrow_left}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <View className="pt-5 px-5">
                        <View 
                            className="
                                flex-1 
                                flex 
                                pt-3 flex-row
                            "
                        >
                            <View
                                style={{
                                    width: "15.38%",
                                }}
                                className="h-full"
                            >
                                <Image
                                    source={images.example}
                                    resizeMode="cover"
                                    className="h-14 w-14 rounded-full"
                                />
                            </View>
                            <View
                                style={{
                                    width: "84.62%",
                                }}
                                className="flex-1 px-3 "
                            >
                                <View>
                                    <Text className="text-sm text-muted-300">
                                        Company
                                    </Text>
                                    <Text
                                        className="text-lg font-[700] pt-1 font-pmedium text-muted-300"
                                    >
                                        Investment Owner
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-1 mt-5 rounded-lg shadow overflow-hidden border border-border">
                            <ImageBackground
                                source={images.example2}
                                resizeMode="cover"
                                className="w-full h-[180px] rounded-[8px_8px_0_0] flex-1 "
                            >
                                <LinearGradient
                                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']} // Ensure transparency at the top
                                    start={{ x: 0.5, y: 0.405 }}
                                    end={{ x: 0.5, y: 1 }}
                                    style={StyleSheet.absoluteFillObject}
                                    className="h-full p-6 items-center justify-center"
                                >
                                    <View className="w-full mt-auto">
                                        <Text 
                                            className="font-psans text-3xl text-white"
                                            numberOfLines={2}
                                        >
                                            Mono Inc. Transport Services 
                                        </Text>
                                        <View>
                                            <Text className="text-[#FDFDFD99] text-base">
                                                Investment opportunity
                                            </Text>
                                        </View>
                                        
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </View>
                        <View className="bg-white py-3">
                            <Text className="text-xl font-pregular font-[700] text-black-100 ">
                                Mono Inc. transportation and parcel services Nigeria
                            </Text>
                            <View className="py-2">
                                <View className="flex flex-row justify-between">
                                    <View className="flex flex-row ">
                                        <Money 
                                            value={20000}
                                            containerStyle="flex"
                                            textStyle="font-psans my-auto font-[600] text-xl text-secondary-100"
                                        />
                                        <View className="flex flex-row ">
                                            <Text className="font-pmedium my-auto font-[600] text-base text-muted-100">
                                                /unit
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="my-auto">
                                        <View className="flex">
                                            <View className="bg-[#00A6511A] flex-row ml-auto w-[80px] border-[#FFFFFF4D] border px-2 py-1 rounded-[30px]">
                                                <Text className="h-[5px] my-auto w-[5px] rounded-full bg-secondary-100"></Text>
                                                <Text className="text-secondary-100 my-auto pl-1.5 text-sm">
                                                    Ongoing
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="pt-5 px-5 border-t border-border-100">
                        <View className="flex flex-row gap-4 mt-2 flex-1">
                            <View className="flex w-[50%] items-center justify-center bg-[#F6F6F6] border border-border px-3 py-2 rounded-lg">
                                <View className="flex flex-row ">
                                    <Image
                                        source={icons.roi}
                                        resizeMode="contain"
                                        className="my-auto"
                                    />
                                    <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">30% ROI</Text>
                                </View>
                            </View>
                            <View className="flex w-[50%] items-center justify-center bg-[#F6F6F6] border border-border px-3 py-2 rounded-lg">
                                <View className="flex flex-row">
                                    <Image
                                        source={icons.money}
                                        resizeMode="contain"
                                        className="my-auto"
                                    />
                                    <View className="flex flex-row ">
                                        <Money 
                                            value={20000}
                                            containerStyle="flex"
                                            textStyle="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200"
                                        />
                                        <View className="flex flex-row ">
                                            <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">
                                                min
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/* <View className="flex items-center justify-center bg-[#F6F6F6] border border-border px-3 py-2 rounded-lg">
                                <View className="flex flex-row ">
                                    <Image
                                        source={icons.calender}
                                        resizeMode="contain"
                                        className="my-auto"
                                    />
                                    <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">12 months returns</Text>
                                </View>
                            </View> */}
                            
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Investment