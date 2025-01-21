import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons, images } from '../../constants'
import AccountComponets from '../../components/AccountComponets'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { signOut } from '@/lib/appwrite'

const account = () => {
    const { setUser, setIsLogged } = useGlobalContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const logout = async () => {
        setIsLoggingOut(true)
        await signOut();
        setUser(null);
        setIsLogged(false);
        setIsLoggingOut(false)

        router.replace("/sign_in");
    };

    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    <View className="px-5">
                        <View className="pt-8">
                            <Text className="text-black-100 font-psans text-2xl">
                                My Account
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
                <View className="pb-24">
                    <View 
                        className="
                            flex-1 
                            rounded-lg
                            flex 
                            py-9 flex-row
                            mb-5
                            border-b
                            border-border
                            px-5
                        "
                    >
                        <View
                            className="items-center justify-center "
                        >
                            <Image
                                source={images.example2}
                                resizeMode="cover"
                                className="h-16 w-16 rounded-full"
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
                                    className="text-xl text-header-200 font-psans"
                                >
                                    David Gabriel
                                </Text>
                            </View>
                            <View className="pt-2">
                                <Text className="text-muted text-sm">
                                    DavidGabriel@gmail.com
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: "10.08%",
                            }}
                            className="items-center justify-center"
                        >
                            <Link href={"/edit-account"}>
                                <View className="h-11 w-11 rounded-full bg-[#F5F5F5] items-center justify-center">
                                    <Image 
                                        source={icons.edit}
                                    />
                                </View>
                            </Link>
                        </View>
                    </View>
                    <View className="px-5">
                        <AccountComponets 
                            title={"Verify account"}
                            subtitle={"Get your account verified."}
                            icon={icons.check}
                            link={"/verify-account"}
                            verified
                        />
                        <AccountComponets 
                            title={"Security"}
                            subtitle={"Change password, Biomertrics"}
                            icon={icons.shield}
                            link={"/security"}
                        />
                        <AccountComponets 
                            title={"Transaction history"}
                            icon={icons.arrow_up_down}
                            link={"/transactions"}
                        />
                        <AccountComponets 
                            title={"Wallet"}
                            icon={icons.wallet}
                            link={"/wallet"}
                        />
                        <AccountComponets 
                            title={"Notification settings"}
                            icon={icons.notification}
                            link={"/"}
                        />
                        <AccountComponets 
                            title={"Terms & conditions"}
                            icon={icons.docs}
                            link={"/"}
                        />
                        <AccountComponets 
                            title={"Help"}
                            icon={icons.phone}
                            link={"/"}
                        />
                    </View>
                    <View className="mb-10 mt-10 justify-center items-center">
                        <TouchableOpacity
                            onPress={logout}
                            activeOpacity={0.1}
                        >
                            {isLoggingOut ? (
                                <Text className="text-lg font-psemibold text-[##D82F2F]">
                                    Logging out...
                                </Text>
                            ) : (
                                <Text className="text-lg font-psemibold text-[##D82F2F]">
                                    Log out
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default account