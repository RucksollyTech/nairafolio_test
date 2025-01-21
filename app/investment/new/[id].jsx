import { View, Text, ScrollView, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons, images } from '../../../constants'
import Money from '../../../components/Money'
import CustomButton from '../../../components/CustomButton'
import {Collapsible} from '../../../components/Collapsible'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { router } from 'expo-router'
import ToggleButtons from '../../../components/ToggleButtons'
import PaymentDrawer from '../../../components/PaymentDrawer'
import useAppwrite from '../../../lib/useAppwrite'
import { getInvestment } from '@/lib/appwrite'
import { convertDaysToReadableFormat } from '../../../components/dayConverter'
import { RefreshControl } from 'react-native'


const Investment = () => {
    const {id} = useLocalSearchParams();
    const { data:listData, loading, refetch } = useAppwrite(()=>getInvestment(id))
    let data = listData && listData[0]
    const navigation = useNavigation();
    const [active, setActive] = useState(true)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const toggler = (value)=>{
        setActive(value)
    }

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
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
                            <TouchableOpacity
                                className="pt-5"
                                onPress={()=>navigation.goBack()}
                            >
                                <Image
                                    source={icons.arrow_left}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <View className="pt-5 px-5">
                        <View 
                            className="
                                flex-1 
                                flex 
                                pt-3 flex-row
                            "
                        >
                            <View
                                style={{
                                    width: "15.38%",
                                }}
                                className="h-full"
                            >
                                <Image
                                    source={{uri: data?.logo}}
                                    resizeMode="cover"
                                    className="h-14 w-14 rounded-full"
                                />
                            </View>
                            <View
                                style={{
                                    width: "84.62%",
                                }}
                                className="flex-1 px-3 "
                            >
                                <View>
                                    <Text className="text-sm text-muted-300">
                                        {data?.company_name}
                                    </Text>
                                    <Text
                                        className="text-lg font-[700] pt-1 font-pmedium text-muted-300"
                                    >
                                        {data?.company_owner}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className="flex-1 mt-5 rounded-lg shadow overflow-hidden border border-border">
                            <ImageBackground
                                source={{uri: data?.cover_image}}
                                resizeMode="cover"
                                className="w-full h-[180px] rounded-[8px_8px_0_0] flex-1 "
                            >
                                <LinearGradient
                                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']} // Ensure transparency at the top
                                    start={{ x: 0.5, y: 0.405 }}
                                    end={{ x: 0.5, y: 1 }}
                                    style={StyleSheet.absoluteFillObject}
                                    className="h-full p-6 items-center justify-center"
                                >
                                    <View className="w-full mt-auto">
                                        <Text 
                                            className="font-psans text-3xl text-white"
                                            numberOfLines={2}
                                        >
                                            {data?.name}
                                        </Text>
                                        <View>
                                            <Text className="text-[#FDFDFD99] text-base">
                                                Investment opportunity
                                            </Text>
                                        </View>
                                        
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </View>
                        <View className="bg-white py-3">
                            <Text className="text-xl font-pregular font-[700] text-black-100 ">
                                {data?.name}
                            </Text>
                            <View className="py-2">
                                <View className="flex flex-row justify-between">
                                    <View className="flex flex-row ">
                                        <Money 
                                            value={data?.price_per_unit ?? 0}
                                            containerStyle="flex"
                                            textStyle="font-psans my-auto font-[600] text-xl text-secondary-100"
                                        />
                                        <View className="flex flex-row ">
                                            <Text className="font-pmedium my-auto font-[600] text-base text-muted-100">
                                                /unit
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="my-auto">
                                        <View className="flex">
                                            <View className={`
                                                ${data?.status === null ? "bg-[#8080801A]" : "bg-[#00A6511A]"} 
                                                flex-row ml-auto w-[80px] border-[#FFFFFF4D] border px-2 py-1 rounded-[30px]
                                            `}>
                                                <Text className={`h-[5px] my-auto w-[5px] rounded-full ${data?.status === null ? "bg-[#808080]" : "bg-secondary-100"}`}></Text>
                                                <Text className={`${data?.status === null ? "text-[#808080]" : "text-secondary-100"} my-auto pl-2 text-sm`}>
                                                    {(data?.status !== null) ? (data?.status ? "Ongoing" : "Closed") : "Coming soon"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="pt-5 px-5 border-t border-border-100 flex-1">
                        <Text className="text-muted text-base">
                            Highlights
                        </Text>
                        <View className="flex flex-row gap-4 mt-3 flex-1 pt-1">
                            <View className="flex w-[48%] items-center justify-center bg-[#F6F6F6] border border-border-200 px-3 py-2.5 rounded-lg">
                                <View>
                                    <Image
                                        source={icons.roi}
                                        resizeMode="contain"
                                        className="my-auto"
                                    />
                                </View>
                                <View className="mt-2">
                                    <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">
                                        {data?.rio ?? 1}% ROI
                                    </Text>
                                </View>
                            </View>
                            <View className="flex w-[48%] items-center justify-center bg-[#F6F6F6] border border-border-200 px-3 py-2.5 rounded-lg">
                                <View>
                                    <Image
                                        source={icons.money}
                                        resizeMode="contain"
                                        className="my-auto"
                                    />
                                </View>
                                <View className="mt-2">
                                    <View className="flex flex-row ">
                                        <Money 
                                            value={data?.min_investment ?? 0}
                                            containerStyle="flex"
                                            textStyle="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200"
                                        />
                                        <View className="flex flex-row ">
                                            <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">
                                                min
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View className="flex mt-4 items-center justify-center bg-[#F6F6F6] border border-border-200 px-3 py-2.5 rounded-lg">
                            <View>
                                <Image
                                    source={icons.calender}
                                    resizeMode="contain"
                                    className="my-auto"
                                />
                            </View>
                            <View className="mt-2">
                                <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">
                                    {convertDaysToReadableFormat(data?.duration_days ?? 0)} returns
                                </Text>
                            </View>
                        </View>
                        <View className="mt-4 items-center justify-center flex-1">
                            {data && data?.total_investors > 0 && (
                                <Text className="text-muted-200">
                                    Join{" "}<Text className="text-secondary-100">{data?.total_investors ?? 0} Investors</Text>
                                </Text>
                            )}
                            <CustomButton 
                                title="Invest Now" 
                                containerStyles="w-full h-16 mt-4" 
                                textStyles="font-psans !text-white text-lg" 
                                handlePress={() => setIsDrawerVisible(true)}
                            />
                        </View>
                    </View>
                    <ToggleButtons
                        active={active}
                        toggler={toggler}
                        title1={"Overview"}
                        title2={"Reports"}
                    />
                    <View className="px-5 pt-7">
                        {active && (
                            <View>
                                <View className="mb-10">
                                    <View className="border-b pb-2 border-border-200">
                                        <Text className="text-muted-200 font-pmedium font-[600] text-lg">
                                            Introduction
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-black-300 text-lg font-pregular font-[600]">
                                            {data?.introduction ?? ""}
                                        </Text>
                                    </View>
                                </View>
                                <View className="mb-7">
                                    <View className="border-b pb-2 border-border-200">
                                        <Text className="text-muted-200 font-pmedium font-[600] text-lg">
                                            Objective
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-black-300 text-lg font-pregular font-[600]">
                                            {data?.objective ?? ""}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        {!active && (
                            <View>
                                <View className="mb-7">
                                    <View className="border-b pb-2 border-border-200">
                                        <Text className="text-muted-200 font-pmedium font-[600] text-lg">
                                            Reports
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-black-300 text-lg font-pregular font-[600]">
                                            {data?.reports ?? ""}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        {(data?.images && data?.images.length>0) && (
                            <View className="my-5">
                                <View className="border-b pb-2 border-border-200">
                                    <Text className="text-muted-200 font-pmedium text-lg">
                                        Images
                                    </Text>
                                </View>
                                <View>
                                    <ScrollView 
                                        horizontal 
                                        showsHorizontalScrollIndicator={false}
                                        className="pt-3"
                                    >
                                        {data?.images.map((imageData,index) => (
                                            <View key={index} className="pr-3">
                                                <Image 
                                                    source={{uri : imageData.image}} 
                                                    resizeMode="cover"
                                                    style={{width: 100, height: 70}}
                                                    className="rounded-md"
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                        {(data?.riskFactors && data?.riskFactors.length > 0) && (
                            <View className="my-12 rounded-lg bg-[#F6F6F6]">
                                <View className="flex flex-row p-4 border-b border-border-200">
                                    <View className="bg-[#D82F2F1A] rounded-full h-10 w-10 items-center justify-center">
                                        <Image
                                            source={icons.alert}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <View className="my-auto ml-2">
                                        <Text className="text-muted font-pmedium text-lg">
                                            Risk factors
                                        </Text>
                                    </View>
                                </View>

                                <View className="p-4">
                                    {data?.riskFactors.map((riskData,index)=>(
                                        <View className="flex-row flex mb-10" key={index}>
                                            <View className="w-6">
                                                <Text className="text-2xl">•</Text>
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-black-200 text-lg font-pregular">
                                                    {riskData.body}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        {(data?.faq && data?.faq.length > 0) && (
                            <>
                                <View className="mt-5">
                                    <Text className="text-muted font-pmedium text-lg">
                                        FAQs
                                    </Text>
                                </View>
                                <View className="mt-5">
                                    {data?.faq.map((faqData,index)=>(
                                        <View key={index} className="border border-border-100 rounded-lg mb-4">
                                            <Collapsible title={faqData.title}>
                                                <Text>{faqData.body}</Text>
                                            </Collapsible>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </View>
                    <View className="my-10 p-5 border-t border-border-100">
                        <View className="items-center justify-center flex-1">
                            {data && data?.total_investors > 0 && (
                                <Text className="text-muted-200">
                                    Join{" "}<Text className="text-secondary-100">{data?.total_investors ?? 0} Investors</Text>
                                </Text>
                            )}
                            <CustomButton 
                                title="Invest Now" 
                                containerStyles="w-full h-16 mt-4" 
                                textStyles="font-psans !text-white text-lg" 
                                handlePress={() => setIsDrawerVisible(true)}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            {data && (
                <PaymentDrawer 
                    isVisible={isDrawerVisible} 
                    onClose={() => setIsDrawerVisible(false)} 
                    investment={data}
                />
            )}
        </SafeAreaView>
    )
}

export default Investment