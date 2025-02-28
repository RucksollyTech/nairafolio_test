import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Money from './Money'
import ProgressBar from './ProgressBar'
import UTCDate from './UTCDate'
import { router } from 'expo-router'

export const calculateProfit = (data)=>{
    const {percentage,daysGone,invested,duration} = data
    const profit = (percentage * daysGone * invested)/100
    if(daysGone > duration){
        return (percentage * duration * invested)/100
    }
    return profit
}

export const checkMatured = data =>{
    const {duration, createdAt} = data
    const {daysGone} = UTCDate(createdAt)
    if ((duration-daysGone) >= 0)return false
    return true
}
const InvestmentCard = ({logo,_id,name,percentage,duration,invested,date}) => {
    const {daysGone} = UTCDate(date)

    return (
        <View className="mb-2">
            <TouchableOpacity
                onPress={()=>router.push(`/investment/active/${_id}`)}
                activeOpacity={0.7}
            >
                <View 
                    className="
                        flex-1 
                        rounded-lg
                        flex 
                        p-2.5 flex-row
                        border
                        border-border
                        bg-[#F8F8F8]
                    "
                >
                    <View
                        style={{
                            width: "13.38%",
                        }}
                        className="h-full items-center justify-center"
                    >
                        <Image
                            source={{uri: logo}}
                            resizeMode="cover"
                            className="h-12 w-12 rounded-full"
                        />
                    </View>
                    <View
                        style={{
                            width: "63.54%",
                        }}
                        className="flex-1 px-2 "
                    >
                        <View>
                            <Text
                                className="text-base font-[700] font-pmedium text-muted"
                                numberOfLines={1}
                            >
                                {name}
                            </Text>
                        </View>
                        <View className="flex-1 pt-1">
                            <View className="pb-1">
                                {(duration-daysGone) >= 0 ? (
                                    <Text className="text-muted-100 text-xs">
                                        {duration-daysGone} days left
                                    </Text>
                                ) : (
                                    <Text className="text-muted-100 text-xs">
                                        Matured
                                    </Text>
                                )}
                            </View>
                            <ProgressBar date={date} duration={duration} />
                        </View>
                    </View>
                    <View
                        style={{
                            width: "23.08%",
                        }}
                    >
                        <View>
                            <Money 
                                value={invested}
                                textStyle="font-pmedium text-muted text-right text-base"
                            />
                        </View>
                        <View className="mt-1">
                            <Money 
                                value={calculateProfit({
                                    percentage,
                                    daysGone,
                                    invested,
                                    duration,
     
                                })}
                                add
                                textStyle="font-pmedium text-secondary-100 text-right text-sm"
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default InvestmentCard