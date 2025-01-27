import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";

const BankTransferPaymentScreen = ({ userEmail, depositAmount }) => {
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to initiate bank transfer
    const initiateBankTransferPayment = async (email, amount) => {
        try {
            setLoading(true);
            const response = await fetch("https://api.paystack.co/transaction/initialize", {
                method: "POST",
                headers: {
                    Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`, // Replace with your Paystack test/live secret key
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email, // Customer's email
                    amount: amount * 100, // Amount in kobo (Naira * 100)
                    channels: ["bank"], // Restrict to bank transfer
                }),
            });

            const data = await response.json();

            if (data.status) {
                setPaymentUrl(data.data.authorization_url); // Set authorization URL for WebView
            } else {
                Alert.alert("Error", data.message || "Failed to initiate payment.");
            }
        } catch (error) {
            console.error("Error initiating bank transfer:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to verify payment
    const verifyPayment = async (reference) => {
        try {
            const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`, // Replace with your Paystack test/live secret key
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error verifying payment:", error);
        }
    };

    const handlePaymentSuccess = () => {
        Alert.alert("Payment Completed", "Your payment was successful!");
        setPaymentUrl(null); // Close WebView
    };

    const handlePaymentFailure = () => {
        Alert.alert("Payment Failed", "Your payment was unsuccessful. Please try again.");
        setPaymentUrl(null); // Close WebView
    };

    return (
        <View style={styles.container}>
            {!paymentUrl ? (
                <>
                    <Text style={styles.title}>Bank Transfer Payment</Text>
                    <Button
                        title="Pay Now"
                        onPress={() => initiateBankTransferPayment(userEmail, depositAmount)}
                        disabled={loading}
                    />
                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
                </>
            ) : (
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
});

export default BankTransferPaymentScreen;
