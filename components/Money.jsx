import { View, Text } from 'react-native'
import React from 'react'

const Money = ({value,containerStyle,textStyle,add,minus}) => {
    return (
        <View className={containerStyle ?? ""}>
            <Text className={textStyle ?? "text-black-100 font-psans"}>{add && "+"}{minus && "-"}₦{value && value.toLocaleString()}</Text>
        </View>
    )
}

export default Money