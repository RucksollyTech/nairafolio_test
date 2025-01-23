import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
    loading,
}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-primary rounded-xl min-h-8 flex flex-row justify-center items-center ${containerStyles} ${
                (isLoading || loading) ? "opacity-50" : ""
            }`}
            disabled={isLoading || loading}
        >
            <Text className={`font-pinter font-semibold text-base ${textStyles}`}>
                {title}
            </Text>

            {isLoading && (
                <ActivityIndicator
                    animating={isLoading}
                    color="#fff"
                    size="small"
                    className="ml-2"
                />
            )}
        </TouchableOpacity>
    );
};

export default CustomButton;
