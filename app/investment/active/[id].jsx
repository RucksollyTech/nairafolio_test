import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons, images } from '../../../constants'
import { useNavigation } from 'expo-router'
import Money from '../../../components/Money'
import { Link, router } from 'expo-router'
import Drawer from '../../../components/Drawer'
import TitleComponent from '../../../components/TitleComponent'

const Active = () => {
    const navigation = useNavigation();
    const [active, setActive] = useState(true)
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const _id=2
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
                            <TouchableOpacity
                                className="pt-5 flex flex-row"
                                onPress={()=>navigation.goBack()}
                            >
                                <Image
                                    source={icons.arrow_left}
                                    resizeMode="contain"
                                />
                                <View className="pl-3">
                                    <Text className="text-black-100 text-xl font-pregular font-[700]">
                                        Investment Name
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            
                        </View>
                    </LinearGradient>
                    <View className="px-5">
                        <View className="pt-10">
                            <Money
                                value={400000000}
                                textStyle="text-black-100 font-psans text-4xl"
                            />
                        </View>
                        <View className="mt-2 flex-1">
                            <View className="mt-2 flex flex-row flex-1">
                                <Text className="text-muted font-pregular font-[700] text-base">
                                    Invested 
                                </Text>
                                <Money
                                    value={400000}
                                    textStyle="text-muted font-pregular font-[700] text-base"
                                    containerStyle="pl-2"
                                />
                            </View>
                            <View className="mt-2">
                                <Money
                                    value={400000}
                                    textStyle="text-secondary-100 font-pregular text-base font-[700]"
                                />
                            </View>
                            <View className={`flex mt-2 items-center justify-center w-[100px] bg-[#F5F5F5] border border-border px-3 py-1.5 rounded-lg`}>
                                <Text className={`font-pregular text-base text-muted-100 `}>
                                    68 days left
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 flex flex-row gap-4 my-7">
                            <TouchableOpacity
                                onPress={()=>router.push("/")}
                                activeOpacity={0.7}
                                className={`bg-primary rounded-xl h-11 flex w-[48%] flex-row justify-center items-center`}
                            >
                                <Text className={`font-pinter font-semibold text-base text-white`}>
                                    Add
                                </Text>
                                <View className="ml-2">
                                    <Image
                                        source={icons.download}
                                        resizeMode="contain"
                                        tintColor={"#FFFFFF"}
                                    />
                                </View>
                                
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>router.push("/")}
                                activeOpacity={0.7}
                                className={`border border-border-100 bg-[#F5F5F5] rounded-xl h-11 flex w-[48%] flex-row justify-center items-center`}
                            >
                                <Text className={`font-pinter font-semibold text-base text-muted`}>
                                    Sell shares
                                </Text>
                                <View className="ml-2">
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        tintColor={"#747474"}
                                    />
                                </View>
                                
                            </TouchableOpacity>
                        </View>

                        <View className="flex-1 rounded-lg border border-border">
                            <View className="p-4 border-b border-border flex-1">
                                <Text className="text-muted">
                                    Returns
                                </Text>
                            </View>
                            <View className="p-4">
                                <Text className="text-muted text-base">
                                    Highlights
                                </Text>
                                <View className="flex flex-row gap-4 mt-4 flex-1">
                                    
                                    <View className="flex w-[48%] items-center justify-center bg-[#F6F6F6] border border-border-200 px-3 py-2.5 rounded-lg">
                                        <View>
                                            <Image
                                                source={icons.roi}
                                                resizeMode="contain"
                                                className="my-auto"
                                            />
                                        </View>
                                        <View className="mt-2">
                                            <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">30% ROI</Text>
                                        </View>
                                    </View>
                                    <View className="flex w-[48%] items-center justify-center bg-[#F6F6F6] border border-border-200 px-3 py-2.5 rounded-lg">
                                        <View>
                                            <Image
                                                source={icons.money}
                                                resizeMode="contain"
                                                className="my-auto"
                                            />
                                        </View>
                                        <View className="mt-2">
                                            <View className="flex flex-row ">
                                                <Money 
                                                    value={20000}
                                                    containerStyle="flex"
                                                    textStyle="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200"
                                                />
                                                <View className="flex flex-row ">
                                                    <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">
                                                        min
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex mt-4 items-center justify-center bg-[#F6F6F6] border border-border-200 px-3 py-2.5 rounded-lg">
                                    <View>
                                        <Image
                                            source={icons.calender}
                                            resizeMode="contain"
                                            className="my-auto"
                                        />
                                    </View>
                                    <View className="mt-2">
                                        <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">12 months returns</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="p-4">
                                <Text className="text-muted text-base">
                                    Overview
                                </Text>
                                <View className="pt-4 border-t border-border mt-4">
                                    <Text className="text-black-300 text-lg font-pregular font-[600]">
                                        Mono Inc. is a leading Nigerian transportation and parcel 
                                        services company, offering a wide range of services, including:
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
                                        Reprehenderit ea deleniti dolorum quidem! Tempora error voluptas 
                                        veritatis, consequatur provident asperiores ullam vero,
                                        eos beatae odio enim deserunt aut fugit officiis!
                                    </Text>
                                </View>
                                <View className="mt-4 items-right">
                                    <Link href={`/investment/new/${_id}`}>
                                        <Text className="text-blue-500 font-psans">
                                            See more
                                        </Text>
                                    </Link>
                                </View>
                            </View>
                            
                        </View>
                        <View className="mt-8">
                            <Text className="text-black-100 text-xl font-pregular font-[700]">
                                Updates
                            </Text>
                            <View className="mt-2">
                                <Text className="text-muted text-base font-pregular">
                                    Here are updates about your investment.
                                </Text>
                            </View>
                            <View className="flex flex-row justify-between w-full">
                                <View className="flex flex-row gap-4 flex-1 w-full mt-4">
                                    <TouchableOpacity
                                        onPress={() => setActive(true)}
                                        className={`
                                            flex
                                            justify-center
                                            items-center
                                            rounded-full
                                            h-12
                                            w-12
                                            ${active ? "bg-[#F3F3F3]" : "bg-[#F9F9F9]"}
                                        `}
                                    >
                                        <Image
                                            source={icons.arrow_left_italic}
                                            resizeMode="contain"
                                            tintColor={active ? "#014148" : "#98B2B5"}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setActive(false)}
                                        className={`
                                            flex
                                            justify-center
                                            items-center
                                            rounded-full
                                            h-12
                                            w-12
                                            ${!active ? "bg-[#F3F3F3]" : "bg-[#F9F9F9]"}
                                        `}
                                    >
                                        <Image
                                            source={icons.arrow_right_italic}
                                            resizeMode="contain"
                                            tintColor={!active ? "#014148" : "#98B2B5"}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View className="flex">
                                    <TouchableOpacity 
                                        className='my-auto'
                                        onPress={() => setDrawerVisible(true)}
                                    >
                                        <Text className="text-blue-500 font-psans">
                                            See more
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View className="mt-2">
                                <TitleComponent />
                            </View>
                        </View>
                        <View className="mt-8">
                            <Text className="text-black-100 text-xl font-pregular font-[700]">
                                Updates
                            </Text>
                            <View className="mt-4 mb-10">
                                <View 
                                    className="
                                        flex-1 
                                        rounded-lg
                                        flex 
                                        py-4 flex-row
                                        border-b
                                        border-border
                                        mb-1
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
                                            width: "61.54%",
                                        }}
                                        className="flex-1 px-3 "
                                    >
                                        <View>
                                            <Text
                                                className="text-lg font-[700] font-pmedium text-header-200"
                                                numberOfLines={1}
                                            >
                                                Deposit
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
                                            width: "23.08%",
                                        }}
                                    >
                                        <View>
                                            <Money 
                                                value={1000}
                                                textStyle="text-right"
                                            />
                                        </View>
                                        <View className="mt-2">
                                            <Text className="text-secondary-100 text-sm font-semibold text-right">
                                                Credited
                                            </Text>
                                        </View>
                                    </View>
                                </View>
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
                                            width: "61.54%",
                                        }}
                                        className="flex-1 px-3 "
                                    >
                                        <View>
                                            <Text
                                                className="text-lg font-[700] font-pmedium text-header-200"
                                                numberOfLines={1}
                                            >
                                                Deposit
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
                                            width: "23.08%",
                                        }}
                                    >
                                        <View>
                                            <Money 
                                                value={1000}
                                                textStyle="text-right"
                                            />
                                        </View>
                                        <View className="mt-2">
                                            <Text className="text-secondary-100 text-sm font-semibold text-right">
                                                Credited
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Drawer header={"Updates"} isVisible={isDrawerVisible} onClose={() => setDrawerVisible(false)}>
                <View>
                    <View className="border border-border flex-row rounded-md w-44">
                        <View className="border-r border-border p-2 text-center justify-center">
                            <Image
                                source={icons.calender}
                                resizeMode="cover"
                            />
                        </View>
                        <View className="p-2 text-center justify-center">
                            <Text className=" text-muted-200 font-pmedium">
                                Select Month
                            </Text>
                        </View>
                    </View>
                    <View className="mt-2 mb-14">
                        <TitleComponent />
                        <TitleComponent />
                        <TitleComponent />
                    </View>
                </View>
            </Drawer>
        </SafeAreaView>
    )
}

export default Active