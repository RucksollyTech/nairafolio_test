import { View, Text, Image } from 'react-native'
import React from 'react'

const Card = ({title,body,thumbnail}) => {
    return (
        <View className="flex-1">
            <View className="rounded-lg bg-muted">
                <Image
                    className="max-w-[100%] rounded-lg h-[100px]"
                    source={{uri: thumbnail}}
                    resizeMode='cover'
                />
            </View>
            <Text 
                className="
                    mt-3 
                    mb-1
                    font-semibold
                    text-base
                    text-black-100 dark:text-white
                "
            >
                {title}
            </Text>
            <Text
                className="text-muted dark:text-[#FFFFFFB2] text-sm"
                numberOfLines={2}
            >
                {body}
            </Text>
        </View>
    )
}

export default Card