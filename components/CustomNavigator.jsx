import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { Image } from 'react-native'
import { Link } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'


const CustomNavigator = ({navigator,darkTheme}) => {
    return (
        <LinearGradient
            colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
            start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
            end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
        >
            <View className="px-5 py-3">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={()=>navigator.goBack()}
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