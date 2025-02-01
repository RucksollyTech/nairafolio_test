import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { Link, useNavigation } from 'expo-router'
import CustomNavigator from '../../components/CustomNavigator'

const VerifyAccount = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <CustomNavigator navigator={navigation} />
            <View className="pt-2 px-5">
                <Text className="text-black-100 font-psans text-2xl">
                    Verify account
                </Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className="bg-white flex-1 h-full px-5 pb-10">
                    <View className="py-4">
                        <Text className="text-muted-300">
                            You are required to provide some information about your identity.
                        </Text>
                    </View>
                    <View>
                        <Link href={"/verify-with-nin"}>
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-4 flex-row
                                    mb-5
                                    border
                                    border-border
                                    bg-[#F8FAFA]
                                "
                            >
                                <View
                                    className="h-14 w-14 rounded-full items-center justify-center"
                                >
                                    <Image
                                        source={icons.document_validation}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View
                                    style={{
                                        width: "74.54%",
                                    }}
                                    className="flex-1 px-3 "
                                >
                                    <View>
                                        <Text
                                            className="text-lg text-header-200 font-psans"
                                        >
                                            Verify with NIN
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-muted text-sm">
                                            Provide your NIN
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: "10.08%",
                                    }}
                                    className="items-center justify-center"
                                >
                                    <Image 
                                        source={icons.arrow_right_italic}
                                    />
                                </View>
                            </View>
                        </Link>
                    </View>
                    <View className="mt-4">
                        <Link href={"/verify-with-nin"}>
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-4 flex-row
                                    mb-5
                                    border
                                    border-border
                                    bg-[#F8FAFA]
                                "
                            >
                                <View
                                    className="h-14 w-14 rounded-full items-center justify-center"
                                >
                                    <Image
                                        source={icons.document_validation}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View
                                    style={{
                                        width: "74.54%",
                                    }}
                                    className="flex-1 px-3 "
                                >
                                    <View className="my-auto">
                                        <Text
                                            className="text-lg text-header-200 font-psans"
                                        >
                                            Verify Email
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: "10.08%",
                                    }}
                                    className="items-center justify-center"
                                >
                                    <Image 
                                        source={icons.arrow_right_italic}
                                    />
                                </View>
                            </View>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default VerifyAccount