import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For the checkmark icon

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
    setIsOpen
  
}) => {
  

  const selectOption = (option) => {
    // if (option.enabled) {
      setSelected(option.value);
      setIsOpen(false);
    // }
  };

  return (
    <View className={`relative z-10 ${parentClassName}`}>
        {isOpen && (
            <View className="absolute top-0 right-0 w-48 bg-white shadow-lg rounded-2xl border border-gray-200">
                <Text className="text-gray-600 py-3 px-5 border-b border-gray-200 font-semibold">Filter by types</Text>
                {options.map((option, index) => (
                    <Pressable 
                        key={index} 
                        onPress={() => selectOption(option)} 
                        // disabled={!option.enabled}
                        className={`p-3 flex-row items-center border-b border-gray-200 
                            bg-white
                        `}
                    >
                        {selected === option.value && <MaterialIcons name="check" size={20} color="black" />}
                        <Text className={`ml-2 ${selected === option.value ? "text-black" : "text-gray-400"}`}>
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
