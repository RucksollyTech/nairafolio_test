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
import ToggleButtons from '../../components/ToggleButtons';

const CustomCarousel = ({data,width,progressValue}) =>(
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
                                    <Text className="text-muted dark:text-[#FFFFFFB2] text-base">
                                        {title}
                                    </Text>
                                </View>
                                <View className="mt-2">
                                    <Text className={`text-black-100 dark:text-white ${amount.toLocaleString().length > 9 ? "text-xl" : "text-4xl"} font-psans`}>
                                        ₦{amount.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <CustomButton 
                                    title="Top up"
                                    textStyles="text-white"
                                    containerStyles="w-[76px] h-9 text-xs item-end"
                                    handlePress={()=>router.push("/home")}
                                />
                            </View>
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
    const width = Dimensions.get('window').width;
    const progressValue = useSharedValue(0); 
    const [adjWidth, setAdjWidth] = useState(width ? width/2 : 0)
    const [active, setActive] = useState(true)
    const toggler = (value)=>{
        setActive(value)
    }
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
    useEffect(() => {
        if(width){
            setAdjWidth(width/2)
        }
    }, [width])
    
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <FlatList 
                data={data}
                keyExtractor={(item) => item.$id}
                numColumns={2}
                contentContainerStyle={{ paddingBottom : 15}}
                columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 15 }}
                renderItem={({ item:{title,thumbnail,body} }) => (
                    <View className="flex-1 px-2 py-2">
                        <Card
                            title={title}
                            thumbnail={thumbnail}
                            body={body}
                        />
                    </View>
                )}
                ListHeaderComponent={()=>(
                    <View className="flex-1 h-full">
                        {/* <LinearGradient
                            colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                            start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
                            end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
                        >
                            <View className="px-5">
                                <View className="pt-10">
                                    <Text className="text-muted dark:text-[#FFFFFFB2] font-psemibold font-semibold text-sm">
                                        Welcome,
                                    </Text>
                                </View>
                                <View className="pt-1">
                                    <Text className="text-black-100 dark:text-white font-psans text-xl">
                                        David Gabriel
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient> */}

                        <View className="px-5 mt-5 flex-1">
                            <View
                                // className="rounded-lg mb-5 drop-shadow-card"
                                className="rounded-lg mb-5 shadow-card"
                            >
                                <MemoizedCarousel 
                                    width={width}
                                    data={data}
                                    progressValue={progressValue}
                                />
                            </View>

                            <View className="flex-row justify-center items-center mt-3">
                                {data.map((_, index) => {
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
                        <ToggleButtons 
                            active={active}
                            toggler={toggler}
                        />
                        <View className="mt-16">
                            <EmptyState
                                title={"You have no Investments"}
                                subtitle={"You can start by investing in the available opportunities"}
                            />
                        </View>
                        <View className="mt-16 mx-6">
                            <View className="mb-2">
                                <Text className="font-psans text-lg text-black-100 dark:text-white">
                                    Media and stories
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                // refreshControl={
                // <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                // }
            />
        </SafeAreaView>
    );
};

export default Home;
