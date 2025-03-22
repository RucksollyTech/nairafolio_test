import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CustomModalAlert from './CustomModalAlert'
import FormField from './FormField'
import { verifyUserPasscode } from '@/lib/appwrite'
import { router } from 'expo-router'

const PasswordConfirm = ({isOpen,setIsOpen,actionFunc,user}) => {
    const [pin, setPin] = useState()
    const [errorMsg, setErrorMsg] = useState(null)
    const continueFunction = async() => {
        setErrorMsg(null)
        const isPasscodeSuccess = await verifyUserPasscode(user.$id, parseInt(pin))
        if(pin){
            if(isPasscodeSuccess){
                await actionFunc()
                setPin(null)
                setIsOpen(false)
            }else{
                setPin(null)
                setErrorMsg("Invalid passcode")
            }
        }else{
            setErrorMsg("Invalid passcode")
        }
        
    }
    return (
        <View className='z-[100]'>
            <CustomModalAlert
                showDefault={false}
                isVisible={isOpen}
                onClose={() => setIsOpen(false)}
                body={user.hasPasscode ? "Enter your passcode to continue" : "Set passcode to continue"}
                title={user.hasPasscode ? "Please verify that it's you" : "Set passcode"}
            >  
                {user.hasPasscode && (
                    <View className='py-2 mx-6'>
                        <FormField 
                            title="Password"
                            placeholder="Enter your passcode."
                            value={pin}
                            withPassword={false}
                            keyboardType={"number-pad"}
                            tintColor={"bg-black/80 text-muted"}
                            otherStyles="my-5 w-full"
                            handleChangeText={(e)=>setPin(e)}
                        />
                        <View className='pt-1 min-h-5'>
                            {errorMsg && <Text className="text-red-500 text-xs">{errorMsg}</Text>}
                        </View>
                    </View>
                )}
                {errorMsg && !pin ? (
                    <TouchableOpacity 
                        className='border-t border-[#4e4e4e] w-full py-3'
                        onPress={()=>setIsOpen(false)}
                    >
                        <Text className="font-psemibold text-base text-blue-500 text-center">
                            Close
                        </Text>
                    </TouchableOpacity>
                ):(
                    <TouchableOpacity 
                        className='border-t border-[#4e4e4e] w-full py-3'
                        onPress={user.hasPasscode ? continueFunction : ()=>router.push("/change-password")}
                    >
                        <Text className="font-psemibold text-lg text-blue-500 text-center">
                            {user.hasPasscode ? "Continue" : "Set passcode"}
                        </Text>
                    </TouchableOpacity>
                )}
                
            </CustomModalAlert>
        </View>
    )
}

export default PasswordConfirm