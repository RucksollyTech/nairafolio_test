import { UTCDate } from "@/components";
import VerifyNIN from './ninVerification';
import { createRecipient } from './payStack';
import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";
import { checkMatured } from "@/components/InvestmentCard";
import { registerForPushNotificationsAsync } from "@/app/_layout";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.nairafolio.nairafolio",
    projectId: "6782ee210030356b6a95",
    storageId: "6782f37e0013e42e9c1d",
    databaseId: "6782f35d0018fef1ae8c",

    private_infoCollectionId: "6782f703001026ec420c",
    userCollectionId: "6782f79900093bb2969a",
    investmentCollectionId: "6782fc7e000b717966bf",
    user_investmentCollectionId: "6782ff3f0025652a7181",
    imagesCollectionId: "67830cb300190d0c23c4",
    risk_factorCollectionId: "67830e790015a9ba051c",
    faqCollectionId: "67830f1e001b224ac020",
    updatesCollectionId: "67830fdb003db05476ef",
    notificationCollectionId: "678310a90025b949bf23",
    blogCollectionId: "67831271001e9a88a7c2",
    transactionCollectionId: "678e2f94003752d097cf",
    bankCollectionId: "678fdfcb000ab4bfa7cc",
    graphCollectionId: "67d4ccd70034c5d208f1",
    passcodeCollectionId: "67de172a0029ccdd3fba"
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, name, phone,date_of_birth) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(name);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                name: name,
                phone: phone,
                avatar: avatarUrl,
                date_of_birth: UTCDate(date_of_birth).isoDate
            }
        );

        return newUser;
    } catch (error) {
        // throw new Error(error);
        console.error(error);
    }
}

function getEvenlySpacedDates(data, count) {
    if(!data || !count){
        return null
    }
    if (data.length <= count) return data; 
  
    const result = [];
    const step = Math.floor(data.length / count);
  
    for (let i = 0; i < count; i++) {
        result.push(data[i * step] || data[data.length - 1]);
    }
  
    return result;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); 
}

function formatData(data) {
    return {
        labels: data.map(item => formatDate(item.date)),
        data: data.map(item => item.percentage),
    };
}
  

export async function graphData(investmentId) {
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 6);
    
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 29);
    
    const last365Days = new Date();
    last365Days.setDate(today.getDate() - 364);
  
    try {
        const last7DaysData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.graphCollectionId, 
            [
                Query.greaterThan('date', last7Days.toISOString().split("T")[0]), 
                Query.orderAsc('date'),
                Query.equal("investment", investmentId)
            ]
        );
    
        // **Fetch the last 30 days**
        const last30DaysData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.graphCollectionId, 
            [
                Query.greaterThan('date', last30Days.toISOString().split("T")[0]), 
                Query.orderAsc('date'),
                Query.equal("investment", investmentId)
            ]
        );
    
        // **Fetch the last 365 days**
        const last365DaysData = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.graphCollectionId, 
            [
                Query.greaterThan('date', last365Days.toISOString().split("T")[0]), 
                Query.orderAsc('date'),
                Query.equal("investment", investmentId)
            ]
        );
    
        // Process Data for 1 Month & 1 Year
        let processedLast30Days = []
        let processedLast365Days = []
        if (last30DaysData.documents.length >0){
            processedLast30Days = getEvenlySpacedDates(last30DaysData.documents, 7);
        }
        if(last365DaysData.documents.length > 0){
            processedLast365Days = getEvenlySpacedDates(last365DaysData.documents, 7);
        }
    
        return {
            "Last 7 Days": last7DaysData.documents.length > 0 ? formatData(last7DaysData.documents) : null,
            "1 Month": processedLast30Days ? formatData(processedLast30Days) : null,
            "1 Year": processedLast365Days ? formatData(processedLast365Days) : null,
        };
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
  
