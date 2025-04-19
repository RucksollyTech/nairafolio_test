import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For the checkmark icon
import { myClassConverter } from "@/lib/performActions";

const options = [
  { label: "All", value: "all", enabled: true },
  { label: "Ongoing", value: "ongoing", enabled: false },
  { label: "Closed", value: "closed", enabled: false },
];

const CustomDropdown = ({
    parentClassName,
    isOpen,
    selected,
    setSelected,
    setIsOpen,
    darkTheme
}) => {
  

  const selectOption = (option) => {
    // if (option.enabled) {
      setSelected(option.value);
      setIsOpen(false);
    // }
  };

  return (
    <View className={`relative z-10 ${parentClassName} ${darkTheme === "dark" && "dark"}`}>
        {isOpen && (
            <View className={myClassConverter(
                darkTheme,
                `absolute top-0 right-0 w-48 shadow-lg rounded-2xl border pb-3`,
                "bg-dark_mode-300 border-[#0000000D]",
                "bg-white border-gray-200"
            )}>
                <Text className={myClassConverter(
                    darkTheme,
                    `py-3 px-5 border-b font-semibold`,
                    "text-gray-400 border-[#0000000D]",
                    "text-gray-600 border-gray-200"
                )}>Filter by types</Text>
                {options.map((option, index) => (
                    <Pressable 
                        key={index} 
                        onPress={() => selectOption(option)} 
                        // disabled={!option.enabled}
                        className={myClassConverter(
                            darkTheme,
                            `p-3 flex-row 
                            items-center border-b `,
                            "border-[#0000000D] bg-dark_mode-300",
                            "border-gray-200 bg-white"
                        )}
                    >
                        {selected === option.value && <MaterialIcons name="check" size={20} color={darkTheme === "dark" ? "white" : "black"} />}
                        <Text className={`ml-2 ${selected === option.value ? `${darkTheme === "dark" ? "text-[#FFFFFF]" : "text-black"}` : "text-gray-400 "}`}>
                            {option.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        )}
    </View>
  );
};

export default CustomDropdown;
