import * as SecureStore from 'expo-secure-store';
import { createNINRecord, updateUser } from "./appwrite";
import { updateCurrentUser } from "./updateAccountTransaction";


export const handleVerificationEmailAndNIN= async(data)=>{
    // add verification email and NIN to user db here
    const {email,nin,userId,setUser}=data;
    let newVerifiedUser
    if (email){

        newVerifiedUser = await updateUser(userId,
            {
                is_email_verified: true,
            }
        )
        if(newVerifiedUser && newVerifiedUser.is_nin_verified){
            newVerifiedUser= await updateUser(userId,
                {
                    is_verified: true,
                }
            )
        }
        await updateCurrentUser(setUser)
        return newVerifiedUser
    }else if(nin){
        const newRecord = await createNINRecord(nin,userId)
        if(!newRecord){
            return {"error":true};
        }
        newVerifiedUser = await updateUser(userId,
            {
                is_nin_verified: true,
            }
        )
        if(newVerifiedUser && newVerifiedUser.is_email_verified){
            newVerifiedUser= await updateUser(userId,
                {
                    is_verified: true,
                }
            )
        }
        await updateCurrentUser(setUser)
        return newVerifiedUser
    }
    return {"error":true};
}


export async function savePassword(key, value) {
    await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
}

export async function getPassword(key) {
    return await SecureStore.getItemAsync(key);
}


export async function sendPushNotification(expoPushToken, title, message) {
    const messageBody = {
        to: expoPushToken,
        sound: "default",
        title: title,
        body: message,
    };

    try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(messageBody),
        });

        const data = await response.json();
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}
