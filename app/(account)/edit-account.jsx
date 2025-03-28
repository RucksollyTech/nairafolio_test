import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../../constants'
import AccountCustomForm from '../../components/AccountCustomForm'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '@/context/GlobalProvider'
import { useNavigation } from 'expo-router'

// import * as ImagePicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import GeneralDrawer from '../../components/GeneralDrawer'
import { updateUserProfile } from '../../lib/appwrite'
import { updateCurrentUser } from '../../lib/updateAccountTransaction'
import CustomNavigator from '../../components/CustomNavigator'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
import { Keyboard } from 'react-native'
import { IconSymbol } from '@/components/ui/IconSymbol'

const EditAccount = () => {
    const { user, setUser, setLastActive,darkTheme } = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async()=>{
        setRefreshing(true)
        await updateCurrentUser(setUser)
        setRefreshing(false)
    }
    const navigation = useNavigation();
    const username = user?.name?.split(" ")

    const [accountForm, setAccountForm] = useState({
        firstName: username?.[0] || "",
        lastName: username?.slice(1).join(" ") || "",
        phoneNumber: user.phone || "",
        image: null,
    })

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    
    const openPicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setAccountForm({
                ...accountForm,
                image: result.assets[0],
            });
            setIsDrawerVisible(false)
        }
    };

    const takePhoto = async () => {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
        if (status !== "granted") {
          Alert.alert("Permission Denied", "You need to grant camera access to take a photo.");
          return;
        }
      
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1,
        });
      
        if (!result.canceled) {
            setAccountForm({
                ...accountForm,
                image: result.assets[0],
            });
            setIsDrawerVisible(false)
        }
    };

    const submit = async () => {
        if (
            (accountForm.firstName === "") |
            (accountForm.lastName === "") |
            (accountForm.phoneNumber === "")
        ) {
            return Alert.alert("Please provide all fields");
        }
        setUploading(true);
        try {
            await updateUserProfile({
                ...accountForm,
                userId: user.$id,
                user
            });
            await updateCurrentUser(setUser)
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
            }, 1500);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            await updateCurrentUser(setUser)
            setUploading(false);
        }
    };
    useEffect(() => {
        updateCurrentUser(setUser)
    }, [uploading])
    
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" && "padding"} 
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} className={darkTheme === "dark" ? "dark" : ""}>
                <SafeAreaView className="bg-white dark:bg-dark_mode flex-1 h-full">
                    <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
                    <ScrollView
                        onTouchStart={() => setLastActive(Date.now())}
                        onScroll={() => setLastActive(Date.now())}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false} 
                        showsHorizontalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    >
                        <View className="bg-white dark:bg-dark_mode flex-1 px-5 pb-10 relative">
                            
                            <View className="pt-4">
                                <Text className="text-black-100 dark:text-white font-psans text-2xl">
                                    Edit profile
                                </Text>
                            </View>
                            <View className="py-14 justify-center items-center flex-1">
                                <TouchableOpacity 
                                    activeOpacity={0.9}
                                    onPress={()=>setIsDrawerVisible(true)}
                                    className="relative flex-1"
                                >
                                    {accountForm?.image ? (
                                        <Image 
                                            source={{uri : accountForm.image.uri}}
                                            resizeMode='cover'
                                            className="w-28 h-28 rounded-full"
                                        />
                                    ):(
                                        <Image 
                                            source={{uri : user?.avatar}}
                                            resizeMode='cover'
                                            className="w-28 h-28 rounded-full"
                                        />
                                    )}
                                    
                                    <View className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-[#F5F5F5] items-center justify-center">
                                        <Image 
                                            source={icons.edit}
                                            resizeMode='cover'
                                            className="rounded-full"
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {saved && (
                                <View className="relative">
                                    <View className="absolute -top-10 z-10 justify-center items-center">
                                        
                                        <View className={`
                                            bg-[#00A6511A]
                                            flex-row w-[140px] border-[#FFFFFF4D] border px-2 py-1 rounded-[30px]
                                        `}>
                                            <Text className={`text-secondary-100 text-center font-psemibold my-auto pl-2 text-xs`}>
                                                Edit was successful
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            <View>
                                <AccountCustomForm
                                    darkTheme={darkTheme} 
                                    title="First name"
                                    otherStyles="mb-4"
                                    value={accountForm.firstName}
                                    placeholder={"Enter your first name"}
                                    handleChangeText={(e)=>setAccountForm({...accountForm,firstName:e})}
                                />
                                <AccountCustomForm
                                    darkTheme={darkTheme} 
                                    title="Last name"
                                    otherStyles="mb-4"
                                    value={accountForm.lastName}
                                    placeholder={"Enter your last name"}
                                    handleChangeText={(e)=>setAccountForm({...accountForm,lastName:e})}
                                />
                                <AccountCustomForm
                                    darkTheme={darkTheme} 
                                    title="Email"
                                    otherStyles="mb-4"
                                    value={user.email}
                                    keyboardType={"email-address"}
                                    placeholder={"Enter your email address"}
                                />
                                <AccountCustomForm
                                    darkTheme={darkTheme} 
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
                                    textStyles={darkTheme === "dark" ? "font-psemibold" : "text-white font-psemibold"}
                                    handlePress={submit}
                                    isLoading={uploading}
                                    darkTheme={darkTheme}
                                />
                            </View>
                            
                        </View>
                    </ScrollView>
                    <GeneralDrawer 
                        darkTheme={darkTheme}
                        header={"Profile photo"}
                        isVisible={isDrawerVisible} 
                        onClose={() => setIsDrawerVisible(false)}
                        dismissOnClickOutside={true}
                    >
                        <View className="flex-1 flex-row gap-10 mb-10 mt-5">
                            <TouchableOpacity 
                                onPress={takePhoto}
                                className="items-center justify-center"
                            >
                                <View className="mb-2">
                                    <IconSymbol
                                        name="camera.fill"
                                        size={32}
                                        weight="medium"
                                        color={darkTheme === "dark" ? "#FFFFFF" : "#171717"}
                                    />
                                </View>
                                <View>
                                    <Text className="font-psans text-header-100 dark:text-white text-sm">
                                        Camera
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View>
                                <TouchableOpacity 
                                    onPress={openPicker}
                                    className="items-center justify-center"
                                >
                                    <View className="mb-2">
                                        <IconSymbol
                                            name="gallery.fill"
                                            size={32}
                                            weight="medium"
                                            color={darkTheme === "dark" ? "#FFFFFF" : "#171717"}
                                        />
                                    </View>
                                    <View>
                                        <Text className="font-psans text-header-100 dark:text-white text-sm">
                                            Gallery
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </GeneralDrawer>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default EditAccount