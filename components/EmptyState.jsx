import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle }) => {
    return (
        <View className="flex justify-center items-center px-4 h-full flex-1">
            <Image
                source={images.empty}
                resizeMode="contain"
            />

            <Text 
                className="text-xl font-psans text-muted mt-5"
            >
                {title}
            </Text>
            <Text 
                className="text-lg text-center text-muted-100 mt-2"
            >
                {subtitle}
            </Text>

            {/* <CustomButton
                title="Back to Explore"
                handlePress={() => router.push("/home")}
                containerStyles="w-full my-5"
            /> */}
        </View>
    );
};

export default EmptyState;
