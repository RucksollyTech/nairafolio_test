import { View, Text, ScrollView, Image, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomNavigator from '@/components/CustomNavigator'
import { getData, storeData, useGlobalContext } from '@/context/GlobalProvider'
import { useNavigation } from 'expo-router'
import { icons } from '@/constants'

const themes = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const { darkTheme, setLastActive, setDarkTheme } = useGlobalContext();
    const [active, setActive] = useState(3)



    const handleChangeTheme = (theme,defaults=false)=>{
        setActive(defaults ? 3 : theme === "dark" ? 2 : 1)
        const defScreen = async()=>{
            await storeData("NairafolioColorScheme",theme)
            setDarkTheme(theme);
        }
        defScreen()
    }

    useEffect(() => {
        const defScreen = async()=>{
            const screenCol= await getData("NairafolioColorScheme")
            if(!screenCol){
                setActive(3)
                setDarkTheme(colorScheme);
            }else{
                setActive(screenCol === "dark" ? 2 : 1)
            }
        }
        defScreen()

    }, [colorScheme]);

    return (
        <SafeAreaView className={` flex-1 h-full ${darkTheme === "dark" ? "dark bg-dark_mode" : "bg-white"}`}>
            <CustomNavigator navigator={navigation} darkTheme={darkTheme} />
            <ScrollView
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className="bg-white dark:bg-dark_mode flex-1 h-full px-5 pb-10">
                    
                    <View className="pt-4">
                        <Text className="text-black-100 dark:text-white font-psans text-2xl">
                            Theme
                        </Text>
                    </View>
                    <View className='mt-6'>
                        <TouchableOpacity
                            onPress={()=>handleChangeTheme("light")}
                            activeOpacity={0.9}
                        >
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-5 flex-row
                                    mb-5
                                    border
                                    border-border dark:border-[#3B3C43]
                                    bg-[#F8FAFA]
                                    dark:bg-dark_mode-300
                                "
                            >
                                <View
                                    style={{
                                        width: "74.54%",
                                    }}
                                    className="flex-1 px-4 my-auto"
                                >
                                    <View>
                                        <Text
                                            className="text-lg text-[#2A3B59] dark:text-white font-pmedium"
                                        >
                                            Light
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: "10.08%",
                                    }}
                                    className="items-center justify-center pr-4"
                                >
                                    <Image 
                                        source={active === 1 ? icons.good_sm : icons.good_bg}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>handleChangeTheme("dark")}
                            activeOpacity={0.9}
                        >
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    py-5 flex-row
                                    mb-5
                                    border
                                    border-border dark:border-[#3B3C43]
                                    bg-[#F8FAFA]
                                    dark:bg-dark_mode-300
                                "
                            >
                                <View
                                    style={{
                                        width: "74.54%",
                                    }}
                                    className="flex-1 px-4 my-auto"
                                >
                                    <View>
                                        <Text
                                            className="text-lg text-[#2A3B59] dark:text-white font-pmedium"
                                        >
                                            Dark
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: "10.08%",
                                    }}
                                    className="items-center justify-center pr-4"
                                >
                                    <Image 
                                        source={active === 2 ? icons.good_sm : icons.good_bg}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>handleChangeTheme(colorScheme,true)}
                            activeOpacity={0.9}
                        >
                            <View 
                                className="
                                    flex-1 
                                    rounded-lg
                                    flex 
                                    
                                    py-4 flex-row
                                    mb-5
                                    border
                                    border-border dark:border-[#3B3C43]
                                    bg-[#F8FAFA]
                                    dark:bg-dark_mode-300
                                "
                            >
                                <View
                                    style={{
                                        width: "74.54%",
                                    }}
                                    className="flex-1 px-4 my-auto"
                                >
                                    <View>
                                        <Text
                                            className="text-lg text-[#2A3B59] dark:text-white font-pmedium"
                                        >
                                            System Default
                                        </Text>
                                        <View className='mt-2'>
                                            <Text
                                                className="text-sm text-[#2A3B59] dark:text-white font-pmedium"
                                            >
                                                This will use your device default settings
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: "10.08%",
                                    }}
                                    className="items-center justify-center pr-4"
                                >
                                    <Image 
                                        source={active === 3 ? icons.good_sm : icons.good_bg}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default themes