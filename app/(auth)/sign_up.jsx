import { View, Text, ImageBackground, Image, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import { CustomButton, FormField } from '@/components'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createUser, saveExpoPushToken, signOut } from '@/lib/appwrite'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableOpacity } from 'react-native'
import { registerForPushNotificationsAsync } from '../_layout'

const sign_up = () => {
    const { setUser, setIsLogged, setLastActive, setLocked, darkTheme } = useGlobalContext();
    const [errorMessage, setErrorMessage] = useState("");
    // const [generalLoad, setGeneralLoad] = useState(false);

    const [showNext, setShowNext] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        password_confirm: "",
        name: "",
        phone: "",
        date_of_birth: "",
    });
    const [dateValue, setDateValue] = useState(null)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDateValue(date)
        hideDatePicker();
    };

    const handleNotificationSetup = async()=>{
        // setGeneralLoad(true)
        try {
            await registerForPushNotificationsAsync()
        } catch (error) {
            
        }finally{
            // setGeneralLoad(false)
        }
    }

    const submit = async () => {
        setErrorMessage("")
        if (
            form.name === "" || 
            form.email === "" || 
            form.password === "" ||
            form.phone === ""  ||
            dateValue === null 
        ) {
            return
        }

        setSubmitting(true);
        try {
            const result = await createUser(
                form.email, form.password, form.name,form.phone,
                dateValue
            );
            if (!result || !result.$id){
                Alert.alert("Error", "Failed to create user");
                return
            }
            setUser(result);
            setIsLogged(true);
            await AsyncStorage.setItem('isSignedUp', JSON.stringify(true));
            setLocked(false)
            try {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    await saveExpoPushToken(token);
                }
                router.replace("/home");
            } catch (error) {
                throw new Error("Device not supported");
            }
        } catch (error) {
            setErrorMessage("Please use another email address. That email is taken");
        } finally {
            setSubmitting(false);
        }
    };
    function isValidEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    function isValidPassword(password) {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
        return pattern.test(password);
    }
      
    const moveToNext = ()=>{
        setErrorMessage("")
        if (form.email === "") {
            setErrorMessage("Email field is required")
            return
        }
        if(!isValidEmail(form.email)){
            setErrorMessage("Invalid email address")
            return
        }
        if (
            form.password === "" ||
            form.password_confirm === ""
        ){
            setErrorMessage("Password field is required")
            return
        }
        if(!isValidPassword(form.password)){
            setErrorMessage("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.")
            return
        }
        if (form.password !== form.password_confirm){
            setErrorMessage("Password and Confirm password must be the equal")
            return
        }
        setShowNext(true)
    }
    useEffect(()=>{
        const logOutUserControl = async()=>{
            setUser(null)
            setIsLogged(false);
            await signOut()
        }
        logOutUserControl()
        handleNotificationSetup()
    },[])
    // if(generalLoad){
    //     return (
    //         <View className='flex-1 flex justify-center items-center'>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     )
    // }
    return (
        <SafeAreaView className={`flex-1 ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <ScrollView
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className='pt-3 pl-2'>
                    {showNext ? (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={()=>setShowNext(false)}
                        >
                            <Image 
                                source={icons.left_arrow}
                                resizeMode='contain'
                                tintColor={darkTheme=== "dark" ? "#FFFFFF" : "#000000"}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Link href={"/"}>
                            <Image 
                                source={icons.left_arrow}
                                resizeMode='contain'
                                tintColor={darkTheme=== "dark" ? "#FFFFFF" : "#000000"}
                            />
                        </Link>
                    )}
                </View>
                <View className="w-full px-5 flex justify-center h-full"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <View>
                        <View>
                            <Text className='font-psans dark:text-white text-3xl'>
                                {showNext ? "Name and Phone number" : "Sign up"}
                            </Text>
                        </View>
                        <View className='mt-2'>
                            <Text className='
                                text-lg 
                                font-pregular
                                font-semibold 
                                text-muted
                            '>
                                {showNext ? "Please enter the fields below." : "Create an account and start investing."}
                            </Text>
                        </View>
                        <View className='w-full'>
                            {showNext ? (
                                <View className='min-h-[336px]'>
                                    <View className='pt-8'>
                                        <FormField 
                                            title="Name"
                                            value={form.name}
                                            placeholder="Surname FirstName OtherName"
                                            handleChangeText={(e)=>setForm({...form, name: e})}
                                            darkTheme={darkTheme}
                                        />
                                    </View>
                                    <View className='flex flex-row pt-4 gap-3'>
                                        <View className='
                                            flex px-4
                                            bg-[#FDFDFD] 
                                            dark:bg-[#27282F]
                                            rounded-2xl 
                                            flex-row
                                            border border-border dark:border-[#3B3C43] 
                                            focus:border-primary 
                                            items-center'
                                        >
                                            <Image 
                                                source={icons.ngLogo}
                                                resizeMode='contain'
                                                className='my-auto'
                                            />
                                            <Text className='text-sm text-muted dark:text-[#FFFFFFB2] pl-1'>
                                                +234
                                            </Text>
                                        </View>
                                        <View className='w-full flex-1'>
                                            <FormField 
                                                title="Phone"
                                                value={form.phone}
                                                placeholder="8160000031"
                                                handleChangeText={(e)=>setForm({...form, phone: e})}
                                                otherStyles="w-full"
                                                darkTheme={darkTheme}
                                            />
                                        </View>

                                    </View>
                                    <View className="mt-3 pt-3">
                                        <TouchableOpacity 
                                            onPress={showDatePicker}
                                            className={`
                                                w-full h-16 
                                                px-4 rounded-2xl 
                                                border flex 
                                                flex-row 
                                                items-center 
                                                bg-[#FDFDFD] dark:bg-[#27282F]
                                                border-border dark:border-[#7F7F7F4D]
                                            `}
                                            // className="border flex-1 border-border dark:border-[#3B3C43] flex-row rounded-md w-44"
                                        >
                                            <View className="border-r h-full border-border dark:border-[#3B3C43] pr-4 text-center justify-center">
                                                <Image
                                                    source={icons.calender}
                                                    resizeMode="cover"
                                                    tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                                                />
                                            </View>
                                            <View className="p-2 text-center justify-center">
                                                <Text className="font-pregular text-base text-muted-200 dark:text-[#FFFFFF99]">
                                                    {!dateValue ? "Enter your date of birth" : dateValue?.toDateString()}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ):(
                                <View className='min-h-[336px]'>
                                    <View className='pt-8'>
                                        <FormField 
                                            title="Email"
                                            value={form.email}
                                            keyboardType={"email-address"}
                                            placeholder="Email address"
                                            handleChangeText={(e)=>setForm({...form, email: e.trim()})}
                                            darkTheme={darkTheme}
                                        />
                                    </View>
                                    
                                    <View className='pt-4'>
                                        <FormField 
                                            title="Password"
                                            value={form.password}
                                            placeholder="Password"
                                            handleChangeText={(e)=>setForm({...form, password: e})}
                                            darkTheme={darkTheme}
                                        />
                                    </View>
                                    <View className='pt-4'>
                                        <FormField 
                                            title="Password"
                                            value={form.password_confirm}
                                            placeholder="Confirm password"
                                            handleChangeText={(e)=>setForm({...form, password_confirm: e})}
                                            darkTheme={darkTheme}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                    <View className="items-center justify-center mt-3 mb-2">
                        <Text className="text-red-500 font-pmedium">
                            {errorMessage}
                        </Text>
                    </View>
                    <View className='w-full mt-[50px]'>
                        <View className='mb-6'>
                            <CustomButton 
                                title={showNext ? "Sign up" : "Continue"}
                                containerStyles="h-[50px]"
                                textStyles={darkTheme !== "dark" && "text-white"}
                                handlePress={showNext ? submit : moveToNext}
                                isLoading={isSubmitting}
                                darkTheme={darkTheme}
                            />
                        </View>
                        <View className='mb-10'>
                            <Text className='text-center text-base font-pregular text-muted'>
                                Already have an account? {" "} 
                                <Link 
                                    href={"/sign_in"}
                                    className='text-[#00A651]'
                                >
                                    Log in
                                </Link>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </SafeAreaView>
    )
}

export default sign_up