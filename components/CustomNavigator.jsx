import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { Image } from 'react-native'
import { Link, router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { usePreventRemove } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const CustomNavigator = ({navigator,darkTheme,isDollar, investment}) => {
    const [checkForDollarDisplayPage,setCheckForDollarDisplayPage] = useState((isDollar || investment?.category === 'Dollar') ? true : false)
    usePreventRemove(checkForDollarDisplayPage,callGoBack)
    const callGoBack = ()=>{
        if (isDollar || investment?.category === 'Dollar'){
            router.push('/home')
        }
        else{
            navigator.goBack()
        }
    }
    const insets = useSafeAreaInsets();
    return (
        <LinearGradient
            style={{ 
                paddingTop: insets.top, 
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right
            }}
            colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
            start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
            end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
        >
            <View className="px-5 py-3">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={callGoBack}
                    >
                        <Image
                            source={icons.arrow_left}
                            resizeMode="contain"
                            tintColor={darkTheme === "dark" ? "#FFFFFF" : "#000000"}
                        />
                    </TouchableOpacity>
                    <View>
                        <Link href={"/home"}>
                            <Image
                                source={icons.home}
                                resizeMode="contain"
                            />
                        </Link>
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}

export default CustomNavigator