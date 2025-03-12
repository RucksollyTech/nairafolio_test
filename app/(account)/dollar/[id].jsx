import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { RefreshControl } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { OngoingDetailSkeletonLoader } from '@/components/DetailLoader';
import useAppwrite from '@/lib/useAppwrite';
import CustomNavigator from '@/components/CustomNavigator';
import { icons } from '@/constants';
import { getUserDataDollarCaller, getUserInvestment } from '@/lib/appwrite';
import Money from '@/components/Money';
import TransactionCard from '@/components/TransactionCard';
import GeneralDrawer from '@/components/GeneralDrawer';
import PaymentDrawer from '@/components/PaymentDrawer';

const Dollar = () => {
    const { setLastActive, user } = useGlobalContext();

    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const { data:{transactions,dollarInvestment}, loading, refetch } = useAppwrite(()=>getUserDataDollarCaller(id,user.$id))
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    const handleAdd=()=>{
        setIsDrawerVisible(true)
    }
    const handleConvert=()=>{
        
    }
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <CustomNavigator navigator={navigation} />
            <View className="px-5">
                {!loading && (
                    <View>
                        <Text 
                            className="text-black-100 text-xl font-pregular font-[700]"
                        >
                            Dollar saving
                        </Text>
                    </View>
                )}
            </View>
            {loading ? (
                <OngoingDetailSkeletonLoader />
            ):(
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
                    <View className="flex-1 h-full">
                        
                        <View className="px-5">
                            <View className="pt-7">
                                <Money
                                    dollar
                                    value={user?.dollar_ballance}
                                    textStyle="text-black-100 font-psans text-4xl"
                                />
                            </View>
                            <View className="mt-2 flex-1">
                                <View className=" flex flex-row flex-1">
                                    <Text className="text-muted font-pregular font-[700] text-base">
                                        Invested 
                                    </Text>
                                    <Money
                                        value={(transactions && transactions.length > 0) ? transactions[0].amount : 0}
                                        textStyle="text-muted font-pregular font-[700] text-base"
                                        containerStyle="pl-2"
                                    />
                                </View>
                                <View className="mt-1">
                                    <Money
                                        add
                                        containerStyle={"flex-row"}
                                        addedText={"/$"}
                                        value={dollarInvestment?.investment?.price_per_unit}
                                        textStyle="text-secondary-100 font-pregular text-base font-[700]"
                                    />
                                </View>
                            </View>
                            <View className="flex-1 mt-5 flex flex-row gap-4">
                                <TouchableOpacity
                                    onPress={handleAdd}
                                    activeOpacity={0.7}
                                    className={` bg-primary rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                >
                                    <Text className={`font-pinter font-semibold text-base text-white`}>
                                        Add
                                    </Text>
                                    <View className="ml-2">
                                        <Image
                                            source={icons.download}
                                            resizeMode="contain"
                                            tintColor={"#FFFFFF"}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    onPress={handleConvert}
                                    activeOpacity={0.7}
                                    className={`border border-border-100 bg-[#F5F5F5] rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                >
                                    <Text className={`font-pinter font-semibold text-base text-muted`}>
                                        Convert
                                    </Text>
                                    <View className="ml-2">
                                        <Image
                                            source={icons.convert}
                                            resizeMode="contain"
                                            tintColor={"#747474"}
                                        />
                                    </View>
                                    
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Transactions */}
                        {transactions && transactions.length > 0 && (
                            <View className='mt-5'>
                                <View className='mb-3'>
                                    <Text className="font-psans text-lg text-black-100">
                                        Activities
                                    </Text>
                                </View>
                                <>
                                    {transactions.map((transaction,index) =>(
                                        <TransactionCard 
                                            key={index} 
                                            transaction={transaction} 
                                            transactions={transactions} 
                                        />
                                    ))}
                                </>
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}

            {dollarInvestment && (
                <PaymentDrawer 
                    isVisible={isDrawerVisible} 
                    onClose={() => setIsDrawerVisible(false)} 
                    investment={dollarInvestment?.investment}
                    user={user}
                    user_investment={dollarInvestment}
                    title="Buy Dollars"
                />
            )}
        
        </SafeAreaView>
    )
}

export default Dollar;