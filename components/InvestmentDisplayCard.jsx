import { View, Text, ImageBackground, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { icons, images } from '../constants'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'nativewind'
import Money from './Money'
import { router } from 'expo-router'
import { convertDaysToReadableFormat } from './dayConverter'
import { myClassConverter } from '@/lib/performActions'

const InvestmentDisplayCard = (
    {
        _id,
        status,
        cover_image,
        logo,
        name,
        total_investors,
        rio,
        min_investment,
        duration_days,
        company_name,
        company_owner,
        darkTheme
    }
) => {
    const iOSStyleSetter = ()=>{
        if(Platform.OS === 'ios'){
            return {height:180, padding: 18}
        }
        return {position:"relative"}
    }
    return (
        <TouchableOpacity
            onPress={()=>router.push(`/investment/new/${_id}`)}
            activeOpacity={0.8}
            className={darkTheme === "dark" ? "dark" : ""}
        >
            <View className={myClassConverter(
                darkTheme,
                `flex-1 rounded-lg shadow overflow-hidden border`,
                "border-[#3B3C43]",
                "border-border"
            )}>
                <ImageBackground
                    source={{uri: cover_image}}
                    resizeMode="cover"
                    className="w-full h-[180px] rounded-[8px_8px_0_0] flex-1 relative"
                >
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']} // Ensure transparency at the top
                        start={{ x: 0.5, y: 0.405 }}
                        end={{ x: 0.5, y: 1 }}
                        style={iOSStyleSetter()}
                        className="h-full p-6 items-center justify-center absolute top-0 left-0 right-0 bottom-0"
                    >
                        <View className="w-full mt-auto">
                            <Text 
                                className="font-psans text-3xl text-white"
                                numberOfLines={2}
                            >
                                {name} 
                            </Text>
                            <View>
                                <Text className="text-[#FDFDFD99] text-base">
                                    Investment opportunity
                                </Text>
                            </View>
                            <View className="flex">
                                <View className={`
                                    ${status === null ? "bg-[#8080801A]" : "bg-[#13664B80]"} 
                                    flex-row ml-auto w-[80px] border-[#FFFFFF4D] border px-2 py-1 rounded-[30px]
                                `}>
                                    <Text className={`h-[5px] my-auto w-[5px] rounded-full ${status === null ? "bg-[#808080]" : "bg-secondary-100"}`}></Text>
                                    <Text className={`${status === null ? "text-[#808080]" : "text-white"} my-auto pl-2 text-sm`}>
                                        {(status !== null) ? (status ? "Ongoing" : "Closed") : "Coming soon"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View className={myClassConverter(
                    darkTheme,
                    `p-3`,
                    "bg-[#242730]",
                    "bg-white"
                )}>
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-lg font-pregular font-[700]`,
                        "text-white",
                        "text-black-100"
                    )}>
                        {name}
                    </Text>
                    <View className="py-2">
                        <Text className="text-sm font-pregular font-[700] text-secondary-100">
                            {total_investors} investors
                        </Text>
                    </View>
                    <View className="flex flex-row flex-wrap gap-4 mt-2">
                        <View className={myClassConverter(
                            darkTheme,
                            `flex items-center 
                            justify-center border px-3 py-2 rounded-lg`,
                            "bg-[#303540] border-[#00000014] ",
                            "bg-[#F6F6F6] border-border "
                        )}>
                            <View className="flex flex-row ">
                                <Image
                                    source={icons.roi}
                                    resizeMode="contain"
                                    className="my-auto"
                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                />
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `font-pmedium ml-2 my-auto font-[600] text-base`,
                                    "text-[#FFFFFF99]",
                                    "text-muted-200"
                                )}>
                                    {rio}% ROI
                                </Text>
                            </View>
                        </View>
                        <View className={myClassConverter(
                            darkTheme,
                            `flex items-center justify-center border px-3 py-2 rounded-lg`,
                            "border-[#00000014] bg-[#303540]",
                            "bg-[#F6F6F6] border-border"
                        )}>
                            <View className="flex flex-row">
                                <Image
                                    source={icons.money}
                                    resizeMode="contain"
                                    className="my-auto"
                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                />
                                <View className="flex flex-row ">
                                    <Money 
                                        value={min_investment}
                                        containerStyle="flex"
                                        textStyle={myClassConverter(
                                            darkTheme,
                                            `font-pmedium ml-2 my-auto font-[600] text-base`,
                                            "text-[#FFFFFF99]",
                                            "text-muted-200"
                                        )}
                                    />
                                    <View className="flex flex-row ">
                                        <Text className={myClassConverter(
                                            darkTheme,
                                            `font-pmedium ml-2 my-auto font-[600] text-base`,
                                            "text-[#FFFFFF99]",
                                            "text-muted-200"
                                        )}>
                                            min
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {!!duration_days && (
                            <View className={myClassConverter(
                                darkTheme,
                                `flex items-center justify-center border px-3 py-2 rounded-lg`,
                                "border-[#00000014] bg-[#303540]",
                                "bg-[#F6F6F6] border-border"
                            )}>
                                <View className="flex flex-row ">
                                    <Image
                                        source={icons.calender}
                                        resizeMode="contain"
                                        className="my-auto"
                                        tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                    />
                                    <Text className={myClassConverter(
                                        darkTheme,
                                        `font-pmedium ml-2 my-auto font-[600] text-base`,
                                        "text-[#FFFFFF99]",
                                        "text-muted-200"
                                    )}>
                                        {convertDaysToReadableFormat(duration_days)} returns
                                    </Text>
                                </View>
                            </View>
                        )}
                        
                    </View>
                    <View className="mt-4">
                        <View 
                            className={myClassConverter(
                                darkTheme,
                                `flex-1 
                                flex 
                                pt-3 flex-row
                                border-t`,
                                "border-[#3B3C43]",
                                "border-border"
                            )}
                        >
                            <View
                                style={{
                                    width: "15.38%",
                                }}
                                className="h-full"
                            >
                                <Image
                                    source={{uri: logo}}
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
                                    <Text className={myClassConverter(
                                        darkTheme,
                                        `text-sm`,
                                        "text-white",
                                        "text-muted-300"
                                    )}>
                                        {company_name}
                                    </Text>
                                    <Text
                                        className={myClassConverter(
                                            darkTheme,
                                            `text-lg font-[700] pt-1 font-pmedium`,
                                            "text-white",
                                            "text-muted-300"
                                        )}
                                    >
                                        {company_owner}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default InvestmentDisplayCard