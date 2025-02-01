import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { icons } from '../constants'

const AccountComponets = ({icon,link,title,subtitle,verified,verificationData}) => {
    const moveToPage=()=>{
        if(verificationData)return
        router.push(link)
    }
    return (
        <View className="py-4 border-b border-border-300">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={moveToPage}
            >
                <View 
                    className="
                        flex-1 
                        rounded-lg
                        flex 
                        py-2 flex-row
                    "
                >
                    <View
                        className="h-14 w-14 bg-[#F5F5F5] rounded-full items-center justify-center"
                    >
                        <Image
                            source={icon}
                            resizeMode="cover"
                        />
                    </View>
                    <View
                        style={{
                            width: "74.54%",
                        }}
                        className="flex-1 pl-3 my-auto "
                    >
                        {verified ? (
                            <View className="my-auto justify-between flex-row flex-1">
                                <View className="w-[70%]">
                                    <View>
                                        <Text
                                            className="text-lg text-header-200 font-psemibold"
                                        >
                                            {title}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-muted text-sm">
                                            {subtitle} 
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-1 w-[30%] justify-center items-end">
                                    {verificationData ? (
                                        <Text
                                            className="text-sm text-green-500 font-pmedium text-right font-[700]" 
                                        >
                                            Verified
                                        </Text>
                                    ):(
                                        <Text
                                            className="text-sm text-red-500 font-pmedium text-right font-[700]" 
                                        >
                                            Unverified
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <>
                                <View>
                                    <Text
                                        className="text-lg text-header-200  font-psemibold"
                                    >
                                        {title}
                                    </Text>
                                </View>
                                {subtitle && (
                                    <View>
                                        <Text className="text-muted text-sm">
                                            {subtitle} 
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                    <View
                        style={{
                            width: "10.08%",
                        }}
                        className="items-center justify-center flex-row"
                    >
                        <Image 
                            source={icons.arrow_right_italic}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default AccountComponets