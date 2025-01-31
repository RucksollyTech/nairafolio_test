import { View } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import WebView from 'react-native-webview';
import { verifyPayment } from '../../../lib/payStack';
import { handlePaymentFailure, handlePaymentSuccess } from '../../../lib/updateAccountTransaction';
// import  { Paystack }  from 'react-native-paystack-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paystack } from 'react-native-paystack-webview';
import { useGlobalContext } from '@/context/GlobalProvider';

const PayWithBank = () => {
    const { mode:access_cod } = useLocalSearchParams();
    // const [access_code,reference] = access_cod.split("NAIRAfoLIO")
    const [email,amount,mode,investmentId,sale] = access_cod.split("NAIRAfoLIO")
    const { setUser } = useGlobalContext();
    // console.log({access_code,reference})
    const navigation = useNavigation();

    // const authorization_url =  `https://checkout.paystack.com/${access_code}`;
    const callback_url = 'https://yourcallback.com';
    const cancel_url = "https://your-cancel-url.com";

    // onNavigationStateChange = state => {
    
    //     const { url } = state;

    //     if (!url) return;
    //     if (url === callback_url) {
    //         // get transaction reference from url and verify transaction, then redirect
            
    //         const redirectTo = 'window.location = "' + callback_url + '"';
    //         this.webview.injectJavaScript(redirectTo);
    //     }
    //     if (url === cancel_url) {
    //         // handle webview removal
    //         // You can either unmount the component, or
    //         // Use a navigator to pop off the view
    //         // Run the cancel payment function if you have one
    //         console.log("canceled")
    //     }
    // };

    
    return (
        <SafeAreaView className="bg-white">
        <View style={{ flex: 1 }} className="max-w-[200px] max-h-[200px]">
            <Paystack  
                paystackKey="pk_test_9dae66fc8b1171e668e2d878162a4ecf9ede8a43"
                amount={amount}
                billingEmail={email}
                activityIndicatorColor="green"
                currency='NGN'
                onCancel={(e) => {
                    navigation.goBack()
                    // {"data": {"event": "cancelled"}, "status": "cancelled"}
                }}
                onSuccess={async(res) => {
                    // {"data": {"event": "successful", 
                    // "transactionRef": {"message": "Approved", "redirecturl": "https://yourcallback.com?trxref=T799131900132373&reference=T799131900132373", 
                    // "reference": "T799131900132373", "status": "success", "trans": "4621519689", "transaction": "4621519689", "trxref": "T799131900132373"}}, "status": "success", 
                    // "transactionRef": {"message": "Approved", "redirecturl": "https://yourcallback.com?trxref=T799131900132373&reference=T799131900132373", 
                    // "reference": "T799131900132373", "status": "success", "trans": "4621519689", "transaction": "4621519689", "trxref": "T799131900132373"}}
                    
                    // Send this function to the success page
                    // await handlePaymentSuccess(res.data.transactionRef.reference,null,"Wallet");
                    router.replace(`/payment-success/${mode === "card" ? "Card" : mode === "bank_transfer" ? "Transfer" : "Wallet"}NAIRAfoLIO${res.data.transactionRef.reference}NAIRAfoLIO${investmentId ? investmentId : "Unavailable"}NAIRAfoLIO${sale ? sale : false}`)
                }}
                channels={[mode]}
                autoStart={true}
            />
            {/* <WebView 
                source={{ uri: authorization_url }}
                style={{ marginTop: 40 }}
                // onNavigationStateChange={ this.onNavigationStateChange }
                onNavigationStateChange={async(navState) => {
                    const { url } = navState;
                    if (url.includes("status=success")) {
                        await handlePaymentSuccess(reference,null,"Wallet");
                        router.replace("/payment-success/Wallet")
                        console.error("WebView success");

                    } else if (url.includes("status=failed")) {
                        await handlePaymentFailure(reference,"Wallet",setUser);
                        router.replace("/payment-failed/Wallet")
                        console.error("WebView Error:");

                    }
                }}
                onError={async(error) => {
                    console.error("WebView Error:", error);
                    router.replace("/payment-failed/Wallet")
                    await handlePaymentFailure(reference,"Wallet",setUser);
                }}
            /> */}
        </View>
        </SafeAreaView>
    );
};

export default PayWithBank;
