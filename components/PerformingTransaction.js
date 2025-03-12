import { sendPushNotification } from "@/lib/performActions";
import { getCurrentUser, updateUser, createUserInvestment, createTransactions, updateOngoingInvestment, getUser, createNotification, createUserInvestmentOnSell, getUserInvestmentData, getUserInvestmentRequest} from "../lib/appwrite";
import { updateCurrentUser } from "../lib/updateAccountTransaction";
import { calculateProfit } from "./InvestmentCard";
import UTCDate from "./UTCDate";

export const CheckBalance = async () => {
    try {
        const res = await getCurrentUser();
        return {
            wallet: res?.wallet_balance ?? null,
            user: res ?? null,
            dollar_ballance: res?.dollar_ballance ?? null
        };
    } catch (error) {
        console.error(error);
        throw new Error(error)
        // return { error };
    }
};

export const WalletCheckOut = async(investment,value_spent,user)=>{
    const {wallet,dollar_ballance, error} = await CheckBalance()

    if(error){
        return {error};
    }

    if(investment && value_spent && wallet !== null){
        
        if(wallet >= (value_spent * investment?.price_per_unit)){
            try {
                if (investment?.isDollar){
                    const [updatedUser, newUserInvestment,trans] = await Promise.all([
                        updateUser(
                            user.$id,
                            {
                                wallet_balance: parseFloat(wallet - (value_spent * investment?.price_per_unit)),
                                dollar_ballance:parseFloat(dollar_ballance + value_spent)
                            }
                        ),
                        createTransactions({
                            action: "Deposit",
                            amount:parseFloat(value_spent * investment.price_per_unit),
                            type:"Dollar",
                            user:user.$id,
                            reason:investment.name,
                            reference:`${value_spent}`
                        })
                    ]);
                    return {
                        updatedUser,
                        newUserInvestment,
                        wallet
                    }
                }
                const [updatedUser, newUserInvestment,trans] = await Promise.all([
                    updateUser(user.$id,{wallet_balance: parseFloat(wallet - (value_spent * investment?.price_per_unit))}),
                    createUserInvestment(
                        investment?.$id,
                        parseFloat(value_spent * investment?.price_per_unit),
                        user.$id,
                        parseFloat(value_spent),
                        parseFloat(investment?.price_per_unit),
                        investment?.rio,
                        investment?.immediate_start
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

export const WalletCheckOutSales = async(investment,value_spent,user)=>{
    const {wallet,error} = await CheckBalance()
    // value_spent is same as unit purchased
    if(error){
        return {error};
    }

    if(investment && value_spent && wallet !== null){
        const sellerUserId = investment?.user?.$id
        const buyingUser = await getUser(sellerUserId)
        if((wallet >= (value_spent * investment?.price_per_unit)) && buyingUser){
            try {
                if(investment?.investment?.immediate_start){
                    const [updatedUser, newUserInvestment,trans] = await Promise.all([
                        updateUser(user.$id,{wallet_balance: parseFloat(wallet - (value_spent * investment?.price_per_unit))}),
                        updateUser(sellerUserId,{wallet_balance: parseFloat(buyingUser?.wallet_balance + (value_spent * investment?.price_per_unit))}),
                        updateOngoingInvestment(
                            investment?.$id,{
                                is_up_for_sell:false,
                                sold:false,
                                pricePlaced:investment?.pricePlaced,
                                user:user.$id
                            }
                        ),
                        createUserInvestmentOnSell(
                            {
                                date_created: investment?.investment?.date_created,
                                user: sellerUserId,
                                unit:parseFloat(investment?.investment?.unit),
                                initial_rate:parseFloat(investment?.investment?.investment?.price_per_unit),
                                total:parseFloat(investment?.investment?.total),
                                sold:true,
                                pricePlaced:parseFloat(investment?.investment?.pricePlaced),
                                investment: investment?.investment?.investment?.$id,
                                parentInvestmentId:investment?.investment?.$id,
                                rio:investment?.investment?.rio,
                                immediate_start:investment?.investment?.immediate_start
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

                        await createNotification(investment?.investment?.$id,investment?.name,parseFloat(value_spent * investment?.price_per_unit),"sales",sellerUserId)
                        await createNotification(investment?.investment?.$id,investment?.name,parseFloat(value_spent * investment?.price_per_unit),"purchase",buyingUser?.$id)
                    }
                    return {
                        updatedUser,
                        newUserInvestment,
                        wallet
                    }
                }else if(!investment?.investment?.immediate_start){
                    const [updatedUser, notUse,noUse] = await Promise.all([
                        updateUser(user.$id,{wallet_balance: parseFloat(wallet - (value_spent * investment?.price_per_unit))}),
                        updateUser(sellerUserId,{wallet_balance: parseFloat(buyingUser?.wallet_balance + (value_spent * investment?.price_per_unit))}),
                        
                        createTransactions({
                            action: "Deposit",
                            amount:parseFloat(value_spent * investment.price_per_unit),
                            type:"Wallet",
                            user:user.$id,
                            reason:investment.name,
                            reference:"Wallet"
                        })
                    ]);
                    let newUserInvestment={}
                    // Get the user investment else create a new one
                    const hasOngoingInvestment = await getUserInvestmentRequest(investment?.investment?.investment?.$id,user.$id)
                    // on sell: create new one to replace it(what is on sell),
                    // sold: edit it with everything new
                    // else increase the unit

                    if(hasOngoingInvestment){
                        if(hasOngoingInvestment.sold){
                            newUserInvestment = await updateOngoingInvestment(
                                hasOngoingInvestment?.$id,{
                                    date_created: investment?.investment?.date_created,
                                    unit:parseFloat(investment?.investment?.unit),
                                    initial_rate:parseFloat(investment?.investment?.investment?.price_per_unit),
                                    total:parseFloat(investment?.investment?.total),
                                    is_up_for_sell:false,
                                    sold:false,
                                    inactive:false,
                                    pricePlaced:parseFloat(investment?.investment?.pricePlaced),
                                    rio:investment?.investment?.rio,
                                }
                            )
                        }else if(hasOngoingInvestment.is_up_for_sell){
                            const [us_,newUserInvestments] = await Promise.all([
                                createUserInvestmentOnSell(
                                    {
                                        date_created: hasOngoingInvestment.date_created,
                                        user: user?.$id,
                                        unit:parseFloat(hasOngoingInvestment.unit),
                                        initial_rate:parseFloat(hasOngoingInvestment?.investment?.price_per_unit),
                                        total:parseFloat(hasOngoingInvestment?.total),
                                        is_up_for_sell:true,
                                        pricePlaced:parseFloat(hasOngoingInvestment.pricePlaced),
                                        investment: hasOngoingInvestment?.investment?.$id,
                                        parentInvestmentId:hasOngoingInvestment?.$id,
                                        rio:hasOngoingInvestment?.rio,
                                        immediate_start:hasOngoingInvestment?.immediate_start
                                    }
                                ),
                                updateOngoingInvestment(
                                    hasOngoingInvestment?.$id,{
                                        date_created: investment?.investment?.date_created,
                                        unit:parseFloat(investment?.investment?.unit),
                                        initial_rate:parseFloat(investment?.investment?.investment?.price_per_unit),
                                        total:parseFloat(investment?.investment?.total),
                                        is_up_for_sell:false,
                                        sold:false,
                                        inactive:false,
                                        pricePlaced:parseFloat(investment?.investment?.pricePlaced ?? 0),
                                        rio:investment?.investment?.rio,
                                    }
                                )
                            ])
                            newUserInvestment = newUserInvestments
                        }else{
                            newUserInvestment = await updateOngoingInvestment(
                                hasOngoingInvestment?.$id,{
                                    unit:parseFloat(hasOngoingInvestment.unit + investment?.investment?.unit)
                                }
                            )
                        }
                        await updateOngoingInvestment(
                            investment?.investment?.$id,{
                                sold:true,
                            }
                        )
                    }else{
                        // create a new one
                        createUserInvestmentOnSell(
                            {
                                date_created: investment?.investment?.date_created,
                                user: user?.$id,
                                unit:parseFloat(investment?.investment?.unit),
                                initial_rate:parseFloat(investment?.investment?.investment?.price_per_unit),
                                total:parseFloat(investment?.investment?.total),
                                investment: investment?.investment?.investment?.$id,
                                rio:investment?.investment?.rio,
                                immediate_start:investment?.investment?.immediate_start
                            }
                        )
                        await updateOngoingInvestment(
                            investment?.investment?.$id,{
                                sold:true,
                            }
                        )
                    }
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
    try {
        if (unit - putUnit > 0) {
            
            await Promise.all([
                updateOngoingInvestment(investment.$id,{
                    unit: parseFloat(unit - putUnit)
                }),
                createUserInvestmentOnSell(
                    {
                        date_created: investment?.date_created,
                        user: user?.$id,
                        unit:parseFloat(putUnit),
                        initial_rate:parseFloat(investment?.investment?.price_per_unit),
                        total:parseFloat(investment?.total),
                        is_up_for_sell:true,
                        pricePlaced:parseFloat(pricePlaced),
                        investment: investment?.investment?.$id,
                        parentInvestmentId:investment?.$id,
                        rio:investment?.rio,
                        immediate_start:investment?.immediate_start
                    }
                )
            ])
            
            // await createTransactions({
            //     action:"Sell Offer",
            //     amount:parseFloat(putUnit * pricePlaced),
            //     type,
            //     user:user.$id,
            //     reason,
            //     reference:"Sold investment to the market"
            // })
            return {"success":true};
        }else if(unit - putUnit === 0){
            await Promise.all([
                updateOngoingInvestment(investment.$id,{
                    unit: parseFloat(putUnit),
                    inactive:true,
                    pricePlaced:parseFloat(pricePlaced),
                    parentInvestmentId:investment?.$id,
                }),
                createUserInvestmentOnSell(
                    {
                        date_created: investment?.date_created,
                        user: user?.$id,
                        unit:parseFloat(putUnit),
                        initial_rate:parseFloat(investment?.investment?.price_per_unit),
                        total:parseFloat(investment?.total),
                        is_up_for_sell:true,
                        pricePlaced:parseFloat(pricePlaced),
                        investment: investment?.investment?.$id,
                        parentInvestmentId:investment?.$id,
                        rio:investment?.rio,
                        immediate_start:investment?.immediate_start
                    }
                )
            ])
            
            // await createTransactions({
            //     action:"Sell Offer",
            //     amount:parseFloat(putUnit * pricePlaced),
            //     type,
            //     user:user.$id,
            //     reason,
            //     reference:"Sold investment to the market"
            // })
            return {"success":true};
        }
        throw new Error("An error occurred while selling your investment. Please try again later.")
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
        if (unit - putUnit > 0) {
            // Create a new one to keep track of the sold investment
            await Promise.all(
                [
                    updateOngoingInvestment(investment.$id,{
                        unit: parseFloat(unit - putUnit)
                    }),
                    updateUser(user.$id,{wallet_balance: parseFloat(user.wallet_balance + (putUnit * investment?.investment?.price_by_nairafolio))}),
                    createTransactions({
                        action:"Deposit",
                        amount:parseFloat(putUnit * investment?.investment?.price_by_nairafolio),
                        type,
                        user:user.$id,
                        reason,
                        reference:"Sold Investment to Nairafolio"
                    }),
                    createUserInvestmentOnSell(
                        {
                            date_created: investment?.date_created,
                            user: user?.$id,
                            unit:parseFloat(putUnit),
                            initial_rate:parseFloat(investment?.investment?.price_by_nairafolio),
                            total:parseFloat(investment?.total),
                            sold:true,
                            pricePlaced:parseFloat(investment?.investment?.price_by_nairafolio),
                            investment: investment?.investment?.$id,
                            parentInvestmentId:investment?.$id,
                            rio:investment?.rio,
                            immediate_start:investment?.immediate_start
                        }
                    )
                ]
            )
            await updateCurrentUser(setUser)
        }else if(unit - putUnit === 0){
            // Create a new one to keep track of the sold investment
            // Then put the original one to in active
            await Promise.all(
                [
                    updateOngoingInvestment(investment.$id,{
                        unit: parseFloat(putUnit),
                        is_up_for_sell:false,
                        sold:false,
                        inactive:true
                    }),
                    updateUser(user.$id,{wallet_balance: parseFloat(user.wallet_balance + (putUnit * investment?.investment?.price_by_nairafolio))}),
                    createTransactions({
                        action:"Deposit",
                        amount:parseFloat(putUnit * investment?.investment?.price_by_nairafolio),
                        type,
                        user:user.$id,
                        reason,
                        reference:"Sold Investment to Nairafolio"
                    }),
                    createUserInvestmentOnSell(
                        {
                            date_created: investment?.date_created,
                            user: user?.$id,
                            unit:parseFloat(putUnit),
                            initial_rate:parseFloat(investment?.investment?.price_by_nairafolio),
                            total:parseFloat(investment?.total),
                            sold:true,
                            pricePlaced:parseFloat(investment?.investment?.price_by_nairafolio),
                            investment: investment?.investment?.$id,
                            parentInvestmentId:investment?.$id,
                            rio:investment?.rio,
                            immediate_start:investment?.immediate_start
                        }
                    )
                ]
            )
        }
        return {"success":true};
    } catch (error) {
        throw new Error("An error occurred while selling your investment. Please try again later.")
    }
}

export const undoSellInvestment = async(data)=>{
    const {
        unit,
        investment,
        type,
        user,
        reason,
    }=data;
    try {
        const parentInvestments = await getUserInvestmentData(investment?.parentInvestmentId,user?.$id)
        if(parentInvestments && parentInvestments.length > 0) {
            const parentInvestment = parentInvestments[0]
            const performUndoAction = async(unit)=>{
                await Promise.all([
                    updateOngoingInvestment(investment?.parentInvestmentId,{
                        unit: parseFloat(unit),
                        is_up_for_sell:false,
                        sold:false,
                        inactive:false,
                        is_cancelled:false
                    }),
                    updateOngoingInvestment(investment?.$id,{
                        sold:false,
                        inactive:true,
                        is_up_for_sell:false,
                        unit:unit
                    })
                ])
            }
            // what if the parentInvestment is on sell 
            // that is, the user sold the left over after the
            // first sell.

            // on sell: create new one to replace it(what is on sell),
            // sold: edit it with everything new
            // else increase the unit
            if(parentInvestment.sold){
                await Promise.all([
                    performUndoAction(unit),
                    createUserInvestmentOnSell(
                        {
                            date_created: investment.date_created,
                            user: user?.$id,
                            unit:parseFloat(investment.unit),
                            initial_rate:parseFloat(investment?.investment?.price_per_unit),
                            total:parseFloat(investment?.total),
                            is_up_for_sell:false,
                            pricePlaced:parseFloat(investment.pricePlaced),
                            investment: investment?.investment?.$id,
                            parentInvestmentId:investment?.$id,
                            rio:investment?.rio,
                            is_cancelled:true,
                            immediate_start:investment?.immediate_start
                        }
                    )
                ])
            }else if (parentInvestment.is_up_for_sell){
                await Promise.all([
                    createUserInvestmentOnSell(
                        {
                            date_created: parentInvestment.date_created,
                            user: user?.$id,
                            unit:parseFloat(parentInvestment.unit),
                            initial_rate:parseFloat(parentInvestment?.investment?.price_per_unit),
                            total:parseFloat(parentInvestment?.total),
                            is_up_for_sell:true,
                            pricePlaced:parseFloat(parentInvestment.pricePlaced),
                            investment: parentInvestment?.investment?.$id,
                            parentInvestmentId:parentInvestment?.$id,
                            rio:parentInvestment?.rio,
                            immediate_start:parentInvestment?.immediate_start
                        }
                    ),
                    createUserInvestmentOnSell(
                        {
                            date_created: parentInvestment.date_created,
                            user: user?.$id,
                            unit:parseFloat(parentInvestment.unit),
                            initial_rate:parseFloat(parentInvestment?.investment?.price_per_unit),
                            total:parseFloat(parentInvestment?.total),
                            is_up_for_sell:false,
                            pricePlaced:parseFloat(parentInvestment.pricePlaced),
                            investment: parentInvestment?.investment?.$id,
                            parentInvestmentId:parentInvestment?.$id,
                            rio:parentInvestment?.rio,
                            is_cancelled:true,
                            immediate_start:parentInvestment?.immediate_start
                        }
                    ),
                    performUndoAction(unit)
                ])
            }else{
                await Promise.all([
                    performUndoAction(parentInvestment.unit + unit),
                    createUserInvestmentOnSell(
                        {
                            date_created: investment.date_created,
                            user: user?.$id,
                            unit:parseFloat(investment.unit),
                            initial_rate:parseFloat(investment?.investment?.price_per_unit),
                            total:parseFloat(investment?.total),
                            is_up_for_sell:false,
                            pricePlaced:parseFloat(investment.pricePlaced),
                            investment: investment?.investment?.$id,
                            parentInvestmentId:investment?.$id,
                            rio:investment?.rio,
                            is_cancelled:true,
                            immediate_start:investment?.immediate_start
                        }
                    )
                ])
            }
            
            await createTransactions({
                action:"Retract",
                amount:parseFloat(0),
                type,
                user:user.$id,
                reason,
                reference:"Sold investment to the market"
            })
            return {"success":true};
        }
        
    } catch (error) {
        throw new Error("An error occurred while selling your investment. Please try again later.")
    }
}

export const totalProfitsAndInvested = (investment)=>{
    return (investment?.investment?.price_per_unit * investment?.unit)  + calculateProfit({
        percentage:investment?.rio,
        daysGone:UTCDate(investment?.date_created)?.daysGone,
        invested:(investment?.investment?.price_per_unit * investment?.unit) ,
        duration:investment?.investment?.duration_days
    })
}

















// -------------------------------------------
// Old Functions
export const old_sellInvestment = async(data)=>{
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
                percentage:investment?.rio,
                daysGone:UTCDate(investment?.date_created)?.daysGone,
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
export const old_sellInvestmentNairaFolio = async(data)=>{
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
                percentage:investment?.rio,
                daysGone:UTCDate(investment?.date_created)?.daysGone,
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
