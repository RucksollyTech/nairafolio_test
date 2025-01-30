import React from 'react';
import {View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { icons } from '../constants';


const SuccessModal = ({ isVisible, onClose, children, header }) => {
    if (!isVisible) return null;

    return (
        <View className="absolute inset-0 z-50 bg-white">
            <View
                className="absolute top-20 inset-x-0 "
            >
                <ScrollView className="flex-1 px-4 pb-7 h-full ">
                    <View className=' justify-center items-center flex-1 h-full'>
                        {children}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default SuccessModal;
