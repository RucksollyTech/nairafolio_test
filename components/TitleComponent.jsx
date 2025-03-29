import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import UTCDate from './UTCDate'
import { Link } from 'expo-router'

const TitleComponent = ({item}) => {
    const {title,body,$createdAt,$id,darkTheme,lines} = item
    console.log({darkTheme,lines})
    return (
        <View className={darkTheme === "dark" ? "dark" : ""}>
            <View className="border flex-1 border-border dark:border-[#495161] bg-[#F8FAFA] dark:bg-[#303540] rounded-lg mt-5">
                <View 
                    className="
                        flex-1 
                        p-5 flex-row
                        border-b
                        border-border dark:border-[#3B3C43]
                    "
                >
                    <View
                        className="
                            h-14 w-14 
                            rounded-full 
                            bg-[#DFE7E8]
                            dark:bg-[#CBF5B84D]
                            items-center 
                            justify-center
                        "
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
                                    className="text-xl w-full font-[700] font-pmedium text-muted-300 dark:text-white"
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
                        <Text numberOfLines={lines ? undefined : 3} className="text-muted-200 dark:text-[#FFFFFF99] text-lg font-pregular">
                            <Link href={`/update/${$id}`}>
                                {body}
                            </Link>
                        </Text>
                    <View className="pt-2 w-full">
                        <Text className="text-muted-200 dark:text-[#FFFFFF99] text-right text-sm font-pmedium font-[700]">
                            {UTCDate($createdAt)?.myDateFormat}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default TitleComponent