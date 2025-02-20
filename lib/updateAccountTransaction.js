import { createNotification, createTransactions, createUserInvestment, getCurrentUser, getInvestment, getUser, getUserInvestmentData, updateOngoingInvestment, updateUser } from "./appwrite"
import { initiateTransfer, verifyPayment } from "./payStack";
import { useGlobalContext } from '@/context/GlobalProvider';
import useAppwrite from "./useAppwrite";
import { sendPushNotification } from "./performActions";


export const updateCurrentUser = async(setUser) =>{
    try {
        const res = await getCurrentUser();
        setUser(res)
        return res;
    } catch (error) {
        console.error(error)
    }
}

export const makeTransfer = async(data) =>{
    const {amount,recipientCode,user,setUser} = data;
    try {
        await updateUser(user.$id,{wallet_balance: user.wallet_balance - amount});
        await updateCurrentUser(setUser)
        const transfer = await initiateTransfer(recipientCode, amount);
        // transfer.reference
        // {"transfer": {"amount": 10000, "createdAt": "2025-01-27T13:05:03.000Z", "currency": "NGN", "domain": "test", 
        // "failures": null, "id": 747199532, "integration": 872535, "reason": "Payment for services", "recipient": 96157979, 
        // "reference": "hgi1vk8362yz1f2pygfv", "request": 916574832, "source": "balance", "source_details": null, 
        // "status": "otp", "titan_code": null, 
        // "transfer_code": "TRF_jfjlcse1lgjmn78j", "transferred_at": null, "transfersessionid": [], "transfertrials": [], "updatedAt": "2025-01-27T13:05:03.000Z"}}
        if(transfer.status){
            await createTransactions({
                action: "Withdrawal",
                amount:parseFloat(amount),
                type: "Wallet",
                user:user?.$id,
                reason:"Bank",
                reference:transfer.reference
            })
            return transfer
        }
        return {error: "Failed to transfer now"}
    } catch (error) {
        return {error: "Failed to transfer"}
    }
}

export const handleFailedTransactions = async(data) =>{
    // add transaction db here
    const {amount,type,userId,reason}=data;
    await createTransactions({
        action:"Failed",
        amount:parseFloat(amount),
        type,
        user:userId,
        reason
    })
    // Check the status of the transaction from
    // Paystack and be sure it failed

    // Add the amount back to wallet if transaction is not successful
    // const user = await updateCurrentUser();
    // await updateUser(user.$id,{wallet_balance: user.wallet_balance + amount});
    // And add reverse transaction this depend status from paystack
    
}
// await createTransactions({
//     action: "Failed",
//     amount:parseFloat(amount),
//     type,
//     user:userId,
//     reason
// })

export const handlePaymentSuccess = async(reference,investmentId,type,setUser) =>{
    const user = await updateCurrentUser(setUser)
    const {$id:userId} = user
    const verify =await verifyPayment(reference)
    if(verify?.status && user){
        await updateUser(userId,{wallet_balance: user.wallet_balance + (verify?.data?.amount)/100})
        if (investmentId === "Unavailable"){
            await createTransactions({
                action: "Deposit",
                amount: parseFloat((verify?.data?.amount)/100),
                type: type,
                user:userId,
                reason:"Wallet",
                reference
            })
        }else if(investmentId){
            const investmentData = await getInvestment(investmentId)
            const investmentExtract = investmentData[0]
            if(!investmentExtract){
                throw new Error("Investment not found")
            }
            await createUserInvestment(investmentId,(verify?.data?.amount)/100,userId,((verify?.data?.amount)/100)/(investmentExtract?.price_per_unit),investmentExtract?.price_per_unit)
            await createTransactions({
                action: "Deposit",
                amount: parseFloat((verify?.data?.amount)/100),
                type: type || "Transfer",
                user:userId,
                reason:investmentExtract.name,
                reference
            })
        }
    }
    
}

// {"verify": {"data": {"amount": 6000, "authorization": [Object], "channel": "card", "connect": null, "createdAt": "2025-01-27T00:48:46.000Z", "created_at": "2025-01-27T00:48:46.000Z", "currency": "NGN", "customer": [Object], "domain": "test", "fees": 90, "fees_breakdown": null, "fees_split": null, "gateway_response": "Successful", "id": 4625905020, "ip_address": "197.210.71.118", "log": [Object], "message": null, "metadata": [Object], "order_id": null, "paidAt": "2025-01-27T00:48:49.000Z", "paid_at": "2025-01-27T00:48:49.000Z", "plan": null, "plan_object": [Object], "pos_transaction_data": null, "receipt_number": null, "reference": "T577800216079794", "requested_amount": 6000, "source": null, "split": [Object], "status": "success", "subaccount": [Object], "transaction_date": "2025-01-27T00:48:46.000Z"}, "message": "Verification successful", "status": true}}

export const handlePaymentFailure = async(reference,type,setUser) =>{
    const user = await updateCurrentUser(setUser)
    const verify = verifyPayment(reference)
    if(user){
        await createTransactions({
            action: "Deposit",
            amount: parseFloat((verify?.data?.amount)/100),
            type: type || "Transfer",
            user:user?.$id,
            reason:"Failed",
            reference
        })
    }
}


export const handlePaymentSuccessFromSales = async(reference,investmentId,type,setUser) =>{
    const user = await updateCurrentUser(setUser)
    const {$id:userId} = user
    const verify =await verifyPayment(reference)
    const investmentData = await getUserInvestmentData(investmentId)
    const investmentExtract = investmentData[0]

    const sellerUserId = investmentExtract?.user?.$id
    const buyingUser = await getUser(sellerUserId)

    if(!investmentExtract){
        throw new Error("Investment not found")
    }
    if(verify?.status && user){
        await Promise.all(
            [updateOngoingInvestment(
                investmentExtract?.$id,{
                    is_up_for_sell:false,
                    sold:false,
                    pricePlaced:0,
                    user:user.$id
                }
            ),
            updateUser(sellerUserId,{wallet_balance: parseFloat(buyingUser?.wallet_balance + ((verify?.data?.amount)/100))}),
            createTransactions({
                action: "Deposit",
                amount: parseFloat((verify?.data?.amount)/100),
                type: type || "Transfer",
                user:userId,
                reason:investmentExtract?.investment?.name ?? "Transaction",
                reference
            })]
        )
        if(investmentExtract?.user?.expoPushToken){
            await sendPushNotification(investmentExtract?.user?.expoPushToken,`Sales of shares", "Your shares for ${investmentExtract?.name} has been sold`)
            await createNotification(investmentData?.$id,investmentData?.investment?.name,parseFloat(((verify?.data?.amount)/100)),"sales",sellerUserId)
            await createNotification(investmentData?.$id,investmentData?.investment?.name,parseFloat(((verify?.data?.amount)/100)),"purchase",buyingUser?.$id)
        }
    }
}
