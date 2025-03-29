import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons } from '../../constants'
import AccountComponets from '../../components/AccountComponets'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { signOut } from '@/lib/appwrite'
import { updateCurrentUser } from '../../lib/updateAccountTransaction'

const account = () => {
    const { setUser, setIsLogged,user,setLastActive,darkTheme } = useGlobalContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async()=>{
        setRefreshing(true)
        await updateCurrentUser(setUser)
        setRefreshing(false)
    }
    const logout = async () => {
        setIsLoggingOut(true)
        await signOut();
        await updateCurrentUser(setUser)
        setUser(null);
        setIsLogged(false);
        setIsLoggingOut(false)

        router.replace("/sign_in");
    };
    useEffect(() => {
        const gettingUser = async()=>{
            await updateCurrentUser(setUser)
        }
        gettingUser()
    }, [])
    
    return (
        <SafeAreaView className={` flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <LinearGradient
                colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
                end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
            >
                <View className="px-5">
                    <View className="pt-8">
                        <Text className="text-black-100 dark:text-white font-psans text-2xl">
                            My Account
                        </Text>
                    </View>
                </View>
            </LinearGradient>
            
            <View 
                className="
                    rounded-lg
                    flex 
                    py-7 flex-row
                    border-b
                    border-border dark:border-[#3B3C43]
                    px-5
                "
            >
                <View
                    className="items-center justify-center "
                >
                    <Image
                        source={{uri: user?.avatar}}
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
                            className="text-xl text-header-200 dark:text-white  font-psans"
                        >
                            {user.name}
                        </Text>
                    </View>
                    <View className="pt-2">
                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                            {user.email}
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
                        <View className="h-10 w-10 rounded-full bg-[#F5F5F5] dark:bg-[#3e3c3c] items-center justify-center">
                            <Image 
                                source={icons.edit}
                            />
                        </View>
                    </Link>
                </View>
            </View>
            <ScrollView
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                
                <View className="pb-24">
                    
                    <View className="px-5">
                        <AccountComponets 
                            title={"Verify account"}
                            subtitle={"Get your account verified."}
                            icon={icons.check}
                            link={"/verify-account"}
                            darkTheme={darkTheme}
                            verified
                            verificationData={user.is_verified}
                        />
                        <AccountComponets 
                            title={"Security"}
                            subtitle={"Change password, Biomertrics"}
                            icon={icons.shield}
                            link={"/security"}
                            darkTheme={darkTheme}
                        />
                        <AccountComponets 
                            title={"Transaction history"}
                            icon={icons.arrow_up_down}
                            link={"/transactions"}
                            darkTheme={darkTheme}
                            tintColor={"#CBF5B8"}
                        />
                        <AccountComponets 
                            title={"Wallet"}
                            icon={icons.wallet}
                            link={"/wallet"}
                            darkTheme={darkTheme}
                        />
                        <AccountComponets 
                            title={"Terms & conditions"}
                            icon={icons.docs}
                            link={"/"}
                            darkTheme={darkTheme}
                        />
                        {/* <AccountComponets 
                            title={"Media and contents"}
                            icon={icons.media}
                            link={"/"}
                            darkTheme={darkTheme}
                        /> */}
                        {/* <AccountComponets 
                            title={"Help"}
                            icon={icons.phone}
                            link={"/"}
                            darkTheme={darkTheme}
                        /> */}
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