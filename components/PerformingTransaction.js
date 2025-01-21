import { getCurrentUser, updateUser, createUserInvestment} from "../lib/appwrite";

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
            const [updatedUser, newUserInvestment] = await Promise.all([
                updateUser(user.$id,{wallet_balance: wallet - (value_spent * investment?.price_per_unit)}),
                createUserInvestment(investment.$id,value_spent * investment?.price_per_unit,user.$id),
            ]);
            return {
                updatedUser,
                newUserInvestment,
                wallet
            }
        }else{
            return {insufficient_fund:true}
        }
    }else{
        return {error:"Something went wrong"}
    }

}