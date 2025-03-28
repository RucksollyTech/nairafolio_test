import { useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert, Text } from "react-native";
import useAppwrite from '../lib/useAppwrite'

import { icons } from "../constants";
import { getCategories } from "@/lib/appwrite";
import { Collapsible } from "./Collapsible";
import Dropdown from "./Dropdown";
import CustomDropdown from "./CustomDropDown";

const SearchInput = ({ initialQuery, refreshing, darkTheme }) => {
    const { data:categories, loading, refetch } = useAppwrite(getCategories)
    const pathname = usePathname();
    const [categorySelected, setCategorySelected] = useState("")
    const [query, setQuery] = useState(initialQuery?.query || "");
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const toggleDropdown = () => setIsOpen(!isOpen);
    
    const handleSelection = (value) => {
        // if(value === "All"){
        //     setCategorySelected("")
        // }else{
            setCategorySelected(value)
        // }
    };
    const handleFocus = () => {
        setIsFocused(true)
        setIsOpen(false)
    }
    useEffect(()=>{
        if (!query && !categorySelected && !selected) {
            return
        };
        const handler = setTimeout(() => {
            if (pathname.startsWith("/search")) {
                router.setParams({ query, categorySelected,selected });
            } else {
                const queryObj = { query, categorySelected,selected };
                const queryString = new URLSearchParams(queryObj).toString();
                router.push(`/search/${queryString}`);
            }
        }, 500);
        return () => clearTimeout(handler);
    },[categorySelected,selected])
    useEffect(() => {
        if (refreshing)refetch()
    }, [refreshing])
    useEffect(()=>{
        refetch()
    },[])

    return (
        <View className={darkTheme === "dark" ? "dark" : ""}>
            <View className={`
                flex-row 
                items-center space-x-4 
                w-full h-16 px-4 
                bg-[#FBFBFB] rounded-2xl 
                dark:bg-dark_mode-300
                relative
                border  
                ${
                    isFocused ? "border-primary" : "border-border dark:border-[#7F7F7F4D]"
                }
            `}>
                <TouchableOpacity
                    onPress={() => {
                        setIsOpen(false)
                        if (!query && !categorySelected && !selected) {
                            return
                        };
                        if (pathname.startsWith("/search")) {
                            router.setParams({ query, categorySelected,selected});
                        } else {
                            const queryObj = { query, categorySelected,selected};
                            const queryString = new URLSearchParams(queryObj).toString();
                            router.push(`/search/${queryString}`);
                        }
                    }}
                >
                    <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
                </TouchableOpacity>
                <TextInput
                    className="text-base mt-0.5 text-black-100 dark:text-white flex-1 font-pregular"
                    value={query}
                    placeholder="Search here"
                    placeholderTextColor="#BBBBBB"
                    onChangeText={(e) => setQuery(e)}
                    onFocus={handleFocus}
                    onBlur={() => setIsFocused(false)}
                />
                <TouchableOpacity
                    onPress={toggleDropdown}
                >
                    <Image 
                        source={icons.filter} 
                        className="w-5 h-5" 
                        resizeMode="contain" 
                        tintColor={darkTheme === "dark" ? "#FFFFFF" : "#141B34"}
                    />
                </TouchableOpacity>
                
                {/* <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
                    {["week", "month", "year"].map((option) => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => setSelectedFilter(option)}
                        style={{
                        padding: 8,
                        margin: 5,
                        backgroundColor: selectedFilter === option ? "#008000" : "#ddd",
                        borderRadius: 5,
                        }}
                    >
                        <Text style={{ color: selectedFilter === option ? "#fff" : "#000" }}>
                        {option.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View> */}
            </View>
            <CustomDropdown 
                isOpen={isOpen}
                selected={selected}
                setSelected={setSelected}
                setIsOpen={setIsOpen}
                darkTheme={darkTheme}
            />
            <View>
                <Dropdown darkTheme={darkTheme} setIsOpen={setIsOpen} options={categories} onSelect={handleSelection} initialQuery={initialQuery?.categorySelected} />
            </View>
        </View>
    );
};

export default SearchInput;
