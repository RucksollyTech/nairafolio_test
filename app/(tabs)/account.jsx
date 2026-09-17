import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons } from '../../constants'
import AccountComponets from '../../components/AccountComponets'
import { Link, router } from 'expo-router'
import { getData, removeData, useGlobalContext } from '@/context/GlobalProvider'
import { signOut } from '@/lib/appwrite'
import { updateCurrentUser } from '../../lib/updateAccountTransaction'
import { myClassConverter } from '@/lib/performActions'

const account = () => {
    const { setUser, setIsLogged,user,setLastActive,darkTheme,setDarkTheme } = useGlobalContext();
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();
    const onRefresh = async()=>{
        setRefreshing(true)
        await updateCurrentUser(setUser)
        setRefreshing(false)
    }
    const logout = async () => {
        setIsLoggingOut(true)
        await signOut();
        // await updateCurrentUser(setUser)
        setUser(null);
        setIsLogged(false);

        const screenCol= await getData("NairafolioColorScheme")
        if(screenCol){
            setDarkTheme(null);
            await removeData("NairafolioColorScheme")
        }
        const viewBalance= await getData("showBalance")
        if(viewBalance){
            await removeData("showBalance")
        }
        const isDefaultThemes= await getData("defaultColorScheme")
        if(isDefaultThemes){
            await removeData("defaultColorScheme")
        }

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
        <View 
            style={{ 
                paddingLeft: insets.left,
                paddingRight: insets.right
            }}
            className={` flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <LinearGradient
                style={{ 
                    paddingTop: insets.top, 
                }}
                colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
                end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
            >
                <View className="px-5">
                    <View className="pt-8">
                        <Text className={myClassConverter(
                            darkTheme,
                            `font-psans text-2xl`,
                            "text-white",
                            "text-black-100"
                        )}>
                            My Account
                        </Text>
                    </View>
                </View>
            </LinearGradient>
            
            <View 
                className={myClassConverter(
                    darkTheme,
                    `rounded-lg px-5 
                    flex 
                    py-7 flex-row
                    border-b`,
                    "border-[#3B3C43]",
                    "border-border"
                )}
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
                            className={myClassConverter(
                                darkTheme,
                                `text-xl font-psans`,
                                "text-white",
                                "text-header-200"
                            )}
                        >
                            {user.name}
                        </Text>
                    </View>
                    <View className="pt-2">
                        <Text className={myClassConverter(
                            darkTheme,
                            `text-sm`,
                            "text-[#FFFFFFB2]",
                            "text-muted"
                        )}>
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
                        <View className={myClassConverter(
                            darkTheme,
                            `h-10 w-10 rounded-full items-center justify-center`,
                            "bg-[#3e3c3c]",
                            "bg-[#F5F5F5]"
                        )}>
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
                            // #014148
                            tintColor={darkTheme === "dark" ? "#CBF5B8" : "#014148"}
                        />
                        <AccountComponets 
                            title={"Wallet"}
                            icon={icons.wallet}
                            link={"/wallet"}
                            darkTheme={darkTheme}
                        />
                        {/* <AccountComponets 
                            title={"Terms & conditions"}
                            icon={icons.docs}
                            link={"/"}
                            darkTheme={darkTheme}
                        /> */}
                        <AccountComponets 
                            title={"Themes"}
                            icon={icons.tag}
                            link={"/themes"}
                            // tintColor={"#267103"}
                            tintColor={darkTheme === "dark" ? "#CBF5B8" : "#267103"}

                            darkTheme={darkTheme}
                        />
                        {/* <AccountComponets 
                            title={"Help"}
                            icon={icons.phone}
                            link={"/"}
                            darkTheme={darkTheme}
                        /> */}
                    </View>
                    <View className="mb-10 mt-10 text-[#174402] justify-center items-center">
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
        </View>
    )
}

export default account