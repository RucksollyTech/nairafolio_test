import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '../../constants'
import Money from '../../components/Money'
import { useNavigation } from 'expo-router'

const DataContainer = ({title,date,noBorder})=>(
    <View 
        className={`
            flex-1 
            rounded-lg
            flex 
            py-4 flex-row
            ${!noBorder  && "border-b border-border"}
            
        `}
    >
        <View
            className="h-14 w-14 relative rounded-full items-center justify-center border border-border"
        >
            <Image
                source={icons.download}
                resizeMode="cover"
                tintColor={"#40BF6A"}
            />
            <View className="absolute -right-2 -bottom-1">
                <Image
                    source={icons.transact}
                    resizeMode="cover"
                />
            </View>
        </View>
        <View
            style={{
                width: "64.54%",
            }}
            className="flex-1 pr-3 pl-5 my-auto"
        >
            <View>
                <Text
                    className="text-base font-pmedium text-muted-300"
                >
                    {title}
                </Text>
            </View>
            <View className="pt-2">
                <Text className="text-muted text-sm">
                    {date}
                </Text>
            </View>
        </View>
        <View
            style={{
                width: "20.08%",
            }}
            className="items-center justify-center"
        >
            <Money 
                value={10000}
                textStyle="font-psemibold text-muted-300 text-base text-right"
            />
            <View>
                <Text className="font-psemibold text-xs text-right text-secondary-100 ">
                    Credited
                </Text>
            </View>
        </View>
    </View>
)

const Transactions = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView className="bg-white flex-1 h-full">
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className="flex-1 h-full">
                    <View className="px-5">
                        <TouchableOpacity
                            onPress={()=>navigation.goBack()}
                        >
                            <Image
                                source={icons.arrow_left}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="pt-4 px-5">
                        <Text className="text-black-100 font-psans text-2xl">
                            Transaction history
                        </Text>
                    </View>
                    {/* Phase 1 */}
                    <View>
                        <View className="px-5 py-2 mt-7 bg-[#F5F5F5]">
                            <Text className="text-sm font-pregular text-muted">
                                Today
                            </Text>
                        </View>
                        <View className="flex-1 px-5">
                            <DataContainer 
                                title={"Deposit into Mono - Investment"}
                                date={"Today, 3:34pm"}
                            />
                            <DataContainer 
                                title={"Deposit into Mono - Investment"}
                                date={"Today, 3:34pm"}
                            />
                            <DataContainer noBorder
                                title={"Deposit into Mono - Investment"}
                                date={"Today, 3:34pm"}
                            />
                        </View>
                    </View>
                    {/* Phase 2 */}
                    <View>
                        <View className="px-5 pb-2 bg-[#F5F5F5]">
                            <Text className="text-sm font-pregular text-muted">
                                May 24th, 4:00pm
                            </Text>
                        </View>

                        <View className="flex-1 px-5">
                            <DataContainer 
                                title={"Deposit into Mono - Investment"}
                                date={"Tue May 24th, 3:34pm"}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Transactions