export async function saveExpoPushToken(token) {
    try{
        const user = await getCurrentUser(); 
        if (!user) return;
        const myTokens = user.expoPushToken?.split(",,,,")
        if (myTokens && myTokens.includes(token)) {
            return;
        }else{
            await updateUser(user.$id, { expoPushToken: user.expoPushToken ? `${user.expoPushToken},,,,${token}` : token});
        }
    }catch(error){
        throw new Error("Could not get devTo")
    }
}


export async function deleteExpoPushToken(token) {
    try {
        const user = await getCurrentUser(); 
        if (!user || !user.expoPushToken) return;
    
        const allTokens = user.expoPushToken.split(",,,,");
    
        if (!allTokens.includes(token)) return;
    
        const filteredTokens = allTokens.filter(t => t !== token);
        await updateUser(user.$id, {
            expoPushToken: filteredTokens.join(",,,,")
        });
    } catch (error) {
        throw new Error("Could not remove DevTo")
    }
}

export async function updateInvestment(investmentId, dataToUpdate) {
    try {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            investmentId,
            dataToUpdate,
        );
    } catch (error) {
        throw new Error(`${error} updateInvestment`);
    }
}

export async function createUserInvestment(
    investmentId, value_investment, 
    userId,unit,initial_rate,rio=1,
    immediate_start=true
) {
    try {
        const getDateNeeded=async(ids)=>{
            const {appwriteDatetime:dateNeeded}=UTCDate()
            const result = await getInvestment(ids)
            if(result && result[0] && !result[0].immediate_start && result[0].date_to_introduction){
                const dateNeeded = UTCDate(result.date_to_introduction).isoDate
                return [dateNeeded,result]
            }
            return [dateNeeded,result]
        }
        const [dateNeeded,result] = await getDateNeeded(investmentId)
        const newUserInvestment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            ID.unique(),
            {
                date_created: dateNeeded,
                user: userId,
                unit:unit,
                pricePlaced: 0.0,
                initial_rate:initial_rate,
                total:value_investment,
                investment: investmentId,
                rio,
                immediate_start
            }
        );
        if(result && result[0]){
            if(result[0].total_investors){
                await updateInvestment(investmentId,{
                    total_investors: parseFloat(result[0].total_investors + 1)
                })
            }else{
                await updateInvestment(investmentId,{
                    total_investors: parseFloat(1)
                })
            }
        }
        return newUserInvestment;
    } catch (error) {
        throw new Error(`${error} createUserInvestment`);
    }
}


export async function createUserInvestmentOnSell(data) {
    try {
        
        const newUserInvestment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            ID.unique(),
            data
        );

        return newUserInvestment;
    } catch (error) {
        throw new Error(`${error} createUserInvestmentOnSell`);
    }
}

export async function createUserPasscode(data) {
    try {
        const newUserPasscode = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.passcodeCollectionId,
            ID.unique(),
            data
        );

        await updateUser(data.user, {hasPasscode:true});

        return newUserPasscode;
    } catch (error) {
        throw new Error(`${error} createUserPasscode`);
    }
}

export async function updateUserPasscode(userId, dataToUpdate,oldPin) {
    try {
        const verify = await verifyUserPasscode(userId,oldPin)
        if(!verify){
            return null;
        }
        const updatedPasscode = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.passcodeCollectionId,
            userId,
            dataToUpdate,
        );

        return updatedPasscode;
    } catch (error) {
        throw new Error(`${error} updateUserPasscode`);
    }
}

export async function verifyUserPasscode(userId,passCode) {
    try {
        const userPasscode = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.passcodeCollectionId,
            [Query.equal("user", userId),Query.equal("passcode", passCode)]
        );
    
        if (!userPasscode){
            return null
        }
    
        return userPasscode.documents[0];
    } catch (error) {
        return null;
    }
}

