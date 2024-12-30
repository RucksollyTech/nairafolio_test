import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { Link, useNavigation } from 'expo-router'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

const ChangePassword = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
        oldPassword: ""
    })
    const handleSubmit = () =>{}
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
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
                    <View>
                        <CustomButton 
                            title={"Save changes"}
                            handlePress={handleSubmit}
                            containerStyles="mt-10 h-14"
                            textStyles="text-white font-psemibold"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChangePassword