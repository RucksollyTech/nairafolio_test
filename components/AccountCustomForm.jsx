import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";


const AccountCustomForm = ({
    title,
    value,
    keyboardType,
    placeholder,
    handleChangeText,
    otherStyles,
    darkTheme,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View className={darkTheme === "dark" ? "dark" : ""}>
            <View 
                className={`
                    space-y-2 ${otherStyles}
                    w-full
                    px-4 rounded-2xl 
                    border flex 
                    bg-[#FDFDFD]
                    dark:bg-dark_mode-300
                    flex-1
                    ${
                        isFocused ? "border-primary" : "border-border dark:border-[#3B3C43]"
                    }
                `}
                // style={{ backgroundColor: "#FDFDFD" }}
            >
                <View className="pt-3">
                    <Text
                        className={`
                            text-base 
                            text-left
                            font-medium 
                            ${isFocused? "text-border font-[700]" : "text-muted"}
                        `}
                    >
                        {title}
                    </Text>
                </View>
                <View
                    className={`
                        flex-1
                        h-16 
                    `}
                    
                >
                    <TextInput
                        className="flex-1 bg-[#FDFDFD] dark:bg-dark_mode-300 text-black-100 dark:text-white font-pregular text-base"
                        value={value}
                        placeholder={placeholder}
                        keyboardType={keyboardType ?? "default"}
                        placeholderTextColor="#BBBBBB"
                        onChangeText={handleChangeText}
                        secureTextEntry={title === "Password" && !showPassword}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        // style={{ backgroundColor: "#FDFDFD" }}
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
        </View>
    );
};

export default AccountCustomForm;
