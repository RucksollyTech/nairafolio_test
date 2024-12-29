import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../../constants'
import AccountCustomForm from '../../components/AccountCustomForm'
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'

const EditAccount = () => {
    const navigation = useNavigation();
    const [accountForm, setAccountForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        image: null,
    })
    const handleImageChange = () => {};
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
                            Edit profile
                        </Text>
                    </View>
                    <View className="py-14 justify-center items-center flex-1">
                        <View className="relative flex-1">
                            <Image 
                                source={images.example2}
                                resizeMode='cover'
                                className="w-28 h-28 rounded-full"
                            />
                            <View className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
                                <TouchableOpacity 
                                    onPress={handleImageChange}
                                >
                                    <Image 
                                        source={icons.camera}
                                        resizeMode='cover'
                                        className="rounded-full"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>
                        <AccountCustomForm 
                            title="First name"
                            otherStyles="mb-4"
                            value={accountForm.firstName}
                            placeholder={"Enter your first name"}
                            handleChangeText={(e)=>setAccountForm({...accountForm,firstName:e})}
                        />
                        <AccountCustomForm 
                            title="Last name"
                            otherStyles="mb-4"
                            value={accountForm.lastName}
                            placeholder={"Enter your last name"}
                            handleChangeText={(e)=>setAccountForm({...accountForm,lastName:e})}
                        />
                        <AccountCustomForm 
                            title="Email"
                            otherStyles="mb-4"
                            value={accountForm.email}
                            keyboardType={"email-address"}
                            placeholder={"Enter your email address"}
                            handleChangeText={(e)=>setAccountForm({...accountForm,email:e})}
                        />
                        <AccountCustomForm 
                            title="Phone"
                            otherStyles="mb-4"
                            value={accountForm.phoneNumber}
                            keyboardType={"phone-pad"}
                            placeholder={"Enter your phone number"}
                            handleChangeText={(e)=>setAccountForm({...accountForm,phoneNumber:e})}
                        />
                    </View>
                    <View className="mt-10">
                        <CustomButton 
                            title="Save changes"
                            containerStyles="h-16"
                            textStyles="text-white font-psemibold"
                            handlePress={()=>console.log("Save button pressed")}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditAccount