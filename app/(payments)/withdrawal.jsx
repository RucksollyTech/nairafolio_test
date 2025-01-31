import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../../constants'
import { Link, useNavigation } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addBank, deleteMyBanks, getCurrentUser, getMyBanks, updateUser, verifyBankCode } from '../../lib/appwrite';
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField';
import GeneralDrawer from '../../components/GeneralDrawer';
import EmailerVerifyBank from '../../components/EmailerVerifyBank';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchBanks, validateAccount } from '../../lib/payStack';
import useAppwrite from '../../lib/useAppwrite';
import HomeSkeletonLoader from '../../components/HomeSkeletonLoader';
import { handleFailedTransactions, makeTransfer } from '../../lib/updateAccountTransaction';

const withdrawal = () => {
    const navigation = useNavigation();
    const { user,setUser } = useGlobalContext();
    const { data:myBanks, loading:loadingBanks, refetch } = useAppwrite(()=>getMyBanks(user?.$id))
    const [withdrawalAmount, setWithdrawalAmount] = useState();
    const [formData, setFormData] = useState({
        bank_name: "",
        account_number: "",
        code: "",
    });
    const [selectedBank, setSelectedBank] = useState()
    const [selectedItems, setSelectedItems] = useState()

    const [loading, setLoading] = useState(user?.is_verified ? false : true);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [submittingBank, setSubmittingBank] = useState(false);
    const [next, setNext] = useState(false);
    const [verifyError, setVerifyError] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const [banks, setBanks] = useState();
    const [bankCode, setBankCode] = useState();
    const [refreshing, setRefreshing] = useState(false)

    const handleDeleteBank= async()=>{
        if(!selectedItems)return
        setSubmittingBank(true)
        await deleteMyBanks(selectedItems.$id)
        await refetch()
        setSelectedItems("")
        setSelectedBank("")
        setSubmittingBank(false)
    }
    const handleSetSelectedItems= (item)=>{
        setSelectedBank("")
        if(selectedItems && selectedItems.$id === item.$id){
            setSelectedItems("")
        }else{
            setSelectedItems(item)
        }
    }
    const handleSelectBank= (item)=>{
        setSelectedItems("")
        if(!selectedItems){
            if(selectedBank && selectedBank.$id === item.$id){
                setSelectedBank("")
            }else{
                setSelectedBank(item)
            }
        }else{
            handleSetSelectedItems(item)
        }
    }

    const handleChangeInBankSelect = (e)=>{
        setFormData({...formData,bank_name:e.name})
        setBankCode(e.code)
    }

    const checkActiveUser = async()=>{
        try {
            const res = await getCurrentUser();
            setUser(res)
        } catch (error) {
            console.error(error)
        }
    }
    const onRefresh = async()=>{
        setRefreshing(true)
        await Promise.all([checkActiveUser(),refetch()])
        setRefreshing(false)
    }


    const handleAddBank=async()=>{
        setVerifyError("")
        if(!formData.account_number || !bankCode || !formData.bank_name || `${formData.account_number}`.length < 10){
            return
        }
        setSubmittingBank(true)
        setSubmitError(false)
        try {
            if(user && user?.email){
                const accountDetails = await validateAccount(formData.account_number, bankCode);
                if(!accountDetails?.account_name){
                    setVerifyError("Invalid Account Number")
                    return
                }
                const bankResponse = await addBank({
                    ...formData,
                    userId:user?.$id,
                    bank_code:bankCode,
                    account_name:accountDetails.account_name
                })
                const emailerData = {email:user.email,code:bankResponse.code}
                await EmailerVerifyBank(emailerData)
                setNext(true)
            }
        } catch (error) {
            setSubmitError(true)
            console.error(error)
            throw new Error(error)
        }finally{
            setSubmittingBank(false)
        }
    }
    const handleCancelAddBank=()=>{
        setNext(false)
        setFormData({
            ...formData,
            account_number: "",
            code: "",
        })
        setIsDrawerVisible(false)
    }
    const handleVerifyBankCode=async()=>{
        setSubmitError(false)
        if(!user || !formData.account_number || !formData.code){
            return
        }
        setSubmittingBank(true)
        try {
            const bankResponse = await verifyBankCode(
                formData.account_number,
                user?.$id,
                formData.code
            )
            if(bankResponse.error){
                setVerifyError(bankResponse.error)
                return
            }
            await refetch()
            setNext(false)
            setFormData({
                ...formData,
                account_number: "",
                code: "",
            })
            setIsDrawerVisible(false)
        } catch (error) {
            setSubmitError(true)
            console.error(error)
        }finally{
            setSubmittingBank(false)
        }
    }
    const handleSendMoney = async () => {
        setVerifyError("")
        if (!selectedBank.user_code) {
            setVerifyError("An error has occurred, please try again later.");
            return;
        }
        const transfer = await makeTransfer({
            user,
            setUser,
            recipientCode: selectedBank.user_code,
            amount: withdrawalAmount,
            description: "Withdrawal from NairaFolio"
        })
        if (transfer && !transfer.error) {
            Alert.alert("Transfer Successful", `Your transfer has been processed.`);
        } else {
            await handleFailedTransactions({
                amount: withdrawalAmount,
                type: "Transfer",
                user: user?.$id,
                reason:"Failed"
            })
            setVerifyError("Transfer Failed. Check your details and try again.")
        }
    };

    const handleWithdrawal = async()=>{
        setVerifyError("")
        if(!user){
            return
        }
        if(!withdrawalAmount ){
            setVerifyError("Please enter an amount")
            return
        }
        if(withdrawalAmount < 1 ){
            setVerifyError("Amount cannot be less than 1")
            return
        }
        if(!selectedBank){
            setVerifyError("Please select a bank account")
            return
        }
        if(user?.wallet_balance < withdrawalAmount){
            setVerifyError("Insufficient funds")
            return
        }
        setSubmittingBank(true)
        try {
            await handleSendMoney()
        } catch (error) {
            console.error(error)  
        }finally{
            setSubmittingBank(false)
        }
    }


    useEffect(() => {
        if(!user){
            checkActiveUser()
        }
    }, [user])
    useEffect(() => {
        const loadBanks = async () => {
            const banks_data = await fetchBanks();
            setBanks(banks_data)
        };
        loadBanks();
    }, []);

    // {"active": true, "code": "120001", "country": "Nigeria", "createdAt": "2022-05-31T06:50:27.000Z", "currency": "NGN", "gateway": "", "id": 302, "is_deleted": false, "longcode": "120001", "name": "9mobile 9Payment Service Bank", "pay_with_bank": false, "slug": "9mobile-9payment-service-bank-ng", "supports_transfer": true, "type": "nuban", "updatedAt": "2022-06-23T09:33:55.000Z"}
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="bg-white flex-1 h-full px-5 pb-10 pt-7">
                    <View>
                        <TouchableOpacity
                            onPress={()=>navigation.goBack()}
                        >
                            <Image
                                source={icons.arrow_left}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="pt-4">
                        <Text className="text-black-100 font-psans text-2xl">
                            Withdrawal
                        </Text>
                    </View>
                    <View className="pt-4">
                        <View>
                            <Text className="text-base text-[#8A97A8]">
                                Amount to withdraw
                            </Text>
                        </View>
                        <FormField 
                            title="Withdraw"
                            value={withdrawalAmount}
                            keyboardType="number-pad"
                            placeholder="₦ 5000"
                            handleChangeText={(e)=>setWithdrawalAmount(e)}
                            otherStyles="mt-2"

                        />
                        <View className="pt-2">
                            <Text className="text-base text-right font-psemibold text-secondary-100">
                                Balance {user?.wallet_balance?.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                    {user?.is_verified ? (
                        <View className="pt-10">
                            {myBanks && myBanks.length > 0 && (
                                <View>
                                    <Text className="text-base text-[#8A97A8]">
                                        Destination of funds.
                                    </Text>
                                </View>
                            )}
                            <View className="mt-2">
                                {((loadingBanks && !myBanks) || (loadingBanks && myBanks && myBanks.length === 0)) && (
                                    <View>
                                        <HomeSkeletonLoader />
                                    </View>
                                )}
                                {(myBanks && myBanks.length > 0) && myBanks.map((myBanksData,index)=>(
                                    <Pressable 
                                        key={index}
                                        className={`
                                            flex-1 
                                            rounded-lg
                                            flex 
                                            py-4 flex-row
                                            mb-5
                                            border
                                            ${selectedItems?.$id === myBanksData?.$id ? "border-red-500" : "border-border"}
                                            
                                            bg-[#F8FAFA]
                                            px-2
                                        `}
                                        onPress={()=>handleSelectBank(myBanksData)}
                                        onLongPress={() => handleSetSelectedItems(myBanksData)}
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
                                            className="flex-1 px-2 "
                                        >
                                            <View>
                                                <Text
                                                    className="text-lg text-header-200 font-psans"
                                                >
                                                    {myBanksData.name}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text className="text-muted text-sm">
                                                    {myBanksData.number}
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
                                                source={myBanksData.$id === selectedBank?.$id ? icons.good_sm : icons.good_bg}
                                            />
                                        </View>
                                    </Pressable>
                                ))}
                                <TouchableOpacity 
                                    activeOpacity={0.9}
                                    className="flex-row items-center mt-5"
                                    onPress={() => setIsDrawerVisible(true)}
                                >
                                    <Image 
                                        source={icons.plus}
                                        resizeMode="contain"
                                        className="mr-2"
                                        tintColor={"#2A3B59"}
                                    />
                                    <Text className="mr-2 text-[#2A3B59] font-psemibold">
                                        Add new bank
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ):(
                        <View className="pt-10">
                            <View>
                                <Text className="text-base text-red-500 font-psemibold">
                                    Unverified account
                                </Text>
                            </View>
                            <Link href={"/verify-account"}
                                className="flex-row items-center mt-5"
                            >
                                <Text className="mr-2 text-blue-500 font-psemibold">
                                    Verify account to continue
                                </Text>
                            </Link>
                        </View>
                    )}
                </View>
            </ScrollView>
            <View>
                {verifyError && (
                    <View className="py-2 px-5">
                        <Text className="text-red-500 text-sm font-psemibold">
                            {verifyError} 
                        </Text>
                    </View>
                )}
                {selectedItems ? (
                    <CustomButton 
                        title="Delete"
                        handlePress={handleDeleteBank}
                        containerStyles="h-14 mb-4 mx-5 bg-red-500"
                        textStyles="text-white font-psemibold"
                        isLoading={submittingBank}
                    />
                ):(
                    <CustomButton 
                        title="Withdraw"
                        handlePress={handleWithdrawal}
                        containerStyles="h-14 mb-4 mx-5"
                        textStyles="text-white font-psemibold"
                        loading={loading || !withdrawalAmount || !selectedBank || !user}
                        isLoading={submittingBank}
                    />
                )}
            </View>
            <GeneralDrawer 
                isVisible={isDrawerVisible} 
                onClose={() => setIsDrawerVisible(false)} 
                noScroll={true} 
                minHeights={400}
            >
                {next ? (
                    <View className="px-5">
                        <View className="pt-4">
                            <Text className="text-black-100 font-psans text-2xl">
                                Verify it's you
                            </Text>
                        </View>

                        <View className="pt-7">
                            <View className="mb-7">
                                <View>
                                    <Text className="text-base text-[#8A97A8]">
                                        We've sent you a verification code to your email!
                                        Please check your inbox and enter the code to continue.
                                    </Text>
                                </View>
                                <FormField 
                                    title="Bank Code"
                                    value={formData.code}
                                    keyboardType="number-pad"
                                    placeholder="Enter code"
                                    handleChangeText={(e)=>setFormData({...formData,code:e})}
                                    otherStyles="mt-2"
                                />
                            </View>
                        </View>
                        <View className="mb-7 mt-4">
                            <TouchableOpacity 
                                activeOpacity={0.9}
                                onPress={handleCancelAddBank}
                            >
                                <Text className="text-red-500 font-psemibold">
                                    Cancel this request
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        {submitError && (
                            <View className="py-2">
                                <Text className="text-red-500 text-sm font-psemibold">
                                    An error occurred 
                                </Text>
                            </View>
                        )}
                        {verifyError && (
                            <View className="py-2">
                                <Text className="text-red-500 text-sm font-psemibold">
                                    {verifyError} 
                                </Text>
                            </View>
                        )}
                        <CustomButton 
                            title="Verify"
                            handlePress={handleVerifyBankCode}
                            containerStyles="h-14 mb-4"
                            textStyles="text-white font-psemibold"
                            isLoading={submittingBank}
                            loading={!user || !formData.account_number || !formData.code}
                        />
                    </View>
                ):(
                    <View className="px-5">
                        <View className="pt-4">
                            <Text className="text-black-100 font-psans text-2xl">
                                Add bank
                            </Text>
                        </View>

                        <View className="pt-7">
                            <View className="mb-5">
                                <View>
                                    <Text className="text-base text-[#8A97A8]">
                                        Bank
                                    </Text>
                                </View>
                                <FormField
                                    title="Bank Name"
                                    value={formData.bank_name}
                                    placeholder="Select bank"
                                    data={banks || []}
                                    handleChangeText={handleChangeInBankSelect}
                                />
                            </View>
                            <View className="mb-7">
                                <View>
                                    <Text className="text-base text-[#8A97A8]">
                                        Account number
                                    </Text>
                                </View>
                                <FormField 
                                    title="Account Number"
                                    value={formData.account_number}
                                    keyboardType="number-pad"
                                    placeholder="Enter bank account number"
                                    handleChangeText={(e)=>setFormData({...formData,account_number:e})}
                                    otherStyles="mt-2"
                                />
                            </View>
                        </View>
                        {submitError && (
                            <View className="py-2">
                                <Text className="text-red-500 text-sm font-psemibold">
                                    An error occurred 
                                </Text>
                            </View>
                        )}
                        
                        {verifyError && (
                            <View className="py-2">
                                <Text className="text-red-500 text-sm font-psemibold">
                                    {verifyError}
                                </Text>
                            </View>
                        )}
                        <CustomButton 
                            title="Add bank"
                            handlePress={handleAddBank}
                            containerStyles="h-14 mb-4"
                            textStyles="text-white font-psemibold"
                            isLoading={submittingBank}
                            loading={!formData.account_number || !formData.bank_name || `${formData.account_number}`.length < 10}
                        />
                    </View>
                )}
            </GeneralDrawer>
        </SafeAreaView>
    )
}

export default withdrawal