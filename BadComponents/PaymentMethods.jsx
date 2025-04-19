

import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { Link, router } from 'expo-router'
import FormField from './FormField'
import CustomButton from './CustomButton'
import { createCustomer, createDedicatedVirtualAccount, initiateBankTransferPayment } from '../lib/payStack';
import { useGlobalContext } from '@/context/GlobalProvider';
import { WebView } from "react-native-webview";
import { myClassConverter } from '@/lib/performActions'

const PaymentMethods = (destination) => {
    const { user } = useGlobalContext();
    const [loading, setLoading] = useState(false)
    const [depositAmount, setDepositAmount] = useState(0)
    const [next, setNext] = useState(false)
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [reference, setReference] = useState(null);
    const [virtualAccount, setVirtualAccount] = useState(null);
    // const handleDeposit = async()=>{
    //     setLoading(true)
    //     if(user){
    //         const res = await initiateBankTransferPayment(user.email, depositAmount)
    //         if (res) {
    //             setPaymentUrl(res.authorization_url)
    //             setReference(res.reference)
    //         }
    //         // Paystack response: {"access_code": "2fipn8i6wyb9wyg", "authorization_url": "https://checkout.paystack.com/2fipn8i6wyb9wyg", "reference": "av2saacotk"}
    //     }
    //     setLoading(false)
    // }

    const handleDeposit = async () => {
        setLoading(true);

        if (user) {
            try {
                // Ensure the customer exists on Paystack
                const customer = await createCustomer(user.email, user.name, "Nairafolio", user.phone);
                if (customer) {
                    // Create a dedicated virtual account for the customer
                    const account = await createDedicatedVirtualAccount(customer.id);
                    if (account) {
                        setVirtualAccount(account); // Set virtual account details
                    } else {
                        Alert.alert("Error", "Failed to create virtual account. Please try again.");
                    }
                } else {
                    Alert.alert("Error", "Failed to create customer. Please try again.");
                }
            } catch (error) {
                console.error("Error during deposit process:", error);
                Alert.alert("Error", "An error occurred. Please try again.");
            }
        } else {
            Alert.alert("Error", "User not logged in.");
        }

        setLoading(false);
    };


    const handlePaymentSuccess = () => {
        Alert.alert("Payment Completed", "Your payment was successful!");
        setPaymentUrl(null); // Close WebView
    };

    const handlePaymentFailure = () => {
        Alert.alert("Payment Failed", "Your payment was unsuccessful. Please try again.");
        setPaymentUrl(null); // Close WebView
    };
    // verifyPayment("transaction-reference-here").then((data) => {
    //     console.log("Payment verification response:", data);
    // });
    // useEffect(() => {
    //     if(paymentUrl){
    //         router.push(`/pay-with/${1}`)
    //     }
    // }, [paymentUrl])
    

    return (
        <View className='flex-1'>
            {virtualAccount ? (
                // Display virtual account details to the user
                <View className="relative z-[60]" style={{ flex: 1, padding: 20 }}>
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-lg font-psans`,
                        "text-white",
                        "text-header-200"
                    )}>
                        Please transfer ₦{depositAmount} to the following account:
                    </Text>
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-lg font-psans`,
                        "text-white",
                        "text-header-200"
                    )}>
                        Bank: {virtualAccount.bank.name}
                    </Text>
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-lg font-psans`,
                        "text-white",
                        "text-header-200"
                    )}>
                        Account Number: {virtualAccount.account_number}
                    </Text>
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-lg font-psans`,
                        "text-white",
                        "text-header-200"
                    )}>
                        Account Name: {virtualAccount.account_name}
                    </Text>
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-sm`,
                        "text-[#FFFFFFB2]",
                        "text-muted"
                    )}>
                        After making the transfer, the payment will be automatically verified.
                    </Text>
                </View>
            ) : (
                <View>
                    {!next ? (
                        <View>
                            <TouchableOpacity 
                                className="my-5 px-5"
                                onPress={()=>setNext(true)}
                            >
                                <View 
                                    className={myClassConverter(
                                        darkTheme,
                                        `flex-1 
                                        rounded-lg
                                        flex 
                                        py-4 flex-row
                                        border`,
                                        "border-[#3B3C43]",
                                        "border-border bg-[#F8FAFA]"
                                    )}
                                >
                                    <View
                                        className="h-14 w-14 rounded-full items-center justify-center"
                                    >
                                        <Image
                                            source={icons.bank}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View
                                        style={{
                                            width: "74.54%",
                                        }}
                                        className="flex-1 px-3 "
                                    >
                                        <View>
                                            <Text
                                                className={myClassConverter(
                                                    darkTheme,
                                                    `text-lg font-psans`,
                                                    "text-white",
                                                    "text-header-200"
                                                )}
                                            >
                                                Bank transfer
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className={myClassConverter(
                                                darkTheme,
                                                `text-sm`,
                                                "text-[#FFFFFFB2]",
                                                "text-muted"
                                            )}>
                                                Direct transfer from your bank account
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
                                            tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <Link href={"/"} className="px-5">
                                <View 
                                    className={myClassConverter(
                                        darkTheme,
                                        `flex-1 
                                        rounded-lg
                                        flex 
                                        py-4 flex-row
                                        mb-5
                                        border`,
                                        "border-[#3B3C43]",
                                        "border-border bg-[#F8FAFA]"
                                    )}
                                >
                                    <View
                                        className="h-14 w-14 rounded-full items-center justify-center"
                                    >
                                        <Image
                                            source={icons.card}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View
                                        style={{
                                            width: "74.54%",
                                        }}
                                        className="flex-1 px-2 "
                                    >
                                        <View>
                                            <Text
                                                className={myClassConverter(
                                                    darkTheme,
                                                    `text-lg font-psans`,
                                                    "text-white",
                                                    "text-header-200"
                                                )}
                                            
                                            >
                                                Debit card
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className={myClassConverter(
                                                darkTheme,
                                                `text-sm`,
                                                "text-[#FFFFFFB2]",
                                                "text-muted"
                                            )}>
                                                Pay using Visa, Mastercard, or others 
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
                                            tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                        />
                                    </View>
                                </View>
                            </Link>
                        </View>
                    ):(
                        <View>
                            <View>
                                <Text className="text-base text-[#8A97A8]">
                                    Enter deposit amount
                                </Text>
                            </View>
                            <FormField 
                                title="Deposit"
                                value={depositAmount}
                                keyboardType="number-pad"
                                placeholder="Min ₦100"
                                handleChangeText={(e)=>setDepositAmount(e)}
                                otherStyles="mt-2"

                            />
                            <View>
                                <CustomButton 
                                    title="Withdraw"
                                    handlePress={handleDeposit}
                                    containerStyles="h-14 mb-4 mt-10"
                                    textStyles="text-white font-psemibold"
                                    loading={!depositAmount || depositAmount <100 || !user}
                                    isLoading={loading}
                                />
                            </View>
                        </View>
                    )}
                    {paymentUrl && (
                        <View className='relative z-[60]'>
                            <WebView
                                source={{ uri: paymentUrl }}
                                onNavigationStateChange={(navState) => {
                                    const { url } = navState;
                                    if (url.includes("status=success")) {
                                        handlePaymentSuccess();
                                    } else if (url.includes("status=failed")) {
                                        handlePaymentFailure();
                                    }
                                }}
                                onError={(error) => {
                                    console.error("WebView Error:", error);
                                    handlePaymentFailure();
                                }}
                                style={{ flex: 1 }}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}

export default PaymentMethods