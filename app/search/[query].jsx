import { View, Text, ScrollView, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import SearchInput from '../../components/SearchInput'
import InvestmentDisplayCard from '../../components/InvestmentDisplayCard'
import useAppwrite from '../../lib/useAppwrite'
import { searchPosts } from '@/lib/appwrite'
import { useLocalSearchParams } from 'expo-router'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'



const Search = () => {
    const { query } = useLocalSearchParams();
    const params = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false)

    const rawQuery = params.query;

    let parsedQuery = {};
    if (rawQuery) {
        const searchParams = new URLSearchParams(rawQuery);
        parsedQuery = Object.fromEntries(searchParams.entries());
    }

    const searchQuery = parsedQuery.query || ""; 
    const category = parsedQuery.categorySelected || "";
    
    const [categorySelected, setCategorySelected] = useState("")
    const { data: investments, refetch,loading } = useAppwrite(
        () => searchPosts({query:searchQuery,categorySelected:category})
    );
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch();
        setRefreshing(false)
    }

    useEffect(() => {
        refetch();
    }, [query]);
    const categories = ["All","Agriculture","Forex","Dollar savings","Transportation","Financial investmenty"]
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
                                <SearchInput 
                                    initialQuery={{query:searchQuery,categorySelected:category}}
                                    categories={categories}
                                />
                            </View>
                            <View className="flex flex-row flex-wrap gap-2 mt-3">
                                {categories.map((category, index) => (
                                    <View key={index} className={`flex ${index === 0 && "bg-primary"} items-center justify-center border border-border px-3 py-1.5 rounded-lg`}>
                                        <Text className={`font-pregular text-base text-muted-100 ${index === 0 && "text-white"}`}>
                                            {category}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={()=> (
                    <View className="h-full flex-1 justify-center items-center">
                        {loading ? (
                            <SkeletonLoader />
                        ): (
                            <View className="mt-14">
                                <EmptyState 
                                    title="No Investment Found"
                                    subtitle="No investment found for this search query"
                                    notIncludeImg
                                />
                            </View>
                        )}
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    )
}

export default Search