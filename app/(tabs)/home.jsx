import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from "../../constants";
import { CustomButton } from '@/components'
import EmptyState from '../../components/EmptyState';
import InvestmentCard, { calculateProfit } from '../../components/InvestmentCard';
import { Link, router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAppwrite from '../../lib/useAppwrite';
import { getUserInvestments, getUserInvestmentsForHome } from '../../lib/appwrite';
import HomeSkeletonLoader from '../../components/HomeSkeletonLoader';
import { getCurrentUser } from '@/lib/appwrite'
import { RefreshControl } from 'react-native';
import GeneralDrawer from '../../components/GeneralDrawer';
import PaymentMethods from '../../components/PaymentMethods';
import UTCDate from '../../components/UTCDate';
import { CustomFlatListCarousel } from '@/components/CustomCarousel';
import Media_and_stories from '@/components/media_and_stories';


const Home = () => {
    const { user,setUser,setLastActive } = useGlobalContext();
    const { data:userInvestments, loading, refetch } = useAppwrite(()=>getUserInvestments(user?.$id))
    const { data:{notForSellData,forSellData}, loading:load, refetch:refetchInfo } = useAppwrite(()=>getUserInvestmentsForHome(user?.$id))

    const [isDrawerVisible, setIsDrawerVisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [active, setActive] = useState(true)
    
    const [hasoldx, setHasoldx] = useState(false)
    const toggler = (value)=>{
        setActive(value)
    }
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
        await Promise.all([refetch(),refetchInfo(),checkActiveUser()])
        setRefreshing(false)
    }
    const handleTotalInvestmentBalance = ()=>{
        let totalInvestment = 0
        if(userInvestments && userInvestments.length > 0){
            userInvestments.forEach(investment=>{
                if(!investment.investment.isDollar){
                    const {daysGone} = UTCDate(investment.date_created)
                    const dataForProfit = {
                        percentage:investment.rio,
                        daysGone,
                        invested:investment.investment.price_per_unit * investment.unit,
                        duration:investment.investment.duration_days
                    }
                    totalInvestment += ((investment.investment.price_per_unit * investment.unit) + calculateProfit(dataForProfit))
                }
            })
        }
        return totalInvestment
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
    }, [userInvestments])
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
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
                    <LinearGradient
                        colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    >
                        <View className="px-5 pt-10 flex-row justify-between">
                            <View>
                                <View>
                                    <Text className="text-muted font-psemibold font-semibold text-sm">
                                        Welcome,
                                    </Text>
                                </View>
                                <View className="pt-1">
                                    <Text className="text-black-100 font-psans text-xl">
                                        {user?.name || "--"}
                                    </Text>
                                </View>
                            </View>
                            <View className='pt-2'>
                                <Link
                                    href={"/notification"}
                                >
                                    <Image 
                                        source={icons.bell_thin}
                                        resizeMode='cover'
                                        // style={{ marginBottom: 10 }}
                                    />
                                </Link>
                            </View>
                        </View>
                    </LinearGradient>

                    <View className="mt-5 flex-1">
                        <CustomFlatListCarousel 
                            data={[
                                {
                                    $id: 1,
                                    amount: user?.wallet_balance ?? 0,
                                    title:"Wallet balance",
                                },{
                                    $id: 2,
                                    amount: handleTotalInvestmentBalance(),
                                    title:"Investments",
                                }
                            ]}
                            setIsDrawerVisible={setIsDrawerVisible}
                        />
                    </View>
                    {/* {(hasoldx || hasSold) && (
                        <ToggleButtons
                            active={active}
                            toggler={toggler}
                            title1={"Investments"}
                            title2={"Up for sale"}
                        />
                    )} */}
                    {(loading || load) ? (
                        <View className="px-5 mt-6">
                            <HomeSkeletonLoader />
                        </View>
                    ) : (
                        <View className="px-5">
                            {(userInvestments && userInvestments.length > 0) ? (
                                <View className="mt-6 min-h-[225px]">
                                    {active && notForSellData.length > 0 && notForSellData.map((mapData,index)=>(
                                        <View key={index} className="mb-2">
                                            <InvestmentCard 
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
                                            />
                                        </View>
                                    ))}
                                    {!active && forSellData.length > 0 && forSellData.map((mapData,index)=>(
                                        <View key={index} className="mb-2">
                                            <InvestmentCard 
                                                logo = {mapData.investment.logo}
                                                name = {mapData.investment.name}
                                                duration = {mapData.investment.duration_days}
                                                invested = {mapData.investment.price_per_unit * mapData.unit}
                                                percentage = {mapData.rio}
                                                date = {mapData.date_created}
                                                _id={mapData.$id}
                                                onSale={true}
                                            />
                                        </View>
                                    ))}
                                    {active && notForSellData.length > 0 ? (
                                        <View className='mt-2'>
                                            <Link
                                                href={"/portfolio"}
                                                className='border text-muted-300 text-center p-3 border-border rounded-lg font-psemibold'
                                            >
                                                See all
                                            </Link>
                                        </View>
                                    ):(
                                        <>
                                            {active && (
                                                <View className="mt-10">
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
                                        </>
                                    )}
                                    {!active && forSellData.length > 0 && (
                                        <View className='mt-2'>
                                            <Link
                                                href={"/portfolio"}
                                                className='border text-muted-300 text-center p-3 border-border rounded-lg font-psemibold'
                                            >
                                                See all
                                            </Link>
                                        </View>
                                    )}
                                    {/* {userInvestments.map((mapData,index)=>{
                                        if(active && !mapData.is_up_for_sell && !mapData.sold){
                                            return(
                                                <View key={index} className="mb-2">
                                                    <InvestmentCard 
                                                        logo = {mapData.investment.logo}
                                                        name = {mapData.investment.name}
                                                        duration = {mapData.investment.duration_days}
                                                        invested = {mapData.investment.price_per_unit * mapData.unit}
                                                        percentage = {mapData.rio}
                                                        date = {mapData.date_created}
                                                        _id={mapData.$id}
                                                    />
                                                </View>
                                            )
                                        }
                                        if(!active && mapData.is_up_for_sell && !mapData.sold){
                                            return(
                                                <View key={index} className="mb-2">
                                                    <InvestmentCard 
                                                        logo = {mapData.investment.logo}
                                                        name = {mapData.investment.name}
                                                        duration = {mapData.investment.duration_days}
                                                        invested = {mapData.investment.price_per_unit * mapData.unit}
                                                        percentage = {mapData.rio}
                                                        date = {mapData.date_created}
                                                        _id={mapData.$id}
                                                        onSale={true}
                                                    />
                                                </View>
                                            )
                                        }
                                    })} */}
                                </View>
                            ) : (
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
                    <View>
                        <Media_and_stories setLastActive={setLastActive} refreshing={refreshing} />
                    </View>
                </View>
            </ScrollView>
            <GeneralDrawer 
                heights={"50px"} 
                isVisible={isDrawerVisible} 
                onClose={() => setIsDrawerVisible(false)}
            >
                <PaymentMethods user={user} />
            </GeneralDrawer>
        </SafeAreaView>
    );
};

export default Home;
