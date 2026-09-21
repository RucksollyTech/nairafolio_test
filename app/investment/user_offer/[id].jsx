import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { icons } from '../../../constants';
import { RefreshControl } from 'react-native';
import { getInvestmentsOffersAds, getUserInvestmentsOffers } from '../../../lib/appwrite';
import useAppwrite from '../../../lib/useAppwrite';
import EmptyState from '../../../components/EmptyState';
import HomeSkeletonLoader from '../../../components/HomeSkeletonLoader';
import CustomNavigator from '../../../components/CustomNavigator';
import { useGlobalContext } from '@/context/GlobalProvider';
import { UTCDate } from '@/components';
import CustomModalAlert from '@/components/CustomModalAlert';
import { checkMatured } from '@/components/InvestmentCard';
import { undoSellInvestment } from '@/components/PerformingTransaction';
import { myClassConverter } from '@/lib/performActions';

const UserOffer = () => {
    const insets = useSafeAreaInsets();
    const { setLastActive, user, darkTheme } = useGlobalContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [loadings, setLoadings] = useState(false);
    const [next, setNext] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeSell, setActiveSell] = useState({});
    const [body, setBody] = useState("");
    const [labels, setLabels] = useState("");

    const {id} = useLocalSearchParams();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const { data:offersAds, loading, refetch } = useAppwrite(()=>getInvestmentsOffersAds(id,user.$id))

    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    const colorDent = (typesData)=>{
        const colors = {
            is_cancelled: "bg-[#D82F2F1A] text-[#D82F2F]",
            sold: "bg-[#00A6511A] text-[#00A651]",
            is_up_for_sell: "bg-[#F79E1B1F] text-[#F79E1B]"
        }
        if (typesData.is_cancelled){
            return {color:colors.is_cancelled,label:"Canceled"}
        }else if (typesData.sold){
            return {color:colors.sold,label:"Sold"}
        } else if (typesData.is_up_for_sell){
            return {color:colors.is_up_for_sell,label: "Not sold"}
        }
    }
    const showAlert = (dataRequired) =>{
        setLoadError(false)
        setNext(false)
        setSuccess(false)
        setActiveSell(dataRequired)
        const typeOfAd=colorDent(dataRequired);
        setLabels(typeOfAd.label)
        if(checkMatured({
            duration:dataRequired?.investment?.duration_days,
            createdAt:dataRequired?.date_created
        }) && typeOfAd.label ==="Not sold"){
            setLabels("Matured")
            setBody("Investment is matured.")
            router.push(`/investment/active/${dataRequired.$id}`)
        }else if(typeOfAd.label ==="Canceled"){
            setBody("This ad was canceled")
            setModalVisible(true);
        }else if(typeOfAd.label ==="Sold"){
            setBody("Units have been sold already")
            setModalVisible(true);
        }else if(typeOfAd.label ==="Not sold"){
            setBody("Would you like to cancel this ad?")
            setModalVisible(true);
        }
    }
    
    const handleUndoSell = async(investment) =>{
        
        setLoadError(false)
        setNext(false)
        setSuccess(false)
        try {
            setLoadings(true)

            await undoSellInvestment({
                unit:investment?.unit,
                investment,
                type: "Sales",
                user,
                reason: investment?.investment?.name
            })
            setNext(true)
            setSuccess(true)
        } catch (error) {
            setLoadError(true)
            setSuccess(false)
            setNext(true)
        }finally{
            setLoadings(false)
        }
    } 
    const handleContinue = async() =>{
        setModalVisible(false)
        await onRefresh()
    }
    return (
        <View 
        style={{ 
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right
        }}
        className={`flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
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
                <View className="px-5">
                    <View 
                        className={`
                            pb-3 pt-2 mb-4 flex-row justify-between items-center
                        `}
                    >
                        <View>
                            <View>
                                <Text className={myClassConverter(
                                    darkTheme,
                                    `text-lg font-psemibold font-semibold`,
                                    "text-white",
                                    "text-header-200"
                                )}>
                                    Available offers
                                </Text>
                            </View>
                            <View className='pt-2'>
                                <Text className={myClassConverter(
                                    darkTheme,
                                    ``,
                                    "text-white",
                                    "text-muted-300"
                                )}>
                                    Review investment units available for purchase from existing investors.
                                </Text>
                            </View>
                        </View>
                    </View>
                    {loading && (
                        <View className="pt-1">
                            <HomeSkeletonLoader darkTheme={darkTheme} />
                        </View>
                    )}

                    {((!!offersAds && offersAds.length > 0) || !loading) ? (
                        <View>
                            {!loading &&(
                                <>
                                    {offersAds && offersAds.length > 0 && offersAds.map((sale) =>(
                                        <View 
                                            // activeOpacity={0.9}
                                            className="mb-5"
                                            key={sale.$id}
                                            // onPress={()=>router.push(`/investment/active/${sale.$id}`)}
                                        >
                                            <View
                                                className={myClassConverter(
                                                    darkTheme,
                                                    `rounded-lg
                                                    border`,
                                                    "border-[#3B3C43] bg-[#303540]",
                                                    "border-border bg-[#F8FAFA]"
                                                )}
                                            >
                                                <View 
                                                    className={`
                                                        flex-1 
                                                        flex 
                                                        py-4 flex-row
                                                        px-2
                                                    `}
                                                >
                                                    <View
                                                        className={myClassConverter(
                                                            darkTheme,
                                                            `h-12 w-12 
                                                            rounded-full items-center 
                                                            justify-center`,
                                                            "bg-[#CBF5B84D]",
                                                            "bg-[#DFE7E8]"
                                                        )}
                                                    >
                                                        <Image
                                                            source={icons.tag}
                                                            resizeMode="contain"
                                                            className="
                                                                w-6
                                                                rounded-full
                                                            "
                                                            tintColor={darkTheme === "dark" ? "#CBF5B8" : "#141B34"}
                                                        />
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: "60%",
                                                        }}
                                                        className="flex-1 px-3 justify-center "
                                                    >
                                                        <View>
                                                            <Text
                                                                className={myClassConverter(
                                                                    darkTheme,
                                                                    `text-lg font-psemibold`,
                                                                    "text-[#FFFFFF99]",
                                                                    "text-muted-200"
                                                                )}
                                                            >
                                                                {sale.unit} units
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View
                                                        style={{
                                                            width: "30%",
                                                        }}
                                                        className="items-right justify-center pr-2"
                                                    >
                                                        <View className="w-full items-end">
                                                            <View>
                                                                <Text className={myClassConverter(
                                                                    darkTheme,
                                                                    `font-psans text-sm`,
                                                                    "text-white",
                                                                    "text-header-100"
                                                                )}>
                                                                    ₦{sale?.unit * sale?.pricePlaced}
                                                                </Text>
                                                            </View>
                                                            <View>
                                                                <Text className="text-secondary-100 text-sm">
                                                                    ₦{sale?.pricePlaced}/unit
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View
                                                    className={myClassConverter(
                                                        darkTheme,
                                                        `flex-1 
                                                        border-t flex-row
                                                        py-2
                                                        px-3`,
                                                        "border-[#3B3C43]",
                                                        "border-border"
                                                    )}
                                                >
                                                    {/*  */}
                                                    {sale.investment.duration_days - UTCDate(sale.date_created).daysGone > 0 ? (
                                                        <Text className="text-muted-100 my-auto text-sm font-semibold">
                                                            {sale.investment.duration_days - UTCDate(sale.date_created).daysGone} days left
                                                        </Text>
                                                    ):(
                                                        <Text className="text-muted-100 my-auto text-sm font-semibold">
                                                            Matured
                                                        </Text>
                                                    )}
                                                    <Text className='text-muted-100 px-2 my-auto text-2xl'>
                                                        •
                                                    </Text>
                                                    <Text className='text-secondary-100 my-auto font-semibold text-sm'>
                                                        {sale.investment.rio}% ROI
                                                    </Text>
                                                    <View className='ml-auto'>
                                                        <TouchableOpacity
                                                            onPress={()=>showAlert(sale)}
                                                        >
                                                            <Text 
                                                                className={`${colorDent(sale).color} px-3 py-1.5 rounded-lg text-sm font-psemibold`}
                                                            >
                                                                {colorDent(sale).label}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </>
                            )}
                        </View>
                    
                    ):(
                        <>
                        {!loading && (
                            <View className={`
                                p-10 flex-row justify-between items-center
                            `}>
                                <EmptyState 
                                    darkTheme={darkTheme}
                                    title="No offer available"
                                    subtitle="No offer available for now. Check later."
                                />
                            </View>
                        )}
                        </>
                    )}
                </View>
            </ScrollView>
            <CustomModalAlert
                isVisible={modalVisible}
                cancelOutSide
                onClose={() => setModalVisible(false)}
                body={loading ? "" : body}
                defaultText={(labels === "Canceled" || labels === "Sold") && "Ok"}
                showDefault={(labels === "Canceled" || labels === "Sold") ? true : false}
            >  
                {labels === "Not sold" && 
                    <View className='w-full'>
                        {loadings && (
                            <View className='pb-2'>
                                <Text className='text-white text-center text-sm'>
                                    Please wait...
                                </Text>
                            </View>
                        )}
                        {!loadings && loadError && (
                            <View className='pb-2'>
                                <Text className='text-red-500 text-center text-sm'>
                                    An error occurred. Please try again.
                                </Text>
                            </View>
                        )}
                        {!loadings && success && (
                            <View className='pb-2'>
                                <Text className='text-green-500 text-center text-sm'>
                                    Success!
                                </Text>
                            </View>
                        )}
                        {!loadError && !success ? (
                            <View
                                className='
                                    border-t border-[#4e4e4e] 
                                    w-full flex-row

                                '
                            >
                                <TouchableOpacity 
                                    className='py-3 w-[50%] border-r border-[#4e4e4e]'
                                    onPress={() => setModalVisible(false)}
                                    disabled={loadings}
                                >
                                    <Text className={`font-psemibold text-base text-blue-500 text-center ${loadings && "opacity-40"}`}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className='py-3 w-[50%]'
                                    onPress={() => handleUndoSell(activeSell)}
                                    disabled={loadings}
                                >
                                    <Text className={`font-psemibold text-base text-red-500 text-center ${loadings && "opacity-40"}`}>Proceed</Text>
                                </TouchableOpacity>
                            </View>
                        ):(
                            <View className='border-t border-[#4e4e4e] w-full'>
                                {(loadError || success) && (
                                    <TouchableOpacity 
                                        className=" py-3" 
                                        onPress={handleContinue}
                                        style={{
                                            width: "100%",
                                            alignItems: "center",
                                        }}
                                    >
                                        <View>
                                            <Text className="font-psemibold text-base text-center text-blue-500">
                                                Continue
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                }
            </CustomModalAlert>
        </View>
    )
}

export default UserOffer;