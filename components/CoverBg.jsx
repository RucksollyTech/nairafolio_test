import { View, Text } from 'react-native'
import React from 'react'

const CoverBg = ({children}) => {
    return (
        <View className="
            absolute top-0 left-0 right-0 
            bottom-0 bg-black/75 z-50
            justify-center items-center
        ">
            {children}
        </View>
    )
}

export default CoverBg