export async function getNIN(nin) {
    try {
        const currentNIN = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.private_infoCollectionId,
            [Query.equal("nin", `${nin}`)]
        );
        if (currentNIN?.total === 0) {
            return false
        }else{
            return true;
        }
    
        // return currentNIN.documents[0];
    } catch (error) {
        return null;
    }
}
export async function createNINRecord(nin, userId) {
    try {
        // const verification = await VerifyNIN(nin)
        // const user = await getCurrentUser();
        const [verification,user] = await Promise.all([
            VerifyNIN(nin),
            getCurrentUser()
        ])
        // {"verification": {"entity": {"customer": "6bb82c41-e15e-4308-b99d-e9640818eca9", "date_of_birth": "1990-01-01", "first_name": "John", "gender": "M", "last_name": "Adamu", "middle_name": "Doe", "phone_number": "08011111111", "photo": "/9j/4A
        if(!verification || !user){
            return null;
        }
        const [first_name, last_name, other_name] = user.name.split(" ")
        if(verification.entity.first_name !== first_name || 
            verification.entity.last_name !== last_name ||
            verification.entity.date_of_birth !== JSON.stringify((user.date_of_birth).toISOString().split("T")[0])
        ){
            return null;
        }

        const ninRecord = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.private_infoCollectionId,
            ID.unique(),
            {
                nin,
                user: userId,
                first_name:verification.entity.first_name,
                last_name:verification.entity.last_name,
                date_of_birth: verification.entity.date_of_birth
            }
        );
        return ninRecord;
    } catch (error) {
        // throw new Error(error);
    }
}

export async function createNotification(investmentId,message,amount,action, userId) {
    try {
        const notify = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            ID.unique(),
            {
                amount,
                message,
                userInvestment:investmentId,
                action,
                user: userId,
            }
        );
        return notify;
    } catch (error) {
        throw new Error(`${error} createNotification`)
    }
}

export async function updatePassword(newPassword, oldPassword) {
    try {
        // Ensure the user is authenticated
        const user = await account.get();

        // Update password
        const securityUpdate = await account.updatePassword(newPassword, oldPassword);

        return { success: true, message: "Password updated successfully" };
    } catch (error) {
        
        if (error.message.includes("Invalid credentials")) {
            return { success: false, message: "Old password is incorrect. Please try again." };
        }

        throw new Error(error.message);
    }
}


export async function updateUser(userId, dataToUpdate) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            dataToUpdate,
        );

        return updatedUser;
    } catch (error) {
        throw new Error(`${error} updateUser`);
    }
}

export async function updateOngoingInvestment(investmentId, dataToUpdate) {
    try {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            investmentId,
            dataToUpdate,
        );
    } catch (error) {
        throw new Error(`${error} updateOngoingInvestment`);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(`${error} signIn`);
    }
  }

export async function sendPasswordResetEmail(email) {
    try {
        await account.createRecovery(email, "https://appwrite.io/reset-password");
        return { success: true, message: "Check your email for a reset link." };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// export async function confirmPassword(password) {
//     try {
//         const user = await account.get();
//         if (!user) {
//             return { unAuth: true};
//         }

//         const session = await account.createEmailPasswordSession(user.email, password);
        
//         return { success: true, session };
//     } catch (error) {
//         console.log(error);
//         return { success: false, message: error.message };
//     }
// }


export async function confirmPassword(password) {
    try {
        await account.updatePassword(password, password);

        return { success: true };
    } catch (error) {
        return { success: false, message: "Incorrect password. Try again." };
    }
}

// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(`${error} getAccount`);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        return null;
    }
}

export async function getUser(userId) {
    try {
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", userId)]
        );
    
        if (!currentUser) throw Error;
    
        return currentUser.documents[0];
    } catch (error) {
        return null;
    }
}


// Upload File
export async function uploadFile(file) {
    if (!file) return;
    
    const asset = { 
        name: file.fileName ?? `${generateRandomNumber()}.${file.mimeType.split("/")[1]}`,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id);
        return fileUrl;
    } catch (error) {
        throw new Error(`${error} uploadFile`);
    }
}

// Get File Preview
export async function getFilePreview(fileId) {
    let fileUrl;

    try {
        fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            112,
            112,
            "top",
            100
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(`${error} getFilePreview`);
    }
}


