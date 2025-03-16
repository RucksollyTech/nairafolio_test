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
export const checkMaturedInfo = data =>{
    const {$createdAt:createdAt,investment:{immediate_start,date_to_introduction,duration_days:duration}} = data
    const {daysGone} = UTCDate(createdAt)
    let dayDiff = duration-daysGone
    let daysGoner
    let matured
    let started=true

    if(immediate_start){
        if (dayDiff >= 0){
            daysGoner = dayDiff
        }else{
            matured=true
        }
    }else{
        const {daysGone,isPastOrToday} = UTCDate(date_to_introduction)
        dayDiff = duration-daysGone
        if(isPastOrToday){
            if (dayDiff >= 0){
                daysGoner = dayDiff
            }else{
                matured=true
            }
        }else{
            started=false
        }
    }
    return [daysGoner,matured,started,immediate_start,date_to_introduction]
}
const InvestmentCard = ({
    logo,_id,name,
    percentage,duration,
    invested,date,
    investType,user,
    investment
}) => {
    const {daysGone} = UTCDate(date)
    const [daysGoner,matured,started,immediate_start,date_to_introduction] = checkMaturedInfo(investment)
    return (
        <View className="mb-2">
            <TouchableOpacity
                onPress={()=>router.push(!investType ? `/investment/active/${_id}` : `/dollar/${investment?.$id}`)}
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
                        <View className={investType ? "my-auto" : ""}>
                            <Text
                                className="text-base font-[700] font-pmedium text-muted"
                                numberOfLines={1}
                            >
                                {name}
                            </Text>
                        </View>
                        {!investType && (
                            <View className="flex-1 pt-1">
                                {immediate_start ? (
                                    <>
                                        <View className="pb-1">
                                            {(duration-daysGone) >= 0 ? (
                                                <Text className="text-muted-100 text-xs">
                                                    {duration-daysGone} day{duration-daysGone > 1 ? "s" : ""} left
                                                </Text>
                                            ) : (
                                                <Text className="text-muted-100 text-xs">
                                                    Matured
                                                </Text>
                                            )}
                                        </View>
                                        <ProgressBar date={date} duration={duration} />
                                    </>
                                ):(<>
                                    <View className="pb-1">
                                        {!started ? (
                                            <Text className="text-muted-100 text-xs">
                                                Start date : {UTCDate(date_to_introduction).myDateFormat}
                                            </Text>
                                        ) : (
                                            <Text className="text-muted-100 text-xs">
                                                {matured ? "Matured" : `${daysGoner} day${daysGoner > 1 ? "s" : ""} left`}
                                            </Text>
                                        )}
                                    </View>
                                    <ProgressBar date={immediate_start ? date : date_to_introduction} duration={duration} setZero={!started ? true : false} />
                                </>)}
                            </View>
                        )}
                    </View>
                    <View
                        style={{
                            width: "23.08%",
                        }}
                    >
                        <View>
                            <Money 
                                dollar={investType}
                                value={investType ? user.dollar_ballance : invested}
                                textStyle="font-pmedium text-muted text-right text-base"
                            />
                        </View>
                        <View className="mt-1">
                            <Money 
                                value={investType ? investment.investment.price_per_unit : calculateProfit({
                                    percentage,
                                    daysGone,
                                    invested,
                                    duration,
    
                                })}
                                containerStyle={investType && "flex-row ml-auto"}
                                addedText={investType && "/$"}
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