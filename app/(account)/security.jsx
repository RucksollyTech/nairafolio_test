import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { Link, useNavigation } from 'expo-router'
import CustomNavigator from '../../components/CustomNavigator'
import showAlert from '../../components/CustomAlert'
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useGlobalContext } from '@/context/GlobalProvider';

export const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware) {
        Alert.alert("Error", "Biometric authentication is not supported on this device.");
        return false;
    }

    if (!isEnrolled) {
        Alert.alert("Error", "No biometrics enrolled. Set up Face ID in device settings.");
        return false;
    }

    return true;
};


const Security = () => {
    const { setLastActive } = useGlobalContext();
    const navigation = useNavigation();

    const [biometricsEnabled, setBiometricsEnabled] = useState(false);
    
    useEffect(() => {
        const checkBiometrics = async () => {
            const savedSetting = await AsyncStorage.getItem("nairaFolioUseBiometrics");
            setBiometricsEnabled(savedSetting === "true");
        };
        checkBiometrics();
    }, []);

    const toggleBiometrics = useCallback(async (value) => {
        console.log("Was here")
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert("Biometric Authentication", "Biometric authentication is not available or not set up on this device.");
                return;
            }

            if (value) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Enable Biometric Authentication",
                    cancelLabel: "Cancel",
                });

                if (result.success) {
                    await AsyncStorage.setItem("nairaFolioUseBiometrics", "true");
                    setBiometricsEnabled(true);
                    Alert.alert("Success", "Biometric authentication enabled.");
                } else {
                    Alert.alert("Authentication Failed", "Could not enable biometric authentication.");
                }
            } else {
                await AsyncStorage.setItem("nairaFolioUseBiometrics", "false");
                setBiometricsEnabled(false);
                Alert.alert("Success", "Biometric authentication disabled.");
            }
        } catch (error) {
            console.error("Biometric Auth Error:", error);
            Alert.alert("Error", "Something went wrong.");
        }
    }, []);

    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <CustomNavigator navigator={navigation} />
            <ScrollView
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className="bg-white flex-1 h-full px-5 pb-10">
                    
                    <View className="pt-4">
                        <Text className="text-black-100 font-psans text-2xl">
                            Security
                        </Text>
                    </View>
                    <View className="pt-6 pb-2">
                        <Text className="text-[#2A3B59] text-lg font-psemibold">
                            Password
                        </Text>
                    </View>
                    <View>
                        <Link href={"/change-password"} className="my-1">
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-2 flex-row
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
                                        source={icons.lock}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View
                                    style={{
                                        width: "74.54%",
                                    }}
                                    className="flex-1 px-3 my-auto"
                                >
                                    <View>
                                        <Text
                                            className="text-lg text-[#2A3B59] font-pmedium"
                                        >
                                            Change password
                                        </Text>
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
                        </Link>
                    </View>
                    <View className="pt-6 pb-2">
                        <Text className="text-[#2A3B59] text-lg font-psemibold">
                            Biometrics
                        </Text>
                    </View>
                    <View className="my-1">
                        <View 
                            className="
                                flex-1 
                                rounded-lg
                                flex 
                                py-2 flex-row
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
                                    source={icons.face_id}
                                    resizeMode="cover"
                                />
                            </View>
                            <View
                                style={{
                                    width: "64.54%",
                                }}
                                className="flex-1 px-3 my-auto"
                            >
                                <View>
                                    <Text
                                        className="text-lg text-[#2A3B59] font-pmedium"
                                    >
                                        Log in with Biometrics
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "20.08%",
                                }}
                                className="items-center justify-center"
                            >
                                <Switch
                                    trackColor={{ false: "#D7D7D7", true: "#81b0ff" }} // Track colors for off/on
                                    thumbColor={biometricsEnabled ? "#FFFFFF" : "#FFFFFF"}     // Thumb color for on/off
                                    ios_backgroundColor="#3e3e3e"                      // Background color for iOS
                                    onValueChange={toggleBiometrics}                      // Callback when value changes
                                    value={biometricsEnabled}  
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Security