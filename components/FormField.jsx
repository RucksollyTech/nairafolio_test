import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <View
                className={`
                    w-full h-16 
                    px-4 rounded-2xl 
                    border flex 
                    flex-row 
                    items-center 
                    bg-[#FDFDFD]
                    ${
                    isFocused ? "border-primary" : "border-border"
                }`}
                style={{ backgroundColor: "#FDFDFD" }}
            >
                <TextInput
                    className="flex-1 bg-[#FDFDFD] text-black-100 font-pregular text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#BBBBBB"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === "Password" && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{ backgroundColor: "#FDFDFD" }}
                    {...props}
                />

                {title === "Password" && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Image
                        source={!showPassword ? icons.eye_thin : icons.eye_close}
                        className="w-6 h-6"
                        resizeMode="contain"
                    />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormField;
