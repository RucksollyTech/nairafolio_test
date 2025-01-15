import { View, Text, ScrollView, Dimensions, Image, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolate,Extrapolation } from 'react-native-reanimated';
import { images } from "../../constants";
import { CustomButton, FormField } from '@/components'
import EmptyState from '../../components/EmptyState';
import Card from '../../components/Card';
import InvestmentCard from '../../components/InvestmentCard';
import { router } from 'expo-router';
import UTCDate from '../../components/UTCDate';
import { useGlobalContext } from '@/context/GlobalProvider';
import PaymentDrawer from '../../components/PaymentDrawer';

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
    const { user,loading, isLogged } = useGlobalContext();
    const width = Dimensions.get('window').width;
    const progressValue = useSharedValue(0); 
    const [active, setActive] = useState(true)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false)
    const toggler = (value)=>{
        setActive(value)
    }
    
    const {datetime} = UTCDate("2024-12-20T12:00:00Z")
    const investmentData = [
        {
            $id:1,
            logo:images.example,
            name: "Investment name",
            duration: 12,
            invested: 30000,
            percentage: 10,
            date: datetime,
        },
        {
            $id:2,
            logo:images.example,
            name: "Investment roll",
            duration: 15,
            invested: 40000,
            percentage: 20,
            date: datetime,
        },
        {
            $id:3,
            logo:images.example,
            name: "Investment drills",
            duration: 45,
            invested: 60000,
            percentage: 5,
            date: datetime,
        }
    ]
    const data=[
        {
            $id: 1,
            amount: 20000,
            title:"Wallet balance",
            body:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui quas illo dolorem quisquam facere ea, repudiandae sed saepe necessitatibus dolor delectus ad suscipit impedit blanditiis minus beatae quidem incidunt odit.",
            thumbnail: images.example,
        },
        {
            $id: 2,
            amount: 500000,
            title:"Investments",
            body:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui quas illo dolorem quisquam facere ea, repudiandae sed saepe necessitatibus dolor delectus ad suscipit impedit blanditiis minus beatae quidem incidunt odit.",
            thumbnail: images.example,
        }
    ]
    
    // const dataz =`
    //  {"$collectionId": "6782f79900093bb2969a", "$createdAt": "2025-01-12T09:44:31.764+00:00", "$databaseId": "6782f35d0018fef1ae8c", "$id": "67838eff0027fd6c1f9e", "$permissions": ["read(\"user:67838efc002bf1e96bd9\")", "update(\"user:67838efc002bf1e96bd9\")", "delete(\"user:67838efc002bf1e96bd9\")"], "$updatedAt": "2025-01-12T09:44:31.764+00:00", "accountId": "67838efc002bf1e96bd9", "avatar": "https://cloud.appwrite.io/v1/avatars/initials?name=Anthony+somebody&project=6782ee210030356b6a95", "email": "chibuzoranthonyokenwa@gmail.com", "investment_ballance": 0, "is_verified": false, 
    //  "name": "Anthony somebody", "phone": "9052184171", "userInvestment": [], "wallet_ballance": 0}
    // `
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
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
                                        amount: user.investment_ballance,
                                        title:"Investments",
                                    },{
                                        $id: 2,
                                        amount: user.wallet_ballance,
                                        title:"Wallet balance",
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
                                    amount: user.investment_ballance,
                                    title:"Investments",
                                },{
                                    $id: 2,
                                    amount: user.wallet_ballance,
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
                    <View className="px-5">
                        {active ? (
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
                        ) : (
                            <View className="mt-6 min-h-[225px]">
                                {investmentData && investmentData.map(({logo,name,duration,percentage,invested,date,$id},index)=>(
                                    <View key={index} className="mb-2">
                                        <InvestmentCard 
                                            logo = {logo}
                                            name = {name}
                                            duration = {duration}
                                            invested = {invested}
                                            percentage = {percentage}
                                            date = {date}
                                            _id={$id}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                    
                </View>
            </ScrollView>
            <PaymentDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
        </SafeAreaView>
    );
};

export default Home;
