import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

const SearchInput = ({ initialQuery }) => {
    const pathname = usePathname();
    const [categorySelected, setCategorySelected] = useState("")
    const [query, setQuery] = useState(initialQuery?.query || "");
    const [isFocused, setIsFocused] = useState(false);
    
    return (
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
    );
};

export default SearchInput;
