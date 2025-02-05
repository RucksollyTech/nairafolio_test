import React, { useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomButton from './CustomButton';
import { images } from '@/constants';
import { Image } from 'react-native';

const { width } = Dimensions.get('window');

export const CustomFlatListCarousel = ({ data, autoPlay = true, interval = 10000,setIsDrawerVisible }) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndex = useRef(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      currentIndex.current =
        currentIndex.current === data.length - 1 ? 0 : currentIndex.current + 1;
      flatListRef.current?.scrollToIndex({ index: currentIndex.current, animated: true });
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, data.length]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item:{amount,title},index }) => (
            <View 
                style={{ width:width - 36, height: 150}}
                className={`
                    mb-5
                    bg-secondary flex-1 
                    justify-center 
                    border-[#00000014] 
                    rounded-lg
                    ${index === 0 ? "mr-2.5 ml-5" : "mr-5 ml-2.5"}
                `}
            >
                <View className="relative flex">
                    <View className="absolute inset-0 z-10 p-5">
                        <View className="flex flex-row justify-between">
                            <View>
                                <View>
                                    <Text className="text-muted text-base">
                                        {title}
                                    </Text>
                                </View>
                                <View className="mt-2">
                                    <Text className={`text-black-100 ${amount.toLocaleString().length > 9 ? "text-xl" : "text-4xl"} font-psans`}>
                                        ₦{amount.toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                            {title !== "Investments" && (
                                <View>
                                    <CustomButton 
                                        title="Top up"
                                        textStyles="text-white"
                                        containerStyles="w-[76px] h-9 text-xs item-end"
                                        handlePress={()=>setIsDrawerVisible(true)}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                    <Image
                        source={images.home_bg_img}
                        className={`h-full ml-auto `}
                        resizeMode='cover'
                    />
                </View>
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Pagination Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        {data.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: 'black',
                margin: 5,
                opacity,
              }}
            />
          );
        })}
      </View>
    </View>
  );
};
