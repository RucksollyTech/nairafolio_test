import { View, Text } from 'react-native'
import React from 'react'
import UTCDate from './UTCDate'

const ProgressBar = ({date,duration}) => {
    const {daysGone} = UTCDate(date)
    const percentage = (daysGone/duration) * 100
    return (
        <View className="w-full h-1 bg-[#D9D9D9] rounded-[10px]">
            <View 
                className={`h-full rounded-[10px] bg-primary`}
                style={{
                    width: `${percentage <= 100 ? percentage : 100}%`,
                }}
            ></View>
        </View>
    )
}

export default ProgressBar