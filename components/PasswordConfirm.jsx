import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CustomModalAlert from './CustomModalAlert'
import FormField from './FormField'
import { verifyUserPasscode } from '@/lib/appwrite'
import { router } from 'expo-router'

const PasswordConfirm = ({isOpen,setIsOpen,actionFunc,user,loading,darkTheme}) => {
    const [pin, setPin] = useState()
    const [errorMsg, setErrorMsg] = useState(null)
    const [loads, setLoads] = useState(false)
    const continueFunction = async() => {
        setErrorMsg(null)
        setLoads(true)
        const isPasscodeSuccess = await verifyUserPasscode(user.$id, parseInt(pin))
        if(pin){
            if(isPasscodeSuccess){
                await actionFunc()
                setLoads(false)
                setPin(null)
                setIsOpen(false)
            }else{
                setLoads(false)
                setPin(null)
                setErrorMsg("Invalid passcode")
            }
        }else{
            setLoads(false)
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
                            darkTheme={darkTheme}
                        />
                        <View className='pt-1 min-h-5'>
                            {errorMsg && <Text className="text-red-500 text-xs text-center">{errorMsg}</Text>}
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
                        disabled={loads || loading}
                    >
                        <Text className="font-psemibold text-lg text-blue-500 text-center">
                            {user.hasPasscode ? "Continue" : (loads || loading) ? "Validating..." : "Set passcode"}
                        </Text>
                    </TouchableOpacity>
                )}
                
            </CustomModalAlert>
        </View>
    )
}

export default PasswordConfirm