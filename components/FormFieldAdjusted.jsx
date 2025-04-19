import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from "react-native";

import { icons } from "../constants";
import { myClassConverter } from "@/lib/performActions";

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
                <Text className={myClassConverter(
                    darkTheme,
                    `px-2 font-pregular text-base`,
                    "text-white",
                    "text-black-100"
                )}>{title}</Text>
            )}
            <View
                className={`
                mt-1.5
                w-full h-16 
                px-4 rounded-2xl 
                border flex 
                flex-row 
                items-center 
                ${darkTheme === "dark" ? "bg-[#27282F]" : "bg-[#FDFDFD]"}
                ${isFocused ? "border-primary" : `${darkTheme === "dark" ? "border-[#3B3C43]" : "border-border"}`}
                `}
                style={{ backgroundColor: darkTheme === "dark" ? "#27282F" : "#FDFDFD" }}
            >
                <TextInput
                    className={myClassConverter(
                        darkTheme,
                        `flex-1 font-pregular text-base`,
                        "text-white",
                        "text-black-100"
                    )}
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
