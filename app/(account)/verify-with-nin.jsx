import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { Link, useNavigation } from 'expo-router'
import FormField from '../../components/FormField'
import GeneralDrawer from '../../components/GeneralDrawer'
import CustomButton from '../../components/CustomButton'

const VerifyWithNin = () => {
    const navigation = useNavigation();
    const [nin, setNin] = useState(0)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
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
                            Verify with NIN
                        </Text>
                    </View>
                    <View className="pt-4 pb-2">
                        <Text className="text-muted-300 text-lg">
                            Provide your NIN to verify your Identity.
                        </Text>
                    </View>
                    <View>
                        <FormField 
                            title="NIN"
                            placeholder="Enter your NIN"
                            value={nin}
                            keyboardType={"number-pad"}
                            handleChangeText={(e)=>setNin(e)}
                        />
                    </View>
                    <View
                        className="pt-2"
                    >
                        <TouchableOpacity
                            onPress={()=>setIsDrawerVisible(true)}
                        >
                            <Text className="text-secondary-100 font-pmedium text-right">
                                Forgot NIN number?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <CustomButton 
                            title={"Submit"}
                            handlePress={handleSubmit}
                            containerStyles="mt-10 h-14"
                            textStyles="text-white font-psemibold"
                        />
                    </View>
                </View>
            </ScrollView>
            <GeneralDrawer heights={"50px"} isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)}>
                <View>
                    <Text className="text-black-100 text-center font-psemibold text-2xl">
                        Dial{" "}<Text className="text-secondary-100 font-psemibold text-2xl">*346#</Text>{" "}to retrieve your NIN
                    </Text>
                </View>
                <View className="py-5">
                    <Text className="text-muted-300 text-center font-pmedium text-base">
                        Dial with the number linked to your NIN.
                    </Text>
                </View>
                <View className="pt-2">
                    <CustomButton 
                        title="Dial *346#"
                        textStyles="text-white font-psemibold"
                        containerStyles="h-14"
                    />
                </View>
            </GeneralDrawer>
        </SafeAreaView>
    )
}

export default VerifyWithNin