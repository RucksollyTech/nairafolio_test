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
import { createTransactions } from '../lib/appwrite';
import PaymentMethods from './PaymentMethods';
import { myClassConverter } from '@/lib/performActions';

const { height: screenHeight } = Dimensions.get('window'); 

const PaymentDrawer = ({ 
    isVisible, 
    onClose, 
    investment,
    user,
    title,
    user_investment,
    setShowMessage,
    darkTheme
}) => {
    if (!isVisible) return null;
    // const { user } = useGlobalContext();
    const [unit, setUnit] = useState(0)
    const [active, setActive] = useState(0)
    const [modeSet, setModeSet] = useState("")
    const [activeMode, setActiveMode] = useState("")
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

        const {error,insufficient_fund} = await WalletCheckOut(investment,parseFloat(unit),user)
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
        // setUser(updatedUser)
        setTimeout(() => {
            setLoading(false)
            router.replace(investment.isDollar ? `/dollar/${user_investment?.$id}` : "/home")
        }, 1000);
        if(investment.isDollar){
            onClose()
            setShowMessage(true);
        }
    }
    const majorSubmitHandler= ()=>{
        if (active === 1){
            setModeSet(activeMode)
            handleWalletPay()
        }else if (active > 1){
            setModeSet(activeMode)
        }
        // if(investment.isDollar){
        //     onClose()
        //     setShowMessage(true);
        // }
    }
    const handleOtherScreen = (num) =>{
        setActive(num)
        setActiveMode("Wallet")
    }
    const handleInsufficientFundClick= ()=>{
        setLoadError(false)
        setLoading(false)
        setIsInsufficientFund(false)
        router.push("/wallet")
    }
    const handleMyForward = ()=>{
        setNext(false)
        setActive(0)
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
            <View className={`absolute inset-0 z-40 bg-black/50 ${darkTheme === "dark" && "dark"}`}>
                {/* <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={handleClose} /> */}
                <View
                    style={styles.drawer}
                    className={myClassConverter(
                        darkTheme,
                        `absolute bottom-0 inset-x-0 rounded-t-[30px]`,
                        "bg-[#1D1E25]",
                        "bg-white"
                    )}
                >
                    {(investment && investment.price_per_unit > 0) ? (
                        <>
                            <View 
                                className={`
                                    p-5 min-h-24 flex-row justify-between items-center ${!next  && `${darkTheme === "dark" ? "border-b border-[#495161]" : "border-b border-border"}`}
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
                                                onPress={handleMyForward}
                                            >
                                                <Image
                                                    source={icons.arrow_left}
                                                    resizeMode="contain"
                                                    className="
                                                        w-6
                                                        rounded-full
                                                    "
                                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#000000"}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View className="pl-3">
                                            <Text className={myClassConverter(
                                                darkTheme,
                                                `text-lg font-psemibold font-semibold`,
                                                "text-white",
                                                "text-header-200"
                                            )}>
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
                                            <Text className={myClassConverter(
                                                darkTheme,
                                                `text-lg font-psemibold font-semibold`,
                                                "text-white",
                                                "text-header-200"
                                            )}>
                                                {title ?? "Secure an Investment"} 
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
                                            <View className={myClassConverter(
                                                darkTheme,
                                                `px-5 border-b`,
                                                "border-[#3B3C43]",
                                                "border-border"
                                            )}>
                                                <TouchableOpacity 
                                                    activeOpacity={0.9}
                                                    onPress={()=>handleOtherScreen(1)}
                                                    // onPress={handleWalletPay}
                                                    className={`
                                                        flex-1 
                                                        rounded-lg
                                                        flex 
                                                        py-4 flex-row
                                                        mb-5
                                                        border
                                                        ${(active && active === 1) ? "border-secondary-100" : `${darkTheme === "dark" ? "border-[#3B3C43]" : "border-border"}`}
                                                        ${darkTheme === "dark" ? "bg-[#303540]" : "bg-[#F8FAFA]"}
                                                    `}
                                                >
                                                    <View
                                                        className="h-14 w-14 rounded-full items-center justify-center"
                                                    >
                                                        {darkTheme === "dark" ? (
                                                            <Image
                                                                source={icons.wallet}
                                                                resizeMode="cover"
                                                                tintColor={"#CBF5B8"}
                                                            />
                                                        ):(
                                                            <Image
                                                                source={icons.wallet}
                                                                resizeMode="cover"
                                                            />
                                                        )}
                                                    </View>
                                                    <View
                                                        className="w-full flex-1"
                                                        style={{
                                                            width: "74.54%",
                                                        }}
                                                    >
                                                        <View
                                                            className="flex-1 px-3 w-full "
                                                        >
                                                            <View className="my-auto justify-between flex-row">
                                                                <View>
                                                                    <Text
                                                                        className={myClassConverter(
                                                                            darkTheme,
                                                                            `text-lg font-psans`,
                                                                            "text-white",
                                                                            "text-header-200"
                                                                        )}
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
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: "10.08%",
                                                        }}
                                                        className="items-center justify-center flex-row"
                                                    >
                                                        <Image 
                                                            source={icons.arrow_right_italic}
                                                            tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <PaymentMethods 
                                                amount={parseFloat(unit) * investment?.price_per_unit}
                                                active={active}
                                                setActive={setActive}
                                                modeSet={modeSet}
                                                setActiveMode={setActiveMode}
                                                investment={investment}
                                                user={user}
                                                setModeSet={setModeSet}
                                                darkTheme={darkTheme}
                                            />
                                        </View>
                                    ) : (
                                        <View className="pt-3 px-5">
                                            <View>
                                                <Text className={myClassConverter(
                                                    darkTheme,
                                                    `font-pmedium`,
                                                    "text-[#FFFFFF99]",
                                                    "text-muted-200 "
                                                )}>
                                                    {investment.isDollar ? "Enter the dollar amount" : "Number of units to purchase"}
                                                </Text>
                                                <FormField 
                                                    title={"e.g 15 units"}
                                                    value={unit}
                                                    placeholder={investment.isDollar ? "$ 300" : "e.g 15 units"}
                                                    handleChangeText={(e)=>setUnit(e)}
                                                    otherStyles={"mt-2"}
                                                    keyboardType="number-pad"
                                                    darkTheme={darkTheme}
                                                />
                                                <View className='min-h-5'>
                                                    {!!unit && parseFloat(unit) < investment.min_investment && (
                                                        <Text className="text-yellow-700 pt-1 text-xs font-psemibold">
                                                            You cannot purchase less than {investment.min_investment} {investment.isDollar ? "dollar" : "units"}.
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                            <View className="mt-8">
                                                <Text className={myClassConverter(
                                                    darkTheme,
                                                    `font-pmedium`,
                                                    "text-[#FFFFFF99]",
                                                    "text-muted-200"
                                                )}>
                                                    {investment.isDollar ? "Total price" : "Price of units"}
                                                </Text>
                                                <View className={myClassConverter(
                                                    darkTheme,
                                                    `mt-3 items-center justify-center rounded-lg h-14`,
                                                    "bg-[#242730]",
                                                    "bg-[#F7F7F7]"
                                                )}>
                                                    <Money 
                                                        value={((parseFloat(unit) && parseFloat(unit) !== NaN) ? parseFloat(unit) : 0) * investment?.price_per_unit}
                                                        textStyle={darkTheme === "dark" ? "text-white font-xl" : "font-xl"}
                                                    />
                                                </View>
                                            </View>
                                            <View className="mt-2 items-center justify-center">
                                                <Text className="text-secondary-100 font-pmedium text-sm">
                                                    {investment.isDollar ? "One dollar costs" :"One unit costs"}{" "}
                                                    <Text className="font-psans">₦{investment?.price_per_unit?.toLocaleString()}</Text>
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    
                                </View>
                            </ScrollView>
                            {(!next) && (
                                <View className="px-5 pb-7">
                                    <CustomButton 
                                        title="Continue"
                                        textStyles={darkTheme !== "dark" ? "text-white font-psemibold" : "text-black font-psemibold"}
                                        containerStyles="h-14"
                                        loading={parseFloat(unit) < investment.min_investment}
                                        handlePress={handleProceed}
                                        darkTheme={darkTheme}
                                    />
                                </View>
                            )}
                            {active > 0 && (
                                <View className="px-5 pb-7">
                                    <CustomButton 
                                        title="Continue"
                                        textStyles={darkTheme !== "dark" ? "text-white font-psemibold" : "text-black font-psemibold"}
                                        containerStyles="h-14"
                                        handlePress={majorSubmitHandler}
                                        darkTheme={darkTheme}
                                    />
                                </View>
                            )}
                        </>
                    ):(
                        <View className={`
                            p-10 flex-row justify-between items-center
                        `}>
                            <View>
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `font-psemibold text-lg`,
                                    "text-[#FFFFFF99] ",
                                    "text-muted-200"
                                )}>
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