import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { useNavigation } from 'expo-router'
import FormField from '../../components/FormField'
import GeneralDrawer from '../../components/GeneralDrawer'
import CustomButton from '../../components/CustomButton'
import CustomNavigator from '../../components/CustomNavigator'
import { useGlobalContext } from '@/context/GlobalProvider'
import { handleVerificationEmailAndNIN, myClassConverter } from '../../lib/performActions'

const VerifyWithNin = () => {
    const { user, setUser,setLastActive,darkTheme } = useGlobalContext();

    const navigation = useNavigation();
    const [nin, setNin] = useState(0)
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isDrawerVisible2, setIsDrawerVisible2] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState(false);
    
    const handleCall = () => {
        // Works with https links
        const url = `*346#`;
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url);
            } else {
              Alert.alert("Error", "Phone call is not supported on this device.");
            }
          })
          .catch((err) => console.error("An error occurred", err));
    };

    const handleSubmit = async()=>{
        if(user.is_nin_verified || user.is_verified || user.is_nin_pending || !nin) return
        setSubmitError(false)
        setLoading(true)
        const verifyer = await handleVerificationEmailAndNIN({
            nin,
            userId:user.$id,
            setUser
        })
        if(verifyer.error){
            setSubmitError(true)
            setIsDrawerVisible2(true)
            setLoading(false)
            return
        }
        setIsDrawerVisible2(true)
        setLoading(false)
    }
    const handleClose = () =>{
        setIsDrawerVisible2(false)
        setSubmitError(false)
    }
    return (
        <View className={`flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
            <ScrollView
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className={myClassConverter(
                    darkTheme,
                    `flex-1 h-full px-5 pb-10`,
                    "bg-dark_mode",
                    "bg-white"
                )}>
                    <View className="pt-2">
                        <Text className={myClassConverter(
                            darkTheme,
                            `font-psans text-2xl`,
                            "text-white",
                            "text-black-100"
                        )}>
                            Verify with NIN
                        </Text>
                    </View>
                    <View className="pt-4 pb-2">
                        <Text className={myClassConverter(
                            darkTheme,
                            `text-lg`,
                            "text-white",
                            "text-muted-300"
                        )}>
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
                            darkTheme={darkTheme}
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
                            textStyles={darkTheme === "dark" ? "font-psemibold" : "text-white font-psemibold"}
                            isLoading={loading}
                            darkTheme={darkTheme}
                        />
                    </View>
                </View>
            </ScrollView>
            <GeneralDrawer darkTheme={darkTheme} dismissOnClickOutside={true} heights={"50px"} isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)}>
                <View>
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-center font-psemibold text-2xl`,
                        "text-white",
                        "text-black-100"
                    )}>
                        Dial{" "}<Text className="text-secondary-100 font-psemibold text-2xl">*346#</Text>{" "}to retrieve your NIN
                    </Text>
                </View>
                <View className="py-5">
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-center font-pmedium text-base`,
                        "text-white",
                        "text-muted-300"
                    )}>
                        Dial with the number linked to your NIN.
                    </Text>
                </View>
                {/* <View className="pt-2">
                    <CustomButton 
                        title="Dial *346#"
                        textStyles="text-white font-psemibold"
                        containerStyles="h-14"
                        handlePress={handleCall}
                    />
                </View> */}
            </GeneralDrawer>
            <GeneralDrawer
                darkTheme={darkTheme}
                isVisible={isDrawerVisible2} 
                onClose={handleClose} 
            >   
                {!submitError ? (
                    <View>
                        <View className="px-2">
                            <View className="flex-1 justify-center items-center">
                                <Image 
                                    source={icons.good}
                                />
                            </View>
                            <View className="mt-5">
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `font-psans text-2xl text-center`,
                                    "text-white",
                                    "text-black-100"
                                )}>
                                    Your NIN have been submitted for review. This may take upto 5 working days.
                                </Text>
                            </View>
                            <CustomButton
                                handlePress={handleClose}
                                title={"Continue"}
                                textStyles={darkTheme === "dark" ? "font-psans" : "font-psans text-white"}
                                containerStyles={"mt-5 h-14"}
                                darkTheme={darkTheme}
                            />
                        </View>
                    </View>
                ):(
                    <View>
                        <View className="px-2">
                            <View className="flex-1 justify-center items-center">
                                <Image 
                                    source={icons.error}
                                />
                            </View>
                            <View className="mt-5">
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `font-psans text-2xl text-center`,
                                    "text-white",
                                    "text-black-100"
                                )}>
                                    Invalid NIN code
                                </Text>
                            </View>
                            <CustomButton
                                handlePress={handleClose}
                                title={"Continue"}
                                textStyles={darkTheme === "dark" ? "font-psans" : "font-psans text-white"}
                                containerStyles={"mt-5 h-14"}
                                darkTheme={darkTheme}
                            />
                        </View>
                    </View>
                )}
            </GeneralDrawer>
        </View>
    )
}

export default VerifyWithNin