// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useState } from 'react'
// import GeneralDrawer from './GeneralDrawer'
// import { Image } from 'react-native';
// import { icons } from '@/constants';
// import Money from './Money';
// import CustomButton from './CustomButton';
// import { WalletCheckOut } from './PerformingTransaction';

// const GeneralPaymentComponent = ({
//     title,
//     isDrawerVisible,
//     setIsDrawerVisible,
//     user,
//     redirect
// }) => {
//     const [next, setNext] = useState(false);
//     const [active, setActive] = useState(false);
//     const [activeMode, setActiveMode] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [loadError, setLoadError] = useState(false);
//     const [isInsufficientFund, setIsInsufficientFund] = useState(false);
//     const [modeSet, setModeSet] = useState("")

//     const handleOtherScreen = (num) =>{
//         setActive(num)
//         setActiveMode("Wallet")
//     }
//     const handleWalletPay = async()=>{
//         setLoading(true)
//         setLoadError(false)
//         setIsInsufficientFund(false)

//         const {error,insufficient_fund} = await WalletCheckOut(investment,unit,user)
//         if(error){
//             setLoading(false)
//             setLoadError(true)
//             return
//         }
//         if(insufficient_fund){
//             setLoading(false)
//             setIsInsufficientFund(true)
//             return
//         }
//         // setUser(updatedUser)
//         if(redirect){
//             setTimeout(() => {
//                 setLoading(false)
//                 router.push(redirect)
//             }, 1000);
//         }
//     }
//     const majorSubmitHandler= ()=>{
//         if (active === 1){
//             setModeSet(activeMode)
//             handleWalletPay()
//         }else if (active > 1){
//             setModeSet(activeMode)
//         }
//     }
//     return (
//         <View>
//             <GeneralDrawer
//                 header={title}
//                 isVisible={isDrawerVisible} 
//                 onClose={()=>setIsDrawerVisible(false)}
//             >
//                 <View>
//                     {!next ? (
//                         <>
//                             <View>
//                                 <View className="px-5 border-b border-border">
//                                     <TouchableOpacity 
//                                         activeOpacity={0.9}
//                                         onPress={()=>handleOtherScreen(1)}
//                                         className={`
//                                             flex-1 
//                                             rounded-lg
//                                             flex 
//                                             py-4 flex-row
//                                             mb-5
//                                             border
//                                             ${(active && active === 1) ? "border-secondary-100" : "border-border"}
//                                             bg-[#F8FAFA]
//                                         `}
//                                     >
//                                         <View
//                                             className="h-14 w-14 rounded-full items-center justify-center"
//                                         >
//                                             <Image
//                                                 source={icons.wallet}
//                                                 resizeMode="cover"
//                                             />
//                                         </View>
//                                         <View
//                                             className="w-full flex-1"
//                                             style={{
//                                                 width: "74.54%",
//                                             }}
//                                         >
//                                             <View
//                                                 className="flex-1 px-3 w-full "
//                                             >
//                                                 <View className="my-auto justify-between flex-row">
//                                                     <View>
//                                                         <Text
//                                                             className="text-lg text-header-200 font-psans"
//                                                         >
//                                                             Wallet
//                                                         </Text>
//                                                     </View>
//                                                     <View className="pr-1">
//                                                         <Money 
//                                                             value={user?.wallet_balance || 0}
//                                                             textStyle={"text-secondary-100 text-lg font-[700]"}
//                                                         />
//                                                     </View>
//                                                 </View>
//                                             </View>
//                                         </View>
//                                         <View
//                                             style={{
//                                                 width: "10.08%",
//                                             }}
//                                             className="items-center justify-center flex-row"
//                                         >
//                                             <Image 
//                                                 source={icons.arrow_right_italic}
//                                             />
//                                         </View>
//                                     </TouchableOpacity>
//                                 </View>
//                                 <TouchableOpacity 
//                                     className="my-5 px-5"
//                                     onPress={()=>handleOtherScreen(2)}
//                                 >
//                                     <View 
//                                         className={`
//                                             flex-1 
//                                             rounded-lg
//                                             flex 
//                                             py-4 flex-row
//                                             border
//                                             ${(active && active === 2) ? "border-secondary-100" : "border-border"}
//                                             bg-[#F8FAFA]
//                                         `}
//                                     >
//                                         <View
//                                             className="h-14 w-14 rounded-full items-center justify-center"
//                                         >
//                                             <Image
//                                                 source={icons.bank}
//                                                 resizeMode="cover"
//                                             />
//                                         </View>
//                                         <View
//                                             style={{
//                                                 width: "74.54%",
//                                             }}
//                                             className="flex-1 px-3 "
//                                         >
//                                             <View>
//                                                 <Text
//                                                     className="text-lg text-header-200 font-psans"
//                                                 >
//                                                     Bank transfer
//                                                 </Text>
//                                             </View>
//                                             <View>
//                                                 <Text className="text-muted text-sm">
//                                                     Direct transfer from your bank account
//                                                 </Text>
//                                             </View>
//                                         </View>
//                                         <View
//                                             style={{
//                                                 width: "10.08%",
//                                             }}
//                                             className="items-center justify-center"
//                                         >
//                                             <Image 
//                                                 source={icons.arrow_right_italic}
//                                             />
//                                         </View>
//                                     </View>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity 
//                                     className="px-5"
//                                     onPress={()=>handleOtherScreen(3)}
//                                 >
//                                     <View 
//                                         className={`
//                                             flex-1 
//                                             rounded-lg
//                                             flex 
//                                             py-4 flex-row
//                                             mb-5
//                                             border
//                                             ${(active && active === 3) ? "border-secondary-100" : "border-border"}
//                                             bg-[#F8FAFA]
//                                         `}
//                                     >
//                                         <View
//                                             className="h-14 w-14 rounded-full items-center justify-center"
//                                         >
//                                             <Image
//                                                 source={icons.card}
//                                                 resizeMode="cover"
//                                             />
//                                         </View>
//                                         <View
//                                             style={{
//                                                 width: "74.54%",
//                                             }}
//                                             className="flex-1 px-2 "
//                                         >
//                                             <View>
//                                                 <Text
//                                                     className="text-lg text-header-200 font-psans"
//                                                 >
//                                                     Debit card
//                                                 </Text>
//                                             </View>
//                                             <View>
//                                                 <Text className="text-muted text-sm">
//                                                     Pay using Visa, Mastercard, or others 
//                                                 </Text>
//                                             </View>
//                                         </View>
//                                         <View
//                                             style={{
//                                                 width: "10.08%",
//                                             }}
//                                             className="items-center justify-center"
//                                         >
//                                             <Image 
//                                                 source={icons.arrow_right_italic}
//                                             />
//                                         </View>
//                                     </View>
//                                 </TouchableOpacity>
//                             </View>
//                             {active > 0 && (
//                                 <View className="px-5 pb-7">
//                                     <CustomButton 
//                                         title="Continue"
//                                         textStyles="text-white"
//                                         containerStyles="h-14"
//                                         handlePress={majorSubmitHandler}
//                                         isLoading={loadings}
//                                     />
//                                 </View>
//                             )}
//                         </>
//                     ):(
//                         <View>
//                             {success ? (
//                                 <View>
//                                     <View className="px-2">
//                                         <View className="flex-1 justify-center items-center">
//                                             <Image 
//                                                 source={icons.good}
//                                             />
//                                         </View>
//                                         <View className="mt-5">
//                                             <Text className="text-black-100 font-psans text-2xl text-center">
//                                                 You have just bought {investment?.unit} units of shares from {investment?.investment?.name}.
//                                             </Text>
//                                         </View>
//                                         <CustomButton
//                                             handlePress={handleSuccessSales}
//                                             title={"Continue"}
//                                             textStyles={"font-psans text-white"}
//                                             containerStyles={"mt-5 h-14"}
//                                         />
//                                     </View>
//                                 </View>
//                             ):loadError ? (
//                                 <View className="">
//                                     <View className="px-2">
//                                         <View className="flex-1 justify-center items-center">
//                                             <Image 
//                                                 source={icons.error}
//                                             />
//                                         </View>
//                                         <View className="mt-5">
//                                             <Text className="text-black-100 font-psans text-2xl text-center">
//                                                 An error occurred while trying to buy shares. Please try again later.
//                                             </Text>
//                                         </View>
//                                         <CustomButton
//                                             handlePress={handleFailSales}
//                                             title={"Continue"}
//                                             textStyles={"font-psans text-white"}
//                                             containerStyles={"mt-5 h-14"}
//                                         />
//                                     </View>
//                                 </View>
//                             ) :(
//                                 <View>
//                                     {isInsufficientFund ? (
//                                         <View className="px-2">
//                                             <View className="flex-1 justify-center items-center">
//                                                 <Image 
//                                                     source={icons.error}
//                                                 />
//                                             </View>
//                                             <View className="mt-5">
//                                                 <Text className="text-black-100 font-psans text-2xl text-center">
//                                                     Insufficient funds
//                                                 </Text>
//                                             </View>
//                                             <CustomButton
//                                                 handlePress={handleInsufficientFundClick}
//                                                 title={"Continue"}
//                                                 textStyles={"font-psans text-white"}
//                                                 containerStyles={"mt-5 h-14"}
//                                             />
//                                         </View>
//                                     ):(
//                                         <View className="px-2">
//                                             <View className="flex-1 justify-center items-center">
//                                                 <Image 
//                                                     source={icons.error}
//                                                 />
//                                             </View>
//                                             <View className="mt-5">
//                                                 <Text className="text-black-100 font-psans text-2xl text-center">
//                                                     An error occurred while trying to buy shares. Please try again later.
//                                                 </Text>
//                                             </View>
//                                             <CustomButton
//                                                 handlePress={handleFailSales}
//                                                 title={"Continue"}
//                                                 textStyles={"font-psans text-white"}
//                                                 containerStyles={"mt-5 h-14"}
//                                             />
//                                         </View>
//                                     )}
//                                 </View>
//                             )}
//                         </View>
//                     )}
//                 </View>
//             </GeneralDrawer>
//         </View>
//     )
// }

// export default GeneralPaymentComponent