import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons, images } from '../../../constants'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import Money from '../../../components/Money'
import { Link, router } from 'expo-router'
import Drawer from '../../../components/Drawer'
import TitleComponent from '../../../components/TitleComponent'
import useAppwrite from '../../../lib/useAppwrite'
import { createTransactions, getInvestment, getUserInvestment, getUserInvestmentData, searchInvestmentUpdates, updateOngoingInvestment, updateUser } from '../../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider';
import UTCDate from '../../../components/UTCDate'
import { calculateProfit, checkMatured, checkMaturedInfo } from '../../../components/InvestmentCard'
import { convertDaysToReadableFormat } from '../../../components/dayConverter'
import { FlatList } from 'react-native'
import { RefreshControl } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import EmptyState from '../../../components/EmptyState'
import GeneralDrawer from '../../../components/GeneralDrawer'
import FormFieldAdjusted from '../../../components/FormFieldAdjusted'
import CustomButton from '../../../components/CustomButton'
import { WalletCheckOutSales, sellInvestment, sellInvestmentNairaFolio, totalProfitsAndInvested, undoSellInvestment } from '../../../components/PerformingTransaction'
import { updateCurrentUser } from '../../../lib/updateAccountTransaction'
import SuccessModal from '../../../components/SuccessModal'
import CustomNavigator from '../../../components/CustomNavigator'
import { OngoingDetailSkeletonLoader } from '@/components/DetailLoader'
import CustomModalAlert from '@/components/CustomModalAlert'
import PasswordConfirm from '@/components/PasswordConfirm'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'

const { height: screenHeight } = Dimensions.get('window'); 
export const goToPayNow = ({email,amount,mode,investmentId,sale})=>{
    router.push({
        pathname: "/pay-with/[mode]",
        params: { mode: `${email}NAIRAfoLIO${amount}NAIRAfoLIO${mode}NAIRAfoLIO${investmentId ? investmentId : "Unavailable"}NAIRAfoLIO${sale}` }
    });
}


