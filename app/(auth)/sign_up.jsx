import { View, Text, ImageBackground, Image, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '@/constants'
import { CustomButton, FormField } from '@/components'
import { Link, router } from 'expo-router'

const sign_in = () => {
    // const { setUser, setIsLogged } = useGlobalContext();

    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        password_confirm: "",
        name: "",
        phone: "",
    });

    const submit = async () => {
    //     if (form.username === "" || form.email === "" || form.password === "") {
    //     Alert.alert("Error", "Please fill in all fields");
    //     }

    //     setSubmitting(true);
    //     try {
    //     const result = await createUser(form.email, form.password, form.username);
    //     setUser(result);
    //     setIsLogged(true);

    //     router.replace("/home");
    //     } catch (error) {
    //     Alert.alert("Error", error.message);
    //     } finally {
    //     setSubmitting(false);
    //     }
    };

    return (
        <SafeAreaView className='bg-white flex-1'>
            <ScrollView
                showsVerticalScrollIndicator={false} 
                showsHorizontalScrollIndicator={false}
            >
                <View className='pt-3 pl-2'>
                    <Link href={"/"}>
                        <Image 
                            source={icons.left_arrow}
                            resizeMode='contain'
                        />
                    </Link>
                </View>
                <View className="w-full px-5 flex justify-center h-full"
                    style={{
                        minHeight: Dimensions.get("window").height - 100,
                    }}
                >
                    <View>
                        <View className='mt-5'>
                            <Text className='font-psans text-3xl'>Sign up</Text>
                        </View>
                        <View className='mt-2'>
                            <Text className='
                                text-lg 
                                font-pregular
                                font-semibold 
                                text-muted
                            '>
                                Create an account and start investing.
                            </Text>
                        </View>
                        <View className='w-full'>
                            <View className='pt-8'>
                                <FormField 
                                    title="Name"
                                    value={form.name}
                                    placeholder="Enter full name"
                                    handleChangeText={(e)=>setForm({...form, name: e})}
                                    otherStyles="max-w-[400px] mx-auto"
                                />
                            </View>
                            <View className='pt-4'>
                                <FormField 
                                    title="Email"
                                    value={form.email}
                                    placeholder="Email address"
                                    handleChangeText={(e)=>setForm({...form, email: e})}
                                    otherStyles="max-w-[400px] mx-auto"
                                />
                            </View>
                            <View className='flex flex-row pt-4 gap-3'>
                                <View className='
                                    flex px-4
                                    bg-[#FDFDFD] 
                                    rounded-2xl 
                                    flex-row
                                    border border-border 
                                    focus:border-primary 
                                    items-center'
                                >
                                    <Image 
                                        source={icons.ngLogo}
                                        resizeMode='contain'
                                        className='my-auto'
                                    />
                                    <Text className='text-sm text-muted pl-1'>
                                        +234
                                    </Text>
                                </View>
                                <View className='w-full flex-1'>
                                    <FormField 
                                        title="Phone"
                                        value={form.phone}
                                        placeholder="8160000031"
                                        handleChangeText={(e)=>setForm({...form, phone: e})}
                                        otherStyles="w-full"
                                    />
                                </View>
                            </View>
                            <View className='pt-4'>
                                <FormField 
                                    title="Password"
                                    value={form.password}
                                    placeholder="Password"
                                    handleChangeText={(e)=>setForm({...form, password: e})}
                                    otherStyles="max-w-[400px] mx-auto"
                                />
                            </View>
                            <View className='pt-4'>
                                <FormField 
                                    title="Password"
                                    value={form.password_confirm}
                                    placeholder="Confirm password"
                                    handleChangeText={(e)=>setForm({...form, password_confirm: e})}
                                    otherStyles="max-w-[400px] mx-auto"
                                />
                            </View>
                        </View>
                    </View>
                    <View className='w-full mt-[100px]'>
                        <View className='mb-6'>
                            <CustomButton 
                                title="Sign up"
                                containerStyles="h-[50px] max-w-[400px]"
                                textStyles="text-white"
                                handlePress={()=>router.push("/home")}
                            />
                        </View>
                        <View className='mb-10'>
                            <Text className='text-center text-base font-pregular text-muted'>
                                Already have an account? {" "} 
                                <Link 
                                    href={"/sign_up"}
                                    className='text-[#00A651]'
                                >
                                    Log in
                                </Link>
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default sign_in