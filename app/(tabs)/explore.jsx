import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import SearchInput from '../../components/SearchInput'
import InvestmentDisplayCard from '../../components/InvestmentDisplayCard'
import useAppwrite from '../../lib/useAppwrite'
import { getAllInvestments } from '@/lib/appwrite'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'



const explore = () => {
    const { data:investments, loading, refetch } = useAppwrite(getAllInvestments)
    const [refreshing, setRefreshing] = useState(false)
    const categories = ["All","Agriculture","Forex","Dollar savings","Transportation","Financial investmenty"]
    
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch();
        setRefreshing(false)
    }
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <FlatList 
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
                        <View className="mt-6 px-5">
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
                            />
                        </View>
                )}
                ListHeaderComponent={()=>(
                    <View className="flex-1 h-full">
                        <LinearGradient
                            colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                        >
                            <View className="px-5">
                                <View className="pt-10">
                                    <Text className="text-black-100 font-psans text-xl">
                                        Explore Investments
                                    </Text>
                                </View>
                                
                            </View>
                        </LinearGradient>
                        <View className="px-5">
                            <View className="py-3">
                                <SearchInput categories={categories} />
                            </View>
                            
                        </View>
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