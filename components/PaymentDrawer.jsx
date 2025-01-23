import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import { icons } from '../constants';
import FormField from "./FormField"
import Money from './Money';
import CustomButton from './CustomButton';
import { Link, router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { CheckBalance, WalletCheckOut } from './PerformingTransaction';
import PaymentLoader from './PaymentLoader';
import CoverBg from './CoverBg';

const { height: screenHeight } = Dimensions.get('window'); 

const PaymentDrawer = ({ 
    isVisible, 
    onClose, 
    investment
}) => {
    if (!isVisible) return null;
    const { user,setUser } = useGlobalContext();
    const [unit, setUnit] = useState(0)
    const [next, setNext] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [isInsufficientFund, setIsInsufficientFund] = useState(false)
    const handleClose = () => {
        setNext(false)
        onClose()
    }
    const handleProceed= ()=>{
        if(unit){
            setNext(true)
        }
    }
    const handleWalletPay = async()=>{
        setLoading(true)
        setLoadError(false)
        setIsInsufficientFund(false)

        const {updatedUser,newUserInvestment,error,wallet,insufficient_fund} = await WalletCheckOut(investment,unit,user)
        if(error){
            setLoading(false)
            setLoadError(true)
            return
        }
        if(insufficient_fund){
            setLoading(false)
            setIsInsufficientFund(true)
            return
        }
        setUser(updatedUser)
        setTimeout(() => {
            setLoading(false)
            router.push("/home")
        }, 1000);
    }
    const handleInsufficientFundClick= ()=>{
        setLoadError(false)
        setLoading(false)
        setIsInsufficientFund(false)
        router.push("/wallet")
    }
    return (
        <>
            {(loading && !loadError) && (
                <PaymentLoader 
                    title1={"Processing transactions"}
                    style1={"text-lg font-psemibold text-white"}
                    title2={"Please wait while we process your transaction."}
                    style2={"text-sm font-psemibold text-white"}
                    loading={loading}
                    setLoading={setLoading}
                />
            )}
            {loadError && (
                <CoverBg>
                    <View>
                        <View className="px-10">
                            <Text className="text-white text-lg font-psemibold text-center">
                                An error occurred while processing your transaction. Please try again later.
                            </Text>
                            <CustomButton 
                                title={"Continue"} 
                                handlePress={()=>setLoadError(false)}
                                containerStyles="mt-10 h-14"
                                textStyles="text-white"
                            />
                        </View>
                    </View>
                </CoverBg>
            )}
            {isInsufficientFund && (
                <CoverBg>
                    <View>
                        <View className="px-10">
                            <Text className="text-white text-3xl font-psemibold text-center">
                                Insufficient fund
                            </Text>
                            <CustomButton 
                                title={"Top up wallet"} 
                                handlePress={handleInsufficientFundClick}
                                containerStyles="mt-6 h-14"
                                textStyles="text-white"
                            />
                            <View>
                                <TouchableOpacity 
                                    activeOpacity={0.9}
                                    onPress={()=>setIsInsufficientFund(false)}
                                    className="mt-5"
                                >
                                    <Text className="text-blue-500 text-center text-lg font-psemibold">
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </CoverBg>
            )}
            <View className="absolute inset-0 z-40 bg-black/50">
                <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={handleClose} />
                <View
                    style={styles.drawer}
                    className="absolute bottom-0 inset-x-0 bg-white rounded-t-[30px]"
                >
                    {(investment && investment.price_per_unit > 0) ? (
                        <>
                            <View 
                                className={`
                                    p-5 min-h-24 flex-row justify-between items-center ${!next  && "border-b border-border" }
                                `}
                            >
                                {next ? (
                                    <View className="flex-row items-center">
                                        <View
                                            className="
                                                h-12 w-12 
                                                rounded-full 
                                                items-center 
                                                justify-center
                                            "
                                        >
                                            <TouchableOpacity 
                                                activeOpacity={0.9}
                                                onPress={()=>setNext(false)}
                                            >
                                                <Image
                                                    source={icons.arrow_left}
                                                    resizeMode="contain"
                                                    className="
                                                        w-6
                                                        rounded-full
                                                    "
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View className="pl-3">
                                            <Text className="text-lg font-psemibold font-semibold text-header-200">
                                                Select payment method
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View className="flex-row items-center">
                                        <View
                                            className="
                                                h-12 w-12 
                                                rounded-full 
                                                bg-[#DFE7E8]
                                                items-center 
                                                justify-center
                                            "
                                        >
                                            <Image
                                                source={icons.tag}
                                                resizeMode="contain"
                                                className="
                                                    w-6
                                                    rounded-full
                                                "
                                            />
                                        </View>
                                        <View className="pl-3">
                                            <Text className="text-lg font-psemibold font-semibold text-header-200">
                                                Secure an Investment
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                <TouchableOpacity onPress={handleClose}>
                                    <Image 
                                        source={icons.cancel}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                            <ScrollView className="flex-1 py-4 h-full flex">
                                <View>
                                    {next ? (
                                        <View>
                                            <View className="px-5 border-b border-border">
                                                <View 
                                                    className="
                                                        flex-1 
                                                        rounded-lg
                                                        flex 
                                                        py-4 flex-row
                                                        mb-5
                                                        border
                                                        border-border
                                                        bg-[#F8FAFA]
                                                    "
                                                >
                                                    <View
                                                        className="h-14 w-14 rounded-full items-center justify-center"
                                                    >
                                                        <Image
                                                            source={icons.wallet}
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                    <TouchableOpacity 
                                                        activeOpacity={0.9}
                                                        className="w-full flex-1"
                                                        style={{
                                                            width: "74.54%",
                                                        }}
                                                        onPress={handleWalletPay}
                                                    >
                                                        <View
                                                            className="flex-1 px-3 w-full "
                                                        >
                                                            <View className="my-auto justify-between flex-row">
                                                                <View>
                                                                    <Text
                                                                        className="text-lg text-header-200 font-psans"
                                                                    >
                                                                        Wallet
                                                                    </Text>
                                                                </View>
                                                                <View className="pr-1">
                                                                    <Money 
                                                                        value={user?.wallet_balance || 0}
                                                                        textStyle={"text-secondary-100 text-lg font-[700]"}
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View
                                                        style={{
                                                            width: "10.08%",
                                                        }}
                                                        className="items-center justify-center flex-row"
                                                    >
                                                        <Image 
                                                            source={icons.arrow_right_italic}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                            <Link href={"/pay-with-bank"} className="my-5 px-5">
                                                <View 
                                                    className="
                                                        flex-1 
                                                        rounded-lg
                                                        flex 
                                                        py-4 flex-row
                                                        mb-5
                                                        border
                                                        border-border
                                                        bg-[#F8FAFA]
                                                    "
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
                                            </Link>
                                            <Link href={"/pay-with-card"} className="px-5">
                                                <View 
                                                    className="
                                                        flex-1 
                                                        rounded-lg
                                                        flex 
                                                        py-4 flex-row
                                                        mb-5
                                                        border
                                                        border-border
                                                        bg-[#F8FAFA]
                                                    "
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
                                            </Link>
                                        </View>
                                    ) : (
                                        <View className="pt-3 px-5">
                                            <View>
                                                <Text className="text-muted-200 font-pmedium">
                                                    Number of units to purchace
                                                </Text>
                                                <FormField 
                                                    title={"e.g 15 units"}
                                                    value={unit}
                                                    placeholder={"e.g 15 units"}
                                                    handleChangeText={(e)=>setUnit(e)}
                                                    otherStyles={"mt-2"}
                                                    keyboardType="number-pad"
                                                />
                                            </View>
                                            <View className="mt-8">
                                                <Text className="text-muted-200 font-pmedium">
                                                    Price of units
                                                </Text>
                                                <View className="mt-3 items-center justify-center rounded-lg bg-[#F7F7F7] h-14">
                                                    <Money 
                                                        value={unit * investment?.price_per_unit}
                                                        textStyle={"font-xl"}
                                                    />
                                                </View>
                                            </View>
                                            <View className="mt-2 items-center justify-center">
                                                <Text className="text-secondary-100 font-pmedium text-sm">
                                                    One unit costs{" "}
                                                    <Text className="font-psans">₦{investment?.price_per_unit?.toLocaleString()}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    
                                </View>
                            </ScrollView>
                            {!next && (
                                <View className="px-5 pb-7">
                                    <CustomButton 
                                        title="Proceed"
                                        textStyles="text-white"
                                        containerStyles="h-14"
                                        handlePress={handleProceed}
                                    />
                                </View>
                            )}
                        </>
                    ):(
                        <View className={`
                            p-10 flex-row justify-between items-center
                        `}>
                            <View>
                                <Text className="text-muted-200 font-psemibold text-lg">
                                    Please select an investment
                                </Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={handleClose}>
                                    <Image 
                                        source={icons.cancel}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
                
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    drawer: {
        height: screenHeight * 0.85, 
    },
});


export default PaymentDrawer