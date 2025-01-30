import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { icons } from '../../../constants';
import { RefreshControl } from 'react-native';
import { getUpdate } from '../../../lib/appwrite';
import useAppwrite from '../../../lib/useAppwrite';
import UTCDate from '../../../components/UTCDate';

const Update = () => {
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
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="px-5">
                    <TouchableOpacity
                        className="pt-5"
                        onPress={()=>navigation.goBack()}
                    >
                        <Image
                            source={icons.arrow_left}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                
                <View className="pt-8 px-5 border-b border-border pb-6">
                    <View className="flex-row flex-1 items-center">
                        <View
                            className="
                                h-16 w-16 
                                rounded-full 
                                bg-[#DFE7E8]
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
                            />
                        </View>
                        <View className="pl-3 mr-5 flex-1">
                            <View>
                                <Text className="text-base font-psans text-header-200">
                                    {update?.[0]?.title}
                                </Text>
                            </View>
                            <View className="pt-1">
                                <Text className="text-muted-200 text-sm font-pmedium font-[700]">
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
                            <Text className="text-lg font-pmedium">
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