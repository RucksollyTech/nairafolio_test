import { View, Text, ScrollView, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import SearchInput from '../../components/SearchInput'
import InvestmentDisplayCard from '../../components/InvestmentDisplayCard'
import useAppwrite from '../../lib/useAppwrite'
import { searchInvestments } from '@/lib/appwrite'
import { useLocalSearchParams } from 'expo-router'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'
import { useGlobalContext } from '@/context/GlobalProvider';
import { myClassConverter } from '@/lib/performActions'



const Search = () => {
    const { setLastActive,darkTheme } = useGlobalContext();

    const { query } = useLocalSearchParams();
    const params = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false)
    const rawQuery = params.query;

    let parsedQuery = {};
    const makeChecksForQuery =(value)=>{
        if(value.includes("=&")){
            return ""
        }
        return value
    }
    
    if (rawQuery) {
        const searchParams = new URLSearchParams(rawQuery);
        parsedQuery = Object.fromEntries(searchParams.entries());
    }
    const searchQuery = parsedQuery.query || makeChecksForQuery(params.query) || ""; 
    const category = parsedQuery.categorySelected || params.categorySelected || "";
    const selected = parsedQuery.selected || params.selected || "";

    const { data: investments, refetch,loading } = useAppwrite(
        () => searchInvestments({query:searchQuery,categorySelected:category,selected})
    );
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch();
        setRefreshing(false)
    }

    useEffect(() => {
        refetch();
    }, [query,selected]);
    return (
        <SafeAreaView className={`flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white "}`}>
            <View>
                <LinearGradient
                    colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                    start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
                    end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
                >
                    <View className="px-5">
                        <View className="pt-10">
                            <Text className={myClassConverter(
                                darkTheme,
                                `font-psans text-xl`,
                                "text-white",
                                "text-black-100"
                            )}>
                                Explore Investments
                            </Text>
                        </View>
                        
                    </View>
                </LinearGradient>
                <View className="px-5">
                    <View className="pt-3">
                        <SearchInput  darkTheme={darkTheme} refreshing={refreshing} initialQuery={{query:searchQuery,categorySelected:category}} />
                    </View>
                    
                </View>
            </View>
            {loading && (
                <View className="px-5">
                    <ActivityIndicator 
                        animating={loading}
                        color="#00A651"
                        size={"small"}
                    />
                </View>
            )}
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
                    company_owner,
                    short_info,
                    category
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
                                darkTheme={darkTheme}
                                short_info={short_info}
                                category={category}
                            />
                        </View>
                )}
                ListEmptyComponent={()=> (
                    <View className="h-full flex-1 justify-center items-center">
                        {loading ? (
                            <SkeletonLoader darkTheme={darkTheme} />
                        ): (
                            <View className="mt-14">
                                <EmptyState 
                                    darkTheme={darkTheme}
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