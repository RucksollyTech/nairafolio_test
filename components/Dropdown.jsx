import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { myClassConverter } from '@/lib/performActions';

const Dropdown = ({darkTheme, options, onSelect, initialQuery,setIsOpen }) => {
  const [selectedValue, setSelectedValue] = useState(initialQuery || null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (value) => {
    setSelectedValue(value);
    onSelect(value);
    setShowOptions(false);
  };
    const setShowDoewnd = ()=>{
        setShowOptions(!showOptions)
        setIsOpen(false)
    }
    return (
        <View className={`
            mb-4 mt-2 rounded-2xl 
            w-full relative border 
            ${darkTheme === "dark" ? "dark border-[#0000000D] bg-dark_mode-300" : "border-border bg-white"}
            
        `}>
            <TouchableOpacity
                className="p-4 flex flex-row justify-between"
                onPress={setShowDoewnd}
                activeOpacity={0.9}
            >
                <View className='pl-4'>
                    <Text className={myClassConverter(
                        darkTheme,
                        ``,
                        "text-gray-400",
                        "text-gray-700"
                    )}>
                    {selectedValue || 'Select an option'}
                    </Text>
                </View>
                <View className='pl-4'>
                    <IconSymbol
                        name="chevron.right"
                        size={18}
                        weight="medium"
                        color={darkTheme === "dark" ? "#FFFFFF" :"#171717"}
                        style={{ transform: [{ rotate: showOptions ? '270deg' : '90deg' }] }}
                    />
                </View>
            </TouchableOpacity>

            {/* Dropdown Options (absolute positioning) */}
            {showOptions && (
                <View className={myClassConverter(
                    darkTheme,
                    `absolute top-14 
                    overflow-hidden 
                    left-0 w-full border-t z-20 
                    rounded-2xl `,
                    "border-[#0000000D] bg-dark_mode-300",
                    "border-gray-300 bg-white"
                )}>
                    {options && ["All",...options].map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            className={myClassConverter(
                                darkTheme,
                                `p-4 border-b`,
                                "border-[#0000000D] bg-dark_mode-300",
                                "border-gray-200 bg-white"
                            )}
                            onPress={() => handleSelect(option)}
                        >
                            <Text className={myClassConverter(
                                darkTheme,
                                ``,
                                "text-[#FFFFFF]",
                                "text-gray-700"
                            )}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default Dropdown;

// const styles = StyleSheet.create({
//     dropdownContainer: {
//       elevation: 5, // Android shadow elevation
//       shadowColor: '#000', // iOS shadow
//       shadowOffset: { width: 0, height: 2 }, // iOS shadow
//       shadowOpacity: 0.25, // iOS shadow
//       shadowRadius: 4, // iOS shadow
//     },
//   });
