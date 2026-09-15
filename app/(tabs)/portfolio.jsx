import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { LinearGradient } from 'expo-linear-gradient';
import ToggleButtons from '@/components/ToggleButtons';
import { getCurrentUser, getUserInvestments, getUserInvestmentsForHome } from '@/lib/appwrite';
import HomeSkeletonLoader from '@/components/HomeSkeletonLoader';
import { CustomButton, EmptyState } from '@/components';
import useAppwrite from '@/lib/useAppwrite';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import InvestmentCard from '@/components/InvestmentCard';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { myClassConverter } from '@/lib/performActions';

const Portfolio = () => {
    const { user,setUser,setLastActive,loading:loads,darkTheme } = useGlobalContext();
    // const { data:{notForSellData,forSellData}, loading, refetch } = useAppwrite(()=>getUserInvestmentsForHome(user?.$id))
    const { data:notForSellData, loading, refetch } = useAppwrite(()=>getUserInvestments(user?.$id))
    const forSellData=[]
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
        await Promise.all([refetch(),checkActiveUser()])
        setRefreshing(false)
    }

    const hasSold = !!forSellData?.length || false;
    // useEffect(() => {
    //     if(forSellData){
    //         const hasSolds = forSellData?.length || false;
    //         setHasoldx(hasSolds);
    //     }
    // }, [forSellData]);
    

    const emptyComponent = useMemo(() => (
        <View className="flex-1 justify-center items-center"> 
            {loading ? (
                <HomeSkeletonLoader darkTheme={darkTheme} />
            ) : (
                <View className="mt-20">
                    <EmptyState
                        darkTheme={darkTheme}
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
    ), [loading]);
    const insets = useSafeAreaInsets();
    return (
        <View 
            style={{ 
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right
            }}
            className={`flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <View className='pb-5'>
                <LinearGradient
                    style={{ 
                        paddingTop: insets.top, 
                    }}
                    colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                    start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
                    end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
                >
                    <View className="px-5">
                        <View className="pt-10">
                            <Text className={myClassConverter(
                                darkTheme,
                                `font-psans text-2xl`,
                                "text-white",
                                "text-black-100"
                            )}>
                                Portfolio
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
                {/* <View className="px-5 pb-4">
                    {(hasoldx || hasSold) && (
                        <ToggleButtons
                            active={active}
                            toggler={toggler}
                            title1={"Investments"}
                            title2={"Up for sale"}
                            marginTop={"mt-7"}
                            darkTheme={darkTheme}
                        />
                    )}
                </View> */}
            </View>
            <FlatList 
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                // data={active ? notForSellData : forSellData}
                data={notForSellData.filter(investmentInView=>investmentInView.investment.category !== 'Dollar')}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{
                    paddingBottom: 24,
                    paddingRight: 20,
                    paddingLeft: 20,
                }}
                renderItem={({ item:mapData }) =>(
                    <View className="mb-2">
                        <InvestmentCard 
                            truncateValue={true}
                            logo = {mapData.investment.logo}
                            name = {mapData.investment.name}
                            duration = {mapData.investment.duration_days}
                            invested = {mapData.investment.price_per_unit * mapData.unit}
                            percentage = {mapData.rio}
                            investType={mapData.investment.isDollar}
                            user={user}
                            investment={mapData}
                            date = {mapData.date_created}
                            _id={mapData.$id}
                            darkTheme={darkTheme}
                        />
                    </View>
                )}
                
                ListEmptyComponent={emptyComponent}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    )
}

export default Portfolio