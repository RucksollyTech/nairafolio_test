import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const { width } = Dimensions.get('window'); // Get device screen width

const HomeSkeletonLoader = () => {
    return (
        <View style={styles.container}>
            <ContentLoader 
                speed={2}
                width={width} 
                height={400}
                viewBox={`0 0 ${width} 400`}
                backgroundColor="#f5f5f5"
                foregroundColor="#ecebeb"
            >
                <Circle cx="50" cy="50" r="30" />
                <Rect x="100" y="40" rx="5" ry="5" width={width - 150} height="13" />
                <Rect x="100" y="60" rx="5" ry="5" width={width - 150} height="5" />
            </ContentLoader>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default HomeSkeletonLoader;
