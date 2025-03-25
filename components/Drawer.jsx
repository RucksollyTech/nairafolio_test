import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { icons } from '../constants';

const { height: screenHeight } = Dimensions.get('window'); 

const Drawer = ({ isVisible, onClose, children, header }) => {
    if (!isVisible) return null;

    return (
        <View className="absolute inset-0 z-50 bg-black/50">
            <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onClose} />
            <View
                style={styles.drawer}
                className="absolute bottom-0 inset-x-0 bg-white rounded-t-[30px]"
            >
                <View 
                    className="
                        p-5 flex-row justify-between items-center border-b border-border dark:border-[#3B3C43]
                    "
                >
                    <Text className="text-lg font-psemibold font-semibold text-header-200 dark:text-white ">
                        {header}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Image 
                            source={icons.cancel}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView className="flex-1 p-4">{children}</ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    drawer: {
        height: screenHeight * 0.92, 
    },
});

export default Drawer;
