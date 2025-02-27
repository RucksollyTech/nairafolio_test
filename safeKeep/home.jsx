import { View, Text, ScrollView, Dimensions, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolate,Extrapolation } from 'react-native-reanimated';
import { images } from "../../constants";
import { CustomButton } from '@/components'
import EmptyState from '../../components/EmptyState';
import InvestmentCard, { calculateProfit } from '../../components/InvestmentCard';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import useAppwrite from '../../lib/useAppwrite';
import { getUserInvestments } from '../../lib/appwrite';
import HomeSkeletonLoader from '../../components/HomeSkeletonLoader';
import { getCurrentUser } from '@/lib/appwrite'
import { RefreshControl } from 'react-native';
import GeneralDrawer from '../../components/GeneralDrawer';
import PaymentMethods from '../../components/PaymentMethods';
import UTCDate from '../../components/UTCDate';
import ToggleButtons from '../../components/ToggleButtons';

const CustomCarousel = ({data,width,progressValue,setIsDrawerVisible}) =>(
    <Carousel
        loop
        width={width - 48}
        height={130}
        autoPlay={true}
        autoPlayInterval={10000}
        data={data}
        scrollAnimationDuration={1000}
        onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}
        renderItem={({ item:{amount,title} }) => (
            <View
                className="
                    bg-secondary flex-1 
                    justify-center 
                    border-[#00000014] 
                    rounded-lg
                "
            >
                <View className="relative flex">
                    <View className="absolute inset-0 z-10 p-5">
                        <View className="flex flex-row justify-between">
                            <View>
                                <View>
                                    <Text className="text-muted text-base">
                                        {title}
                                    </Text>
                                </View>
                                <View className="mt-2">
                                    <Text className={`text-black-100 ${amount.toLocaleString().length > 9 ? "text-xl" : "text-4xl"} font-psans`}>
                                        ₦{amount.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                            {title !== "Investments" && (
                                <View>
                                    <CustomButton 
                                        title="Top up"
                                        textStyles="text-white"
                                        containerStyles="w-[76px] h-9 text-xs item-end"
                                        handlePress={()=>setIsDrawerVisible(true)}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                    <Image
                        source={images.home_bg_img}
                        className={`h-full ml-auto `}
                        resizeMode='cover'
                    />
                </View>
            </View>
        )}
    />
)
const MemoizedCarousel = React.memo(CustomCarousel);
const Home = () => {
    const { user,setUser } = useGlobalContext();
    const { data:userInvestments, loading, refetch } = useAppwrite(()=>getUserInvestments(user?.$id))

    const width = Dimensions.get('window').width;
    const progressValue = useSharedValue(0); 
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
        await Promise.all([refetch(),checkActiveUser()])
        setRefreshing(false)
    }
    const handleTotalInvestmentBalance = ()=>{
        let totalInvestment = 0
        if(userInvestments){
            userInvestments.forEach(investment=>{
                const {daysGone} = UTCDate(investment.date_created)
                const dataForProfit = {
                    percentage:investment.investment.rio,
                    daysGone,
                    invested:investment.investment.price_per_unit * investment.unit,
                    duration:investment.investment.duration_days
                }
                totalInvestment += ((investment.investment.price_per_unit * investment.unit) + calculateProfit(dataForProfit))
            })
        }
        return totalInvestment
    }
    const hasSold = !!userInvestments?.some(solds => solds?.is_up_for_sell) || false;
    useEffect(() => {
        if(userInvestments){
            const hasSolds = userInvestments?.some(solds => solds?.is_up_for_sell) || false;
            setHasoldx(hasSolds);
        }
    }, [userInvestments]);

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
                        <View className="px-5">
                            <View className="pt-10">
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
                    </LinearGradient>

                    <View className="px-5 mt-5 flex-1">
                        <View
                            // className="rounded-lg mb-5 drop-shadow-card"
                            className="rounded-lg mb-5 shadow-card"
                        >
                            <MemoizedCarousel 
                                width={width}
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
                                progressValue={progressValue}
                                setIsDrawerVisible={setIsDrawerVisible}
                            />
                        </View>

                        <View className="flex-row justify-center items-center mt-3">
                            {[
                                {
                                    $id: 1,
                                    amount: 0,
                                    title:"Investments",
                                },{
                                    $id: 2,
                                    amount: user?.wallet_balance ?? 0,
                                    title:"Wallet balance",
                                }
                            ].map((_, index) => {
                                const animatedStyle = useAnimatedStyle(() => {
                                const inputRange = [index - 1, index, index + 1];
                                const scale = interpolate(
                                    progressValue.value,
                                    inputRange,
                                    [1, 1.5, 1],
                                    Extrapolation.CLAMP
                                );
                                const opacity = interpolate(
                                    progressValue.value,
                                    inputRange,
                                    [0.5, 1, 0.5],
                                    Extrapolation.CLAMP
                                );

                                    return {
                                        transform: [{ scale }],
                                        opacity,
                                    };
                                });

                                return (
                                    <Animated.View
                                        key={index}
                                        className="w-2 h-2 rounded-full bg-primary mx-1"
                                        style={animatedStyle}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    {(hasoldx || hasSold) && (
                        <ToggleButtons
                            active={active}
                            toggler={toggler}
                            title1={"Investments"}
                            title2={"Up for sale"}
                        />
                    )}
                    {loading ? (
                        <View className="px-5 mt-6">
                            <HomeSkeletonLoader />
                        </View>
                    ) : (
                        <View className="px-5">
                            {(userInvestments && userInvestments.length > 0) ? (
                                <View className="mt-6 min-h-[225px]">
                                    {userInvestments.map((mapData,index)=>{
                                        if(active && !mapData.is_up_for_sell && !mapData.sold){
                                            return(
                                                <View key={index} className="mb-2">
                                                    <InvestmentCard 
                                                        logo = {mapData.investment.logo}
                                                        name = {mapData.investment.name}
                                                        duration = {mapData.investment.duration_days}
                                                        invested = {mapData.investment.price_per_unit * mapData.unit}
                                                        percentage = {mapData.investment.rio}
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
                                                        percentage = {mapData.investment.rio}
                                                        date = {mapData.date_created}
                                                        _id={mapData.$id}
                                                        onSale={true}
                                                    />
                                                </View>
                                            )
                                        }
                                    })}
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
