import { View, Text } from 'react-native'
import React from 'react'
import Card from './Card'

const Media_and_stories = () => {
    
    return (
        <View>
            <View className="mt-16 mx-6">
                <View className="mb-2">
                    <Text className="font-psans text-lg text-black-100">
                        Media and stories
                    </Text>
                </View>
            </View>
            {/* <View 
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    marginBottom: 20,
                }}
                className="px-4"
            >
                {data.map(({title,thumbnail,body},index)=>(
                    <View key={index} className=" px-2 pt-3 pb-4"
                        style={{
                            width: "50%",
                        }}
                    >
                        <Card
                            title={title}
                            thumbnail={thumbnail}
                            body={body}
                        />
                    </View>
                ))}
            </View> */}
        </View>
    )
}

export default Media_and_stories