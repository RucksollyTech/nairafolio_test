import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ToggleButtons = ({ active, toggler }) => {
    return (
        <View className="mt-12 relative border-b border-border flex flex-row justify-between w-full">
            <View className="w-full flex-1">
                <TouchableOpacity 
                    className="items-center justify-center"
                    onPress={() => toggler(true)}
                >
                    <Text 
                        className={`font-sm px-2 pb-3 ${
                            active ? "font-psans text-secondary-100 border-b-2 border-secondary-100" : "text-muted-100"
                        }`}
                    >
                        Active
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="w-full flex-1">
                <TouchableOpacity 
                    className="items-center justify-center"
                    onPress={() => toggler(false)}
                >
                    <Text 
                        className={`font-sm px-2 pb-3 ${
                            !active ? "font-psans text-secondary-100 border-b-2 border-secondary-100" : "text-muted-100"
                        }`}
                    >
                        Matured
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ToggleButtons