import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { icons, images } from '../../../constants'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import Money from '../../../components/Money'
import { Link, router } from 'expo-router'
import Drawer from '../../../components/Drawer'
import TitleComponent from '../../../components/TitleComponent'
import useAppwrite from '../../../lib/useAppwrite'
import { getInvestment, getUserInvestment, searchInvestmentUpdates } from '../../../lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider';
import UTCDate from '../../../components/UTCDate'
import { calculateProfit } from '../../../components/InvestmentCard'
import { convertDaysToReadableFormat } from '../../../components/dayConverter'
import { FlatList } from 'react-native'
import { RefreshControl } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import EmptyState from '../../../components/EmptyState'
import GeneralDrawer from '../../../components/GeneralDrawer'

const Active = () => {
    const {id} = useLocalSearchParams();
    const { user } = useGlobalContext();
    const [investment, setInvestment] = useState({});
    const [updates, setUpdates] = useState({});
     
    const { data:investmentData, loading, refetch } = useAppwrite(()=>getUserInvestment(id,user?.$id))
    const navigation = useNavigation();
    const [active, setActive] = useState(true)

    const [dateValue, setDateValue] = useState(null)
    const [dateValue2, setDateValue2] = useState(null)
    const [showDateSelect, setShowDateSelect] = useState(false);
    const [isDrawerVisible2, setIsDrawerVisible2] = useState(false);
    
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

    const handleClear =()=>{
        setDateValue(null)
        setDateValue2(null)
        setShowDateSelect(false)
    }

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

    const showDatePicker2 = () => {
        setDatePickerVisibility2(true);
    };

    const hideDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };

    const handleConfirm2 = (date) => {
        setDateValue2(date)
        hideDatePicker2();
    };
    
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    const handleMoveToWallet = ()=>{
        // make sure to check for matured investment
    }
    
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = () => {
        if (activeIndex < investment?.investment.updates.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };
    
    useEffect(()=>{
        if((!dateValue || !dateValue2) && investmentData){
            setInvestment(investmentData[0])
        }
        if(investmentData){
            setUpdates(investmentData?.[0]?.investment?.updates)
        }
    },[investmentData,dateValue])
    useEffect(()=>{
        if (dateValue && dateValue2){
            const searchFunc = async()=>{
                const dateSearchValue = await searchInvestmentUpdates(
                    new Date(dateValue).toISOString(),
                    new Date(dateValue2).toISOString()
                )
                if (dateSearchValue){
                    setUpdates(dateSearchValue)
                }
            }
            searchFunc()
        }
    },[dateValue,dateValue2])
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
                                        {investment?.investment?.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <View className="px-5">
                        <View className="pt-10">
                            <Money
                                value={investment?.total + calculateProfit({
                                    percentage:investment?.investment?.rio,
                                    daysGone:UTCDate(investment?.$createdAt)?.daysGone,
                                    invested:investment?.total,
                                    duration:investment?.investment?.duration_days
                                })}
                                textStyle="text-black-100 font-psans text-4xl"
                            />
                        </View>
                        <View className="mt-2 flex-1">
                            <View className="mt-2 flex flex-row flex-1">
                                <Text className="text-muted font-pregular font-[700] text-base">
                                    Invested 
                                </Text>
                                <Money
                                    value={investment?.total}
                                    textStyle="text-muted font-pregular font-[700] text-base"
                                    containerStyle="pl-2"
                                />
                            </View>
                            <View className="mt-2">
                                <Money
                                    value={calculateProfit({
                                        percentage:investment?.investment?.rio,
                                        daysGone:UTCDate(investment?.$createdAt)?.daysGone,
                                        invested:investment?.total,
                                        duration:investment?.investment?.duration_days
                                    })}
                                    textStyle="text-secondary-100 font-pregular text-base font-[700]"
                                />
                            </View>
                            <View className={`flex mt-2 items-center justify-center w-[100px] bg-[#F5F5F5] border border-border px-3 py-1.5 rounded-lg`}>
                                {(investment?.investment?.duration_days-UTCDate(investment?.$createdAt)?.daysGone) >= 0 ? (
                                    <Text className="font-pregular text-base text-muted-100">
                                        {investment?.investment?.duration_days-UTCDate(investment?.$createdAt)?.daysGone} days left
                                    </Text>
                                ) : (
                                    <Text className="font-pregular text-base text-secondary-100">
                                        Matured
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View className="flex-1 flex flex-row gap-4 my-7">
                            <TouchableOpacity
                                onPress={handleMoveToWallet}
                                activeOpacity={0.7}
                                disabled={(investment?.investment?.duration_days-UTCDate(investment?.$createdAt)?.daysGone) >= 0 ?? true}
                                className={`${(investment?.investment?.duration_days-UTCDate(investment?.$createdAt)?.daysGone) >= 0 && "opacity-50" } bg-primary rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
                            >
                                <Text className={`font-pinter font-semibold text-base text-white`}>
                                    Move to wallet
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
                                className={`border border-border-100 bg-[#F5F5F5] rounded-xl h-12 flex w-[48%] flex-row justify-center items-center`}
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
                                            <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">{investment?.investment?.rio ?? 1}% ROI</Text>
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
                                                    value={investment?.investment?.min_investment}
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
                                        <Text className="font-pmedium ml-2 my-auto font-[600] text-base text-muted-200">
                                            {convertDaysToReadableFormat(investment?.investment?.duration_days ?? 0)} returns
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="p-4">
                                <Text className="text-muted text-base">
                                    Overview
                                </Text>
                                <View className="pt-4 border-t border-border mt-4">
                                    <Text className="text-black-300 text-lg font-pregular font-[600]">
                                        {investment?.investment?.introduction ?? ""}
                                    </Text>
                                </View>
                                <View className="mt-4 items-right">
                                    <Link href={`/investment/new/${investment?.investment?.$id}`}>
                                        <Text className="text-blue-500 font-psans">
                                            See more
                                        </Text>
                                    </Link>
                                </View>
                            </View>
                            
                        </View>
                        <View className="mb-8">
                            {updates && updates.length>0 && (
                                <>
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
                                                    onPress={handlePrev}
                                                    className={`
                                                        flex
                                                        justify-center
                                                        items-center
                                                        rounded-full
                                                        h-12
                                                        w-12
                                                        ${activeIndex > 0 ? "bg-[#F3F3F3]" : "bg-[#F9F9F9]"}
                                                    `}
                                                    disabled={activeIndex === 0}
                                                >
                                                    <Image
                                                        source={icons.arrow_left_italic}
                                                        resizeMode="contain"
                                                        tintColor={activeIndex > 0 ? "#014148" : "#98B2B5"}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={handleNext}
                                                    className={`
                                                        flex
                                                        justify-center
                                                        items-center
                                                        rounded-full
                                                        h-12
                                                        w-12
                                                        ${activeIndex < updates.length - 1 ? "bg-[#F3F3F3]" : "bg-[#F9F9F9]"}
                                                    `}
                                                    disabled={activeIndex === updates.length - 1}
                                                >
                                                    <Image
                                                        source={icons.arrow_right_italic}
                                                        resizeMode="contain"
                                                        tintColor={activeIndex < updates.length - 1 ? "#014148" : "#98B2B5"}
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
                                        <View className="mt-2 flex-1">
                                            <FlatList
                                                data={[updates[activeIndex]]}
                                                horizontal
                                                contentContainerStyle={{flex: 1}}
                                                renderItem={({ item }) => (
                                                    <TitleComponent item={item} />
                                                )}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </View>
                                    </View>
                                </>
                            )}
                            {/* <View className="mt-8">
                                <Text className="text-black-100 text-xl font-pregular font-[700]">
                                    Activities
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
                            </View> */}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <Drawer header={"Updates"} isVisible={isDrawerVisible} onClose={() => setDrawerVisible(false)}>
                <View>
                    <TouchableOpacity 
                        onPress={()=>setShowDateSelect(true)}
                        className="border border-border flex-row rounded-md w-44"
                    >
                        <View className="border-r border-border p-2 text-center justify-center">
                            <Image
                                source={icons.calender}
                                resizeMode="cover"
                            />
                        </View>
                        <View className="p-2 text-center justify-center">
                            <Text className=" text-muted-200 font-pmedium">
                                Select date
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {showDateSelect && (
                        <>
                            <View className="flex-row gap-3 border-border mt-3 pt-3 border-t">
                                <TouchableOpacity 
                                    onPress={showDatePicker}
                                    className="border flex-1 border-border flex-row rounded-md w-44"
                                >
                                    <View className="border-r border-border p-2 text-center justify-center">
                                        <Image
                                            source={icons.calender}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View className="p-2 text-center justify-center">
                                        <Text className="text-sm text-muted-200 font-pmedium">
                                            Select start date
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={showDatePicker2}
                                    className="border flex-1 border-border flex-row rounded-md w-44"
                                >
                                    <View className="border-r border-border p-2 text-center justify-center">
                                        <Image
                                            source={icons.calender}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View className="p-2 text-center justify-center">
                                        <Text className="text-sm text-muted-200 font-pmedium">
                                            Select end date
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {(dateValue || dateValue2) && (
                                <View className="flex-1 flex-row gap-2 mt-2">
                                    <View className="flex-1">
                                        <Text className="text-sm font-pmedium text-muted-200">
                                            {dateValue?.toDateString()}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-pmedium text-muted-200">
                                            {dateValue2?.toDateString()}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            <TouchableOpacity
                                onPress={()=>handleClear(null)}
                            >
                                <Text className="mt-5 font-psans text-red-500">
                                    Clear
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <View className="mt-2 mb-14">
                        {updates && updates?.length > 0 && updates?.map(update=>(
                            <TitleComponent item={update} key={update.$id}/>
                        ))}
                    </View>
                    {updates?.length === 0 && (
                        <View className="mt-2">
                            <EmptyState title={"No update found"} subtitle={"No update found for the date selected"} />
                        </View>
                    )}
                </View>
            </Drawer>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisible2}
                mode="date"
                onConfirm={handleConfirm2}
                onCancel={hideDatePicker2}
            />
            <GeneralDrawer
                header={"Sell shares"}
                isVisible={isDrawerVisible2} 
                onClose={() => setIsDrawerVisible2(false)}
            >
                <Text>
                    Hello
                </Text>
            </GeneralDrawer>
        </SafeAreaView>
    )
}

export default Active