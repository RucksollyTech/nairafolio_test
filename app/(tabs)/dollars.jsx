import { OngoingDetailSkeletonLoader } from '@/components/DetailLoader';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getDataDollarInvestment } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { Redirect, router } from 'expo-router';
import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DollarCheck = () => {
    const { user,loading,darkTheme } = useGlobalContext();
    const {data, loading:InvestmentLoader, refetch} = useAppwrite(getDataDollarInvestment)
    
    if(!loading && user && user?.dollarInvestmentId){
        return <Redirect href={`/dollar/${user.dollarInvestmentId}`} />
    }else if(!InvestmentLoader && data?.$collectionId){
        return <Redirect href={`/investment/new/${data.$collectionId}`} />
    }
    
    return (
        <SafeAreaView className={`flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <View className='flex-1 h-full pt-10'>
                <OngoingDetailSkeletonLoader darkTheme={darkTheme} />
            </View>
        </SafeAreaView>
    )
}

export default DollarCheck