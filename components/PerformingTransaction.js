import { getCurrentUser, updateUser, createUserInvestment, createTransactions} from "../lib/appwrite";

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
                    await updateUser(user.$id,{wallet_balance: parseFloat(wallet - (value_spent * investment?.price_per_unit))}),
                    await createUserInvestment(investment.$id,parseFloat(value_spent * investment?.price_per_unit),user.$id,parseFloat(value_spent),parseFloat(investment?.price_per_unit)),
                    await createTransactions({
                        action: "Deposit",
                        amount:parseFloat(value_spent * investment.price_per_unit),
                        type:"Wallet",
                        user:user.$id,
                        reason:investment.name,
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