import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import GlobalTouchListener from "./GlobalTouchListener";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { checkBiometricSupport } from "@/app/(account)/security";
import { useNavigation } from "@react-navigation/native";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locked, setLocked] = useState(true);
    const [lastActive, setLastActive] = useState(Date.now());

    const navigation = useNavigation();
    const currentState = navigation.getState();
    const currentRouteName = currentState.routes[currentState.index]?.params?.returnUrl;
    const otherScreen = currentState.routes[currentState.index]?.params?.screen;
    
    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLogged(true);
                    setUser(res);
                    // setLocked(false);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
            const subscription = AppState.addEventListener("change", handleAppStateChange);
            return () => subscription.remove();
    }, []);
    const handleAppStateChange = async (nextAppState) => {
        if (nextAppState === "background") {
            setLastActive(Date.now());
        } else if (nextAppState === "active") {
            const inactiveTime = Date.now() - lastActive;
            if (inactiveTime > 400000) {
                lockApp();
            }
            setLastActive(Date.now());
        }

    };
    useEffect(() => {
        const interval = setInterval(() => {
          const inactiveTime = Date.now() - lastActive;
          // Only lock if the app is not already locked and the user is logged in.
          if (inactiveTime > 400000 && !locked && isLogged) {
            lockApp();
          }
        }, 400000);
    
        return () => clearInterval(interval);
    }, [lastActive, locked, isLogged]);

    const lockApp = async () => {
        const useBiometrics = await AsyncStorage.getItem("nairaFolioUseBiometrics");
        if (
            currentRouteName !== "index"
            && otherScreen !== "sign_in"
            && otherScreen !== "sign_up"
            && currentRouteName !== "/"
        ){
            if (useBiometrics === "true") {
                setLocked(true);
                // authenticateUser();
            } else {
                setLocked(true);
            }
        }
    };

    const authenticateUser = async () => {
        const isSupported = await checkBiometricSupport();
        if (!isSupported) return;
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Authenticate to unlock",
            fallbackLabel: "Enter PIN",
            disableDeviceFallback: true, // Prevents password fallback
            requireConfirmation: false, // Avoids extra confirmation for Face ID
        });
        if (result.success) {
            setLocked(false);
            setLastActive(Date.now());
        } else {
            Alert.alert("Authentication Failed", "Please try again.");
        }
    };
    const handleGlobalTouch = () => {
        setLastActive(Date.now());
    };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GlobalContext.Provider
                value={{
                    isLogged,
                    setIsLogged,
                    user,
                    setUser,
                    loading,
                    locked,
                    setLocked,
                    authenticateUser,
                    setLastActive,
                }}
            >
                <GlobalTouchListener onTouch={handleGlobalTouch}>
                    {children}
                </GlobalTouchListener>
            </GlobalContext.Provider>
        </GestureHandlerRootView>
    );
};

export default GlobalProvider;
