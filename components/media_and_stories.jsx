import { View, Text, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import Card from './Card'
import useAppwrite from '@/lib/useAppwrite'
import { getBlogs } from '@/lib/appwrite'
import { FlatList } from 'react-native'
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2.15 - 20; 
const Media_and_stories = ({setLastActive}) => {
    const { data, loading, refetch } = useAppwrite(getBlogs)
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = async()=>{
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    return (
        <View>
            {data && data.length >0 && (
                <View className="mt-16 mx-6">
                    <View>
                        <Text className="font-psans text-lg text-black-100">
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
                renderItem={({ item:{title,image,body} }) =>(
                    <View 
                        style={{
                            width: cardWidth,
                            marginRight: 10, // Optional: space between cards
                        }}
                    >
                        <Card
                            title={title}
                            thumbnail={image}
                            body={body}
                        />
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            
        </View>
    )
}

export default Media_and_stories