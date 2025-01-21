import { View, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import CustomButton from './CustomButton'

const PaymentLoader = ({title1,title2,title3,style1,style2,style3,loading,setLoading}) => {
    const [showCancel, setShowCancel] = useState(false)
    useEffect(() => {
        setShowCancel(false)
        setTimeout(() => {
            setShowCancel(true)
        }, 6000);
    }, [loading])
    
    return (
        <View className="
            absolute top-0 left-0 right-0 
            bottom-0 bg-black/65 z-50
            justify-center items-center
        ">
            {/* <View style={{ transform: [{ scale: 4.5 }] }}> */}
            {loading ? (
                <View>
                    <View>
                        <ActivityIndicator size={150} color={"#ffffff"}/>
                    </View>
                    {title1 && (
                        <View className="pt-2">
                            <Text className={`text-white text-center ${style1}`}>{title1}</Text>
                        </View>
                    )}
                    {title2 && (
                        <View className="pt-2">
                            <Text className={`text-white text-center ${style2}`}>{title2}</Text>
                        </View>
                    )}
                    {title3 && (
                        <View className="pt-2">
                            <Text className={`text-white text-center ${style3}`}>{title3}</Text>
                        </View>
                    )}
                </View>
            ):(
                <View>
                    <View className="items-center justify-center">
                        <Image 
                            source={icons.good}
                            resizeMode="contain"
                            // className="w-36 h-36"
                        />
                    </View>
                    <View className="mt-14">
                        <Text className="text-3xl text-white font-psemibold text-center">
                            Success!
                        </Text>
                    </View>
                </View>
            )}
            {showCancel && (
                <View className="w-full px-5">
                    <CustomButton 
                        title={"Continue"} 
                        handlePress={()=>setLoading(false)}
                        containerStyles="mt-5 h-14 "
                        textStyles="text-white"
                    />
                </View>
            )}
        </View>
    )
}

export default PaymentLoader