import { View, Text, ScrollView, TouchableOpacity, Image, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { Link, router, useNavigation } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider';
import { getCurrentUser, getUserTransactionsWithLimit } from '../../lib/appwrite'
import { RefreshControl } from 'react-native'
import Money from '../../components/Money'
import useAppwrite from '../../lib/useAppwrite'
import HomeSkeletonLoader from '../../components/HomeSkeletonLoader'
import EmptyState from '../../components/EmptyState'
import UTCDate from '../../components/UTCDate'
import GeneralDrawer from '../../components/GeneralDrawer'
import PaymentMethods from '../../components/PaymentMethods'
import CustomNavigator from '../../components/CustomNavigator'
import { TransactionDisplayText, classNameColorsForTransactions, transactionIconChange } from '../(account)/transactions'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { myClassConverter } from '@/lib/performActions'

const Wallet = () => {
    const navigation = useNavigation();
    const { user, setUser, setLastActive, darkTheme } = useGlobalContext();
    const { data:transactions, loading, refetch } = useAppwrite(()=>getUserTransactionsWithLimit(user.$id))
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const [paymentUrl, setPaymentUrl] = useState(null);
    
    const checkActiveUser = async()=>{
        try {
            const res = await getCurrentUser();
            setUser(res)
        } catch (error) {
            console.error(error)
        }
    }
    const onRefresh = async()=>{
        setRefreshing(true)
        await Promise.all([checkActiveUser(),refetch()])
        setRefreshing(false)
    }
    
    useEffect(() => {
        if(!user){
            const activateUser = async ()=>{
                await checkActiveUser()
            }
            activateUser()
        }
    }, [user])
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" && "padding"} 
            style={{ flex: 1 }}
            className={` flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}
        >
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View className={myClassConverter(
                darkTheme,
                `flex-1 h-full`,
                "bg-dark_mode",
                "bg-white"
            )}>
                <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
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
                    <View className={myClassConverter(
                        darkTheme,
                        `flex-1 h-full px-5 pb-10`,
                        "bg-dark_mode",
                        "bg-white"
                    )}>
                        
                        <View className="pt-2">
                            <Text className={myClassConverter(
                                darkTheme,
                                `font-psans text-2xl`,
                                "text-white",
                                "text-black-100"
                            )}>
                                Wallet
                            </Text>
                        </View>
                        <View className={myClassConverter(
                            darkTheme,
                            `py-4 p-5 rounded-lg mt-5`,
                            "bg-dark_mode-300",
                            "bg-[#F7F7F7]"
                        )}>
                            <View>
                                <Text className=" text-muted-100 font-psemibold ">
                                    Ballance
                                </Text>
                            </View>
                            <View className="pt-5">
                                <Text className={`${darkTheme === "dark" ? "text-white" : "text-black-100"} ${user?.wallet_balance?.toLocaleString().length > 9 ? "text-xl" : "text-4xl"} font-psans`}>
                                    ₦{user?.wallet_balance?.toLocaleString() ?? 0}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 flex flex-row gap-4 my-7">
                            <TouchableOpacity
                                onPress={()=>setIsDrawerVisible(true)}
                                activeOpacity={0.7}
                                className={myClassConverter(
                                    darkTheme,
                                    `rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`,
                                    "bg-dark_mode-200",
                                    "bg-primary"
                                )}
                            >
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `font-pinter font-semibold text-base`,
                                    "text-[#171717]",
                                    "text-white"
                                )}>
                                    Deposit
                                </Text>
                                <View className="ml-2">
                                    <Image
                                        source={icons.download}
                                        resizeMode="contain"
                                        tintColor={darkTheme === "dark" ? "#171717" : "#FFFFFF"}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>router.push("/withdrawal")}
                                activeOpacity={0.7}
                                className={myClassConverter(
                                    darkTheme,
                                    `border rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`,
                                    "border-[#00000014] bg-[#303540]",
                                    "border-border-100 bg-[#F5F5F5]"
                                )}
                            >
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `font-pinter font-semibold text-base`,
                                    "text-white",
                                    "text-muted"
                                )}>
                                    Withdraw
                                </Text>
                                <View className="ml-2">
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        tintColor={darkTheme === 'dark' ? "#FFFFFF" : "#747474"}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {(loading && transactions.length===0) && (
                            <>
                                <View className="mt-5">
                                    <Text className={myClassConverter(
                                        darkTheme,
                                        `font-psans text-xl`,
                                        "text-white",
                                        "text-black-100"
                                    )}>
                                        Transactions
                                    </Text>
                                </View>
                                <View className="mt-5">
                                    <HomeSkeletonLoader darkTheme={darkTheme} />
                                </View>
                            </>
                        )}
                        {(transactions && transactions.length > 0) && (
                            <>
                                <View className="mt-5">
                                    <Text className={myClassConverter(
                                        darkTheme,
                                        `font-psans text-xl`,
                                        "text-white",
                                        "text-black-100"
                                    )}>
                                        Transactions
                                    </Text>
                                </View>
                                <View className="my-5">
                                    {transactions.map((transaction,index) =>(
                                        <View 
                                            key={transaction.$id}
                                            className={`
                                                flex-1 
                                                flex
                                                flex-row
                                                mb-5
                                                py-4
                                                ${transactions.length === index + 1 ? '' : `${darkTheme === "dark" ? "border-[#3B3C43]" : "border-border"} border-b`}
                                            `}
                                        >
                                            
                                            <View
                                                className={myClassConverter(
                                                    darkTheme,
                                                    `h-14 w-14 rounded-full items-center justify-center border`,
                                                    "border-[#3B3C43]",
                                                    "border-border"
                                                )}
                                            >
                                                <Image
                                                    source={icons.download}
                                                    resizeMode="cover"
                                                    tintColor={transactionIconChange(transaction.action) ?  "#40BF6A" : "#E33629"}
                                                    className={!transactionIconChange(transaction.action) && "rotate-180"}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    width: "61.54%",
                                                }}
                                                className="flex-1 px-3 "
                                            >
                                                <View>
                                                    <Text className={myClassConverter(
                                                        darkTheme,
                                                        `text-base font-pmedium`,
                                                        "text-white",
                                                        "text-muted-300"
                                                    )} numberOfLines={1}>
                                                        {TransactionDisplayText(transaction.action)}
                                                        <Text
                                                            className="text-lg font-[700] font-pmedium text-muted"
                                                            
                                                        >
                                                            {transaction.reason}
                                                        </Text>
                                                    </Text>
                                                </View>
                                                <View className="pt-2">
                                                    <Text className="text-muted-100 text-sm">
                                                        {UTCDate(transaction.$createdAt)?.myDateFormat || "--"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    width: "23.08%",
                                                }}
                                            >
                                                <View>
                                                    <Money 
                                                        value={transaction.amount}
                                                        textStyle={myClassConverter(
                                                            darkTheme,
                                                            `font-psemibold text-right text-base`,
                                                            "text-[#FFFFFFB2]",
                                                            "text-muted"
                                                        )}
                                                    />
                                                </View>
                                                <View className="mt-2">
                                                    <Text
                                                        className={`font-pmedium ${classNameColorsForTransactions(transaction.action,darkTheme)} text-right text-sm`}
                                                    >
                                                        {transaction.type}
                                                        
                                                        {/* Wallet || Card || Transfer */}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                                <Link className="text-base font-psemibold text-blue-500" href={"/transactions"}>
                                    View all
                                </Link>
                            </>
                        )}
                        {(!loading && transactions?.length === 0) && (
                            <>
                                <View className="mt-5">
                                    <EmptyState
                                        darkTheme={darkTheme}
                                        title={"No transactions"}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
                <GeneralDrawer
                    darkTheme={darkTheme} 
                    heights={"50px"} 
                    isVisible={isDrawerVisible} 
                    onClose={() => setIsDrawerVisible(false)}
                >
                    <PaymentMethods user={user} darkTheme={darkTheme} />
                </GeneralDrawer>
            </View>
            {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
    )
}

export default Wallet