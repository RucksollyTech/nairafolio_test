import { View, Text } from 'react-native'
import React from 'react'
import UTCDate from './UTCDate'
import { myClassConverter } from '@/lib/performActions'

const ProgressBar = ({date,duration,setZero,darkTheme}) => {
    const {daysGone} = UTCDate(date)
    const percentage = setZero ? 0 : (daysGone/duration) * 100
    return (
        <View
        className={darkTheme === 'dark' ? "dark w-full" : "w-full"}
        >
            <View className={myClassConverter(
                darkTheme,
                `w-full h-1 rounded-[10px]`,
                "bg-[#D9D9D933]",
                "bg-[#D9D9D9]"
            )}>
                <View 
                    className={myClassConverter(
                        darkTheme,
                        `h-full rounded-[10px]`,
                        "bg-[#CBF5B8]",
                        "bg-primary"
                    )}
                    style={{
                        width: `${percentage <= 100 ? percentage : 100}%`,
                    }}
                ></View>
            </View>
        </View>
    )
}

export default ProgressBar