import { View, Text, Image } from 'react-native'
import React from 'react'

const Card = ({title,body,thumbnail}) => {
    return (
        <View className="flex-1">
            <View className="rounded-lg bg-muted">
                <Image
                    className="max-w-[100%] rounded-lg h-[131px]"
                    source={thumbnail}
                    resizeMode='cover'
                />
            </View>
            <Text 
                className="
                    my-4 
                    font-semibold
                    text-base
                    text-black-100
                "
            >
                {title}
            </Text>
            <Text
                className="text-muted text-sm"
                numberOfLines={2}
            >
                {body}
            </Text>
        </View>
    )
}

export default Card