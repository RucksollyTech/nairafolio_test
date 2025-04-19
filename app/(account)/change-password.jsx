import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useNavigation } from 'expo-router'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import CustomNavigator from '../../components/CustomNavigator'
import { useGlobalContext } from '@/context/GlobalProvider';
import { updatePassword } from '@/lib/appwrite'
import { updateCurrentUser } from '@/lib/updateAccountTransaction'
import { myClassConverter } from '@/lib/performActions'

const ChangePassword = () => {
    const navigation = useNavigation();
    const { setLastActive,user,setUser,darkTheme } = useGlobalContext();
    const [refreshing, setRefreshing] = useState(false)
    
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
    const onRefresh = async()=>{
        setRefreshing(true)
        await updateCurrentUser(setUser)
        setRefreshing(false)
    }
    const handleMessages = (message,color) => {
        setError({message,color})
    }
    const handleSubmit = async() =>{
        setError({
            message: "",
            color: "",
        })
        if(formData.password !== formData.confirmPassword){
            handleMessages("Password do not match.","text-red-500")
            return
        }
        setLoading(true)
        if(formData.password || formData.oldPassword){
            try {
                const updateRes = await updatePassword(formData.password,formData.oldPassword)
                // const updateRes = await updateUserPasscode(user.$id,{
                //     passcode: formData.password
                // },formData.oldPassword)
                handleMessages("Password reset was successful","text-green-500")
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
        <SafeAreaView className={` flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className={myClassConverter(
                    darkTheme,
                    "flex-1 h-full px-5 pb-10",
                    "bg-dark_mode",
                    "bg-white"
                )}>
                    <View className="py-4">
                        <Text className={myClassConverter(
                            darkTheme,
                            "font-psans text-2xl",
                            "text-white",
                            "text-black-100"
                        )}>
                            Change password
                        </Text>
                    </View>
                    <View>
                        <FormField
                            title="Password"
                            placeholder="Enter your current password."
                            value={formData.oldPassword}
                            otherStyles="mb-5"
                            handleChangeText={(e)=>setFormData({...formData,oldPassword:e})}
                            darkTheme={darkTheme}
                        />
                        <FormField
                            title="Password"
                            placeholder="Enter your new password."
                            value={formData.password}
                            otherStyles="mb-5"
                            handleChangeText={(e)=>setFormData({...formData,password:e})}
                            darkTheme={darkTheme}
                        />
                        <FormField
                            title="Password"
                            placeholder="Re-enter your new password to confirm."
                            value={formData.confirmPassword}
                            otherStyles="mb-5"
                            handleChangeText={(e)=>setFormData({...formData,confirmPassword:e})}
                            darkTheme={darkTheme}
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
                            textStyles={darkTheme === "dark" ? "font-psemibold" : "text-white font-psemibold"}
                            isLoading={loading}
                            darkTheme={darkTheme}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChangePassword