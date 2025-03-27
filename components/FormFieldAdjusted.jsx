import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from "react-native";

import { icons } from "../constants";

const FormFieldAdjusted = ({
  title,
  value,
  keyboardType,
  placeholder,
  handleChangeText,
  otherStyles,
  disAllowTitle,
  isIcon,
  data,
  dataStyle,
  handleDataAction,
  darkTheme,
  ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles} ${darkTheme === "dark" && "dark"}`}>
            {!disAllowTitle && (
                <Text className="px-2 font-pregular text-base text-black-100 dark:text-white">{title}</Text>
            )}
            <View
                className={`
                mt-1.5
                w-full h-16 
                px-4 rounded-2xl 
                border flex 
                flex-row 
                items-center 
                bg-[#FDFDFD]
                dark:bg-[#27282F]
                ${isFocused ? "border-primary" : "border-border dark:border-[#3B3C43]"}
                `}
                style={{ backgroundColor: darkTheme === "dark" ? "#27282F" : "#FDFDFD" }}
            >
                <TextInput
                    className="flex-1 bg-[#FDFDFD] text-black-100 dark:text-white font-pregular text-base"
                    value={value}
                    placeholder={placeholder}
                    keyboardType={keyboardType ?? "default"}
                    placeholderTextColor="#BBBBBB"
                    onChangeText={handleChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{ backgroundColor: darkTheme === "dark" ? "#27282F" : "#FDFDFD" }}
                    {...props}
                />

                {data && (
                    <View>
                        {isIcon ? (
                            <Image
                                source={data}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                        ):(
                            <Text className={dataStyle}>{data}</Text>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

export default FormFieldAdjusted;
