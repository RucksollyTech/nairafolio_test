import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { icons } from '../../../constants';
import { RefreshControl } from 'react-native';
import { getUserInvestmentsOffers } from '../../../lib/appwrite';
import useAppwrite from '../../../lib/useAppwrite';
import EmptyState from '../../../components/EmptyState';
import HomeSkeletonLoader from '../../../components/HomeSkeletonLoader';
import CustomNavigator from '../../../components/CustomNavigator';
import { useGlobalContext } from '@/context/GlobalProvider';
import { UTCDate } from '@/components';

const Sales = () => {
    const { setLastActive, darkTheme } = useGlobalContext();

    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const { data:sales, loading, refetch } = useAppwrite(()=>getUserInvestmentsOffers(id))

    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    return (
        <SafeAreaView className={` flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
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
                <View className="px-5">
                    <View 
                        className={`
                            pb-3 pt-2 mb-4 flex-row justify-between items-center
                        `}
                    >
                        <View>
                            <View>
                                <Text className="text-lg font-psemibold font-semibold text-header-200 dark:text-white ">
                                    Available offers
                                </Text>
                            </View>
                            <View className='pt-2'>
                                <Text className='text-muted-300 dark:text-white '>
                                    Here are offers available from investors who want to sell to you.
                                </Text>
                            </View>
                        </View>
                    </View>
                    {loading && (
                        <View className="pt-1">
                            <HomeSkeletonLoader darkTheme={darkTheme} />
                        </View>
                    )}

                    {((sales && sales.length > 0) && !loading) ? (
                        <View>
                            {!loading &&(
                                <>
                                    {sales && sales.length > 0 && sales.map((sale) =>(
                                        <TouchableOpacity 
                                            activeOpacity={0.9}
                                            className="mb-5"
                                            key={sale.$id}
                                            onPress={()=>router.push(`/investment/active/${sale.$id}`)}
                                        >
                                            <View
                                                className={`
                                                    rounded-lg
                                                    border
                                                    border-border dark:border-[#3B3C43]
                                                    bg-[#F8FAFA] dark:bg-[#303540]
                                                `}
                                            >
                                                <View 
                                                    className={`
                                                        flex-1 
                                                        flex 
                                                        py-4 flex-row
                                                        px-2
                                                    `}
                                                >
                                                    <View
                                                        className="
                                                            h-12 w-12 
                                                            rounded-full 
                                                            bg-[#DFE7E8]
                                                            dark:bg-[#CBF5B84D]
                                                            items-center 
                                                            justify-center
                                                        "
                                                    >
                                                        <Image
                                                            source={icons.tag}
                                                            resizeMode="contain"
                                                            className="
                                                                w-6
                                                                rounded-full
                                                            "
                                                            tintColor={darkTheme === "dark" ? "#CBF5B8" : "#141B34"}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: "60%",
                                                        }}
                                                        className="flex-1 px-3 justify-center "
                                                    >
                                                        <View>
                                                            <Text
                                                                className="text-lg text-muted-200 dark:text-[#FFFFFF99] font-psemibold"
                                                            >
                                                                {sale.unit} units
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: "30%",
                                                        }}
                                                        className="items-right justify-center pr-2"
                                                    >
                                                        <View className="w-full items-end">
                                                            <View>
                                                                <Text className="text-header-100 dark:text-white font-psans text-sm">
                                                                    ₦{sale?.unit * sale?.pricePlaced}
                                                                </Text>
                                                            </View>
                                                            <View>
                                                                <Text className="text-secondary-100 text-sm">
                                                                    ₦{sale?.pricePlaced}/unit
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View
                                                    className={`
                                                        flex-1 
                                                        flex 
                                                        border-t
                                                        border-border dark:border-[#3B3C43]
                                                        flex-row
                                                        py-2
                                                        px-3
                                                    `}
                                                >
                                                    {sale.investment.duration_days - UTCDate(sale.date_created).daysGone > 0 ? (
                                                        <Text className="text-muted-100 text-sm font-semibold">
                                                            {sale.investment.duration_days - UTCDate(sale.date_created).daysGone} days left
                                                        </Text>
                                                    ):(
                                                        <Text className="text-muted-100 text-sm font-semibold">
                                                            Matured
                                                        </Text>
                                                    )}
                                                    <Text className='text-muted-100 px-2 '>
                                                        •
                                                    </Text>
                                                    <Text className='text-secondary-100 font-semibold text-sm'>
                                                        {sale.investment.rio}% ROI
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </View>
                    
                    ):(
                        <>
                            {!loading && (
                                <View className={`
                                    p-10 flex-row justify-between items-center
                                `}>
                                    <EmptyState 
                                        darkTheme={darkTheme}
                                        title="No offer available"
                                        subtitle="No offer available for now. Check later."
                                    />
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Sales;