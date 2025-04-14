import React from 'react';
import {View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { icons } from '../constants';
import { Dimensions } from 'react-native';

const { height: screenHeight } = Dimensions.get('window'); 

const GeneralDrawer = ({ 
    isVisible, onClose, 
    children,minHeights, 
    noScroll, header, 
    dismissOnClickOutside,darkTheme,
    makeFull 
}) => {
    if (!isVisible) return null;

    return (
        <View className={`absolute inset-0 z-50 bg-black/50 ${darkTheme === "dark" ? "dark" : ""}`}>
            {dismissOnClickOutside && <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onClose} />}
            <View
                className="absolute bottom-0 inset-x-0 bg-white dark:bg-[#1D1E25] rounded-t-[30px]"
                style={{ minHeight: makeFull ? screenHeight * 0.92 : minHeights }}
            >
                <View 
                    className="
                        p-5 flex-row justify-between items-center
                    "
                >
                    {header &&(
                        <View>
                            <Text className="text-header-100 dark:text-white pt-2 px-2 font-psemibold text-lg">
                                {header}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity onPress={onClose} className="ml-auto">
                        <Image 
                            source={darkTheme === "dark" ? icons.dark_cancel : icons.cancel}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                {noScroll ? (
                    <View className="flex-1 px-4 pb-7">
                        {children}
                    </View>
                ):(
                    <ScrollView className="flex-1 px-4 pb-7">{children}</ScrollView>
                )}
            </View>
        </View>
    );
};

export default GeneralDrawer;
