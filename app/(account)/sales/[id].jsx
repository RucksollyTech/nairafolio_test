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

const Sales = () => {
    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const { data:sales, loading, refetch } = useAppwrite(()=>getUserInvestmentsOffers(id))

    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    useEffect(() => {
        
    }, [loading])
    
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="px-5">
                    <TouchableOpacity
                        className="pt-5"
                        onPress={()=>navigation.goBack()}
                    >
                        <Image
                            source={icons.arrow_left}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View 
                        className={`
                            p-5 mb-4 flex-row justify-between items-center border-b border-border
                        `}
                    >
                        <View className="flex-row items-center">
                            <View className="pl-1">
                                <Text className="text-lg font-psemibold font-semibold text-header-200">
                                    Available offers
                                </Text>
                            </View>
                        </View>
                    </View>

                    {((sales && sales.length > 0) || !loading) ? (
                        <View className="pt-1 px-5">
                            {loading ? (
                                <HomeSkeletonLoader />
                            ):(
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
                                                    flex-1 
                                                    rounded-lg
                                                    flex 
                                                    py-4 flex-row
                                                    px-2
                                                    border
                                                    border-border
                                                    bg-[#F8FAFA]
                                                `}
                                            >
                                                <View
                                                    className="
                                                        h-12 w-12 
                                                        rounded-full 
                                                        bg-[#DFE7E8]
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
                                                            className="text-lg text-muted-200 font-psemibold"
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
                                                            <Text className="text-header-100 font-psans text-sm">
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
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </View>
                    
                ):(
                    <View className={`
                        p-10 flex-row justify-between items-center
                    `}>
                        <EmptyState 
                            title="No offer available"
                            subtitle="No offer available for now. Check later."
                        />
                    </View>
                )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Sales;