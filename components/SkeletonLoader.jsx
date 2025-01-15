import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const { width } = Dimensions.get('window'); // Get device screen width

const SkeletonLoader = () => {
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
        <Rect x="20" y="20" rx="5" ry="5" width={width - 40} height="140" />
        <Rect x="20" y="170" rx="5" ry="5" width={width - 50} height="15" />
        <Rect x="20" y="195" rx="5" ry="5" width={120} height="50" />
        <Rect x="155" y="195" rx="5" ry="5" width={120} height="50" />
        <Rect x="20" y="255" rx="5" ry="5" width={120} height="50" />

        <Circle cx="50" cy="350" r="30" />
        <Rect x="100" y="330" rx="5" ry="5" width={width - 150} height="13" />
        <Rect x="100" y="350" rx="5" ry="5" width={width - 150} height="13" />
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

export default SkeletonLoader;
