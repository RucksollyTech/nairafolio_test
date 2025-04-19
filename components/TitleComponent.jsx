import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import UTCDate from './UTCDate'
import { Link } from 'expo-router'
import { myClassConverter } from '@/lib/performActions'

const TitleComponent = ({item}) => {
    const {title,body,$createdAt,$id,darkTheme,lines} = item
    return (
        <View className={darkTheme === "dark" ? "dark" : ""}>
            <View className={myClassConverter(
                darkTheme,
                `border flex-1 rounded-lg mt-5`,
                "border-[#495161] bg-[#303540]",
                "border-border bg-[#F8FAFA]"
            )}>
                <View 
                    className={myClassConverter(
                        darkTheme,
                        `flex-1 
                        p-5 flex-row
                        border-b`,
                        "border-[#3B3C43]",
                        "border-border"
                    )}
                >
                    <View
                        className={myClassConverter(
                            darkTheme,
                            `h-14 w-14 
                            rounded-full 
                            items-center 
                            justify-center`,
                            "bg-[#CBF5B84D]",
                            "bg-[#DFE7E8]"
                        )}
                    >
                        <Image
                            source={icons.file}
                            resizeMode="contain"
                            className="
                                w-6 
                                rounded-full
                            "
                            tintColor={darkTheme === "dark" ? "#CBF5B8" : "#014148"}
                        />
                    </View>
                    <View
                        style={{
                            width: "79.54%",
                        }}
                        className="flex-1 pl-2 pr-1"
                    >
                        <View className="my-auto w-full">
                            <Link href={`/update/${$id}`}>
                                <Text
                                    numberOfLines={lines ? undefined : 2}
                                    className={myClassConverter(
                                        darkTheme,
                                        `text-xl w-full font-[700] font-pmedium`,
                                        "text-white",
                                        "text-muted-300"
                                    )}
                                >
                                    {title}
                                </Text>
                            </Link>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "5.08%",
                        }}
                    >
                        <View className="ml-auto my-auto">
                            <Link href={`/update/${$id}`}>
                                <Image 
                                    source={icons.arrow_right_italic}
                                    resizeMode="contain"
                                    className="my-auto"
                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                />
                            </Link>
                        </View>
                    </View>
                </View>
                <View className="p-5">
                    <Text 
                        numberOfLines={lines ? undefined : 3} 
                        className={myClassConverter(
                            darkTheme,
                            `text-lg font-pregular`,
                            "text-[#FFFFFF99]",
                            "text-muted-200"
                        )}>
                        <Link href={`/update/${$id}`}>
                            {body}
                        </Link>
                    </Text>
                    <View className="pt-2 w-full">
                        <Text className={myClassConverter(
                            darkTheme,
                            `text-right text-sm font-pmedium font-[700]`,
                            "text-[#FFFFFF99]",
                            "text-muted-200"
                        )}>
                            {UTCDate($createdAt)?.myDateFormat}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default TitleComponent