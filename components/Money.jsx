import { View, Text } from 'react-native'
import React from 'react'

const Money = ({value,containerStyle,textStyle,add,minus,addedText,dollar}) => {
    return (
        <View className={containerStyle ?? ""}>
            <Text className={textStyle ?? "text-black-100 font-psans"}>{add && "+"}{minus && "-"}{dollar ? "$" : "₦"}{value && value.toLocaleString()}</Text>
            {addedText && <Text className={textStyle ?? "text-black-100 font-psans"}>{addedText}</Text>}
        </View>
    )
}

export default Money