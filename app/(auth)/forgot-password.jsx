import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormFieldAdjusted from '@/components/FormFieldAdjusted'
import { CustomButton, SuccessModal } from '@/components'
import { icons } from '@/constants'
import { sendPasswordResetEmail } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const { darkTheme } = useGlobalContext();

    const [successModal, setSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleDismissSuccessModal = ()=>{
        setSuccessModal(false)
    }
    const handlePasswordReset = async () => {
        setLoading(true);
        const response = await sendPasswordResetEmail(email);
        if (response.success) {
            setSuccessModal(true);
        } else {
            Alert.alert(response.message);
        }
        // Alert.alert(response.message);
        setSuccessModal(true);
        setLoading(false);

    };
    return (
        <SafeAreaView className={darkTheme === "dark" ? "flex-1 dark bg-dark_mode" : 'flex-1 bg-white'}>
            <View className='flex-1 items-center justify-center px-5'>
                <View className='w-full'>
                    <FormFieldAdjusted 
                        title="Enter your email to reset your password"
                        value={email}
                        keyboardType={"email-address"}
                        placeholder={"Email Address"}
                        handleChangeText={(e) => setEmail(e)}
                        darkTheme={darkTheme}
                    />
                    <View className='mt-6'>
                        <CustomButton 
                            title="Continue"
                            containerStyles="h-14"
                            textStyles="text-white font-psans"
                            handlePress={handlePasswordReset}
                            loading={!email}
                            isLoading={loading}
                        />
                    </View>
                </View>
            </View>
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
                            Password reset mail sent! 
                        </Text>
                    </View>
                    <View className="mt-2">
                        <Text className="text-black-100 dark:text-white font-pmedium text-base text-center">
                            Password reset mail has been sent to the email address provided. Follow 
                            the instructions to reset your password.
                        </Text>
                    </View>
                    
                    <CustomButton
                        handlePress={handleDismissSuccessModal}
                        title={"Continue"}
                        textStyles={"font-psans text-white"}
                        containerStyles={"mt-5 h-14"}
                        darkTheme={darkTheme}
                    />
                </View>
            </SuccessModal>
        </SafeAreaView>
    )
}

export default ForgotPassword