import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { icons } from '../../../constants';
import { RefreshControl } from 'react-native';
import { getUpdate } from '../../../lib/appwrite';
import useAppwrite from '../../../lib/useAppwrite';
import UTCDate from '../../../components/UTCDate';
import CustomNavigator from '../../../components/CustomNavigator';
import { useGlobalContext } from '@/context/GlobalProvider';

const Update = () => {
    const { setLastActive, darkTheme } = useGlobalContext();

    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);


    const { data:update, loading, refetch } = useAppwrite(()=>getUpdate(id))
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    return (
        <SafeAreaView className={`${darkTheme ==="dark" ? "bg-dark_mode dark" : "bg-white"} flex-1 h-full`}>
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
                <View className="pt-2 px-5 border-b border-border dark:border-[#3B3C43] pb-6">
                    <View className="flex-row flex-1 items-center">
                        <View
                            className="
                                h-16 w-16 
                                rounded-full 
                                bg-[#DFE7E8]
                                dark:bg-[#CBF5B84D]
                                items-center 
                                justify-center
                            "
                        >
                            <Image
                                source={icons.file}
                                resizeMode="contain"
                                className="
                                    w-8
                                    rounded-full
                                "
                                tintColor={darkTheme === "dark" ? "#CBF5B8" : "#014148"}
                            />
                        </View>
                        <View className="pl-3 mr-5 flex-1">
                            <View>
                                <Text className="text-base font-psans text-header-200 dark:text-white ">
                                    {update?.[0]?.title}
                                </Text>
                            </View>
                            <View className="pt-1">
                                <Text className="text-muted-200 dark:text-[#FFFFFF99] text-sm font-pmedium font-[700]">
                                    {UTCDate(update?.[0]?.$createdAt)?.myDateFormat}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="px-5">
                    <View>
                        <View className="py-5">
                            <Text className="text-lg font-pmedium text-muted-100">
                                Notes
                            </Text>
                        </View>
                        <View>
                            <Text className="text-lg font-pmedium dark:text-white">
                                {update?.[0]?.body}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Update