export async function updateUserProfile(form) {
    try {
        let image
        if(form.image){
            image = await uploadFile(form.image)
        }
        const newUser = await updateUser(form.userId,
            {
                name: `${form.firstName} ${form.lastName}`,
                phone: form.phoneNumber,
                avatar: image ?? form?.user?.avatar,
            }
        )
        return newUser;
    } catch (error) {
        throw new Error(`${error} updateUserProfile`);
    }
}
  

export const generateRandomNumber = () => {
    return Math.floor(10000 + Math.random() * 90000);
};

async function deleteFilteredDocuments(query) {
    try {
      // Fetch documents matching the query
      const documents = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.bankCollectionId,
        query
      );
  
      if (documents.total === 0) {
        return;
      }
  
      // Delete each matching document
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.bankCollectionId,
          doc.$id
        );
      }
  
    } catch (error) {
      console.error("Error while deleting documents:", error);
    }
  }
  

export async function addBank(form) {
    try {
        const code = await createRecipient(form.account_number, form.bank_code, form.bank_name);
        if(!code) return
        const query = [
            Query.equal("user", form.userId),
            Query.equal("number", form.account_number),
            Query.equal("name", form.bank_name),
            Query.equal("bank_code", form.bank_code)
          ];
        await deleteFilteredDocuments(query);
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.bankCollectionId,
            ID.unique(),
            {
                name: form.bank_name,
                number: form.account_number,
                user: form.userId,
                bank_code: form.bank_code,
                account_name:form.account_name,
                user_code:code || null,
                code:`${generateRandomNumber()}`
            }
        );
        return newPost;
    } catch (error) {
        console.error(error);
        throw new Error(`${error} addBank`);
    }
}
export async function updateVerifiedBank(bankId, dataToUpdate) {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.bankCollectionId,
            bankId,
            dataToUpdate,
        );

        return updatedUser;
    } catch (error) {
        throw new Error(`${error} updateVerifiedBank`);
    }
}
export async function verifyBankCode(bankId,userId,code) {
    try {
        const bankDetail = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.bankCollectionId,
            [Query.equal("user", userId),Query.equal("number", bankId)]
        );
        if (UTCDate(bankDetail?.documents[0]?.$createdAt)?.diffInMinutes > 30){
            return {error: "Bank verification code expired"};
        }
        if (bankDetail?.documents[0]?.code!== code){
            return {error: "Invalid bank verification code"};
        }
        await updateVerifiedBank(bankDetail?.documents[0]?.$id,{is_verified: true});
        return {bankData:bankDetail.documents[0]};
    } catch (error) {
        throw new Error(`${error} verifyBankCode`);
    }
}
export async function getMyBanks(userId) {
    try {
        const myBanks = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.bankCollectionId,
            [Query.equal("user", userId),Query.equal("is_verified", true),Query.orderDesc("$createdAt")]
        );
        return myBanks.documents
    } catch (error) {
        throw new Error(`${error} getMyBank`);
    }
}



export async function deleteMyBanks(bankId) {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.bankCollectionId, 
            bankId
        );
        return {success:true}
    } catch (error) {
        throw new Error(`${error} deleteMyBanks`);
    }
}
export async function createTransactions(data) {
    const {action, amount, type, user, reason,reference} = data;
    try {
        const transaction = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.transactionCollectionId,
            ID.unique(),
            {
                action: action,
                amount:amount,
                type: type,
                user:user,
                reason:reason,
                reference
            }
        );
        return transaction;
    } catch (error) {
        throw new Error(`${error} createTransactions`);
    }
}

// Sign Out
export async function signOut() {
    try {
        try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                await deleteExpoPushToken(token);
            }
        } catch (error) {
            
        }
        
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        // console.log(error);
        // throw new Error(error);
    }
}

