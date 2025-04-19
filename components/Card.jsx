import { View, Text, Image } from 'react-native'
import React from 'react'
import { myClassConverter } from '@/lib/performActions'

const Card = ({title,body,thumbnail,darkTheme}) => {
    return (
        <View className={darkTheme === "dark" ? "flex-1 dark" : "flex-1"}>
            <View className="rounded-lg bg-muted">
                <Image
                    className="max-w-[100%] rounded-lg h-[100px]"
                    source={{uri: thumbnail}}
                    resizeMode='cover'
                />
            </View>
            <Text 
                className={myClassConverter(
                    darkTheme,
                    `mt-3 
                    mb-1
                    font-semibold
                    text-base`,
                    "text-white",
                    "text-black-100"
                )}
            >
                {title}
            </Text>
            <Text
                className={myClassConverter(
                    darkTheme,
                    `text-sm`,
                    "text-[#FFFFFFB2]",
                    "text-muted"
                )}
                numberOfLines={2}
            >
                {body}
            </Text>
        </View>
    )
}

export default Card