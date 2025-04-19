import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { icons } from '../constants';
import { myClassConverter } from '@/lib/performActions';

const { height: screenHeight } = Dimensions.get('window'); 

const Drawer = ({ isVisible, onClose, children, header, darkTheme }) => {
    if (!isVisible) return null;

    return (
        <View className={`absolute inset-0 z-50 bg-black/50 ${darkTheme === "dark" && "dark"}`}>
            <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onClose} />
            <View
                style={styles.drawer}
                className={myClassConverter(
                    darkTheme,
                    `absolute bottom-0 inset-x-0 rounded-t-[30px]`,
                    "bg-[#1D1E25]",
                    "bg-white"
                )}
            >
                <View 
                    className={myClassConverter(
                        darkTheme,
                        `p-5 flex-row justify-between items-center border-b`,
                        "border-[#3B3C43]",
                        "border-border"
                    )}
                >
                    <Text className={myClassConverter(
                        darkTheme,
                        `text-lg font-psemibold font-semibold`,
                        "text-white",
                        "text-header-200"
                    )}>
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
