import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../../constants'
import { router, useLocalSearchParams } from 'expo-router'
import { handlePaymentSuccess, handlePaymentSuccessFromSales } from '../../../lib/updateAccountTransaction'
import { useGlobalContext } from '@/context/GlobalProvider';
import { getInvestment, getUserInvestmentRequest } from '@/lib/appwrite'
import { myClassConverter } from '@/lib/performActions'

const PaymentSuccess = () => {
    const { action } = useLocalSearchParams();
    const [type,reference,investmentId,sale] = action.split("NAIRAfoLIO")
    const { setUser,user,setShowMessage, darkTheme } = useGlobalContext();

    const [loadFinished, setLoadFinished] = useState(false)
    const [hasRan, setHasRan] = useState(false)
    const [stopRedirect, setStopRedirect] = useState(false)
    const [investmentExtracted, setInvestmentExtracted] = useState(null)
    
    if(!loadFinished && !hasRan) {
        setHasRan(true)
        const performHandleSuccess = async () =>{
            if(!JSON.parse(sale)){
                const [paymentResult, investmentData] = await Promise.all([
                    handlePaymentSuccess(reference,investmentId === "Unavailable" ? null :investmentId,type,setUser),
                    getInvestment(investmentId)
                ])
                setInvestmentExtracted(investmentData[0])
            }else{
                await handlePaymentSuccessFromSales(reference,investmentId === "Unavailable" ? null :investmentId,type,setUser);
            }
            setLoadFinished(true)
        }
        performHandleSuccess()

        return (
            <SafeAreaView className={darkTheme === "dark" ? "flex-1 bg-dark_mode dark" : "bg-white flex-1"}>
                <View className={myClassConverter(
                    darkTheme,
                    `h-full px-5 mt-16`,
                    "bg-dark_mode",
                    "bg-white"
                )} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator  size={150} color={"#3b82f6"} />
                </View>
            </SafeAreaView>
        )
    }
    if (loadFinished && hasRan && !stopRedirect){
        // console.log({investmentExtracted})
        // if(investmentExtracted && investmentExtracted?.isDollar){
        //     console.log("Continue loading")
        //     setShowMessage(true)
        // }
        setStopRedirect(true)
        if(action ==="Investment"){
            setTimeout(() => {
                router.replace((investmentExtracted && investmentExtracted?.isDollar) ? `/dollar/${investmentExtracted?.$id}` : `/home`)
            }, 1000);
            return
        }else{
            setTimeout(() => {
                router.replace((investmentExtracted && investmentExtracted?.isDollar) ? `/dollar/${investmentExtracted?.$id}` : `/wallet`)
            }, 1000);
            return
        }
    }
    return (
        <SafeAreaView className={darkTheme === "dark" ? "bg-dark_mode dark flex-1 relative z-[100]" : "bg-white flex-1 relative z-[100]"}>
            <View className={myClassConverter(
                darkTheme,
                `h-full px-5`,
                "bg-dark_mode",
                "bg-white"
            )} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image 
                    source={icons.good}
                    resizeMode="contain"
                    className='w-40 h-40'
                />
                <View className="mt-5">
                    <Text 
                        className={myClassConverter(
                            darkTheme,
                            ``,
                            "text-white",
                            "text-black"
                        )}
                        style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Payment Successful!</Text>
                </View>
                {action ==="Investment" && (
                    <View className='mt-3'>
                        <Text className={myClassConverter(
                            darkTheme,
                            `data`,
                            "text-white",
                            "text-black"
                        )}>Your investment has been successfully made. You can now access your dashboard.</Text>
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