

import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { router } from 'expo-router'
import FormField from './FormField'
import CustomButton from './CustomButton'
import { useGlobalContext } from '@/context/GlobalProvider';


const PaymentMethods = ({amount,active,setActive,modeSet,setActiveMode,investment}) => {
    const { user } = useGlobalContext();
    const [loading, setLoading] = useState(false)
    const [depositAmount, setDepositAmount] = useState(0)
    const [next, setNext] = useState(false)
    const [modeChosen, setModeChosen] = useState(false)

    const handleSetNext = (mode) =>{
        setNext(true)
        setModeChosen(mode)
    }
    
    

    // const handleDeposit = async()=>{
    //     setLoading(true)
    //     if(user){
    //         const res = await payWithBankTransfer(user.email, amount ?? depositAmount)
    //         if (res) {
    //             setLoading(false)
    //             router.push({
    //                 pathname: "/pay-with/[mode]",
    //                 params: { url: `${res.access_code}NAIRAfoLIO${res.reference}` }
    //             });
    //         }
    //         // Paystack response: {"access_code": "2fipn8i6wyb9wyg", "authorization_url": "https://checkout.paystack.com/2fipn8i6wyb9wyg", "reference": "av2saacotk"}
    //     }
    //     setLoading(false)
    // }

    const handleOtherScreen = (num,mode) =>{
        if(setActive && setActiveMode){
            setActive(num)
            setActiveMode(mode)
        }
        setModeChosen(mode)
    }

    const goToPayNow = ()=>{
        router.push({
            pathname: "/pay-with/[mode]",
            params: { mode: `${user.email}NAIRAfoLIO${amount ?? depositAmount}NAIRAfoLIO${modeChosen}NAIRAfoLIO${investment ? investment.$id : "Unavailable"}` }
        });
    }

    useEffect(()=>{
        if(amount && (modeSet === "bank_transfer" || modeSet === "card")){
            goToPayNow()
        }
    },[modeSet])

    return (
        <View style={{ flex: 1 }}>
            {!next ? (
                <View>
                    <TouchableOpacity 
                        className="my-5 px-5"
                        onPress={()=>amount ? handleOtherScreen(2,"bank_transfer") : handleSetNext("bank_transfer")}
                    >
                        <View 
                            className={`
                                flex-1 
                                rounded-lg
                                flex 
                                py-4 flex-row
                                border
                                ${(active && active === 2) ? "border-secondary-100" : "border-border"}
                                bg-[#F8FAFA]
                            `}
                        >
                            <View
                                className="h-14 w-14 rounded-full items-center justify-center"
                            >
                                <Image
                                    source={icons.bank}
                                    resizeMode="cover"
                                />
                            </View>
                            <View
                                style={{
                                    width: "74.54%",
                                }}
                                className="flex-1 px-3 "
                            >
                                <View>
                                    <Text
                                        className="text-lg text-header-200 font-psans"
                                    >
                                        Bank transfer
                                    </Text>
                                </View>
                                <View>
                                    <Text className="text-muted text-sm">
                                        Direct transfer from your bank account
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "10.08%",
                                }}
                                className="items-center justify-center"
                            >
                                <Image 
                                    source={icons.arrow_right_italic}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className="px-5"
                        onPress={()=>amount ? handleOtherScreen(3,"card") : handleSetNext("card")}
                    >
                        <View 
                            className={`
                                flex-1 
                                rounded-lg
                                flex 
                                py-4 flex-row
                                mb-5
                                border
                                ${(active && active === 3) ? "border-secondary-100" : "border-border"}
                                bg-[#F8FAFA]
                            `}
                        >
                            <View
                                className="h-14 w-14 rounded-full items-center justify-center"
                            >
                                <Image
                                    source={icons.card}
                                    resizeMode="cover"
                                />
                            </View>
                            <View
                                style={{
                                    width: "74.54%",
                                }}
                                className="flex-1 px-2 "
                            >
                                <View>
                                    <Text
                                        className="text-lg text-header-200 font-psans"
                                    >
                                        Debit card
                                    </Text>
                                </View>
                                <View>
                                    <Text className="text-muted text-sm">
                                        Pay using Visa, Mastercard, or others 
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "10.08%",
                                }}
                                className="items-center justify-center"
                            >
                                <Image 
                                    source={icons.arrow_right_italic}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            ):(
                <View>
                    <View>
                        <Text className="text-base text-[#8A97A8]">
                            Enter deposit amount
                        </Text>
                    </View>
                    <FormField 
                        title="Deposit"
                        value={depositAmount}
                        keyboardType="number-pad"
                        placeholder="Min ₦100"
                        handleChangeText={(e)=>setDepositAmount(e)}
                        otherStyles="mt-2"

                    />
                    <View>
                        <CustomButton 
                            title="Continue"
                            handlePress={goToPayNow}
                            containerStyles="h-14 mb-4 mt-10"
                            textStyles="text-white font-psemibold"
                            loading={!depositAmount || depositAmount <100 || !user}
                            isLoading={loading}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

export default PaymentMethods