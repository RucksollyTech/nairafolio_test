import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

const account = () => {
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <LinearGradient
                        colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    >
                        <View className="px-5">
                            <View className="pt-8">
                                <Text className="text-black-100 font-psans text-2xl">
                                    Account
                                </Text>
                            </View>
                            
                        </View>
                    </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    )
}

export default account