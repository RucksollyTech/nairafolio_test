import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { icons } from '../constants';

const { height: screenHeight } = Dimensions.get('window'); 

const GeneralDrawer = ({ isVisible, onClose, children,heights }) => {
    if (!isVisible) return null;

    return (
        <View className="absolute inset-0 z-50 bg-black/50">
            <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onClose} />
            <View
                className="absolute bottom-0 inset-x-0 bg-white rounded-t-[30px]"
            >
                <View 
                    className="
                        p-5 flex-row justify-between items-center
                    "
                >
                    <TouchableOpacity onPress={onClose} className="ml-auto">
                        <Image 
                            source={icons.cancel}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView className="flex-1 px-4 pb-7">{children}</ScrollView>
            </View>
        </View>
    );
};

export default GeneralDrawer;
