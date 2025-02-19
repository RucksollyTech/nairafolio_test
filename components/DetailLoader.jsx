import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window'); 

const DetailSkeletonLoader = () => {
    return (
        <View style={styles.container} className={Platform.OS !== 'android' ? "mt-40" : "mt-32"}>
            <ContentLoader 
                speed={2}
                width={width} 
                height={900}
                viewBox={`0 0 ${width} 900`}
                backgroundColor="#f5f5f5"
                foregroundColor="#ecebeb"
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default DetailSkeletonLoader;
