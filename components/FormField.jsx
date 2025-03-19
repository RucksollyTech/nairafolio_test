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
  otherStyles,
  data, // New prop for dropdown options
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state
  const [selectedOption, setSelectedOption] = useState(value); // Selected dropdown option

  const handleSelect = (option) => {
    setSelectedOption(option.name);
    setShowDropdown(false); // Hide dropdown after selection
    handleChangeText(option); // Update the parent component
  };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`space-y-2 ${otherStyles}`}>
            {/* <Text className="font-pregular text-base text-black-100">{title}</Text> */}
            <View
                className={`
                w-full h-16 
                px-4 rounded-2xl 
                border flex 
                flex-row 
                items-center 
                bg-[#FDFDFD]
                ${isFocused ? "border-primary" : "border-border"}
                `}
                style={{ backgroundColor: "#FDFDFD" }}
            >
                {data ? (
                // Dropdown when `data` is provided
                <View className="flex-row justify-center items-center">
                    <Image 
                        source={icons.bank}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        className="flex-1 pl-2"
                        onPress={() => setShowDropdown(!showDropdown)}
                        style={{ backgroundColor: "#FDFDFD" }}
                    >
                        <Text 
                            className="text-black-100 font-pregular text-base"
                            numberOfLines={1}
                        >
                            {selectedOption || placeholder}
                        </Text>
                    </TouchableOpacity>
                    <Image 
                        source={icons.arrow_collapse}
                        resizeMode="contain"
                        style={{ transform: [{ rotate: showDropdown ? '180deg' : '0deg' }] }}
                    />
                </View>
                ) : (
                // TextInput when no `data` is provided
                <TextInput
                    className="flex-1 bg-[#FDFDFD] text-black-100 font-pregular text-base"
                    value={value}
                    placeholder={placeholder}
                    keyboardType={keyboardType ?? "default"}
                    placeholderTextColor="#BBBBBB"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === "Password" && !showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{ backgroundColor: "#FDFDFD" }}
                    {...props}
                />
                )}

                {/* Password visibility toggle */}
                {title === "Password" && !data && (
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Image
                    source={!showPassword ? icons.eye_thin : icons.eye_close}
                    className="w-6 h-6"
                    resizeMode="contain"
                    />
                </TouchableOpacity>
                )}
            </View>

            {/* Dropdown options */}
            {showDropdown && data && (
                <View
                className="absolute z-10 overflow-y-auto h-[300px] bg-white rounded-lg shadow-lg mt-14 max-h-40"
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
                        <Text className="text-black-100 font-pregular">{item.name}</Text>
                    </TouchableOpacity>
                    )}
                />
                </View>
            )}
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default FormField;
