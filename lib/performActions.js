import * as SecureStore from 'expo-secure-store';
import { createNINRecord, updateUser } from "./appwrite";
import { updateCurrentUser } from "./updateAccountTransaction";

export const myClassConverter = (mode,data,darkMode, lightMode)=>{
    if(mode === "dark"){
        return `${data} ${darkMode}`
    }
    return `${data} ${lightMode}`
}

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


export async function sendPushNotification(user, title, message,data) {
    const expoPushToken = user.expoPushToken.split(",,,,")
    
    const sendPushNotifications = async(token)=>{
        const messageBody = {
            to: token,
            sound: "default",
            title: title,
            body: message,
            data
        };
    
        try {
            const response = await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    'Accept-encoding': 'gzip, deflate',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(messageBody),
            });
    
            const data = await response.json();
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
    for (let i = 0; i < expoPushToken.length; i++) {
        const element = expoPushToken[i];
        if(element && element!== ""  && element!== undefined  && element!== null){
            await sendPushNotifications(element)
        }
    }
    return;
}
