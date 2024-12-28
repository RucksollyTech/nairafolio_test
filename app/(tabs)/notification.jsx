import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons } from '../../constants'
import Money from '../../components/Money'

const notification = () => {
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className="flex-1 h-full">
                    <LinearGradient
                        colors={['#EAF6E4', 'rgba(234, 246, 228, 0)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    >
                        <View className="px-5">
                            <View className="pt-8">
                                <Text className="text-black-100 font-psans text-2xl">
                                    Notification
                                </Text>
                            </View>
                            
                        </View>
                    </LinearGradient>
                    {/* Phase 1 */}
                    <View>
                        <View className="px-5 py-2 mt-7 bg-[#F5F5F5]">
                            <Text className="text-sm font-pregular text-muted">
                                Today
                            </Text>
                        </View>

                        <View className="flex-1 px-5 pt-2">
                            {/* Type one */}
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-4 flex-row
                                    mb-5
                                    border-b
                                    border-border
                                "
                            >
                                <View
                                    className="h-14 w-14 rounded-full items-center justify-center border border-border"
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
                                            You just invested{" "}<Text className="text-header-200 font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 font-psans">Investment name</Text>.
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-muted text-sm">
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
                            {/* Type two */}
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-4 flex-row
                                    mb-5
                                    border-b
                                    border-border
                                "
                            >
                                <View
                                    className="h-14 w-14 rounded-full items-center justify-center border border-border"
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
                                            You just invested{" "}<Text className="text-header-200 font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 font-psans">Investment name</Text>.
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-muted text-sm">
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
                            {/* Type three */}
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-4 flex-row
                                    mb-5
                                    border-b
                                    border-border
                                "
                            >
                                <View
                                    className="h-14 w-14 rounded-full items-center justify-center border border-border"
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
                                            You just invested{" "}<Text className="text-header-200 font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 font-psans">Investment name</Text>.
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-muted text-sm">
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
                            </View>
                        </View>
                    </View>
                    {/* Phase 2 */}
                    <View>
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
                                    className="h-14 w-14 rounded-full items-center justify-center border border-border"
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
                                            You just invested{" "}<Text className="text-header-200 font-psans">₦10,500</Text>{" "}into{" "}<Text className="text-header-200 font-psans">Investment name</Text>.
                                        </Text>
                                    </View>
                                    <View className="pt-2">
                                        <Text className="text-muted text-sm">
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
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default notification