// Create Video Post
export async function createVideoPost(form) {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(`${error} createVideoPost`);
    }
}
export async function getAllInvestmentsDollarOnly() {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            [Query.orderDesc("$createdAt"),Query.equal("isDollar", true)]
        );

        return investments.documents;
    } catch (error) {
        throw new Error(`${error} getAllInvestmentsDollarOnly`);
    }
}
// Get all Investments
export async function getAllInvestments() {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            [Query.orderDesc("$createdAt")]
        );

        return investments.documents;
    } catch (error) {
        throw new Error(`${error} getAllInvestments`);
    }
}
export async function getAllInvestmentsFIlterDollar() {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            [Query.orderDesc("$createdAt"),Query.equal("isDollar", false)]
        );

        return investments.documents;
    } catch (error) {
        throw new Error(`${error} getAllInvestmentsFIlterDollar`);
    }
}
export async function getAllInvestmentsDollarToArranged() {
    try {
        const [dollar, otherInvestments] = await Promise.all([
            getAllInvestmentsDollarOnly(),
            getAllInvestmentsFIlterDollar()
        ])
        return [...dollar,...otherInvestments];
    } catch (error) {
        throw new Error(`${error} getAllInvestmentsDollarToArranged`);
    }
}


// Get Investments purchased by user
// export async function getUserInvestments(userId) {
//     try {
//         const investments = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.user_investmentCollectionId,
//             [
//                 Query.equal("user", userId),
//                 Query.equal("is_matured", false),
//                 Query.equal("is_cancelled", false),
//                 Query.equal("inactive", false),
//                 Query.equal("sold", false),
//                 Query.equal("is_up_for_sell", false),
//                 Query.orderDesc("$createdAt")
//             ]
//         );
//         return investments.documents;
//     } catch (error) {
//         throw new Error(error);
//     }
// }
export async function getUserInvestments(userId) {
    // Rearrange the result here
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [
                Query.equal("user", userId),
                Query.equal("is_matured", false),
                Query.equal("is_cancelled", false),
                Query.equal("inactive", false),
                Query.equal("sold", false),
                Query.equal("is_up_for_sell", false),
                Query.orderDesc("$updatedAt")
            ]
        );
        const sortedList = investments.documents.sort((a, b) => {
            return b.investment.isDollar - a.investment.isDollar; 
        });
        return sortedList;
    } catch (error) {
        throw new Error(`${error} getUserInvestments`);
    }
}
export async function getInvestors(investmentId) {
    try {
        const investors = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("investment", investmentId),Query.equal("is_up_for_sell", false),Query.equal("is_cancelled", false),Query.orderDesc("$createdAt")]
        );
        return investors.total;
    } catch (error) {
        throw new Error(`${error} getInvestors`);
    }
}


export async function getInvestmentOfferTotal(investmentId) {
    try {
        const investors = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("investment", investmentId),Query.equal("is_up_for_sell", true),Query.orderDesc("$createdAt")]
        );
        return investors.total;
    } catch (error) {
        throw new Error(`${error} getInvestmentOfferTotal`);
    }
}

export async function getUserInvestmentsForHome(userId) {
    try {
        const notForSell = async()=>{
            const investments = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.user_investmentCollectionId,
                [
                    Query.equal("user", userId),
                    Query.equal("is_matured", false),
                    Query.equal("sold", false),
                    Query.equal("is_up_for_sell", false),
                    Query.equal("inactive", false),
                    Query.limit(3),
                    Query.equal("is_cancelled", false),
                    Query.orderDesc("$updatedAt")
                ]
            );
            return investments.documents;
        }
        const forSell = async()=>{
            const investments = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.user_investmentCollectionId,
                [
                    Query.equal("user", userId),
                    Query.equal("is_matured", false),
                    Query.equal("sold", false),
                    Query.equal("is_up_for_sell", true),
                    Query.limit(3),
                    Query.orderDesc("$updatedAt")
                ]
            );
            return investments.documents;
        }
        const [notForSellData, forSellData] = await Promise.all([notForSell(),forSell()])
        return {notForSellData,forSellData}
    } catch (error) {
        throw new Error(`${error} getUserInvestmentsForHome`);
    }
}

export async function getNotifications(userId) {
    try {
        const Notifications = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.notificationCollectionId,
            [Query.equal("user", userId),Query.orderDesc("$createdAt")]
        );

        return Notifications.documents;
    } catch (error) {
        throw new Error(`${error} getNotifications`);
    }
}

