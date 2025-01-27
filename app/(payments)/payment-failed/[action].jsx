import { View, Text, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../../constants'
import { router, useLocalSearchParams } from 'expo-router'
import CustomButton from '../../../components/CustomButton'

const paymentFailed = () => {
    const { action } = useLocalSearchParams();
    return (
        <SafeAreaView>
            <View className="h-full px-5" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* <Image 
                    source={icons.good_bg}
                    resizeMode="contain"
                /> */}
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Payment Failed!</Text>
                <View>
                    <CustomButton title="Continue" onPress={() => router.push('/wallet')} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default paymentFailed