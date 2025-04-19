import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { icons } from '../constants'
import { myClassConverter } from '@/lib/performActions'

const AccountComponets = ({icon,link,title,subtitle,verified,verificationData,darkTheme,tintColor}) => {
    const moveToPage=()=>{
        if(verificationData)return
        router.push(link)
    }
    return (
        <View className={darkTheme === "dark" ? "dark" : ""}>
            <View className={myClassConverter(
                darkTheme,
                `py-4 border-b`,
                "border-[#495161]",
                "border-border-300"
            )}>
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
                            className={myClassConverter(
                                darkTheme,
                                `h-14 w-14 rounded-full items-center justify-center`,
                                "bg-dark_mode-300",
                                "bg-[#F5F5F5]"
                            )}
                        >
                            {tintColor ? (
                                <Image
                                    source={icon}
                                    resizeMode="cover"
                                    tintColor={tintColor}
                                />
                            ):(
                                <Image
                                    source={icon}
                                    resizeMode="cover"
                                />
                            )}
                            
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
                                                className={myClassConverter(
                                                    darkTheme,
                                                    `text-lg font-psemibold`,
                                                    "text-white",
                                                    "text-header-200"
                                                )}
                                            >
                                                {title}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className={myClassConverter(
                                                darkTheme,
                                                `text-sm`,
                                                "text-[#FFFFFFB2]",
                                                "text-muted"
                                            )}>
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
                                            className={myClassConverter(
                                                darkTheme,
                                                `text-lg font-psemibold`,
                                                "text-white",
                                                "text-header-200"
                                            )}
                                        >
                                            {title}
                                        </Text>
                                    </View>
                                    {subtitle && (
                                        <View>
                                            <Text className={myClassConverter(
                                                darkTheme,
                                                `text-sm`,
                                                "text-[#FFFFFFB2]",
                                                "text-muted"
                                            )}>
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
                                tintColor={darkTheme === "dark" ? "#FFFFFF" : "#000000"}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AccountComponets