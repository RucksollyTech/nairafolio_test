import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window'); 

const DetailSkeletonLoader = ({darkTheme}) => {
    return (
        <View style={styles.container} className={`${darkTheme === "dark" ? "dark bg-[#1D1E25]" : "bg-white"} ${Platform.OS !== 'android' ? "mt-40" : "mt-32"}`}>
            <ContentLoader 
                speed={2}
                width={width} 
                height={900}
                viewBox={`0 0 ${width} 900`}
                backgroundColor={darkTheme === "dark" ? "#404255" : "#f5f5f5"}
                foregroundColor={darkTheme === "dark" ? "#14151b" : "#ecebeb"}
            >
                <Circle cx="50" cy="50" r="30" />
                <Rect x="100" y="40" rx="5" ry="5" width={width - 150} height="13" />
                <Rect x="100" y="60" rx="5" ry="5" width={width - 150} height="13" />
                
                <Rect x="20" y="90" rx="5" ry="5" width={width - 40} height="140" />
                <Rect x="20" y="240" rx="5" ry="5" width={width - 50} height="15" />
                <Rect x="20" y="265" rx="5" ry="5" width={120} height="50" />
                <Rect x="155" y="265" rx="5" ry="5" width={120} height="50" />
                <Rect x="20" y="325" rx="5" ry="5" width={120} height="50" />

                <Rect x="20" y="400" rx="5" ry="5" width={width - 40} height="13" />
                <Rect x="20" y="420" rx="5" ry="5" width={width - 40} height="13" />
            </ContentLoader>
        </View>
    );
};

export const OngoingDetailSkeletonLoader = ({darkTheme}) => {
    return (
        <View style={styles.container} className={`${darkTheme === "dark" ? "bg-[#1D1E25] dark" : "bg-white" } ${Platform.OS !== 'android' ? "mt-10" : "mt-7"}`}>
            <ContentLoader 
                speed={2}
                width={width} 
                height={900}
                viewBox={`0 0 ${width} 900`}
                backgroundColor={darkTheme === "dark" ? "#404255" : "#f5f5f5"}
                foregroundColor={darkTheme === "dark" ? "#14151b" : "#ecebeb"}
            >
                <Rect x="20" y="40" rx="5" ry="5" width={width - 40} height="16" />
                <Rect x="20" y="70" rx="5" ry="5" width={width - 40} height="18" />
                
                <Rect x="20" y="100" rx="5" ry="5" width={width - 180} height="13" />
                <Rect x="20" y="123" rx="5" ry="5" width={width - 180} height="13" />
                <Rect x="20" y="153" rx="5" ry="5" width={width - 40} height="25" />

                <Rect x="20" y="195" rx="5" ry="5" width={width - 80} height="30" />
                <Rect x="20" y="265" rx="5" ry="5" width={120} height="50" />
                <Rect x="155" y="265" rx="5" ry="5" width={120} height="50" />
                <Rect x="20" y="325" rx="5" ry="5" width={120} height="50" />

                <Rect x="20" y="400" rx="5" ry="5" width={width - 40} height="13" />
                <Rect x="20" y="420" rx="5" ry="5" width={width - 40} height="13" />
            </ContentLoader>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DetailSkeletonLoader;
