import { View, Text, ImageBackground, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { icons, images } from '../constants'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet } from 'nativewind'
import Money from './Money'
import { router } from 'expo-router'
import { convertDaysToReadableFormat } from './dayConverter'
import { myClassConverter } from '@/lib/performActions'
import { MaterialIcons } from '@expo/vector-icons'

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
        category,
        darkTheme,
        short_info,
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
                `flex-1 h-[110px] rounded-lg overflow-hidden border`,
                "border-[#3B3C43]",
                "border-border"
            )}>
                <View className="w-full h-full flex flex-row gap-2 p-2">
                    
                    <Image
                        style={{
                            width: "20%",
                        }}
                        source={{uri: cover_image}}
                        resizeMode="cover"
                        className="w-full h-full rounded-lg"
                    />
                    <View className='flex-1'>
                        <View className="flex flex-row justify-between">
                            <View className="flex">
                                <View className={`
                                    bg-[#DDF6E7]
                                    flex-row ml-auto border-[#DDF6E7] border px-2 py-0.5 rounded-[30px]
                                `}>
                                    <Text className={`text-[#37733E] my-auto text-xs`}>
                                        {category}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex">
                                <View className={`
                                    ${status === null ? "bg-[#8080801A]" : "bg-[#DDF6E7]"} 
                                    flex-row ml-auto w-[80px] border-[#FFFFFF4D] border px-2 py-0.5 rounded-[30px]
                                `}>
                                    <Text className={`h-[5px] my-auto w-[5px] rounded-full ${status === null ? "bg-[#808080]" : "bg-secondary-100"}`}></Text>
                                    <Text className={`${status === null ? "text-[#808080]" : "text-[#37733E]"} my-auto pl-2 text-xs`}>
                                        {(status !== null) ? (status ? "Ongoing" : "Closed") : "Coming soon"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className='flex justify-between'>
                            <View className="flex">
                                <View className="flex pt-1 flex-row justify-between">
                                    <Text 
                                        style={{
                                            width: "70%",
                                        }}
                                    className={myClassConverter(
                                        darkTheme,
                                        `text-sm font-bold`,
                                        "text-white",
                                        "text-black-100"
                                    )}
                                    numberOfLines={1}
                                    >
                                        {name}
                                    </Text>
                                    <View>
                                        <MaterialIcons className='my-auto' name="chevron-right" size={20} color={darkTheme === "dark" ? "white" : "black"} />
                                    </View>
                                </View>
                                <View className="flex">
                                    <Text
                                        style={{
                                            width: "70%",
                                        }}
                                        className={myClassConverter(
                                            darkTheme,
                                            `text-xs font-[700] font-pmedium`,
                                            "text-[#FFFFFFB2]",
                                            "text-muted"
                                        )}
                                        numberOfLines={1}
                                    >
                                        {short_info}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View className='flex flex-row gap-2 mt-2'>
                            <View className='flex flex-row gap-2'>
                                <MaterialIcons className='my-auto' name="signal-cellular-alt" size={20} color={darkTheme === "dark" ? "white" : "#604B31"} />
                                <View>
                                    <View>
                                        <Text
                                            className={myClassConverter(
                                                darkTheme,
                                                `text-xs font-bold`,
                                                "text-white",
                                                "text-[#604B31]"
                                            )}
                                        >
                                            {rio}%
                                        </Text>
                                    </View>
                                     <View>
                                        <Text
                                            className={myClassConverter(
                                                darkTheme,
                                                `text-xs font-[700] font-pmedium`,
                                                "text-[#FFFFFFB2]",
                                                "text-muted"
                                            )}
                                        >
                                            Est. ROI
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View className='flex flex-row gap-2'>
                                <MaterialIcons className='my-auto' name="payments" size={20} color={darkTheme === "dark" ? "white" : "#604B31"} />
                                <View>
                                    <View>
                                        
                                        <Money 
                                            values={min_investment}
                                            containerStyle="flex"
                                            textStyle={myClassConverter(
                                                darkTheme,
                                                `font-bold text-xs`,
                                                "text-white",
                                                "text-[#604B31]"
                                            )}
                                        />
                                    </View>
                                     <View>
                                        <Text
                                            className={myClassConverter(
                                                darkTheme,
                                                `text-xs font-[700] font-pmedium`,
                                                "text-[#FFFFFFB2]",
                                                "text-muted"
                                            )}
                                        >
                                            Min. Investment
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className='flex flex-row gap-2'>
                                <MaterialIcons className='my-auto' name="calendar-month" size={20} color={darkTheme === "dark" ? "white" : "#604B31"} />
                                <View>
                                    <View>
                                        
                                        <Text
                                            className={myClassConverter(
                                                darkTheme,
                                                `text-xs font-bold max-w-[50px]`,
                                                "text-white",
                                                "text-[#604B31]"
                                            )}
                                            numberOfLines={1}
                                        >
                                            {convertDaysToReadableFormat(duration_days)}
                                        </Text>
                                    </View>
                                     <View>
                                        <Text
                                            className={myClassConverter(
                                                darkTheme,
                                                `text-xs font-[700] font-pmedium`,
                                                "text-[#FFFFFFB2]",
                                                "text-muted"
                                            )}
                                        >
                                            Returns
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>





{/* 
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
                                    {short_info}
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
                </View> */}
            </View>
        </TouchableOpacity>
    )
}

export default InvestmentDisplayCard