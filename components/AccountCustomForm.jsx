import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
import { myClassConverter } from "@/lib/performActions";


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
                    ${darkTheme === "dark" ? "bg-dark_mode-300" : "bg-[#FDFDFD]"}
                    flex-1
                    ${
                        isFocused ? "border-primary" : `${darkTheme === "dark" ? "border-[#3B3C43]" : "border-border"}`
                    }
                `}
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
                        className={myClassConverter(
                            darkTheme,
                            `flex-1 font-pregular text-base`,
                            "bg-dark_mode-300 text-white",
                            "bg-[#FDFDFD] text-black-100"
                        )}
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
