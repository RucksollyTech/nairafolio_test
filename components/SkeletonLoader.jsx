import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SkeletonLoader = ({ style }) => {
  const shimmerAnimation = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    };
    startShimmer();
  }, [shimmerAnimation]);

  const shimmerTranslateX = shimmerAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-Dimensions.get('window').width, Dimensions.get('window').width],
  });

  return (
    <View style={[styles.skeletonContainer, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: shimmerTranslateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['#e0e0e0', '#f0f0f0', '#e0e0e0']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.linearGradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  linearGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default SkeletonLoader;
