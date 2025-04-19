import { View, Text } from 'react-native'
import React from 'react'
import { myClassConverter } from '@/lib/performActions'

const Money = ({value,containerStyle,textStyle,add,minus,addedText,dollar}) => {
    return (
        <View className={containerStyle ?? ""}>
            <Text className={textStyle ?? myClassConverter(
                                                darkTheme,
                                                `font-psans`,
                                                "text-white",
                                                "text-black-100"
                                            )}>{add && "+"}{minus && "-"}{dollar ? "$" : "₦"}{value && value.toLocaleString()}</Text>
            {addedText && <Text className={textStyle ?? myClassConverter(
                                                darkTheme,
                                                `font-psans`,
                                                "text-white",
                                                "text-black-100"
                                            )}>{addedText}</Text>}
        </View>
    )
}

export default Money