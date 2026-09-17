import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { myClassConverter } from '@/lib/performActions';


const Home = () => {
    const { user,setUser,setLastActive,darkTheme,showBalance,setShowBalance } = useGlobalContext();
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
    const insets = useSafeAreaInsets();
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" && "padding"} 
            style={{ flex: 1 }}
            className={darkTheme === 'dark' ? "dark" : ""}
        >
            <View 
            style={{ 
                paddingLeft: insets.left,
                paddingRight: insets.right
            }}
            className={myClassConverter(
                darkTheme,
                `flex-1 h-full`,
                "bg-[#1D1E25]",
                "bg-white"
            )}>
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
                            style={{ 
                                paddingTop: insets.top, 
                            }}
                            colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                            start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
                            end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
                        >
                            <View className="px-5 pt-10 flex-row justify-between">
                                <View>
                                    <View>
                                        <Text className={myClassConverter(
                                            darkTheme,
                                            `font-psemibold font-semibold text-sm`,
                                            "text-[#FFFFFFB2]",
                                            "text-muted"
                                        )}>
                                            Welcome,
                                        </Text>
                                    </View>
                                    <View className="pt-1">
                                        <Text className={myClassConverter(
                                            darkTheme,
                                            `font-psans text-xl`,
                                            "text-white",
                                            "text-black-100"
                                        )}>
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
                                            className='w-7 h-7'
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
                                darkTheme={darkTheme}
                                showBalance={showBalance}
                                setShowBalance={setShowBalance}
                            />
                        </View>
                        {/* {(hasoldx || hasSold) && (
                            <ToggleButtons
                                active={active}
                                toggler={toggler}
                                title1={"Investments"}
                                title2={"Up for sale"}
                                darkTheme={darkTheme}
                            />
                        )} */}
                        {(loading || load) ? (
                            <View className="px-5 mt-6">
                                <HomeSkeletonLoader darkTheme={darkTheme} />
                            </View>
                        ) : (
                            <View className="px-5">
                                {(userInvestments && userInvestments.length > 0) ? (
                                    <View className="mt-6 min-h-[225px]">
                                    {/* userInvestments */}
                                        {/* {active && notForSellData.length > 0 && notForSellData.map((mapData,index)=>( */}
                                        {active && userInvestments?.length > 0 && (userInvestments.filter(investmentInView=>investmentInView.investment.category !== 'Dollar').slice(0,3))?.map((mapData,index)=>(
                                            <View key={index} className="mb-2">
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
                                                    hideBallance={showBalance}
                                                />
                                            </View>
                                        ))}
                                        {!active && forSellData.length > 0 && forSellData.map((mapData,index)=>(
                                            <View key={index} className="mb-2">
                                                <InvestmentCard 
                                                    truncateValue={true}
                                                    logo = {mapData.investment.logo}
                                                    name = {mapData.investment.name}
                                                    duration = {mapData.investment.duration_days}
                                                    invested = {mapData.investment.price_per_unit * mapData.unit}
                                                    percentage = {mapData.rio}
                                                    date = {mapData.date_created}
                                                    _id={mapData.$id}
                                                    onSale={true}
                                                    darkTheme={darkTheme}
                                                    hideBallance={showBalance}
                                                />
                                            </View>
                                        ))}
                                        {active && notForSellData.length > 0 ? (
                                            <View className='mt-2'>
                                                <Link
                                                    href={"/portfolio"}
                                                    className={myClassConverter(
                                                        darkTheme,
                                                        `border text-center p-3 rounded-lg font-psemibold`,
                                                        "text-white border-[#3B3C43]",
                                                        "text-muted-300 border-border"
                                                    )}
                                                >
                                                    See all
                                                </Link>
                                            </View>
                                        ):(
                                            <>
                                                {active && (
                                                    <View className="mt-10">
                                                        <EmptyState
                                                            darkTheme={darkTheme}
                                                            title={"You have no Investments"}
                                                            subtitle={"You can start by investing in the available opportunities"}
                                                        />
                                                        <View className="items-center justify-center pt-5">
                                                            <CustomButton 
                                                                title="Explore investments"
                                                                textStyles={darkTheme === "dark" && "text-white"}
                                                                containerStyles="w-[180px] h-11 text-xs text-center"
                                                                handlePress={()=>router.push("/explore")}
                                                                darkTheme={darkTheme}
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
                                                    className={myClassConverter(
                                                        darkTheme,
                                                        `border text-center p-3 rounded-lg font-psemibold`,
                                                        "text-white border-[#3B3C43]",
                                                        "text-muted-300 border-border"
                                                    )}
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
                                                            truncateValue={true}
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
                                                            truncateValue={true}
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
                                            darkTheme={darkTheme}
                                            title={"You have no Investments"}
                                            subtitle={"You can start by investing in the available opportunities"}
                                        />
                                        <View className="items-center justify-center pt-5">
                                            <CustomButton 
                                                title="Explore investments"
                                                textStyles={darkTheme !== "dark" && "text-white"}
                                                containerStyles="w-[180px] h-11 text-xs text-center"
                                                handlePress={()=>router.push("/explore")}
                                                darkTheme={darkTheme}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                        <View>
                            <Media_and_stories darkTheme={darkTheme} setLastActive={setLastActive} refreshing={refreshing} />
                        </View>
                    </View>

                </ScrollView>

                <GeneralDrawer 
                    darkTheme={darkTheme}
                    heights={"50px"} 
                    isVisible={isDrawerVisible} 
                    onClose={() => setIsDrawerVisible(false)}
                >
                    <PaymentMethods user={user} darkTheme={darkTheme}/>
                </GeneralDrawer>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Home;
