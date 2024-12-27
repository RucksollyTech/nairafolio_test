import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons } from '../../../constants'
import { useNavigation } from '@react-navigation/native'
import Money from '../../../components/Money'
import { router } from 'expo-router'

const Active = () => {
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
                                className="pt-5 flex flex-row"
                                onPress={()=>navigation.goBack()}
                            >
                                <Image
                                    source={icons.arrow_left}
                                    resizeMode="contain"
                                />
                                <View className="pl-3">
                                    <Text className="text-black-100 text-xl font-pregular font-[700]">
                                        Investment Name
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                        </View>
                    </LinearGradient>
                    <View className="px-5">
                        <View className="pt-10">
                            <Money
                                value={400000000}
                                textStyle="text-black-100 font-psans text-4xl"
                            />
                        </View>
                        <View className="mt-2 flex-1">
                            <View className="mt-2 flex flex-row flex-1">
                                <Text className="text-muted font-pregular font-[700] text-base">
                                    Invested 
                                </Text>
                                <Money
                                    value={400000}
                                    textStyle="text-muted font-pregular font-[700] text-base"
                                    containerStyle="pl-2"
                                />
                            </View>
                            <View className="mt-2">
                                <Money
                                    value={400000}
                                    textStyle="text-secondary-100 font-pregular text-base"
                                />
                            </View>
                            <View className={`flex mt-2 items-center justify-center w-[100px] bg-[#F5F5F5] border border-border px-3 py-1.5 rounded-lg`}>
                                <Text className={`font-pregular text-base text-muted-100 font-[700]`}>
                                    68 days left
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 flex flex-row my-9">
                            <TouchableOpacity
                                onPress={()=>router.push("/")}
                                activeOpacity={0.7}
                                className={`bg-primary rounded-xl min-h-8 flex flex-row justify-center items-center`}
                            >
                                <Text className={`font-pinter font-semibold text-base`}>
                                    {title}
                                </Text>
                                <Image
                                    source={icons.investment_icon}
                                    resizeMode="contain"
                                />
                                <View className="pl-3">
                                    <Text className="text-black-100 text-xl font-pregular font-[700]">
                                        Investment Details
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Active