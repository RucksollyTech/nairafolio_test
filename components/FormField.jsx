import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, TouchableWithoutFeedback, Keyboard } from "react-native";

import { icons } from "../constants";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";

const FormField = ({
  title,
  value,
  keyboardType,
  placeholder,
  handleChangeText,
  tintColor,
  withPassword=true,
  darkTheme,
  otherStyles,
  data,
  ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state
    const [selectedOption, setSelectedOption] = useState(value); // Selected dropdown option

    const handleSelect = (option) => {
        setSelectedOption(option.name);
        setShowDropdown(false); 
        handleChangeText(option);
    };
    return (
        <View className={`space-y-2 ${otherStyles} ${darkTheme === "dark" && "dark"}`}>
            {/* <Text className="font-pregular text-base text-black-100 dark:text-white">{title}</Text> */}
            <View
                className={`
                    w-full h-16 
                    px-4 rounded-2xl 
                    border flex 
                    flex-row 
                    items-center 
                    ${tintColor ?? "bg-[#FDFDFD] dark:bg-[#27282F]"}
                    ${isFocused ? "border-primary" : "border-border dark:border-[#7F7F7F4D]"}
                `}
                // style={{ backgroundColor: "#FDFDFD" }}
            >
                {data ? (
                // Dropdown when `data` is provided
                    <TouchableOpacity 
                        onPress={() => setShowDropdown(!showDropdown)}
                        className="flex-row justify-center items-center dark:bg-[#27282F]"
                    >
                        {darkTheme === "dark" ? (
                            <Image
                                source={icons.bank}
                                resizeMode="contain"
                                tintColor={"#CBF5B8"}
                            />
                        ):(
                            <Image
                                source={icons.bank}
                                resizeMode="contain"
                            />
                        )}
                        <View
                            className="flex-1 pl-2 "  
                            // onPress={() => setShowDropdown(!showDropdown)}
                            style={{ backgroundColor: darkTheme === "dark" ? "#27282F" : "#FDFDFD"}}
                        >
                            <Text 
                                className="text-black-100 dark:text-white font-pregular text-base"
                                numberOfLines={1}
                            >
                                {selectedOption || placeholder}
                            </Text>
                        </View>
                        <Image 
                            source={icons.arrow_collapse}
                            resizeMode="contain"
                            tintColor={darkTheme === "dark" ? "#FFFFFF" : "#000000"}
                            style={{ transform: [{ rotate: showDropdown ? '180deg' : '0deg' }] }}
                        />
                    </TouchableOpacity>
                ) : (
                    // TextInput when no `data` is provided
                    <TextInput
                        className={`
                            flex-1 
                            ${tintColor ?? "bg-[#FDFDFD] dark:bg-[#27282F] text-black-100 dark:text-white"}
                            font-pregular 
                            text-base
                        `}
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
                )}

                {/* Password visibility toggle */}
                {title === "Password" && withPassword && !data && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={!showPassword ? icons.eye_thin : icons.eye_close}
                            className="w-6 h-6"
                            resizeMode="contain"
                            tintColor={darkTheme === "dark" ? "#cfcccc" : "#141B34"}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Dropdown options */}
            {showDropdown && data && (
                <View
                    className="absolute z-10 overflow-y-auto h-[300px] bg-white dark:bg-[#27282F] rounded-lg shadow-lg mt-14 max-h-40"
                    style={{ width: "100%" }}
                >
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                        <TouchableOpacity
                            className="p-4 border-b border-gray-200"
                            onPress={() => handleSelect(item)}
                        >
                            <Text className="text-black-100 dark:text-white font-pregular">{item.name}</Text>
                        </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default FormField;
