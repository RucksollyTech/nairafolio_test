import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import Money from '../../components/Money'
import { useNavigation } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider';
import { getCurrentUser, getUserTransactions } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import HomeSkeletonLoader from '../../components/HomeSkeletonLoader'
import EmptyState from '../../components/EmptyState'
import UTCDate from '../../components/UTCDate'
import CustomNavigator from '../../components/CustomNavigator'
import { myClassConverter } from '@/lib/performActions'

export const TransactionDisplayText=(action)=>{
    if(action === "Deposit"){
        return `${action} into `
    }else if(action === "Failed"){
        return `${action} `
    }else if(action === "Reversal"){
        return `${action} `
    }else if(action === "Retract" || action === "Sell Offer"){
        return `${action} | `
    }else{
        return `${action} to `
    }
}
export const classNameColorsForTransactions = (action, darkTheme = "dark")=>{
    if(
        action === "Deposit" || 
        action === "Reversal"
    ){
        return "text-secondary-100"
    } else if(
        action === "Retract" || 
        action === "Failed" || 
        action === "Sell Offer"
    ){
        return myClassConverter(
            darkTheme,
            ``,
            "text-white",
            "text-muted-300"
        )
    } else{
        return "text-red-500"
    }
}
export const transactionIconChange = (action)=>{
    if(
        action === "Deposit" || 
        action === "Reversal"
    ){
        return true
    } else if(
        action === "Retract" || 
        action === "Failed" || 
        action === "Sell Offer"
    ){
        return true
    } else{
        return false
    }
}
export const DataContainer = ({data,transactions,index,darkTheme})=>(
    <View 
        className={`
            flex-1 
            flex
            flex-row
            mb-5
            py-4
            ${transactions?.length === index + 1 ? '' : `${darkTheme === "dark" ? "border-[#3B3C43]" : "border-border"} border-b`}
        `}
    >
        
        <View
            className={myClassConverter(
                darkTheme,
                `border h-14 w-14 rounded-full items-center justify-center`,
                "border-[#3B3C43]",
                "border-border"
            )}
        >
            <Image
                source={icons.download}
                resizeMode="cover"
                tintColor={transactionIconChange(data?.action) ?  "#40BF6A" : "#E33629"}
                className={!transactionIconChange(data?.action) && "rotate-180"}
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
                    `text-base font-pmedium `,
                    "text-white",
                    "text-muted-300"
                )} numberOfLines={1}>
                    {TransactionDisplayText(data?.action)}
                    <Text
                        className="text-lg font-[700] font-pmedium text-muted"
                        
                    >
                        {data?.reason}
                    </Text>
                </Text>
            </View>
            <View className="pt-2">
                <Text className="text-muted-100 text-sm">
                    {UTCDate(data?.$createdAt)?.myDateFormat || "--"}
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
                    value={data?.amount}
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
                    className={`font-pmedium ${classNameColorsForTransactions(data?.action,darkTheme)} text-right text-sm`}
                >
                    {data?.type}
                    
                    {/* Wallet || Card || Transfer */}
                </Text>
            </View>
        </View>
    </View>
)

const Transactions = () => {
    const navigation = useNavigation();
    const { user,setUser,setLastActive,darkTheme } = useGlobalContext();
    const { data:transactions, loading, refetch } = useAppwrite(()=>getUserTransactions(user.$id))
    const [showOlder, setShowOlder] = useState(false)
    const [showToday, setShowToday] = useState(false)

    const [refreshing, setRefreshing] = useState(false)
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
            checkActiveUser()
        }
    }, [user])
    const hasOlder = transactions?.some(transact => !UTCDate(transact.$createdAt)?.isToday) || false;
    const hasToday = transactions?.some(transact => UTCDate(transact.$createdAt)?.isToday) || false;

    useEffect(() => {
        const hasOlder = transactions?.some(transact => !UTCDate(transact.$createdAt)?.isToday);
        const hasToday = transactions?.some(transact => UTCDate(transact.$createdAt)?.isToday);

        setShowOlder(hasOlder);
        setShowToday(hasToday);
    }, [transactions]);

    return (
        <SafeAreaView className={` flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <CustomNavigator navigator={navigation} darkTheme={darkTheme}/>
            <View className="pt-2 px-5 pb-3">
                <Text className={myClassConverter(
                    darkTheme,
                    `font-psans text-2xl`,
                    "text-white",
                    "text-black-100 "
                )}>
                    Transaction history
                </Text>
            </View>
            <FlatList 
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                data={transactions}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{
                    paddingBottom: 24,
                }}
                renderItem={({ item, index }) => {
                    if(!UTCDate(item.$createdAt)?.isToday){
                        return(
                            <View className="px-5">
                                <DataContainer 
                                    data={item}
                                    transactions={transactions}
                                    index={index}
                                    darkTheme={darkTheme}
                                />
                            </View>
                        )
                    }
                }}
                ListHeaderComponent={()=>(
                    <>
                        <View className="flex-1">
                            
                            {(showToday || hasToday) && (
                                <View className="px-5 py-2 bg-[#F5F5F5]">
                                    <Text className="text-sm font-pregular text-muted">
                                        Today
                                    </Text>
                                </View>
                            )}
                            <View className="px-5">
                                {(transactions && transactions.length > 0) && transactions.map((transact,index)=>{
                                    if(UTCDate(transact.$createdAt)?.isToday){
                                        return(
                                            <View key={transact.$id}>
                                                <DataContainer 
                                                    data={transact}
                                                    transactions={transactions}
                                                    index={index}
                                                    darkTheme={darkTheme}
                                                />
                                            </View>
                                        )
                                    }
                                })}
                            </View>
                            {(showOlder || hasOlder) && (
                                <View className={`px-5 py-2 ${(showToday || hasToday) && "-mt-[21px]"} relative z-10 bg-[#F5F5F5]`}>
                                    <Text className="text-sm font-pregular text-muted">
                                        Older
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
                ListEmptyComponent={()=> (<View className="h-full flex-1 justify-center items-center">
                    {loading ? (
                        <View className="px-5 pt-5">
                            <HomeSkeletonLoader darkTheme={darkTheme} />
                        </View>
                    ): (
                        <View className="px-5 pt-10">
                            <EmptyState darkTheme={darkTheme} title={"No transactions"}/>
                        </View>
                    )}
                </View>)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            
        </SafeAreaView>
    )
}

export default Transactions