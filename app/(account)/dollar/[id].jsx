import { View, Text, ScrollView, Image, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { RefreshControl } from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { OngoingDetailSkeletonLoader } from '@/components/DetailLoader';
import useAppwrite from '@/lib/useAppwrite';
import CustomNavigator from '@/components/CustomNavigator';
import { icons } from '@/constants';
import { createTransactions, getUserDataDollarCaller, getUserInvestment, updateUser } from '@/lib/appwrite';
import Money from '@/components/Money';
import TransactionCard from '@/components/TransactionCard';
import GeneralDrawer from '@/components/GeneralDrawer';
import PaymentDrawer from '@/components/PaymentDrawer';
import { updateCurrentUser } from '@/lib/updateAccountTransaction';
import CustomModalAlert from '@/components/CustomModalAlert';
import { CustomButton, FormField } from '@/components';
import { CheckBalance } from '@/components/PerformingTransaction';
import { KeyboardAvoidingView } from 'react-native';
import { Keyboard } from 'react-native';

const Dollar = () => {
    const { setLastActive, user,setUser,setShowMessage,showMessage,darkTheme } = useGlobalContext();

    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isDrawerVisible2, setIsDrawerVisible2] = useState(false);
    const [dollarToSell, setDollarToSell] = useState(false);
    const [load, setLoad] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { data:{transactions,dollarInvestment}, loading, refetch } = useAppwrite(()=>getUserDataDollarCaller(id,user.$id))
    const onRefresh = async()=>{
        setRefreshing(true)
        await Promise.all([
            refetch(),
            updateCurrentUser(setUser)
        ])
        setRefreshing(false)
    }
    const handleMessageClose=async()=>{
        setShowMessage(false)
        await updateCurrentUser(setUser)
        // await onRefresh()
    }
    const handleAdd=()=>{
        setIsDrawerVisible(true)
        return
    }
    const handleConvert=()=>{
        setIsDrawerVisible2(true)
    }

    const handleCloseModal=async()=>{
        setLoad(false)
        setSuccess(false)
        setHasError("")
        setIsDrawerVisible2(false)
        await updateCurrentUser(setUser)
    }
    const moveToWallet = async()=>{
        setLoad(true)
        setSuccess(false)
        setHasError("")
        try {
            const {wallet,dollar_ballance, error} = await CheckBalance()
            if(dollar_ballance < dollarToSell){
                setHasError("Insufficient funds")
                return
            }
            await Promise.all([
                updateUser(
                    user.$id,
                    {
                        wallet_balance: parseFloat(wallet + parseFloat(dollarToSell * dollarInvestment?.investment?.dollar_withdrawal_rate)),
                        dollar_ballance:parseFloat(dollar_ballance - parseFloat(dollarToSell))
                    }
                ),
                createTransactions({
                    action: "Withdrawal",
                    amount:parseFloat(dollarToSell * dollarInvestment?.investment?.dollar_withdrawal_rate),
                    type:"Dollar",
                    user:user.$id,
                    reason:dollarInvestment?.investment?.name,
                    reference:`${dollarToSell}`,
                    for_dollar:true
                })
            ]);
            setSuccess(true);
        } catch (error) {
            setSuccess(false)
            setIsDrawerVisible2(false)
            setHasError("An error occurred. Please try again.");
        }finally {
            setLoad(false)
        }
    }
    const getLastTransaction = (data)=>{
        const response =data.find(x => x.action === "Deposit")
        if (response)return response.amount
        // console.log({response})
        return 0
    }
    useEffect(()=>{
        const handles=async()=>{
            await updateCurrentUser(setUser)
        }
        handles()
    },[])
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" && "padding"} 
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView className="bg-white flex-1 h-full">
                    <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
                    <View className="px-5">
                        {!loading && (
                            <View>
                                <Text 
                                    className="text-black-100 dark:text-white text-xl font-pregular font-[700]"
                                >
                                    Dollar saving
                                </Text>
                            </View>
                        )}
                    </View>
                    {loading ? (
                        <OngoingDetailSkeletonLoader />
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
                                    <View className="pt-7">
                                        <Money
                                            dollar
                                            value={user?.dollar_ballance}
                                            textStyle="text-black-100 dark:text-white font-psans text-4xl"
                                        />
                                    </View>
                                    <View className="mt-2 flex-1">
                                        <View className=" flex flex-row flex-1">
                                            <Text className="text-muted dark:text-[#FFFFFFB2] font-pregular font-[700] text-base">
                                                Invested 
                                            </Text>
                                            <Money
                                                value={(transactions && transactions.length > 0) ? getLastTransaction(transactions) : 0}
                                                textStyle="text-muted dark:text-[#FFFFFFB2] font-pregular font-[700] text-base"
                                                containerStyle="pl-2"
                                            />
                                        </View>
                                        <View className="mt-1">
                                            <Money
                                                add
                                                containerStyle={"flex-row"}
                                                addedText={"/$"}
                                                value={dollarInvestment?.investment?.price_per_unit}
                                                textStyle="text-secondary-100 font-pregular text-base font-[700]"
                                            />
                                        </View>
                                    </View>
                                    <View className="flex-1 mt-5 flex flex-row gap-4">
                                        <TouchableOpacity
                                            onPress={handleAdd}
                                            activeOpacity={0.7}
                                            className={` bg-primary rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                        >
                                            <Text className={`font-pinter font-semibold text-base text-white`}>
                                                Add
                                            </Text>
                                            <View className="ml-2">
                                                <Image
                                                    source={icons.download}
                                                    resizeMode="contain"
                                                    tintColor={"#FFFFFF"}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            onPress={handleConvert}
                                            activeOpacity={0.7}
                                            className={`border border-border-100 bg-[#F5F5F5] rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                                        >
                                            <Text className={`font-pinter font-semibold text-base text-muted`}>
                                                Convert
                                            </Text>
                                            <View className="ml-2">
                                                <Image
                                                    source={icons.convert}
                                                    resizeMode="contain"
                                                    tintColor={"#747474"}
                                                />
                                            </View>
                                            
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* Transactions */}
                                {transactions && transactions.length > 0 && (
                                    <View className='mt-5 px-5'>
                                        <View className='mb-3'>
                                            <Text className="font-psans text-lg text-black-100 dark:text-white">
                                                Activities
                                            </Text>
                                        </View>
                                        <>
                                            {transactions.map((trans,index) =>(
                                                <TransactionCard 
                                                    key={index} 
                                                    index={index}
                                                    transaction={trans} 
                                                    transactions={transactions} 
                                                />
                                            ))}
                                        </>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}

                    {dollarInvestment && (
                        <PaymentDrawer 
                            isVisible={isDrawerVisible} 
                            onClose={() => setIsDrawerVisible(false)} 
                            investment={dollarInvestment?.investment}
                            user={user}
                            user_investment={dollarInvestment}
                            title="Buy Dollars"
                            setShowMessage={setShowMessage}
                            darkTheme={darkTheme}
                        />
                    )}
                    <CustomModalAlert
                        isVisible={showMessage}
                        title={"Success!"}
                        onClose={handleMessageClose}
                        body={`Your dollar purchase was successful!`}
                        defaultText={"Ok"}
                        showDefault={true}
                    ><></></CustomModalAlert>
                    <CustomModalAlert
                        isVisible={!!hasError}
                        title={"Error!"}
                        onClose={()=>setHasError("")}
                        body={hasError}
                        defaultText={"Continue"}
                        showDefault={true}
                    ><></></CustomModalAlert>
                    <GeneralDrawer 
                        darkTheme={darkTheme}
                        heights={"50px"} 
                        header={"Convert Dollars"}
                        isVisible={isDrawerVisible2} 
                        onClose={() => setIsDrawerVisible2(false)}
                    >
                        <View className="pt-3 px-5">
                            {!success ? (
                                <>
                                    <View>
                                        <Text className="text-muted-200 dark:text-[#FFFFFF99] font-pmedium">
                                            Enter the dollar amount to convert
                                        </Text>
                                        <FormField 
                                            title={"Enter the dollar amount to convert"}
                                            value={dollarToSell}
                                            placeholder={"$ 300"}
                                            handleChangeText={(e)=>setDollarToSell(e)}
                                            otherStyles={"mt-2"}
                                            keyboardType="number-pad"
                                            darkTheme={darkTheme}
                                        />
                                        <View className='min-h-5'>
                                            {user.dollar_ballance < dollarToSell && (
                                                <Text className="text-red-600 pt-1 text-xs font-psemibold">
                                                    You cannot convert more than ${`${user.dollar_ballance}`.toLocaleString()}
                                                </Text>
                                            )}
                                            {dollarToSell && user.dollar_ballance >= dollarToSell && (
                                                <Text className="text-green-600 pt-1 text-xs font-psemibold">
                                                    You will receive approximately ₦{`${dollarToSell * dollarInvestment?.investment?.dollar_withdrawal_rate}`.toLocaleString()}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    <View className="mt-20">
                                        <Text className="text-muted-200 dark:text-[#FFFFFF99] text-center font-pmedium text-sm">
                                            By proceeding, you confirm  that you want to convert at the rate of ₦{dollarInvestment?.investment?.dollar_withdrawal_rate}. 
                                            Funds converted will be sent to your Nairafolio wallet
                                        </Text>
                                    </View>
                                </>
                            ):(
                                <View className="px-2">
                                    <View className="flex-1 justify-center items-center">
                                        <Image 
                                            source={icons.good}
                                        />
                                    </View>
                                    <View className="mt-5">
                                        <Text className="text-black-100 dark:text-white font-psans text-2xl text-center">
                                            You have successfully converted {dollarToSell}.
                                        </Text>
                                    </View>
                                </View>
                            )}
                            <CustomButton 
                                title={success ? "Continue" : "Proceed"}
                                textStyles="text-white font-psans"
                                containerStyles="h-14 mt-8"
                                loading={!dollarToSell || user?.dollar_ballance < dollarToSell}
                                handlePress={success ? handleCloseModal : moveToWallet}
                                isLoading={loading || load}
                            />
                        </View>
                    </GeneralDrawer>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Dollar;