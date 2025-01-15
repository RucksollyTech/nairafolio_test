import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert, Text } from "react-native";

import { icons } from "../constants";

const SearchInput = ({ initialQuery ,categories}) => {
    const pathname = usePathname();
    const [categorySelected, setCategorySelected] = useState("")
    const [query, setQuery] = useState(initialQuery?.query || "");
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <View>
            <View className={`
                flex flex-row 
                items-center space-x-4 
                w-full h-16 px-4 
                bg-[#FBFBFB] rounded-2xl 
                border
                ${
                    isFocused ? "border-primary" : "border-border"
                }
            `}>
                <TextInput
                    className="text-base mt-0.5 text-black-100 flex-1 font-pregular"
                    value={query}
                    placeholder="Search here"
                    placeholderTextColor="#BBBBBB"
                    onChangeText={(e) => setQuery(e)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <TouchableOpacity
                    onPress={() => {
                        if (query === "")
                            return
                        // if (pathname.startsWith("/search")) router.setParams({ query });
                        // else router.push(`/search/${query}`);
                        if (pathname.startsWith("/search")) {
                            router.setParams({ query: { query, categorySelected} });
                        } else {
                            const queryObj = { query, categorySelected};
                            const queryString = new URLSearchParams(queryObj).toString();
                            router.push(`/search/${queryString}`);
                        }
                    }}
                >
                    <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
                </TouchableOpacity>
            </View>
            {/* Create a different query to get all categories */}
            {categories && (
                <View className="flex flex-row flex-wrap gap-2 mt-3">
                    {categories.map((category, index) => (
                        <View key={index} className={`flex ${index === 0 && "bg-primary"} items-center justify-center border border-border px-3 py-1.5 rounded-lg`}>
                            <Text className={`font-pregular text-base text-muted-100 ${index === 0 && "text-white"}`}>
                                {category}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default SearchInput;