const Active = () => {
    const {id} = useLocalSearchParams();
    const { user, setUser, setLastActive, darkTheme } = useGlobalContext();
    const [investment, setInvestment] = useState({});
    const [investmentCalcVal, setInvestmentCalcVal] = useState(null);
    const [updates, setUpdates] = useState({});
     
    const { data:investmentData, loading, refetch } = useAppwrite(()=>getUserInvestmentData(id,user?.$id))
    const navigation = useNavigation();
    const [activeMethod, setActiveMethod] = useState(true)

    const [dateValue, setDateValue] = useState(null)
    const [dateValue2, setDateValue2] = useState(null)
    const [showDateSelect, setShowDateSelect] = useState(false);
    const [isDrawerVisible2, setIsDrawerVisible2] = useState(false);
    const [isDrawerVisible3, setIsDrawerVisible3] = useState(false);
    const [isDrawerVisible4, setIsDrawerVisible4] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadings, setLoadings] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [next, setNext] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [unitToSell, setUnitToSell] = useState(0);
    const [pricePlaced, setPricePlaced] = useState(0);

    const handleClear =()=>{
        setDateValue(null)
        setDateValue2(null)
        setShowDateSelect(false)
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDateValue(date)
        hideDatePicker();
    };

    const showDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };

    const handleConfirm2 = (date) => {
        setDateValue2(date)
        hideDatePicker2();
    };
    
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    const handleMoveToWallet = async()=>{
        if(!checkMatured({
            duration:investment?.investment?.duration_days,
            createdAt:investment?.date_created
        })){
            Alert.alert("Invalid request", "Investment is not matured.");
            return
        }
        setLoadingSubmit(true)
        await updateOngoingInvestment(investment?.$id,{
            is_matured:true,
            inactive:true
        })
        const valueSentToWallet = totalProfitsAndInvested(investment)
        await Promise.all(
            [updateUser(user.$id,{wallet_balance: parseFloat(user.wallet_balance + valueSentToWallet)}),
            createTransactions({
                action:"Deposit",
                amount:parseFloat(valueSentToWallet),
                type:"Wallet",
                user:user.$id,
                reason:investment?.investment?.name,
                reference:"Wallet"
            })]
        )
        await updateCurrentUser(setUser)
        setLoadingSubmit(false)
        // Show success message and say continue
        setSuccessModal(true)
    }

    const handleSellShare = async()=>{
        // make sure to check for matured investment 
        if(checkMatured({
            duration:investment?.investment?.duration_days,
            createdAt:investment?.date_created
        })){
            Alert.alert("Invalid request", "Investment is matured, you cannot sell now.");
            return
        }
        setLoadingSubmit(true)
        try {
            await sellInvestment({
                unit:investment?.unit,
                putUnit:unitToSell,
                pricePlaced: parseFloat(pricePlaced),
                investment,
                type: "Sales",
                user,
                setUser,
                reason: investment?.investment?.name
            })
            await refetch()
            setSuccess(true)
        } catch (error) {
            console.log(error)
        }finally{
            setLoadingSubmit(false)
        }
    }
    const handleSellShareNairaFolio = async()=>{
        if(checkMatured({
            duration:investment?.investment?.duration_days,
            createdAt:investment?.date_created
        })){
            Alert.alert("Invalid request", "Investment is matured, you cannot sell now.");
            return
        }
        setLoadingSubmit(true)
        try {
            await sellInvestmentNairaFolio({
                unit:investment?.unit,
                putUnit:unitToSell,
                investment,
                type: "Sales",
                user,
                setUser,
                reason: investment?.investment?.name
            })
            await refetch()
            setSuccess(true)
        } catch (error) {
            console.log(error)
        }finally{
            setLoadingSubmit(false)
        }
    }
    
    const handleSuccess= ()=>{
        setSuccess(false)
        setIsDrawerVisible2(false)
        setNext(false)
        setUnitToSell(0)
        setPricePlaced(0)
        setActiveMethod(0)
    }

    const handleNext = () => {
        if (activeIndex < investment?.investment.updates.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleUndoSell = async() =>{
        
        setLoadError(false)
        try {
            setLoadings(true)

            await undoSellInvestment({
                unit:investment?.unit,
                investment,
                type: "Sales",
                user,
                reason: investment?.investment?.name
            })

            setNext(true)
            setSuccess(true)
        } catch (error) {
            setLoadError(true)
            setSuccess(false)
            setNext(true)
        }finally{
            setLoadings(false)
        }
    }
    const handleSuccessUndoSales= ()=>{
        setSuccess(false)
        setIsDrawerVisible4(false)
        setNext(false)
        setLoadings(false)
        setLoadError(false)
        router.replace("/portfolio")
    }

    const handleFailSalesUndoSales= ()=>{
        setSuccess(false)
        setIsDrawerVisible4(false)
        setNext(false)
        setLoadings(false)
        setLoadError(false)
    }

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };
    const handleSellMethodSelect = (methodSelected) => {
        setNext(true);
        setActiveMethod(methodSelected)
    }
    const handleDismissSuccessModal = ()=>{
        setSuccessModal(false)
        router.replace("/home")
    }
    useEffect(()=>{
        if(investmentData){
            if((investmentData[0] && investmentData[0].sold) || (investmentData[0] && investmentData[0].is_matured)){
                router.replace("/home")
            }
            
        }
        if((!dateValue || !dateValue2) && investmentData){
            setInvestment(investmentData[0])
            if(investmentData[0]){
                const [daysGoner,matured,started,immediate_start,date_to_introduction] =checkMaturedInfo(investmentData[0]);
                setInvestmentCalcVal({daysGoner,matured,started,immediate_start,date_to_introduction})
            }
        
        }
        if(investmentData){
            setUpdates(investmentData?.[0]?.investment?.updates)
        }
    },[investmentData,dateValue])
    useEffect(()=>{
        if (dateValue && dateValue2){
            const searchFunc = async()=>{
                const dateSearchValue = await searchInvestmentUpdates(
                    new Date(dateValue).toISOString(),
                    new Date(dateValue2).toISOString()
                )
                if (dateSearchValue){
                    setUpdates(dateSearchValue)
                }
            }
            searchFunc()
        }
    },[dateValue,dateValue2])
    const handleAdd = ()=>{
        setModalVisible(true)
    }
    const [active, setActive] = useState(0)
    
    const [isInsufficientFund, setIsInsufficientFund] = useState(false)
    
    const handleWalletPay = async()=>{
        setLoadings(true)
        setLoadError(false)
        setIsInsufficientFund(false)

        // {price_per_unit,name,$id}

        const {error,insufficient_fund} = await WalletCheckOutSales({
            price_per_unit:investment?.pricePlaced,
            name:investment?.investment?.name,
            $id:investment?.$id,
            user:investment?.user,
            investment,
        },investment?.unit,user)
        if(error){
            setLoadError(true)
            return
        }
        if(insufficient_fund){
            setLoadings(false)
            setIsInsufficientFund(true)
            return
        }
        setLoadings(false)
        setSuccess(true)
    }
    const majorSubmitHandler= async()=>{
        if (active === 1){
            await handleWalletPay()
            setNext(true)
        }else if (active === 2){
            goToPayNow({
                email:user.email,
                amount:investment?.pricePlaced * investment?.unit,
                mode: "bank_transfer",
                investmentId:investment?.$id,
                sale:true
            })
            setNext(true)
        }else if (active === 3){
            goToPayNow({
                email:user.email,
                amount:investment?.pricePlaced * investment?.unit,
                mode: "card",
                investmentId:investment?.$id,
                sale:true
            })
            setNext(true)
        }
    }
    const handleOtherScreen = (num) =>{
        setActive(num)
    }
    
    const handleSuccessSales= ()=>{
        setSuccess(false)
        setIsDrawerVisible3(false)
        setNext(false)
        setLoadings(false)
        setLoadError(false)
        router.replace("/home")
    }
    const handleFailSales= ()=>{
        setSuccess(false)
        setIsDrawerVisible3(false)
        setLoadings(false)
        setNext(false)
        setLoadError(false)
    }
    const handleInsufficientFundClick= ()=>{
        handleFailSales()
        setIsInsufficientFund(false)
        router.push("/wallet")
    }
    const handleModalClick= (url)=>{
        setModalVisible(false)
        router.push(url)
    }
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" && "padding"} 
            style={{ flex: 1 }}
        >
            <SafeAreaView className={`flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
                <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
                <View className="px-5">
                    {!loading && (
                        <View>
                            <Text 
                                className="text-black-100 dark:text-white text-xl font-pregular font-[700]"
                            >
                                {investment?.investment?.name}
                            </Text>
                        </View>
                    )}
                </View>
                {loading ? (
                    <OngoingDetailSkeletonLoader darkTheme={darkTheme} />
                ):(
                    <ScrollView
                        onTouchStart={() => setLastActive(Date.now())}
                        onScroll={() => setLastActive(Date.now())}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false} 
                        showsHorizontalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        <View className="flex-1 h-full">
                            
                            <View className="px-5">
                                <View className="pt-5">
                                    {(investmentCalcVal?.immediate_start || investmentCalcVal?.started) ? (
                                        <Money
                                            value={(investment?.investment?.price_per_unit * investment?.unit) + calculateProfit({
                                                percentage:investment?.rio,
                                                daysGone:UTCDate(investment?.date_created)?.daysGone,
                                                invested:investment?.investment?.price_per_unit * investment?.unit,
                                                duration:investment?.investment?.duration_days
                                            })}
                                            textStyle="text-black-100 dark:text-white font-psans text-4xl"
                                        />
                                    ):(
                                        <Money
                                            value={investment?.investment?.price_per_unit * investment?.unit}
                                            textStyle="text-black-100 dark:text-white font-psans text-4xl"
                                        />
                                    )}
                                </View>
                                <View className=" flex-1">
                                    <View className=" flex flex-row flex-1">
                                        <Text className="text-muted dark:text-[#FFFFFFB2] font-pregular font-[700] text-base">
                                            Invested 
                                        </Text>
                                        <Money
                                            value={(investment?.investment?.price_per_unit * investment?.unit) }
                                            textStyle="text-muted dark:text-[#FFFFFFB2] font-pregular font-[700] text-base"
                                            containerStyle="pl-2"
                                        />
                                    </View>
                                    <View>
                                        {investmentCalcVal?.started ? (
                                            <Money
                                                value={calculateProfit({
                                                    percentage:investment?.rio,
                                                    daysGone:UTCDate(investment?.date_created)?.daysGone,
                                                    invested:(investment?.investment?.price_per_unit * investment?.unit) ,
                                                    duration:investment?.investment?.duration_days
                                                })}
                                                textStyle="text-secondary-100 font-pregular text-base font-[700]"
                                            />

                                        ):(
                                            <Text className="text-muted dark:text-[#FFFFFFB2] font-pregular font-[700] text-base">
                                                Start date : {UTCDate(investmentCalcVal?.date_to_introduction).myDateFormat}
                                            </Text>
                                        )}
                                    </View>
                                    <View className={`flex mt-2 items-center justify-center w-[100px] bg-[#F5F5F5] dark:bg-[#303540] border border-border dark:border-[#DCDCDC4D] px-3 py-1.5 rounded-lg`}>
                                        {(investment?.investment?.duration_days-UTCDate(investment?.date_created)?.daysGone) >= 0 ? (
                                            <Text className="font-pregular text-base text-muted-100">
                                                {investment?.investment?.duration_days-UTCDate(investment?.date_created)?.daysGone} days left
                                            </Text>
                                        ) : (
                                            <Text className="font-pregular text-base text-secondary-100">
                                                Matured
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                {/* here ............ */}
                                        {/* {false ? ( */}
                                <View className="pt-6 min-h-24">
                                    {user?.$id === investment?.user?.$id ? (
                                        <View className="flex-1 flex flex-row gap-4">
                                            {(!investment?.is_up_for_sell && !investmentCalcVal?.matured) ? (
                                                <TouchableOpacity
                                                    onPress={handleAdd}
                                                    activeOpacity={0.7}
                                                    disabled={loadingSubmit ? true : false}
                                                    className={`${ loadingSubmit && "opacity-50" } bg-primary dark:bg-dark_mode-200 rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                                >
                                                    <Text className={`font-pinter font-semibold text-base text-white dark:text-[#171717]`}>
                                                        Add
                                                    </Text>
                                                    <View className="ml-2">
                                                        <Image
                                                            source={icons.download}
                                                            resizeMode="contain"
                                                            tintColor={darkTheme === "dark" ? "#171717" : "#FFFFFF"}
                                                        />
                                                    </View>
                                                    
                                                </TouchableOpacity>
                                            ):(
                                                <TouchableOpacity
                                                    onPress={handleMoveToWallet}
                                                    activeOpacity={0.7}
                                                    disabled={((investment?.investment?.duration_days-UTCDate(investment?.date_created)?.daysGone) >= 0 || loadingSubmit) ? true : false}
                                                    className={`${((investment?.investment?.duration_days-UTCDate(investment?.date_created)?.daysGone) >= 0 || loadingSubmit) && "opacity-50" } bg-primary dark:bg-dark_mode-200 rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                                >
                                                    <Text className={`font-pinter font-semibold text-base text-white dark:text-[#171717]`}>
                                                        Move to wallet
                                                    </Text>
                                                    <View className="ml-2">
                                                        <Image
                                                            source={icons.download}
                                                            resizeMode="contain"
                                                            tintColor={darkTheme === "dark" ? "#171717" : "#FFFFFF"}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                            {(!investment?.is_up_for_sell && !investment?.sold && !checkMatured({
                                                duration:investment?.investment?.duration_days,
                                                createdAt:investment?.date_created
                                            }) ) ? (
                                                <TouchableOpacity
                                                    onPress={()=>setIsDrawerVisible2(true)}
                                                    activeOpacity={0.7}
                                                    className={`border border-border-100 dark:border-[#00000014] bg-[#F5F5F5] dark:bg-[#303540] rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                                >
                                                    <Text className={`font-pinter font-semibold text-base text-muted dark:text-white`}>
                                                        Sell shares
                                                    </Text>
                                                    <View className="ml-2">
                                                        <Image
                                                            source={icons.upload}
                                                            resizeMode="contain"
                                                            tintColor={darkTheme === 'dark' ? "#FFFFFF" : "#747474"}
                                                        />
                                                    </View>
                                                    
                                                </TouchableOpacity>
                                            ):(
                                                <> 
                                                    {!checkMatured({
                                                        duration:investment?.investment?.duration_days,
                                                        createdAt:investment?.date_created
                                                    }) && (user?.$id === investment?.user?.$id) && (
                                                        <TouchableOpacity
                                                            onPress={()=>setIsDrawerVisible4(true)}
                                                            activeOpacity={0.7}
                                                            className={`border border-border-100 dark:border-[#00000014] bg-[#F5F5F5] dark:bg-[#303540] rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                                        >
                                                            <Text className={`font-pinter font-semibold text-base text-muted dark:text-white`}>
                                                                Cancel ad
                                                            </Text>
                                                            <View className="ml-2">
                                                                <Image
                                                                    source={icons.upload}
                                                                    resizeMode="contain"
                                                                    tintColor={darkTheme === 'dark' ? "#FFFFFF" : "#747474"}
                                                                />
                                                            </View>
                                                            
                                                        </TouchableOpacity>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    ):(
                                        <>
                                            {user && investment?.user && (
                                                <View className="flex-1">
                                                    <CustomButton 
                                                        title={"Buy now"}
                                                        handlePress={()=> setIsDrawerVisible3(true)}
                                                        containerStyles={"h-14 font-psemibold"}
                                                        textStyles={darkTheme !== "dark" && "text-white"}
                                                        isLoading={loadings}
                                                        darkTheme={darkTheme}
                                                    />
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>

                                <View>
                                    <TouchableOpacity 
                                        activeOpacity={0.9}
                                        className="mb-5"
                                        onPress={()=>router.push(`/investment/user_offer/${investment?.investment?.$id}`)}
                                    >
                                        <View 
                                            className={`
                                                flex-1 
                                                py-2.5 flex-row
                                                px-3
                                                rounded-lg
                                                bg-[#CBF5B84D]
                                                dark:bg-[#f1f1f1]
                                            `}
                                        >
                                            <View
                                                className="
                                                    h-12 w-12 
                                                    rounded-full 
                                                    bg-[#0141481A]
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
                                            <View
                                                style={{
                                                    width: "60%",
                                                }}
                                                className="flex-1 px-3 justify-center "
                                            >
                                                <View>
                                                    <Text
                                                        className="text-lg text-muted-200 "
                                                    >
                                                        View sales ads
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    width: "30%",
                                                }}
                                                className="items-right justify-center pr-2"
                                            >
                                                <View className="w-full items-end">
                                                    <View>
                                                        <Image
                                                            source={icons.arrow_right}
                                                            resizeMode="contain"
                                                            className="
                                                                w-6
                                                                rounded-full
                                                            "
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-1 mt-1 rounded-lg border border-border dark:border-[#3B3C43]">
                                    <View className="p-4 border-b border-border dark:border-[#3B3C43] flex-1">
                                        <Text className="text-muted dark:text-[#FFFFFFB2]">
                                            Returns
                                        </Text>
                                    </View>
                                    <View className="p-4">
                                        <Text className="text-muted dark:text-[#FFFFFFB2] text-base">
                                            Highlights
                                        </Text>
                                        <View className="flex flex-row gap-4 mt-4 flex-1">
                                            
                                            <View className="flex w-[48%] items-center justify-center bg-[#F6F6F6] dark:bg-dark_mode-300 border border-border-200 dark:border-[#0000000A] px-3 py-2.5 rounded-lg">
                                                <View>
                                                    <Image
                                                        source={icons.roi}
                                                        resizeMode="contain"
                                                        className="my-auto"
                                                        tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                    />
                                                </View>
                                                <View className="mt-2">
                                                    <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200 dark:text-[#FFFFFF99]">{investment?.rio ?? 1}% ROI</Text>
                                                </View>
                                            </View>
                                            <View className="flex w-[48%] items-center justify-center bg-[#F6F6F6] dark:bg-dark_mode-300 border border-border-200 dark:border-[#0000000A] px-3 py-2.5 rounded-lg">
                                                <View>
                                                    <Image
                                                        source={icons.money}
                                                        resizeMode="contain"
                                                        className="my-auto"
                                                        tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                    />
                                                </View>
                                                <View className="mt-2">
                                                    <View className="flex flex-row ">
                                                        <Money 
                                                            value={investment?.investment?.min_investment}
                                                            containerStyle="flex"
                                                            textStyle="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200 dark:text-[#FFFFFF99]"
                                                        />
                                                        <View className="flex flex-row ">
                                                            <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200 dark:text-[#FFFFFF99]">
                                                                min
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        {/* <View className="flex mt-4 items-center justify-center bg-[#F6F6F6] dark:bg-dark_mode-300 border border-border-200 dark:border-[#0000000A] px-3 py-2.5 rounded-lg">
                                            <View>
                                                <Image
                                                    source={icons.calender}
                                                    resizeMode="contain"
                                                    className="my-auto"
                                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                />
                                            </View>
                                            <View className="mt-2">
                                                <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200 dark:text-[#FFFFFF99]">
                                                    {convertDaysToReadableFormat(investment?.investment?.duration_days ?? 0)} returns
                                                </Text>
                                            </View>
                                        </View> */}
                                        <View className="flex flex-row gap-4 flex-1">
                                            {!!investment?.investment?.duration_days && (
                                                <View className="flex w-[48%] mt-4 items-center justify-center bg-[#F6F6F6] dark:bg-dark_mode-300 border border-border-200 dark:border-[#0000000A] px-3 py-2.5 rounded-lg">
                                                    <View>
                                                        <Image
                                                            source={icons.calender}
                                                            resizeMode="contain"
                                                            className="my-auto"
                                                            tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                        />
                                                    </View>
                                                    <View className="mt-2">
                                                        <Text className="font-pmedium text-center ml-2 my-auto font-[600] text-base text-muted-200 dark:text-[#FFFFFF99]">
                                                            {convertDaysToReadableFormat(investment?.investment?.duration_days ?? 0)} returns
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                            {!!investment?.investment?.date_to_introduction && (
                                                <View className="flex w-[48%] mt-4 items-center justify-center bg-[#F6F6F6] dark:bg-dark_mode-300 border border-border-200 dark:border-[#0000000A] px-3 py-2.5 rounded-lg">
                                                    <View>
                                                        <Image
                                                            source={icons.start_date}
                                                            resizeMode="contain"
                                                            className="my-auto"
                                                            tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                        />
                                                    </View>
                                                    <View className="mt-2">
                                                        <View className="flex flex-row ">
                                                            <View className="flex flex-row ">
                                                                <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200 dark:text-[#FFFFFF99]">
                                                                    Starts {UTCDate(investment?.investment?.date_to_introduction)?.simpleDateFormat}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>


                                    </View>
                                    <View className="p-4">
                                        <Text className="text-muted dark:text-[#FFFFFFB2] text-base">
                                            Overview
                                        </Text>
                                        <View className="pt-4 border-t border-border dark:border-[#3B3C43] mt-4">
                                            <Text className="text-black-300 dark:text-[#808D9E] text-lg font-pregular font-[600]">
                                                {investment?.investment?.introduction ?? ""}
                                            </Text>
                                        </View>
                                        <View className="mt-4 items-right">
                                            <Link href={`/investment/new/${investment?.investment?.$id}`}>
                                                <Text className="text-blue-500 font-psans">
                                                    See more
                                                </Text>
                                            </Link>
                                        </View>
                                    </View>
                                    
                                </View>
                                <View className="mb-8">
                                    {updates && updates.length>0 && (
                                        <>
                                            <View className="mt-8">
                                                <Text className="text-black-100 dark:text-white text-xl font-pregular font-[700]">
                                                    Updates
                                                </Text>
                                                <View className="mt-2">
                                                    <Text className="text-muted dark:text-[#FFFFFFB2] text-base font-pregular">
                                                        Here are updates about your investment.
                                                    </Text>
                                                </View>
                                                <View className="flex flex-row justify-between w-full">
                                                    <View className="flex flex-row gap-4 flex-1 w-full mt-4">
                                                        <TouchableOpacity
                                                            onPress={handlePrev}
                                                            className={`
                                                                flex
                                                                justify-center
                                                                items-center
                                                                rounded-full
                                                                h-12
                                                                w-12
                                                                ${activeIndex > 0 ? `${darkTheme === "dark" ? "bg-[#303540]" : "bg-[#F3F3F3]"}` : `${darkTheme === "dark" ? "bg-[#303540]" : "bg-[#F9F9F9]"}`}
                                                            `}
                                                            disabled={activeIndex === 0}
                                                        >
                                                            <Image
                                                                source={icons.arrow_left_italic}
                                                                resizeMode="contain"
                                                                tintColor={activeIndex > 0 ? `${darkTheme === "dark" ? "#FFFFFF" : "#014148"}` : `${darkTheme === "dark" ? "#F1F1F1" : "#98B2B5"}`}
                                                            />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            onPress={handleNext}
                                                            className={`
                                                                flex
                                                                justify-center
                                                                items-center
                                                                rounded-full
                                                                h-12
                                                                w-12
                                                                ${activeIndex < updates.length - 1 ? `${darkTheme === "dark" ? "bg-[#303540]" : "bg-[#F3F3F3]"}` : `${darkTheme === "dark" ? "bg-[#303540]" : "bg-[#F9F9F9]"}`}
                                                            `}
                                                            disabled={activeIndex === updates.length - 1}
                                                        >
                                                            <Image
                                                                source={icons.arrow_right_italic}
                                                                resizeMode="contain"
                                                                tintColor={activeIndex < updates.length - 1 ? `${darkTheme === "dark" ? "#FFFFFF" : "#014148"}` : `${darkTheme === "dark" ? "#F1F1F1" : "#98B2B5"}`}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View className="flex">
                                                        <TouchableOpacity 
                                                            className='my-auto'
                                                            onPress={() => setDrawerVisible(true)}
                                                        >
                                                            <Text className="text-blue-500 font-psans">
                                                                See more
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View className="mt-2 flex-1">
                                                    <FlatList
                                                        onTouchStart={() => setLastActive(Date.now())}
                                                        onScroll={() => setLastActive(Date.now())}
                                                        scrollEventThrottle={16}
                                                        data={[updates[activeIndex]]}
                                                        horizontal
                                                        contentContainerStyle={{flex: 1}}
                                                        renderItem={({ item }) => (
                                                            <TitleComponent item={{...item,darkTheme:darkTheme}} />
                                                        )}
                                                        keyExtractor={(item, index) => index.toString()}
                                                    />
                                                </View>
                                            </View>
                                        </>
                                    )}
                                    {/* <View className="mt-8">
                                        <Text className="text-black-100 dark:text-white text-xl font-pregular font-[700]">
                                            Activities
                                        </Text>
                                        <View className="mt-4 mb-10">
                                            <View 
                                                className="
                                                    flex-1 
                                                    rounded-lg
                                                    flex 
                                                    py-4 flex-row
                                                    border-b
                                                    border-border dark:border-[#3B3C43]
                                                    mb-1
                                                "
                                            >
                                                <View
                                                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                                                >
                                                    <Image
                                                        source={icons.download}
                                                        resizeMode="cover"
                                                        tintColor={"#40BF6A"}
                                                    />
                                                </View>
                                                <View
                                                    style={{
                                                        width: "61.54%",
                                                    }}
                                                    className="flex-1 px-3 "
                                                >
                                                    <View>
                                                        <Text
                                                            className="text-lg font-[700] font-pmedium text-header-200 dark:text-white "
                                                            numberOfLines={1}
                                                        >
                                                            Deposit
                                                        </Text>
                                                    </View>
                                                    <View className="pt-2">
                                                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                                            Tue May 24th, 3:34pm
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        width: "23.08%",
                                                    }}
                                                >
                                                    <View>
                                                        <Money 
                                                            value={1000}
                                                            textStyle="text-right"
                                                        />
                                                    </View>
                                                    <View className="mt-2">
                                                        <Text className="text-secondary-100 text-sm font-semibold text-right">
                                                            Credited
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View 
                                                className="
                                                    flex-1 
                                                    rounded-lg
                                                    flex 
                                                    py-4 flex-row
                                                    mb-5
                                                "
                                            >
                                                <View
                                                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                                                >
                                                    <Image
                                                        source={icons.download}
                                                        resizeMode="cover"
                                                        tintColor={"#40BF6A"}
                                                    />
                                                </View>
                                                <View
                                                    style={{
                                                        width: "61.54%",
                                                    }}
                                                    className="flex-1 px-3 "
                                                >
                                                    <View>
                                                        <Text
                                                            className="text-lg font-[700] font-pmedium text-header-200 dark:text-white "
                                                            numberOfLines={1}
                                                        >
                                                            Deposit
                                                        </Text>
                                                    </View>
                                                    <View className="pt-2">
                                                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                                            Tue May 24th, 3:34pm
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={{
                                                        width: "23.08%",
                                                    }}
                                                >
                                                    <View>
                                                        <Money 
                                                            value={1000}
                                                            textStyle="text-right"
                                                        />
                                                    </View>
                                                    <View className="mt-2">
                                                        <Text className="text-secondary-100 text-sm font-semibold text-right">
                                                            Credited
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View> */}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                )}
                <Drawer 
                    header={"Updates"} 
                    isVisible={isDrawerVisible} 
                    onClose={() => setDrawerVisible(false)}
                    darkTheme={darkTheme}
                >
                    <View>
                        <TouchableOpacity 
                            onPress={()=>setShowDateSelect(true)}
                            className="border border-border dark:border-[#3B3C43] flex-row rounded-md w-44"
                        >
                            <View className="border-r border-border dark:border-[#3B3C43] p-2 text-center justify-center">
                                <Image
                                    source={icons.calender}
                                    resizeMode="cover"
                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                />
                            </View>
                            <View className="p-2 text-center justify-center">
                                <Text className=" text-muted-200 dark:text-[#FFFFFF99] font-pmedium">
                                    Select date
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {showDateSelect && (
                            <>
                                <View className="flex-row gap-3 border-border dark:border-[#3B3C43] mt-3 pt-3 border-t">
                                    <TouchableOpacity 
                                        onPress={showDatePicker}
                                        className="border flex-1 border-border dark:border-[#3B3C43] flex-row rounded-md w-44"
                                    >
                                        <View className="border-r border-border dark:border-[#3B3C43] p-2 text-center justify-center">
                                            <Image
                                                source={icons.calender}
                                                resizeMode="cover"
                                                tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                            />
                                        </View>
                                        <View className="p-2 text-center justify-center">
                                            <Text className="text-sm text-muted-200 dark:text-[#FFFFFF99] font-pmedium">
                                                Select start date
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={showDatePicker2}
                                        className="border flex-1 border-border dark:border-[#3B3C43] flex-row rounded-md w-44"
                                    >
                                        <View className="border-r border-border dark:border-[#3B3C43] p-2 text-center justify-center">
                                            <Image
                                                source={icons.calender}
                                                resizeMode="cover"
                                                tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                            />
                                        </View>
                                        <View className="p-2 text-center justify-center">
                                            <Text className="text-sm text-muted-200 dark:text-[#FFFFFF99] font-pmedium">
                                                Select end date
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {(dateValue || dateValue2) && (
                                    <View className="flex-1 flex-row gap-2 mt-2">
                                        <View className="flex-1">
                                            <Text className="text-sm font-pmedium text-muted-200 dark:text-[#FFFFFF99]">
                                                {dateValue?.toDateString()}
                                            </Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-sm font-pmedium text-muted-200 dark:text-[#FFFFFF99]">
                                                {dateValue2?.toDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                <TouchableOpacity
                                    onPress={()=>handleClear(null)}
                                >
                                    <Text className="mt-5 font-psans text-red-500">
                                        Clear
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                        <View className="mt-2 mb-14">
                            {updates && updates?.length > 0 && updates?.map(update=>(
                                <TitleComponent item={{...update,darkTheme:darkTheme,"lines":true}} key={update.$id}/>
                            ))}
                        </View>
                        {updates?.length === 0 && (
                            <View className="mt-2">
                                <EmptyState darkTheme={darkTheme} title={"No update found"} subtitle={"No update found for the date selected"} />
                            </View>
                        )}
                    </View>
                </Drawer>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible2}
                    mode="date"
                    onConfirm={handleConfirm2}
                    onCancel={hideDatePicker2}
                />
                <GeneralDrawer
                    darkTheme={darkTheme}
                    header={success ? "success!" : activeMethod === 2 ? "Sell shares now" : "Sell shares"}
                    isVisible={isDrawerVisible2} 
                    onClose={handleSuccess}
                    makeFull={success}
                >
                    {!next ? (
                        <>
                            <TouchableOpacity 
                                className="my-5"
                                onPress={()=>handleSellMethodSelect(1)}
                            >
                                <View 
                                    className={`
                                        flex-1 
                                        rounded-lg
                                        flex 
                                        py-4 flex-row
                                        px-2
                                        border
                                        border-border dark:border-[#3B3C43]
                                        bg-[#F8FAFA] dark:bg-[#303540]
                                    `}
                                >
                                    <View
                                        style={{
                                            width: "74.54%",
                                        }}
                                        className="flex-1 px-3 "
                                    >
                                        <View>
                                            <Text
                                                className="text-lg text-header-200 dark:text-white  font-psans"
                                            >
                                                Put up your shares for sale
                                            </Text>
                                        </View>
                                        <View className="mt-1">
                                            <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                                Set your price and wait for a buyer
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            width: "30.08%",
                                        }}
                                        
                                        className="items-right justify-center pr-2"
                                    >
                                        <View className="w-full items-end">
                                            <Image 
                                                source={icons.arrow_right_italic}
                                                tintColor={darkTheme === "dark" ? "#FFFFFF" : "#000000"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={()=>handleSellMethodSelect(2)}
                            >
                                <View 
                                    className={`
                                        flex-1 
                                        rounded-lg
                                        flex 
                                        py-4 flex-row
                                        px-2
                                        border
                                        border-border dark:border-[#3B3C43]
                                        bg-[#F8FAFA] dark:bg-[#303540]
                                    `}
                                >
                                    <View
                                        style={{
                                            width: "70%",
                                        }}
                                        className="flex-1 px-3 "
                                    >
                                        <View>
                                            <Text
                                                className="text-lg text-header-200 dark:text-white  font-psans"
                                            >
                                                Sell now
                                            </Text>
                                        </View>
                                        <View className="mt-1">
                                            <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                                Instantly sell your shares at our price.
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            width: "30%",
                                        }}
                                        className="items-right justify-center pr-2"
                                    >
                                        <View className="w-full items-end">
                                            <Text className="text-secondary-100 font-psans text-sm">
                                                ₦{investment?.investment?.price_by_nairafolio} / unit
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>
                    ):success ? (
                        <View 
                            className="px-2 flex-col justify-between"
                            style={{
                                minHeight: screenHeight - 200 
                            }}
                        >
                            <View className=' justify-center items-center'>
                                <View className="flex-1 justify-center items-center mt-24">
                                    <Image 
                                        source={icons.good}
                                    />
                                </View>
                                <View className="mt-5">
                                    {activeMethod === 2 ? (
                                        <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                            You have just sold {unitToSell} units of your shares to NairaFolio.
                                        </Text>
                                    ) : (
                                        <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                            You have just put up {unitToSell} units of your shares up for sale.
                                        </Text>
                                    )}
                                </View>
                                {activeMethod !== 2 && (
                                    <View className="mt-2">
                                        <Text className="text-black-100 dark:text-white font-pmedium text-base text-center">
                                            Your wallet will be credited once someone else buys your shares
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <CustomButton
                                handlePress={handleSuccess}
                                title={"Continue"}
                                textStyles={darkTheme !== "dark" && "font-psans text-white"}
                                containerStyles={"mt-24 h-14"}
                                darkTheme={darkTheme}
                            />
                        </View>
                    ):(
                        <>
                            <View className="px-2">
                                <FormFieldAdjusted 
                                    title="How many units do you want to sell?"
                                    value={unitToSell}
                                    keyboardType={"number-pad"}
                                    placeholder={"Enter unit"}
                                    handleDataAction={()=>setUnitToSell(investment?.unit)}
                                    handleChangeText={(e)=>setUnitToSell(e)}
                                    dataStyle={"text-muted-200 dark:text-[#FFFFFF99] font-psemibold"}
                                    darkTheme={darkTheme}
                                />
                                {unitToSell > investment?.unit && (
                                    <Text className="mt-2 text-red-500 font-psemibold text-sm ">
                                        You cannot sell more units than you have.
                                    </Text>
                                )}
                                {activeMethod !== 2 && (
                                    <View>
                                        <Text className="font-pregular px-2 text-base my-7 text-black-100 dark:text-white">
                                            Note that your shares will be sold only when someone else buys them.
                                        </Text>
                                    </View>
                                )}
                                {activeMethod !== 2 ? (
                                    <FormFieldAdjusted 
                                        title="Set a price per unit"
                                        value={pricePlaced}
                                        keyboardType={"number-pad"}
                                        placeholder={"Enter price per unit"}
                                        data={"/Unit"}
                                        handleChangeText={(e)=>setPricePlaced(e)}
                                        dataStyle={"text-muted-200 dark:text-[#FFFFFF99] font-psemibold"}
                                        darkTheme={darkTheme}
                                    />
                                ):(
                                    <View>
                                        <View className="mt-5 mb-7">
                                            <Text className="text-muted-200 dark:text-[#FFFFFF99] font-pmedium">
                                                Price of units
                                            </Text>
                                            <View className="mt-3 items-center justify-center rounded-lg bg-[#F7F7F7] dark:bg-[#27282F] h-14">
                                                <Money 
                                                    value={unitToSell * investment?.investment?.price_by_nairafolio}
                                                    textStyle={darkTheme === "dark" ? "font-xl !text-white" : "font-xl"}
                                                />
                                            </View>
                                        </View>
                                        <View className={"justify-center items-center flex-row"}>
                                            <View className="">
                                                <Text className="text-secondary-100 text-base font-pmedium">
                                                    One unit costs {" "}
                                                </Text>
                                            </View>
                                            <View className="">
                                                <Money 
                                                    value={investment?.investment?.price_by_nairafolio}
                                                    containerStyle={"flex"}
                                                    textStyle={"font-psans text-base text-secondary-100"}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                                {unitToSell > 0 && pricePlaced > 0 && (
                                    <View className="mt-5 justify-center items-center flex-row">
                                        <Text className="font-pregular text-base my-7 text-secondary-100">
                                            For {unitToSell} units you’ll get{" "}
                                        </Text>
                                        <Money 
                                            value={unitToSell * pricePlaced}
                                            containerStyle={""}
                                            textStyle={"text-secondary-100 my-auto font-psemibold"}
                                        />
                                    </View>
                                )}
                                {activeMethod !== 2 ? (
                                    <CustomButton 
                                        title={"Sell shares"}
                                        containerStyles={"h-14 mt-16"}
                                        textStyles={"text-white font-psemibold"}
                                        loading={!unitToSell || !pricePlaced || unitToSell > investment?.unit }
                                        isLoading={loadingSubmit}
                                        handlePress={()=>setIsOpen(true)}
                                        darkTheme={darkTheme}
                                        newText={"!text-[#000000]"}
                                    />
                                ):(
                                    <CustomButton 
                                        title={"Sell shares"}
                                        containerStyles={"h-14 mt-16"}
                                        textStyles={"text-white font-psemibold"}
                                        loading={!unitToSell || unitToSell > investment?.unit }
                                        isLoading={loadingSubmit}
                                        handlePress={()=>setIsOpen2(true)}
                                        darkTheme={darkTheme}
                                        newText={"!text-[#000000]"}
                                    />
                                )}
                            </View>
                        </>
                    )}
                </GeneralDrawer>
                <SuccessModal
                    darkTheme={darkTheme}
                    header={"success!"}
                    isVisible={successModal} 
                    onClose={handleDismissSuccessModal}
                >
                    <View className="px-2 flex-1 mt-14">
                        <View className="flex-1 justify-center items-center">
                            <Image 
                                source={icons.good}
                            />
                        </View>
                        <View className="mt-5">
                            <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                Congratulations! 
                            </Text>
                        </View>
                        <View className="mt-2">
                            <Text className="text-black-100 dark:text-white font-pmedium text-base text-center">
                                Your investment funds have been successfully transferred to your wallet. 
                            </Text>
                        </View>
                        
                        <CustomButton
                            handlePress={handleDismissSuccessModal}
                            title={"Continue"}
                            textStyles={darkTheme !== "dark" && "font-psans text-white"}
                            containerStyles={"mt-5 h-14"}
                            darkTheme={darkTheme}
                        />
                    </View>
                </SuccessModal>
                <GeneralDrawer
                    darkTheme={darkTheme}
                    header={"Select payment method"}
                    isVisible={isDrawerVisible3} 
                    onClose={()=>setIsDrawerVisible3(false)}
                >
                    <View>
                        {!next ? (
                            <>
                                <View>
                                    <View className="px-5 border-b border-border dark:border-[#3B3C43]">
                                        <TouchableOpacity 
                                            activeOpacity={0.9}
                                            onPress={()=>handleOtherScreen(1)}
                                            className={`
                                                flex-1 
                                                rounded-lg
                                                flex 
                                                py-4 flex-row
                                                mb-5
                                                border
                                                ${(active && active === 1) ? "border-secondary-100" : "border-border dark:border-[#3B3C43]"}
                                                bg-[#F8FAFA]
                                                dark:bg-dark_mode-300
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
                                                                className="text-lg text-header-200 dark:text-white  font-psans"
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
                                    <TouchableOpacity 
                                        className="my-5 px-5"
                                        onPress={()=>handleOtherScreen(2)}
                                    >
                                        <View 
                                            className={`
                                                flex-1 
                                                rounded-lg
                                                flex 
                                                py-4 flex-row
                                                border
                                                ${(active && active === 2) ? "border-secondary-100" : "border-border dark:border-[#3B3C43]"}
                                                bg-[#F8FAFA]
                                                dark:bg-dark_mode-300
                                            `}
                                        >
                                            <View
                                                className="h-14 w-14 rounded-full items-center justify-center"
                                            >
                                                {darkTheme === "dark" ? (
                                                    <Image
                                                        source={icons.bank}
                                                        resizeMode="cover"
                                                        tintColor={"#CBF5B8"}
                                                    />
                                                ):(
                                                    <Image
                                                        source={icons.bank}
                                                        resizeMode="cover"
                                                    />
                                                )}
                                            </View>
                                            <View
                                                style={{
                                                    width: "74.54%",
                                                }}
                                                className="flex-1 px-3 "
                                            >
                                                <View>
                                                    <Text
                                                        className="text-lg text-header-200 dark:text-white  font-psans"
                                                    >
                                                        Bank transfer
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
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
                                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        className="px-5"
                                        onPress={()=>handleOtherScreen(3)}
                                    >
                                        <View 
                                            className={`
                                                flex-1 
                                                rounded-lg
                                                flex 
                                                py-4 flex-row
                                                mb-5
                                                border
                                                ${(active && active === 3) ? "border-secondary-100" : "border-border dark:border-[#3B3C43]"}
                                                bg-[#F8FAFA]
                                                dark:bg-dark_mode-300
                                            `}
                                        >
                                            <View
                                                className="h-14 w-14 rounded-full items-center justify-center"
                                            >
                                                {darkTheme === "dark" ? (
                                                    <Image
                                                        source={icons.card}
                                                        resizeMode="cover"
                                                        tintColor={"#CBF5B8"}
                                                    />
                                                ):(
                                                    <Image
                                                        source={icons.card}
                                                        resizeMode="cover"
                                                    />
                                                )}
                                            </View>
                                            <View
                                                style={{
                                                    width: "74.54%",
                                                }}
                                                className="flex-1 px-2 "
                                            >
                                                <View>
                                                    <Text
                                                        className="text-lg text-header-200 dark:text-white  font-psans"
                                                    >
                                                        Debit card
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
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
                                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {active > 0 && (
                                    <View className="px-5 pb-7">
                                        <CustomButton 
                                            title="Continue"
                                            textStyles={darkTheme !== "dark" && "text-white"}
                                            containerStyles="h-14"
                                            handlePress={majorSubmitHandler}
                                            isLoading={loadings}
                                            darkTheme={darkTheme}
                                        />
                                    </View>
                                )}
                            </>
                        ):(
                            <View>
                                {success ? (
                                    <View>
                                        <View className="px-2">
                                            <View className="flex-1 justify-center items-center">
                                                <Image 
                                                    source={icons.good}
                                                />
                                            </View>
                                            <View className="mt-5">
                                                <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                                    You have just bought {investment?.unit} units of shares from {investment?.investment?.name}.
                                                </Text>
                                            </View>
                                            <CustomButton
                                                handlePress={handleSuccessSales}
                                                title={"Continue"}
                                                textStyles={darkTheme !== "dark" ? "font-psans text-white" : "font-psans"}
                                                containerStyles={"mt-5 h-14"}
                                                darkTheme={darkTheme}
                                            />
                                        </View>
                                    </View>
                                ):loadError ? (
                                    <View className="">
                                        <View className="px-2">
                                            <View className="flex-1 justify-center items-center">
                                                <Image 
                                                    source={icons.error}
                                                />
                                            </View>
                                            <View className="mt-5">
                                                <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                                    An error occurred while trying to buy shares. Please try again later.
                                                </Text>
                                            </View>
                                            <CustomButton
                                                handlePress={handleFailSales}
                                                title={"Continue"}
                                                containerStyles={"mt-5 h-14"}
                                                textStyles={darkTheme !== "dark" ? "font-psans text-white" : "font-psans"}
                                                darkTheme={darkTheme}
                                            />
                                        </View>
                                    </View>
                                ) :(
                                    <View>
                                        {isInsufficientFund ? (
                                            <View className="px-2">
                                                <View className="flex-1 justify-center items-center">
                                                    <Image 
                                                        source={icons.error}
                                                    />
                                                </View>
                                                <View className="mt-5">
                                                    <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                                        Insufficient funds
                                                    </Text>
                                                </View>
                                                <CustomButton
                                                    handlePress={handleInsufficientFundClick}
                                                    title={"Continue"}
                                                    containerStyles={"mt-5 h-14"}
                                                    textStyles={darkTheme !== "dark" ? "font-psans text-white" : "font-psans"}
                                                    darkTheme={darkTheme}
                                                />
                                            </View>
                                        ):(
                                            <View className="px-2">
                                                <View className="flex-1 justify-center items-center">
                                                    <Image 
                                                        source={icons.error}
                                                    />
                                                </View>
                                                <View className="mt-5">
                                                    <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                                        An error occurred while trying to buy shares. Please try again later.
                                                    </Text>
                                                </View>
                                                <CustomButton
                                                    handlePress={handleFailSales}
                                                    title={"Continue"}
                                                    containerStyles={"mt-5 h-14"}
                                                    textStyles={darkTheme !== "dark" ? "font-psans text-white" : "font-psans"}
                                                    darkTheme={darkTheme}
                                                />
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </GeneralDrawer>
                <GeneralDrawer
                    darkTheme={darkTheme}
                    header={success ? "Success!" : loadError ? "Error occurred " :"Are you sure you want to undo this sell"}
                    isVisible={isDrawerVisible4} 
                    onClose={()=>setIsDrawerVisible4(false)}
                >
                    <View>
                        {!next ? (
                            <>
                                <View className="px-5 pb-7">
                                    <CustomButton 
                                        title="Continue"
                                        containerStyles="h-14"
                                        handlePress={handleUndoSell}
                                        isLoading={loadings}
                                        textStyles={darkTheme !== "dark" && "text-white"}
                                        darkTheme={darkTheme}
                                    />
                                </View>
                            </>
                        ):(
                            <View>
                                {success ? (
                                    <View>
                                        <View className="px-2">
                                            <View className="flex-1 justify-center items-center">
                                                <Image 
                                                    source={icons.good}
                                                />
                                            </View>
                                            <View className="mt-5">
                                                <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                                    Success!
                                                </Text>
                                            </View>
                                            <CustomButton
                                                handlePress={handleSuccessUndoSales}
                                                title={"Continue"}
                                                containerStyles={"mt-5 h-14"}
                                                textStyles={darkTheme !== "dark" ? "font-psans text-white" : "font-psans"}
                                                darkTheme={darkTheme}
                                            />
                                        </View>
                                    </View>
                                ):loadError ? (
                                    <View className="">
                                        <View className="px-2">
                                            <View className="flex-1 justify-center items-center">
                                                <Image 
                                                    source={icons.error}
                                                />
                                            </View>
                                            <View className="mt-5">
                                                <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                                    An error occurred. Please try again later.
                                                </Text>
                                            </View>
                                            <CustomButton
                                                handlePress={handleFailSalesUndoSales}
                                                title={"Continue"}
                                                containerStyles={"mt-5 h-14"}
                                                textStyles={darkTheme !== "dark" ? "font-psans text-white" : "font-psans"}
                                                darkTheme={darkTheme}
                                            />
                                        </View>
                                    </View>
                                ) :(
                                    <View>
                                        <View className="px-2">
                                            <View className="flex-1 justify-center items-center">
                                                <Image 
                                                    source={icons.error}
                                                />
                                            </View>
                                            <View className="mt-5">
                                                <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                                    An error occurred. Please try again later.
                                                </Text>
                                            </View>
                                            <CustomButton
                                                handlePress={handleFailSalesUndoSales}
                                                title={"Continue"}
                                                containerStyles={"mt-5 h-14"}
                                                textStyles={darkTheme !== "dark" ? "font-psans text-white" : "font-psans"}
                                                darkTheme={darkTheme}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </GeneralDrawer>
                <CustomModalAlert
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    body={investment?.immediate_start ? "This investment follows a one time feature, you can buy again from the explore page or other investors willing to sell." :"This investment is sold out, but you can buy from other investors that are willing to sell. Please proceed to view offers if you are still interested"}
                    title={"Please note"}
                >  
                    {investment?.immediate_start && 
                        <TouchableOpacity 
                            className='border-t border-[#4e4e4e] w-full py-2.5'
                            onPress={() => handleModalClick(`/investment/new/${investment?.investment?.$id}`)}
                        >
                            <Text className="font-psemibold text-lg text-blue-500 text-center">Go to Explore</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity 
                        className='border-t border-[#4e4e4e] w-full py-2.5'
                        onPress={() => handleModalClick(`/sales/${investment?.investment?.$id}`)}
                    >
                        <Text className="font-psemibold text-lg text-blue-500 text-center">See Offers</Text>
                    </TouchableOpacity>
                </CustomModalAlert>
                <PasswordConfirm  
                    actionFunc={handleSellShare}
                    user={user}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    loading={loadingSubmit}
                    darkTheme={darkTheme}
                />
                <PasswordConfirm  
                    actionFunc={handleSellShareNairaFolio}
                    user={user}
                    setIsOpen={setIsOpen2}
                    isOpen={isOpen2}
                    loading={loadingSubmit}
                    darkTheme={darkTheme}
                />
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default Active