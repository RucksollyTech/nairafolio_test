import { View, Text, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../../constants'
import { useNavigation } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getCurrentUser } from '../../lib/appwrite';
import CustomModal from '../../components/CustomModal'
import showAlert from '../../components/CustomAlert';

const withdrawal = () => {
    const navigation = useNavigation();
    const { user,setUser } = useGlobalContext();
    const [isModalVisible, setIsModalVisible] = useState(user?.is_verified ? false : true);
    // const [isModalVisible, setIsModalVisible] = useState(false);
    const checkActiveUser = async()=>{
        try {
            const res = await getCurrentUser();
            setUser(res)
        } catch (error) {
            console.error(error)
        }
    }
    // useEffect(() => {
    //     if(user && user?.is_verified === false){
    //         showAlert()
    //     }
    // }, [user])
    
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);
    useEffect(() => {
        if(!user){
            checkActiveUser()
        }
    }, [user])
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                // refreshControl={
                //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                // }
            >
                <View className="bg-white flex-1 h-full px-5 pb-10">
                    <View className="pt-7">
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
                            Withdrawal
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <CustomModal
                visible={isModalVisible}
                onClose={closeModal}
                title="Hello, World!"
                tw="justify-center items-center"
                contentStyle={{ paddingHorizontal: 10 }}
                buttonText="Continue"
            >
                <Text className="text-gray-700 text-center">
                    This is a reusable modal. You can customize its content and styles.
                </Text>
            </CustomModal>
        </SafeAreaView>
    )
}

export default withdrawal