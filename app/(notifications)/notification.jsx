import { View, Text, Image, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import { useGlobalContext } from '@/context/GlobalProvider';
import { getNotifications } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import CustomNavigator from '@/components/CustomNavigator'
import { useNavigation } from 'expo-router'
import HomeSkeletonLoader from '@/components/HomeSkeletonLoader'
import { EmptyState, UTCDate } from '@/components'


const notification = () => {
    const navigation = useNavigation();

    const { setLastActive,user,darkTheme } = useGlobalContext();
    const { data:notifications, loading, refetch } = useAppwrite(()=>getNotifications(user?.$id))

    const [showOlder, setShowOlder] = useState(false)
    const [showToday, setShowToday] = useState(false)

    const [refreshing, setRefreshing] = useState(false)
    
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    const hasOlder = notifications?.some(notify => !UTCDate(notify.$createdAt)?.isToday) || false;
    const hasToday = notifications?.some(notify => UTCDate(notify.$createdAt)?.isToday) || false;

    useEffect(() => {
        const hasOlder = notifications?.some(notificarifications => !UTCDate(notificarifications.$createdAt)?.isToday);
        const hasToday = notifications?.some(notificarifications => UTCDate(notificarifications.$createdAt)?.isToday);

        setShowOlder(hasOlder);
        setShowToday(hasToday);
    }, [notifications]);
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
            <View className="pt-2 px-5 pb-3">
                <Text className="text-black-100 dark:text-white font-psans text-2xl">
                    Notification
                </Text>
            </View>
            <FlatList
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                data={notifications}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.$id}

                renderItem={({ item, index }) => {
                    if(item.action === "sales" || item.action === "purchase"){
                        return(
                            <View className="px-5 pt-2">
                                <View 
                                    className="
                                        flex-1 
                                        rounded-lg
                                        flex 
                                        py-4 flex-row
                                        mb-5
                                        border-b
                                        border-border dark:border-[#3B3C43]
                                    "
                                >
                                    <View
                                        className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                                    >
                                        <Image
                                            source={icons.download}
                                            resizeMode="cover"
                                            tintColor={item.action === "sales" ? "#40BF6A" : "#E33629"}
                                            className={item.action !== "sales" ? "rotate-180" : ""}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            width: "74.54%",
                                        }}
                                        className="flex-1 px-3 "
                                    >
                                        <View>
                                            {item.action === "sales" && (
                                                <Text
                                                    className="text-lg font-pmedium text-muted"
                                                >
                                                    Your share{" "}
                                                    <Text className="text-header-200 dark:text-white  font-psans">{item.message}</Text>
                                                    {" "}has been sold at
                                                    <Text className="text-header-200 dark:text-white  font-psans">₦{(item.amount)?.toLocaleString()}</Text>.
                                                </Text>
                                            )}
                                            {item.action === "purchase" && (
                                                <Text
                                                    className="text-lg font-pmedium text-muted"
                                                >
                                                    You have successfully bought a share{" "}
                                                    <Text className="text-header-200 dark:text-white  font-psans">{item.message}</Text>
                                                    {" "}at
                                                    <Text className="text-header-200 dark:text-white  font-psans">₦{(item.amount)?.toLocaleString()}</Text>.
                                                </Text>
                                            )}
                                        </View>
                                        <View className="pt-2">
                                            <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                                {UTCDate(item?.$createdAt)?.myDateFormat || "--"}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            width: "10.08%",
                                        }}
                                    ></View>
                                </View>
                            </View>
                        )
                    }else{
                        return(
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-4 flex-row
                                    mb-5
                                    border-b
                                    border-border dark:border-[#3B3C43]
                                "
                            >
                                <View
                                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                                >
                                    <Image
                                        source={icons.file}
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
                                            className="text-lg font-pmedium text-muted"
                                        >
                                            {item.message}
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                            {UTCDate(item?.$createdAt)?.myDateFormat || "--"}
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
                                    />
                                </View>
                            </View>
                        )
                    }
                }}
                ListHeaderComponent={()=>(
                    <>
                        <View className="flex-1">
                            
                            {(showToday || hasToday) && (
                                <View className="px-5 py-2 bg-[#F5F5F5]">
                                    <Text className="text-sm font-pregular text-muted">
                                        Today
                                    </Text>
                                </View>
                            )}
                            <View className="px-5">
                                {(notifications && notifications.length > 0) && notifications.map((item,index)=>{
                                    if(item.action === "sales" || item.action === "purchase"){
                                        return(
                                            <View className="px-5 pt-2">
                                                <View 
                                                    className="
                                                        flex-1 
                                                        rounded-lg
                                                        flex 
                                                        py-4 flex-row
                                                        mb-5
                                                        border-b
                                                        border-border dark:border-[#3B3C43]
                                                    "
                                                >
                                                    <View
                                                        className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                                                    >
                                                        <Image
                                                            source={icons.download}
                                                            resizeMode="cover"
                                                            tintColor={item.action === "sales" ? "#40BF6A" : "#E33629"}
                                                            className={item.action !== "sales" ? "rotate-180" : ""}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: "74.54%",
                                                        }}
                                                        className="flex-1 px-3 "
                                                    >
                                                        <View>
                                                            {item.action === "sales" && (
                                                                <Text
                                                                    className="text-lg font-pmedium text-muted"
                                                                >
                                                                    Your share{" "}
                                                                    <Text className="text-header-200 dark:text-white  font-psans">{item.message}</Text>
                                                                    {" "}has been sold at
                                                                    <Text className="text-header-200 dark:text-white  font-psans">₦{(item.amount)?.toLocaleString()}</Text>.
                                                                </Text>
                                                            )}
                                                            {item.action === "purchase" && (
                                                                <Text
                                                                    className="text-lg font-pmedium text-muted"
                                                                >
                                                                    You have successfully bought a share{" "}
                                                                    <Text className="text-header-200 dark:text-white  font-psans">{item.message}</Text>
                                                                    {" "}at
                                                                    <Text className="text-header-200 dark:text-white  font-psans">₦{(item.amount)?.toLocaleString()}</Text>.
                                                                </Text>
                                                            )}
                                                        </View>
                                                        <View className="pt-2">
                                                            <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                                                {UTCDate(item?.$createdAt)?.myDateFormat || "--"}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: "10.08%",
                                                        }}
                                                    ></View>
                                                </View>
                                            </View>
                                        )
                                    }else{
                                        return(
                                            <View 
                                                className="
                                                    flex-1 
                                                    rounded-lg
                                                    flex 
                                                    py-4 flex-row
                                                    mb-5
                                                    border-b
                                                    border-border dark:border-[#3B3C43]
                                                "
                                            >
                                                <View
                                                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                                                >
                                                    <Image
                                                        source={icons.file}
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
                                                            className="text-lg font-pmedium text-muted"
                                                        >
                                                            {item.message}
                                                        </Text>
                                                    </View>
                                                    <View className="pt-2">
                                                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                                                            {UTCDate(item?.$createdAt)?.myDateFormat || "--"}
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
                                                    />
                                                </View>
                                            </View>
                                        )
                                    }
                                })}
                            </View>
                            {(showOlder || hasOlder) && (
                                <View className={`px-5 py-2 ${(showToday || hasToday) && "-mt-[21px]"} relative z-10 bg-[#F5F5F5]`}>
                                    <Text className="text-sm font-pregular text-muted">
                                        Older
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}
                ListEmptyComponent={()=> (<View className="h-full flex-1 justify-center items-center">
                    {loading ? (
                        <View className="px-5 pt-5">
                            <HomeSkeletonLoader darkTheme={darkTheme} />
                        </View>
                    ):(
                        <View className="px-5 pt-10">
                            <EmptyState title={"No notification"}/>
                        </View>
                    )}
                </View>)}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </SafeAreaView>
    )
}

