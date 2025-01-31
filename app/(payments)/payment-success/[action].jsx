import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../../constants'
import { router, useLocalSearchParams } from 'expo-router'
import { handlePaymentSuccess, handlePaymentSuccessFromSales } from '../../../lib/updateAccountTransaction'
import { useGlobalContext } from '@/context/GlobalProvider';

const PaymentSuccess = () => {
    const { action } = useLocalSearchParams();
    const [type,reference,investmentId,sale] = action.split("NAIRAfoLIO")
    const { setUser } = useGlobalContext();

    const [loadFinished, setLoadFinished] = useState(false)
    const [hasRan, setHasRan] = useState(false)
    
    if(!loadFinished && !hasRan) {
        setHasRan(true)
        const performHandleSuccess = async () =>{
            if(!sale){
                await handlePaymentSuccess(reference,investmentId === "Unavailable" ? null :investmentId,type,setUser);
            }else{
                await handlePaymentSuccessFromSales(reference,investmentId === "Unavailable" ? null :investmentId,type,setUser);
            }
            setLoadFinished(true)
        }
        performHandleSuccess()

        return (
            <SafeAreaView className="bg-white flex-1">
                <View className="h-full px-5 bg-white mt-16" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator  size={150} color={"#3b82f6"} />
                </View>
            </SafeAreaView>
        )
    }
    if (loadFinished && hasRan){
        if(action ==="Investment"){
            setTimeout(() => {
                router.push(`/home`)
            }, 1000);
        }else{
            setTimeout(() => {
                router.push(`/wallet`)
            }, 1000);
        }
    }
    return (
        <SafeAreaView className="bg-white flex-1 relative z-[100]">
            <View className="h-full bg-white px-5" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image 
                    source={icons.good}
                    resizeMode="contain"
                />
                <View className="mt-5">
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Payment Successful!</Text>
                </View>
                {action ==="Investment" && (
                    <View>
                        <Text>Your investment has been successfully made. You can now access your dashboard.</Text>
                    </View>
                )}
                <View className="mt-6">
                    <ActivityIndicator size={"small"} color={"#3b82f6"} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PaymentSuccess