import { sendPushNotification } from "@/lib/performActions";
import { getCurrentUser, updateUser, createUserInvestment, createTransactions, updateOngoingInvestment, getUser, createNotification} from "../lib/appwrite";
import { updateCurrentUser } from "../lib/updateAccountTransaction";
import { calculateProfit } from "./InvestmentCard";
import UTCDate from "./UTCDate";

export const CheckBalance = async () => {
    try {
        const res = await getCurrentUser();
        return {
            wallet: res?.wallet_balance ?? null,
            user: res ?? null,
        };
    } catch (error) {
        console.error(error);
        throw new Error(error)
        // return { error };
    }
};

export const WalletCheckOut = async(investment,value_spent,user)=>{
    const {wallet,error} = await CheckBalance()

    if(error){
        return {error};
    }

    if(investment && value_spent && wallet !== null){
        
        if(wallet >= (value_spent * investment?.price_per_unit)){
            try {
                
                const [updatedUser, newUserInvestment,trans] = await Promise.all([
                    updateUser(user.$id,{wallet_balance: parseFloat(wallet - (value_spent * investment?.price_per_unit))}),
                    createUserInvestment(investment.$id,parseFloat(value_spent * investment?.price_per_unit),user.$id,parseFloat(value_spent),parseFloat(investment?.price_per_unit)),
                    createTransactions({
                        action: "Deposit",
                        amount:parseFloat(value_spent * investment.price_per_unit),
                        type:"Wallet",
                        user:user.$id,
                        reason:investment.name,
                        reference:"Wallet"
                    })
                ]);
                return {
                    updatedUser,
                    newUserInvestment,
                    wallet
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            console.log("Insufficient fund")
            return {insufficient_fund:true}
        }
    }else{
        return {error:"Something went wrong"}
    }

}

export const WalletCheckOutSales = async(investment,value_spent,user)=>{
    const {wallet,error} = await CheckBalance()

    if(error){
        return {error};
    }

    if(investment && value_spent && wallet !== null){
        const sellerUserId = investment?.user?.$id
        const buyingUser = await getUser(sellerUserId)
        if((wallet >= (value_spent * investment?.price_per_unit)) && buyingUser){
            try {
                
                const [updatedUser, newUserInvestment,trans] = await Promise.all([
                    updateUser(user.$id,{wallet_balance: parseFloat(wallet - (value_spent * investment?.price_per_unit))}),
                    updateUser(sellerUserId,{wallet_balance: parseFloat(buyingUser?.wallet_balance + (value_spent * investment?.price_per_unit))}),
                    updateOngoingInvestment(
                        investment?.$id,{
                            is_up_for_sell:false,
                            sold:false,
                            pricePlaced:0,
                            user:user.$id
                        }
                    ),
                    createTransactions({
                        action: "Deposit",
                        amount:parseFloat(value_spent * investment.price_per_unit),
                        type:"Wallet",
                        user:user.$id,
                        reason:investment.name,
                        reference:"Wallet"
                    })
                ]);
                if(buyingUser?.expoPushToken){
                    await sendPushNotification(buyingUser?.expoPushToken,`Sales of shares", "Your shares for ${investment?.name} has been sold`)
                    // Add text as message here

                    await createNotification(investment?.$id,investment?.investment?.name,parseFloat(value_spent * investment?.price_per_unit),"sales",sellerUserId)
                    await createNotification(investment?.$id,investment?.investment?.name,parseFloat(value_spent * investment?.price_per_unit),"purchase",buyingUser?.$id)
                }
                return {
                    updatedUser,
                    newUserInvestment,
                    wallet
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            return {insufficient_fund:true}
        }
    }else{
        return {error:"Something went wrong"}
    }

}


export const sellInvestment = async(data)=>{
    const {
        unit,
        putUnit,
        investment,
        pricePlaced,
        type,
        user,
        reason,
        setUser,
    }=data;
    // sendPushNotification Use this to send the notifications here 
    try {
        // check present value before updating
        await updateOngoingInvestment(investment.$id,{
            unit: parseFloat(putUnit),
            is_up_for_sell:true,
            pricePlaced
        })
        if (unit - putUnit > 0) {
            // Update wallet and update transaction (withdrawal and Sells)
            //valueSentToWallet= (totalProfit + amountInvested /totalUnitsBought ) * (unit - putUnit)
            const totalProfitAndInvested = (investment?.investment?.price_per_unit * investment?.unit)  + calculateProfit({
                percentage:investment?.investment?.rio,
                daysGone:UTCDate(investment?.$createdAt)?.daysGone,
                invested:(investment?.investment?.price_per_unit * investment?.unit) ,
                duration:investment?.investment?.duration_days
            })
            const valueSentToWallet = (totalProfitAndInvested/(investment?.unit)) * (unit - putUnit)
            await Promise.all(
                [updateUser(user.$id,{wallet_balance: parseFloat(user.wallet_balance + valueSentToWallet)}),
                createTransactions({
                    action:"Deposit",
                    amount:parseFloat(valueSentToWallet),
                    type,
                    user:user.$id,
                    reason,
                    reference:"Sold investment to the market"
                })]
            )
            await updateCurrentUser(setUser)
            // sendPushNotification()
            // await createNotification(investmentData?.$id,parseFloat(((verify?.data?.amount)/100)),"sales",sellerUserId)
            // await createNotification(investmentData?.$id,parseFloat(((verify?.data?.amount)/100)),"purchase",buyingUser?.$id)
        }
        return {"success":true};
    } catch (error) {
        throw new Error("An error occurred while selling your investment. Please try again later.")
    }
}

export const sellInvestmentNairaFolio = async(data)=>{
    const {
        unit,
        putUnit,
        investment,
        type,
        user,
        reason,
        setUser,
    }=data;
    try {
        await updateOngoingInvestment(investment.$id,{
            unit: parseFloat(putUnit),
            is_up_for_sell:true,
            sold:true
        })

        if (unit - putUnit > 0) {
            const totalProfitAndInvested = (investment?.investment?.price_by_nairafolio * investment?.unit)  + calculateProfit({
                percentage:investment?.investment?.rio,
                daysGone:UTCDate(investment?.$createdAt)?.daysGone,
                invested:(investment?.investment?.price_by_nairafolio * investment?.unit) ,
                duration:investment?.investment?.duration_days
            })
            const valueSentToWallet = (totalProfitAndInvested/(investment?.unit)) * (unit - putUnit)
            await Promise.all(
                [updateUser(user.$id,{wallet_balance: parseFloat(user.wallet_balance + valueSentToWallet)}),
                createTransactions({
                    action:"Deposit",
                    amount:parseFloat(valueSentToWallet),
                    type,
                    user:user.$id,
                    reason,
                    reference:"Sold Investment to Nairafolio"
                })]
            )
            await updateCurrentUser(setUser)
        }
        return {"success":true};
    } catch (error) {
        throw new Error("An error occurred while selling your investment. Please try again later.")
    }
}

export const totalProfitsAndInvested = (investment)=>{
    return (investment?.investment?.price_per_unit * investment?.unit)  + calculateProfit({
        percentage:investment?.investment?.rio,
        daysGone:UTCDate(investment?.$createdAt)?.daysGone,
        invested:(investment?.investment?.price_per_unit * investment?.unit) ,
        duration:investment?.investment?.duration_days
    })
}