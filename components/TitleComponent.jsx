import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const TitleComponent = () => {
    return (
        <View>
            <View className="border border-border bg-[#F8FAFA] rounded-lg mt-5">
                <View 
                    className="
                        flex-1 
                        p-5 flex-row
                        border-b
                        border-border
                    "
                >
                    <View
                        className="
                            h-14 w-14 
                            rounded-full 
                            bg-[#DFE7E8]
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
                        />
                    </View>
                    <View
                        style={{
                            width: "61.54%",
                        }}
                        className="flex-1 pl-2 "
                    >
                        <View className="my-auto">
                            <Text
                                className="text-xl font-[700] font-pmedium text-muted-300"
                            >
                                Title
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "23.08%",
                        }}
                        className="flex-1 flex"
                    >
                        <View className="ml-auto my-auto">
                            <Image 
                                source={icons.arrow_right_italic}
                                resizeMode="contain"
                                className="my-auto"
                            />
                        </View>
                    </View>
                </View>
                <View className="p-5">
                    <Text className="text-muted-200 text-lg font-pregular">
                        Updates and announcements for the month of December
                    </Text>
                    <View className="pt-2 w-full">
                        <Text className="text-muted-200 text-right text-sm font-pmedium font-[700]">
                            December 13th, 2023
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default TitleComponent