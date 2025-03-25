import { View, Text, Image } from "react-native";
import { images } from "../constants";

const EmptyState = ({ title, subtitle ,notIncludeImg}) => {
    return (
        <View className="flex justify-center items-center px-4 h-full flex-1">
            {!notIncludeImg && (
                <Image
                    source={images.empty}
                    resizeMode="contain"
                />
            )}

            <Text 
                className="text-xl font-psans text-muted dark:text-[#FFFFFFB2] mt-5"
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
