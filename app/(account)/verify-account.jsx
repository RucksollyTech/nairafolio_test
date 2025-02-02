import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { Link, useNavigation } from 'expo-router'
import CustomNavigator from '../../components/CustomNavigator'
import GeneralDrawer from '../../components/GeneralDrawer'
import { generateRandomNumber } from '../../lib/appwrite'
import { EmailVerify } from '../../lib/EmailSenders'
import { handleVerificationEmailAndNIN } from '../../lib/performActions'
import { useGlobalContext } from '@/context/GlobalProvider'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { updateCurrentUser } from '../../lib/updateAccountTransaction'
import { RefreshControl } from 'react-native'

const VerifyAccount = () => {
    const { user, setUser, setLastActive } = useGlobalContext();

    const navigation = useNavigation();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [numberCode, setNumberCode] = useState(0);
    const [submitError, setSubmitError] = useState(false);
    const [next, setNext] = useState(false);

    const [code, setCode] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async()=>{
        setRefreshing(true)
        await updateCurrentUser(setUser)
        setRefreshing(false)
    }
    const handleVerifyMail = async() =>{
        if(user.is_email_verified || user.is_verified) return

        setIsDrawerVisible(true)
        const getCode= generateRandomNumber()
        setNumberCode(getCode)
        const emailerData = {email:user.email,code:getCode}
        await EmailVerify(emailerData)
    }
    const handleSubmit = async()=>{
        if(user.is_email_verified || user.is_verified) return
        
        setSubmitError(false)
        setLoading(true)
        if(parseFloat(numberCode) === parseFloat(code)){
            // proceed to adding to db
            const verifyer = await handleVerificationEmailAndNIN({
                email:true,
                userId:user.$id,
                setUser
            })
            if(verifyer.error){
                setSubmitError(true)
                setLoading(false)
                return
            }
            setNext(true)
        }else{
            setSubmitError(true)
        }
        setLoading(false)
    }
    const handleClose = () =>{
        setIsDrawerVisible(false)
        setNext(false)
        setCode("")
        setSubmitError(false)
    }
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <CustomNavigator navigator={navigation} />
            <View className="pt-2 px-5">
                <Text className="text-black-100 font-psans text-2xl">
                    Verify account
                </Text>
            </View>
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
                <View className="bg-white flex-1 h-full px-5 pb-10">
                    <View className="py-4">
                        <Text className="text-muted-300">
                            You are required to provide some information about your identity.
                        </Text>
                    </View>
                    <View>
                        <Link href={"/verify-with-nin"}>
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
                                        source={icons.document_validation}
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
                                            Verify with NIN
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-muted text-sm">
                                            Provide your NIN
                                        </Text>
                                    </View>
                                    {(user.is_nin_verified || user.is_verified) && (
                                        <View className="mt-1">
                                            <View className={`
                                                bg-[#00A6511A]
                                                items-center justify-center
                                                flex-row w-[80px] border-[#FFFFFF4D] border py-1 rounded-[30px]
                                            `}>
                                                <Text className={`text-secondary-100 text-center font-psemibold my-auto text-xs`}>
                                                    Verified
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    {(user.is_nin_pending) && (
                                        <View className="mt-1">
                                            <View className={`
                                                bg-[#98a6001a]
                                                flex-row w-[80px] border-[#FFFFFF4D] border px-2 py-1 rounded-[30px]
                                            `}>
                                                <Text className={`text-yellow-600 text-center font-psemibold my-auto pl-2 text-xs`}>
                                                    Pending
                                                </Text>
                                            </View>
                                        </View>
                                    )}
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
                    <View className="mt-4">
                        <TouchableOpacity
                            onPress={()=> handleVerifyMail()}
                        >
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
                                        source={icons.document_validation}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View
                                    style={{
                                        width: "74.54%",
                                    }}
                                    className="flex-1 px-3 "
                                >
                                    <View className="my-auto">
                                       <View>
                                            <Text
                                                className="text-lg text-header-200 font-psans"
                                            >
                                                Verify Email
                                            </Text>
                                       </View>
                                       {(user.is_email_verified || user.is_verified) && (
                                            <View className="mt-1">
                                                <View className={`
                                                    bg-[#00A6511A]
                                                    items-center justify-center
                                                    flex-row w-[80px] border-[#FFFFFF4D] border py-1 rounded-[30px]
                                                `}>
                                                    <Text className={`text-secondary-100 text-center font-psemibold my-auto text-xs`}>
                                                        Verified
                                                    </Text>
                                                </View>
                                            </View>
                                       )}
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
                </View>
            </ScrollView>
            <GeneralDrawer
                isVisible={isDrawerVisible} 
                onClose={handleClose} 
            >   
                {!next ? (
                    <View className="px-5">
                        <View className="pt-4">
                            <Text className="text-black-100 font-psans text-2xl">
                                Verify your mail
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
                                    title="Verification Code"
                                    value={code}
                                    // keyboardType="number-pad"
                                    placeholder="Enter code"
                                    handleChangeText={(e)=>setCode(e)}
                                    otherStyles="mt-2"
                                />
                            </View>
                        </View>
                        
                        {submitError && (
                            <View className="py-2">
                                <Text className="text-red-500 text-sm font-psemibold">
                                    Invalid/expired code 
                                </Text>
                            </View>
                        )}
                        <CustomButton 
                            title="Verify"
                            handlePress={handleSubmit}
                            containerStyles="h-14 mb-4"
                            textStyles="text-white font-psemibold"
                            isLoading={loading}
                            loading={!user || !code}
                        />
                    </View>
                ):(
                    <View>
                        <View className="px-2">
                            <View className="flex-1 justify-center items-center">
                                <Image 
                                    source={icons.good}
                                />
                            </View>
                            <View className="mt-5">
                                <Text className="text-black-100 font-psans text-2xl text-center">
                                    Your email have been verified successfully.
                                </Text>
                            </View>
                            <CustomButton
                                handlePress={handleClose}
                                title={"Continue"}
                                textStyles={"font-psans text-white"}
                                containerStyles={"mt-5 h-14"}
                            />
                        </View>
                    </View>
                )}
            </GeneralDrawer>
        </SafeAreaView>
    )
}

export default VerifyAccount