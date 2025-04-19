import { View, Text, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Card from './Card'
import useAppwrite from '@/lib/useAppwrite'
import { getBlogs } from '@/lib/appwrite'
import { FlatList } from 'react-native'
import { Dimensions } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { myClassConverter } from '@/lib/performActions'

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2.15 - 20; 

export const openLink = async (link) => {
    await WebBrowser.openBrowserAsync(link);
};
const Media_and_stories = ({setLastActive,refreshing,darkTheme}) => {
    const { data, loading, refetch } = useAppwrite(getBlogs)
    const onRefresh = async()=>{
        await refetch()
    }
    useEffect(()=>{
        if(refreshing) {
            refetch()
        }
    },[refreshing])
    return (
        <View className={darkTheme === "dark" && "dark"}>
            {data && data.length >0 && (
                <View className="mt-16 mx-6">
                    <View>
                        <Text className={myClassConverter(
                            darkTheme,
                            `font-psans text-lg`,
                            "text-white",
                            "text-black-100"
                        )}>
                            Media and stories
                        </Text>
                    </View>
                </View>
            )}
            <FlatList 
                onTouchStart={() => setLastActive(Date.now())}
                onScroll={() => setLastActive(Date.now())}
                scrollEventThrottle={16}
                horizontal
                data={data}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{
                    paddingBottom: 24,
                    paddingTop:20,
                    paddingRight: 20,
                    paddingLeft: 20,
                }}
                renderItem={({ item:{title,image,body,link} }) =>(
                    <TouchableOpacity
                       onPress={()=>openLink(link)}
                    >
                        <View 
                            style={{
                                width: cardWidth,
                                marginRight: 10,
                            }}
                        >
                            <Card
                                darkTheme={darkTheme}
                                title={title}
                                thumbnail={image}
                                body={body}
                            />
                        </View>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                
            />
            
        </View>
    )
}

export default Media_and_stories