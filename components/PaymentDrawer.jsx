import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { icons } from '../constants';
import FormField from "./FormField"
import Money from './Money';
import CustomButton from './CustomButton';

const { height: screenHeight } = Dimensions.get('window'); 

const PaymentDrawer = ({ isVisible, onClose }) => {
    if (!isVisible) return null;
    const [unit, setUnit] = useState(0)
    const [next, setNext] = useState(false)
    const unitPrice = 20
    const handleClose = () => {
        setNext(false)
        onClose()
    }
    return (
        <View className="absolute inset-0 z-50 bg-black/50">
            <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={handleClose} />
            <View
                style={styles.drawer}
                className="absolute bottom-0 inset-x-0 bg-white rounded-t-[30px]"
            >
                <View 
                    className="
                        p-5 min-h-24 flex-row justify-between items-center border-b border-border
                    "
                >
                    {next ? (
                        <View>
                            <Text className="text-muted-200 font-pmedium">
                                Select payment method
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-row items-center">
                            <View
                                className="
                                    h-12 w-12 
                                    rounded-full 
                                    bg-[#DFE7E8]
                                    items-center 
                                    justify-center
                                "
                            >
                                <Image
                                    source={icons.tag}
                                    resizeMode="contain"
                                    className="
                                        w-6 
                                        rounded-full
                                    "
                                />
                            </View>
                            <View className="pl-3">
                                <Text className="text-lg font-psemibold font-semibold text-header-200">
                                    Secure an Investment
                                </Text>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity onPress={handleClose}>
                        <Image 
                            source={icons.cancel}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView className="flex-1 p-4 h-full flex">
                    <View>
                        {next ? (
                            <View></View>
                        ) : (
                            <View>
                                <View>
                                    <Text className="text-muted-200 font-pmedium">
                                        Number of units to purchace
                                    </Text>
                                    <FormField 
                                        title={"e.g 15 units"}
                                        value={unit}
                                        placeholder={"e.g 15 units"}
                                        handleChangeText={(e)=>setUnit(e)}
                                        otherStyles={"mt-2"}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="mt-8">
                                    <Text className="text-muted-200 font-pmedium">
                                        Price of units
                                    </Text>
                                    <View className="mt-3 items-center justify-center rounded-lg bg-[#F7F7F7] h-14">
                                        <Money 
                                            value={unit * unitPrice}
                                            textStyle={"font-xl"}
                                        />
                                    </View>
                                </View>
                                <View className="mt-2 items-center justify-center">
                                    <Text className="text-secondary-100 font-pmedium text-sm">
                                        One unit costs{" "}
                                        <Text className="font-psans">₦{unitPrice.toLocaleString()}</Text>
                                    </Text>
                                </View>
                            </View>
                        )}
                        
                    </View>
                </ScrollView>
                <View className="px-5 pb-7">
                    <CustomButton 
                        title="Proceed"
                        textStyles="text-white"
                        containerStyles="h-14"
                        handlePress={()=>next ? router.push("/") : setNext(true)}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    drawer: {
        height: screenHeight * 0.92, 
    },
});


export default PaymentDrawer