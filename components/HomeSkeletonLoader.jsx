import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const { width } = Dimensions.get('window'); // Get device screen width

const HomeSkeletonLoader = ({darkTheme}) => {
    return (
        <View 
        // style={styles.container}
            className={`flex-1 justify-center items-center ${darkTheme === "dark" ? "bg-[#1D1E25]" : "bg-white" } `}
        >
            <ContentLoader 
                speed={2}
                width={width} 
                height={400}
                viewBox={`0 0 ${width} 400`}
                backgroundColor={darkTheme === "dark" ? "#F8F8F8" : "#f5f5f5"}
                foregroundColor={darkTheme === "dark" ? "#14151b" : "#ecebeb"}
            >
                <Circle cx="50" cy="50" r="30" />
                <Rect x="100" y="40" rx="5" ry="5" width={width - 150} height="13" />
                <Rect x="100" y="60" rx="5" ry="5" width={width - 150} height="5" />
            </ContentLoader>
        </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
// });

export default HomeSkeletonLoader;
