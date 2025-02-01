import React from 'react';
import {View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { icons } from '../constants';


const GeneralDrawer = ({ isVisible, onClose, children,minHeights, noScroll, header, dismissOnClickOutside }) => {
    if (!isVisible) return null;

    return (
        <View className="absolute inset-0 z-50 bg-black/50">
            {dismissOnClickOutside && <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onClose} />}
            <View
                className="absolute bottom-0 inset-x-0 bg-white rounded-t-[30px]"
                style={{ minHeight: minHeights }}
            >
                <View 
                    className="
                        p-5 flex-row justify-between items-center
                    "
                >
                    {header &&(
                        <View>
                            <Text className="text-header-100 pt-2 px-2 font-psemibold text-lg">
                                {header}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity onPress={onClose} className="ml-auto">
                        <Image 
                            source={icons.cancel}
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
