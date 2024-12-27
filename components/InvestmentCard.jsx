import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Money from './Money'
import ProgressBar from './ProgressBar'
import UTCDate from './UTCDate'
import { router } from 'expo-router'

const InvestmentCard = ({logo,_id,name,percentage,duration,invested,date}) => {
    const {daysGone} = UTCDate(date)
    const profit = (percentage * daysGone * invested)/100
    return (
        <TouchableOpacity
            onPress={()=>router.push(`/investment/active/${_id}`)}
            activeOpacity={0.7}
        >
            <View 
                className="
                    flex-1 
                    rounded-lg
                    flex 
                    p-4 flex-row
                    border
                    border-border
                    bg-[#F8F8F8]
                "
            >
                <View
                    style={{
                        width: "15.38%",
                    }}
                    className="h-full"
                >
                    <Image
                        source={logo}
                        resizeMode="cover"
                        className="h-14 w-14 rounded-full"
                    />
                </View>
                <View
                    style={{
                        width: "61.54%",
                    }}
                    className="flex-1 px-3 "
                >
                    <View>
                        <Text
                            className="text-lg font-[700] font-pmedium text-muted"
                            numberOfLines={1}
                        >
                            {name}
                        </Text>
                    </View>
                    <View className="pt-2">
                        {(duration-daysGone) >= 0 ? (
                            <Text className="text-muted-100 text-xs">
                                {duration-daysGone} days left
                            </Text>
                        ) : (
                            <Text className="text-muted-100 text-xs">
                                Matured
                            </Text>
                        )}
                        
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
                    <View className="mt-2">
                        <Money 
                            value={profit}
                            add
                            textStyle="font-pmedium text-secondary-100 text-right text-sm"
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default InvestmentCard