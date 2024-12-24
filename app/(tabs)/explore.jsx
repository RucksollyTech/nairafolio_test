import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import SearchInput from '../../components/SearchInput'
import InvestmentDisplayCard from '../../components/InvestmentDisplayCard'

const explore = () => {
    const categories = ["All","Agriculture","Forex","Dollar savings","Transportation","Financial investmenty"]
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className="flex-1 h-full">
                    <LinearGradient
                        colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    >
                        <View className="px-5">
                            <View className="pt-10">
                                <Text className="text-black-100 font-psans text-xl">
                                    Explore Investments
                                </Text>
                            </View>
                            
                        </View>
                    </LinearGradient>
                    <View className="px-5">
                        <View className="py-3">
                            <SearchInput />
                        </View>
                        <View className="flex flex-row flex-wrap gap-2 mt-3">
                            {categories.map((category, index) => (
                                <View key={index} className={`flex ${index === 0 && "bg-primary"} items-center justify-center border border-border px-3 py-1.5 rounded-lg`}>
                                    <Text className={`font-pregular text-base text-muted-100 ${index === 0 && "text-white"}`}>
                                        {category}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View className="mt-5">
                            <View className="mb-6">
                                <InvestmentDisplayCard />
                            </View>
                            <View className="mb-6">
                                <InvestmentDisplayCard />
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default explore