export default notification
{/* <View className="flex-1 h-full"> */}
    {/* <LinearGradient
        colors={darkTheme === 'dark' ? ['#1D1E25', '#1D1E25'] : ['#EAF6E4', 'rgba(234, 246, 228, 0)']}
        start={darkTheme === 'dark' ? null : { x: 0.5, y: 0 }}
        end={darkTheme === 'dark' ? null : { x: 0.5, y: 1 }}
    >
        <View className="px-5">
            <View className="pt-8">
                <Text className="text-black-100 dark:text-white font-psans text-2xl">
                    Notification
                </Text>
            </View>
            
        </View>
    </LinearGradient> */}
    {/* Phase 1 */}
    {/* <View> */}
        {/* <View className="px-5 py-2 mt-7 bg-[#F5F5F5]">
            <Text className="text-sm font-pregular text-muted">
                Today
            </Text>
        </View> */}

        {/* <View className="flex-1 px-5 pt-2"> */}
            {/* Type one */}
            {/* <View 
                className="
                    flex-1 
                    rounded-lg
                    flex 
                    py-4 flex-row
                    mb-5
                    border-b
                    border-border dark:border-[#3B3C43]
                "
            >
                <View
                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                >
                    <Image
                        source={icons.download}
                        resizeMode="cover"
                        tintColor={"#40BF6A"}
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
                            className="text-lg font-pmedium text-muted"
                        >
                            You just invested{" "}<Text className="text-header-200 dark:text-white  font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 dark:text-white  font-psans">Investment name</Text>.
                        </Text>
                    </View>
                    <View className="pt-2">
                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                            Tue May 24th, 3:34pm
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        width: "10.08%",
                    }}
                ></View>
            </View> */}
            {/* Type two */}
            {/* <View 
                className="
                    flex-1 
                    rounded-lg
                    flex 
                    py-4 flex-row
                    mb-5
                    border-b
                    border-border dark:border-[#3B3C43]
                "
            >
                <View
                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                >
                    <Image
                        source={icons.download}
                        resizeMode="cover"
                        tintColor={"#E33629"}
                        className="rotate-180"
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
                            className="text-lg font-pmedium text-muted"
                        >
                            You just invested{" "}<Text className="text-header-200 dark:text-white  font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 dark:text-white  font-psans">Investment name</Text>.
                        </Text>
                    </View>
                    <View className="pt-2">
                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                            Tue May 24th, 3:34pm
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        width: "10.08%",
                    }}
                ></View>
            </View> */}
            {/* Type three */}
            {/* <View 
                className="
                    flex-1 
                    rounded-lg
                    flex 
                    py-4 flex-row
                    mb-5
                    border-b
                    border-border dark:border-[#3B3C43]
                "
            >
                <View
                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                >
                    <Image
                        source={icons.file}
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
                            className="text-lg font-pmedium text-muted"
                        >
                            You just invested{" "}<Text className="text-header-200 dark:text-white  font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 dark:text-white  font-psans">Investment name</Text>.
                        </Text>
                    </View>
                    <View className="pt-2">
                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                            Tue May 24th, 3:34pm
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
                    />
                </View>
            </View> */}
        {/* </View> */}
    {/* </View> */}
    {/* Phase 2 */}
    {/* <View>
        <View className="px-5 py-2 mt-7 bg-[#F5F5F5]">
            <Text className="text-sm font-pregular text-muted">
                May 24th, 4:00pm
            </Text>
        </View>

        <View className="flex-1 px-5 pt-2">
            <View 
                className="
                    flex-1 
                    rounded-lg
                    flex 
                    py-4 flex-row
                    mb-5
                "
            >
                <View
                    className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
                >
                    <Image
                        source={icons.download}
                        resizeMode="cover"
                        tintColor={"#40BF6A"}
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
                            className="text-lg font-pmedium text-muted"
                        >
                            You just invested{" "}<Text className="text-header-200 dark:text-white  font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 dark:text-white  font-psans">Investment name</Text>.
                        </Text>
                    </View>
                    <View className="pt-2">
                        <Text className="text-muted dark:text-[#FFFFFFB2] text-sm">
                            Tue May 24th, 3:34pm
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        width: "10.08%",
                    }}
                ></View>
            </View>
        </View>
    </View> */}
{/* </View> */}