export async function getUserInvestmentsOffers(investmentId) {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("investment", investmentId),Query.equal("is_up_for_sell", true),Query.equal("is_matured", false),Query.equal("sold", false),Query.orderDesc("$createdAt")]
        );
        const filterMatured = investments.documents.filter(
            investment => !checkMatured({
                duration:investment?.investment?.duration_days,
                createdAt:investment?.date_created
            })
        )
        // return investments.documents;
        return filterMatured;
    } catch (error) {
        throw new Error(`${error} getUserInvestmentsOffers`);
    }
}


export async function getInvestmentsOffersAds(investmentId,userId) {
    try {
        
        const [cancelled, sold, upForSell] = await Promise.all([
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.user_investmentCollectionId,
                [
                    Query.equal("investment", investmentId),
                    Query.equal("user", userId),
                    Query.equal("inactive", false),
                    Query.equal("is_matured", false),
                    Query.equal("is_cancelled", true),
                    Query.orderDesc("$createdAt")
                ]
            ),
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.user_investmentCollectionId,
                [
                    Query.equal("investment", investmentId),
                    Query.equal("user", userId),
                    Query.equal("inactive", false),
                    Query.equal("is_matured", false), 
                    Query.equal("sold", true),
                    Query.orderDesc("$createdAt")
                ]
            ),
            databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.user_investmentCollectionId,
                [
                    Query.equal("investment", investmentId),
                    Query.equal("user", userId),
                    Query.equal("inactive", false),
                    Query.equal("is_matured", false), 
                    Query.equal("is_up_for_sell", true),
                    Query.orderDesc("$createdAt")
                ]
            )
        ]);
        const mergedResults = [
            ...cancelled.documents,
            ...sold.documents,
            ...upForSell.documents
        ];
        const uniqueResults = Array.from(new Map(mergedResults.map(doc => [doc.$id, doc])).values());

        uniqueResults.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

        return uniqueResults;
    } catch (error) {
        throw new Error(`${error} getInvestmentsOffersAds`);
    }
}

export async function getUserInvestment(investmentId,userId) {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("$id", investmentId),Query.equal("user", userId),Query.orderDesc("$createdAt")]
        );
        return investment.documents;
    } catch (error) {
        throw new Error(`${error} getUserInvestment`);
    }
}
export async function getUserDataDollar(userId) {
    try {
        const dollar = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.transactionCollectionId,
            [Query.equal("user", userId),Query.equal("type", "Dollar"),Query.orderDesc("$createdAt")]
            // [Query.equal("user", userId),Query.equal("for_dollar", true),Query.orderDesc("$createdAt")]
        );
        return dollar.documents
    } catch (error) {
        throw new Error(`${error} getUserDataDollar`);
    }
}
export async function getUserDataDollarCaller(investmentId,userId) {
    const [transactions,dollarInvestment] = await Promise.all([
        getUserDataDollar(userId),
        getUserInvestment(investmentId,userId)
    ])
    return {transactions,dollarInvestment:dollarInvestment[0]}
}
export async function getUserInvestmentData(investmentId) {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("$id", investmentId),Query.orderDesc("$updatedAt")]
        );
        return investment.documents;
    } catch (error) {
        throw new Error(`${error} getUserInvestmentData`);
    }
}

export async function getUserInvestmentRequest(parentInvestmentId,userId) {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [
                Query.equal("investment", parentInvestmentId),
                Query.equal("user", userId),
                // Query.equal("is_up_for_sell", false),
                // Query.equal("sold", false),
                Query.orderDesc("$createdAt")
            ]
        );
        return investment.documents[0];
    } catch (error) {
        throw new Error(`${error} getUserInvestmentRequest`);
    }
}

export async function getUpdate(updateId) {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.updatesCollectionId,
            [Query.equal("$id", updateId)]
        );

        return investment.documents;
    } catch (error) {
        throw new Error(`${error} getUpdate`);
    }
}

