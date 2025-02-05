import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { Link, useNavigation } from 'expo-router'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import CustomNavigator from '../../components/CustomNavigator'
import { useGlobalContext } from '@/context/GlobalProvider';
import { updatePassword } from '@/lib/appwrite'

const ChangePassword = () => {
    const navigation = useNavigation();
    const { setLastActive } = useGlobalContext();
    const [error, setError] = useState({
        message: "",
        color: "",
    })
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
        oldPassword: ""
    })
    const [loading, setLoading] = useState(false)
    const handleMessages = (message,color) => {
        setError({message,color})
    }
    const handleSubmit = async() =>{
        setLoading(true)
        setError({
            message: "",
            color: "",
        })
        if(formData.password !== formData.confirmPassword){
            handleMessages("Passwords do not match.","text-red-500")
            return
        }
        if(formData.password || formData.oldPassword){
            try {
                const updateRes = await updatePassword(formData.password,formData.oldPassword)
                handleMessages("Passwords reset was successful","text-green-500")
                console.log({updateRes})
                return
            } catch (error) {
                handleMessages("Error updating password","text-red-500")
            }finally {
                setLoading(false)
                setFormData({
                    password: "",
                    confirmPassword: "",
                    oldPassword: ""
                })
            }
        }
    }
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <CustomNavigator navigator={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
            >
                <View className="bg-white flex-1 h-full px-5 pb-10">
                    
                    <View className="pt-4">
                        <Text className="text-black-100 font-psans text-2xl">
                            Change password
                        </Text>
                    </View>
                    <View>
                        <FormField 
                            title="Password"
                            placeholder="Enter your current password."
                            value={formData.oldPassword}
                            otherStyles="my-5"
                            handleChangeText={(e)=>setFormData({...formData,oldPassword:e})}
                        />
                        <FormField 
                            title="Password"
                            placeholder="Enter your new password."
                            value={formData.password}
                            otherStyles="mb-5"
                            handleChangeText={(e)=>setFormData({...formData,password:e})}
                        />
                        <FormField 
                            title="Password"
                            placeholder="Re-enter your new password to confirm."
                            value={formData.confirmPassword}
                            otherStyles="mb-5"
                            handleChangeText={(e)=>setFormData({...formData,confirmPassword:e})}
                        />
                    </View>
                    {error?.message && (
                        <View className='mt-3'>
                            <Text className={`font-psans ${error?.color}`}>
                                {error?.message}
                            </Text>
                        </View>
                    )}
                    <View>
                        <CustomButton 
                            title={"Save changes"}
                            handlePress={handleSubmit}
                            containerStyles="mt-10 h-14"
                            textStyles="text-white font-psemibold"
                            isLoading={loading}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChangePassword