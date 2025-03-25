import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import SearchInput from '../../components/SearchInput'
import InvestmentDisplayCard from '../../components/InvestmentDisplayCard'
import useAppwrite from '../../lib/useAppwrite'
import { getAllInvestments, getAllInvestmentsDollarToArranged } from '@/lib/appwrite'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'
import { useGlobalContext } from '@/context/GlobalProvider';



const explore = () => {
    const { setLastActive,darkTheme } = useGlobalContext();

    const { data:investments, loading, refetch } = useAppwrite(getAllInvestmentsDollarToArranged)
    const [refreshing, setRefreshing] = useState(false)
    
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch();
        setRefreshing(false)
    }
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <View>
                <LinearGradient
                    colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                    start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
                    end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
                >
                    <View className="px-5">
                        <View className="pt-10">
                            <Text className="text-black-100 dark:text-white font-psans text-xl">
                                Explore Investments
                            </Text>
                        </View>
                        
                    </View>
                </LinearGradient>
                <View className="px-5">
                    <View className="pt-3">
                        <SearchInput refreshing={refreshing} />
                    </View>
                </View>
            </View>
            <FlatList 
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                data={investments}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{
                    paddingBottom: 24,
                }}
                renderItem={({ item:{
                    $id,
                    cover_image,
                    status,
                    logo,
                    name,
                    total_investors,
                    rio,
                    min_investment,
                    duration_days,
                    company_name,
                    company_owner
                    } }) => (
                        <View className="mb-6 px-5">
                            <InvestmentDisplayCard 
                                _id={$id}
                                cover_image={cover_image}
                                status={status}
                                logo={logo}
                                name={name}
                                total_investors={total_investors}
                                rio={rio}
                                min_investment={min_investment}
                                duration_days={duration_days}
                                company_name={company_name}
                                company_owner={company_owner}
                                darkTheme={darkTheme}
                            />
                        </View>
                )}
                ListEmptyComponent={()=> (<View className="h-full flex-1 justify-center items-center">
                    {loading ? (
                        <SkeletonLoader />
                    ): (
                        <EmptyState title={"No investment now"} subtitle={"Check back later"}/>
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

export default explore