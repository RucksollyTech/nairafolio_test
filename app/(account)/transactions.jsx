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

const DataContainer = ({data,transactions,index})=>(
    <View 
        className={`
            flex-1 
            flex
            flex-row
            mb-5
            py-4
            ${transactions?.length === index + 1 ? '' : 'border-border border-b'}
        `}
    >
        
        <View
            className="h-14 w-14 rounded-full items-center justify-center border border-border"
        >
            <Image
                source={icons.download}
                resizeMode="cover"
                tintColor={data?.action === "Deposit" ?  "#40BF6A" : "#E33629"}
                className={data?.action !== "Deposit" && "rotate-180"}
            />
        </View>
        <View
            style={{
                width: "61.54%",
            }}
            className="flex-1 px-3 "
        >
            <View>
                <Text className="text-base font-pmedium text-muted-300" numberOfLines={1}>
                    {data?.action} {" "}
                    {data?.action === "Deposit" ? "into" : data?.action === "Failed" ? "" : data?.action === "Reversal" ? "" : "to"} {" "}

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
                    textStyle="font-psemibold text-muted text-right text-base"
                />
            </View>
            <View className="mt-2">
                <Text
                    className={`font-pmedium ${data?.action === "Deposit" ? "text-secondary-100" : data?.action === "Reversal" ? "text-secondary-100" : data?.action === "Failed" ? "text-muted-300" : "text-red-500"} text-right text-sm`}
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
    const { user,setUser } = useGlobalContext();
    const { data:transactions, loading, refetch } = useAppwrite(()=>getUserTransactions(user.$id))
    const [showOlder, setShowOlder] = useState(false)

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
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <FlatList 
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
                                />
                            </View>
                        )
                    }
                }}
                ListHeaderComponent={()=>(
                    <>
                        <View className="flex-1">
                            <View className="px-5">
                                <TouchableOpacity
                                    onPress={()=>navigation.goBack()}
                                >
                                    <Image
                                        source={icons.arrow_left}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View className="pt-4 px-5">
                                <Text className="text-black-100 font-psans text-2xl">
                                    Transaction history
                                </Text>
                            </View>
                            <View className="px-5 py-2 mt-7 bg-[#F5F5F5]">
                                <Text className="text-sm font-pregular text-muted">
                                    Today
                                </Text>
                            </View>
                            <View className="px-5">
                                {(transactions && transactions.length > 0) && transactions.map((transact,index)=>{
                                    if(UTCDate(transact.$createdAt)?.isToday){
                                        return(
                                            <View key={transact.$id}>
                                                <DataContainer 
                                                    data={transact}
                                                    transactions={transactions}
                                                    index={index}
                                                />
                                            </View>
                                        )
                                    }else{
                                        if(!showOlder)setShowOlder(true);
                                    }
                                })}
                            </View>
                            {showOlder && (
                                <View className="px-5 pb-2 bg-[#F5F5F5]">
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
                            <HomeSkeletonLoader />
                        </View>
                    ): (
                        <View className="px-5 pt-10">
                            <EmptyState title={"No transactions"}/>
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