export async function searchInvestmentUpdates(date, date2) {
    try {
        const updates = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.updatesCollectionId,
            [
                Query.greaterThanEqual("date_created", date), 
                Query.lessThanEqual("date_created", date2), 
                Query.orderDesc("$createdAt") 
            ]
        );
        return updates.documents;
    } catch (error) {
        throw new Error(`${error} searchInvestmentUpdates`);
    }
}


export async function getUserTransactions(userId) {
    try {
        const transactions = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.transactionCollectionId,
            [Query.equal("user", userId) ,Query.orderDesc("$createdAt")]
        );
        return transactions.documents;
    } catch (error) {
        throw new Error(`${error} getUserTransactions`);
    }
}
export async function getUserTransactionsWithLimit(userId) {
    try {
        const transactions = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.transactionCollectionId,
            [Query.equal("user", userId), Query.limit(7),Query.orderDesc("$createdAt")]
        );
        return transactions.documents;
    } catch (error) {
        throw new Error(`${error} getUserTransactionsWithLimit`);
    }
}

export async function getInvestment(investmentId) {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            [Query.equal("$id", investmentId),Query.orderDesc("$updatedAt")]
        );

        return investment.documents;
    } catch (error) {
        throw new Error(`${error} getInvestment`);
    }
}

export async function getBlogs() {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.blogCollectionId,
            [Query.orderDesc("$createdAt")]
        );

        return investment.documents;
    } catch (error) {
        throw new Error(`${error} getBlogs`);
    }
}

// Get investments that matches search query
export async function searchInvestments(data) {
    const {query, categorySelected:category,selected} = data;
    let mainReturn = [];
    try {
        const getTheSearch= async(field,queries) =>{
            const investments = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.investmentCollectionId,
                [Query.search(field, queries),Query.orderDesc("$createdAt")]
            );
            if (!investments) return [];
            
            return investments.documents;
        }
        if(query && category){
            const [name, company_name,company_owner] = await Promise.all([
                getTheSearch("name",query),
                getTheSearch("company_name",query),
                getTheSearch("company_owner",query),
            ]);
            if(category !== "All"){
                mainReturn = [...new Set([...name,...company_name,...company_owner])].filter(x=>x.category === category)
            }else{
                mainReturn = [...new Set([...name,...company_name,...company_owner])]
            }
        }else if(query && !category){
            const investments = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.investmentCollectionId,
                [Query.search("name", query),Query.orderDesc("$createdAt")]
            );
            if (!investments) throw new Error("Something went wrong");
            
            mainReturn = investments.documents;
        }else if(!query && category){
            if(category !== "All"){
                const investments = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.investmentCollectionId,
                    [Query.search("category", category),Query.orderDesc("$createdAt")]
                );
                if (!investments) throw new Error("Something went wrong");
                
                mainReturn = investments.documents;
            }else{
                const investments = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.investmentCollectionId,
                    [Query.orderDesc("$createdAt")]
                );
                if (!investments) return [];
                
                mainReturn = investments.documents;
            }
        }else{
            mainReturn = await getAllInvestments()
        }
        
        if(selected === "all"){
            return mainReturn
        }else if(selected === "ongoing"){
            return mainReturn.filter(x=>x.status === true)
        }else if(selected === "closed"){
            return mainReturn.filter(x=>x.status === false)
        }
        return mainReturn
    } catch (error) {
        console.error(error);
    }
}

// Get latest Investments
export async function getLatestInvestments() {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );

        return investments.documents;
    } catch (error) {
        throw new Error(`${error} getLatestInvestments`);
    }
}

export async function getCategories() {
    try {
        const mySet = new Set();
        const response = await getAllInvestments()
        const category = response.map((doc) => doc.category);
        const categories = category.filter(doc =>{
            if (mySet.has(doc)){
                return false;
            }else{
                mySet.add(doc);
                return true;
            }
        })
        return categories;
    } catch (error) {
        throw new Error(`${error} getCategories`);
    }
}
