import { View, Text, Image } from "react-native";
import { images } from "../constants";
import { myClassConverter } from "@/lib/performActions";

const EmptyState = ({ title, subtitle ,notIncludeImg, darkTheme}) => {
    return (
        <View className={`flex justify-center items-center px-4 h-full flex-1 ${darkTheme === "dark" && "dark"}`}>
            {!notIncludeImg && (
                <Image
                    source={images.empty}
                    resizeMode="contain"
                />
            )}

            <Text 
                className={myClassConverter(
                    darkTheme,
                    `text-xl font-psans mt-5`,
                    "text-[#FFFFFFB2]",
                    "text-muted"
                )}
            >
                {title}
            </Text>
            {subtitle && (
                <Text 
                    className="text-lg text-center text-muted-100 mt-2"
                >
                    {subtitle}
                </Text>
            )}
        </View>
    );
};

export default EmptyState;
