import { View, Text } from 'react-native'
import React from 'react'
import { icons } from '@/constants'
import { Image } from 'react-native'
import { TransactionDisplayText, classNameColorsForTransactions, transactionIconChange } from '@/app/(account)/transactions'
import UTCDate from './UTCDate'
import Money from './Money'

const TransactionCard = ({transactions,transaction,index}) => {
    return (
        
        <View 
            key={transaction?.$id}
            className={`
                flex-1 
                flex
                flex-row
                mb-5
                py-4
                ${transactions.length === index + 1 ? '' : 'border-border dark:border-[#3B3C43] border-b'}
            `}
        >
            
            <View
                className="h-14 w-14 rounded-full items-center justify-center border border-border dark:border-[#3B3C43]"
            >
                <Image
                    source={icons.download}
                    resizeMode="cover"
                    tintColor={transactionIconChange(transaction?.action) ?  "#40BF6A" : "#E33629"}
                    className={!transactionIconChange(transaction?.action) && "rotate-180"}
                />
            </View>
            <View
                style={{
                    width: "61.54%",
                }}
                className="flex-1 px-3 "
            >
                <View>
                    <Text className="text-base font-pmedium text-muted-300" numberOfLines={1}>
                        {TransactionDisplayText(transaction?.action)}
                        <Text
                            className="text-lg font-[700] font-pmedium text-muted"
                            
                        >
                            {transaction?.reason}
                        </Text>
                    </Text>
                </View>
                <View className="pt-2">
                    <Text className="text-muted-100 text-sm">
                        {UTCDate(transaction?.$createdAt)?.myDateFormat || "--"}
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
                        value={transaction?.amount}
                        textStyle="font-psemibold text-muted dark:text-[#FFFFFFB2] text-right text-base"
                    />
                </View>
                <View className="mt-2">
                    <Text
                        className={`font-pmedium ${classNameColorsForTransactions(transaction?.action)} text-right text-sm`}
                    >
                        {transaction?.type}
                        
                        {/* Wallet || Card || Transfer */}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default TransactionCard