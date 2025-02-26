import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { LinearGradient } from 'expo-linear-gradient';
import ToggleButtons from '@/components/ToggleButtons';
import { getCurrentUser, getUserInvestmentsForHome } from '@/lib/appwrite';
import HomeSkeletonLoader from '@/components/HomeSkeletonLoader';
import { CustomButton, EmptyState } from '@/components';
import useAppwrite from '@/lib/useAppwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import InvestmentCard from '@/components/InvestmentCard';

const Portfolio = () => {
    const { user,setUser,setLastActive } = useGlobalContext();
    const { data:{notForSellData,forSellData}, loading, refetch:refetchInfo } = useAppwrite(()=>getUserInvestmentsForHome(user?.$id))
    const [hasoldx, setHasoldx] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [active, setActive] = useState(true)
    

    const checkActiveUser = async()=>{
        try {
            const res = await getCurrentUser();
            setUser(res)
        } catch (error) {
            console.error(error)
        }
    }
    const toggler = (value)=>{
        setActive(value)
    }
    const onRefresh = async()=>{
        setRefreshing(true)
        await Promise.all([refetch(),refetchInfo(),checkActiveUser()])
        setRefreshing(false)
    }

    const hasSold = !!forSellData?.length || false;
    useEffect(() => {
        if(forSellData){
            const hasSolds = forSellData?.length || false;
            setHasoldx(hasSolds);
        }
    }, [forSellData]);
    useEffect(() => {
        if(!user){
            const activateUser = async ()=>{
                await checkActiveUser()
            }
            activateUser()
        }
    }, [user,loading])
    useEffect(() => {
        checkActiveUser()
    }, [notForSellData,forSellData])
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <View>
                <LinearGradient
                    colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    <View className="px-5">
                        <View className="pt-10">
                            <Text className="text-black-100 font-psans text-2xl">
                                Portfolio
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
                <View className="px-5 pb-5">
                    {(hasoldx || hasSold) && (
                        <ToggleButtons
                            active={active}
                            toggler={toggler}
                            title1={"Investments"}
                            title2={"Up for sale"}
                            marginTop={"mt-7"}
                        />
                    )}
                </View>
            </View>
            <FlatList 
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                data={active ? notForSellData : forSellData}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{
                    paddingBottom: 24,
                    paddingRight: 20,
                    paddingLeft: 20,
                }}
                renderItem={({ item:mapData }) =>(
                    <View className="mb-2">
                        <InvestmentCard 
                            logo = {mapData.investment.logo}
                            name = {mapData.investment.name}
                            duration = {mapData.investment.duration_days}
                            invested = {mapData.investment.price_per_unit * mapData.unit}
                            percentage = {mapData.investment.rio}
                            date = {mapData.$createdAt}
                            _id={mapData.$id}
                        />
                    </View>
                )}
                ListEmptyComponent={()=> (
                    <View className="h-full flex-1 justify-center items-center">
                        {loading ? (
                            <HomeSkeletonLoader />
                        ): (
                            <View className="mt-20">
                                <EmptyState
                                    title={"You have no Investments"}
                                    subtitle={"You can start by investing in the available opportunities"}
                                />
                                <View className="items-center justify-center pt-5">
                                    <CustomButton 
                                        title="Explore investments"
                                        textStyles="text-white"
                                        containerStyles="w-[180px] h-11 text-xs text-center"
                                        handlePress={()=>router.push("/explore")}
                                    />
                                </View>
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

export default Portfolio