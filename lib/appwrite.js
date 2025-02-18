import { UTCDate } from "@/components";
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
export async function createUser(email, password, name, phone) {
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
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

export async function saveExpoPushToken(token) {
    const user = await account.get(); // Get current user

    await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id,  
        { expoPushToken: token }
    );
}
export async function createUserInvestment(investmentId, value_investment, userId,unit,initial_rate) {
    try {
        const {appwriteDatetime}=UTCDate()
        const newUserInvestment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            ID.unique(),
            {
                date_created: appwriteDatetime,
                user: userId,
                unit:unit,
                initial_rate:initial_rate,
                total:value_investment,
                investment: investmentId,
            }
        );

        return newUserInvestment;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createNINRecord(nin, userId) {
    try {
        const ninRecord = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.private_infoCollectionId,
            ID.unique(),
            {
                nin,
                user: userId,
            }
        );
        return ninRecord;
    } catch (error) {
        throw new Error(error);
    }
}

export async function createNotification(investmentId,message,amount,action, userId) {
    try {
        const ninRecord = await databases.createDocument(
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
        return ninRecord;
    } catch (error) {
        throw new Error(error);
    }
}

export async function updatePassword(newPassword, oldPassword) {
    try {
        // Ensure the user is authenticated
        const user = await account.get();

        // Update password
        const securityUpdate = await account.updatePassword(newPassword, oldPassword);
        console.log({ securityUpdate });

        return { success: true, message: "Password updated successfully" };
    } catch (error) {
        console.log("Password update error:", error);
        
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
        throw new Error(error);
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
        console.log(error)
        throw new Error(error);
    }
}

// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
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
        throw new Error(error);
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
        console.log(error);
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
        console.log(error,"Error o3")
        
        throw new Error(error);
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
        console.log(error,"Error o2")
        

        throw new Error(error);
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
        console.log(newUser)
        return newUser;
    } catch (error) {
        console.log(error,"Error on1")

        throw new Error(error);
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
        console.log("No documents found matching the criteria.");
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
        throw new Error(error);
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
        throw new Error(error);
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
        throw new Error(error);
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
        throw new Error(error);
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
        throw new Error(error);
    }
}
export async function createTransactions(data) {
    const {action, amount, type, user, reason} = data;
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
                reason:reason
            }
        );
        return transaction;
    } catch (error) {
        throw new Error(error);
    }
}

// Sign Out
export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
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
        throw new Error(error);
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
        throw new Error(error);
    }
}


// Get Investments purchased by user
export async function getUserInvestments(userId) {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("user", userId),Query.equal("is_matured", false),Query.equal("sold", false),Query.orderDesc("$createdAt")]
        );

        return investments.documents;
    } catch (error) {
        throw new Error(error);
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
        throw new Error(error);
    }
}

export async function getUserInvestmentsOffers(investmentId) {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("investment", investmentId),Query.equal("is_up_for_sell", true),Query.equal("is_matured", false),Query.equal("sold", false),Query.orderDesc("$createdAt")]
        );

        return investments.documents;
    } catch (error) {
        throw new Error(error);
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
        throw new Error(error);
    }
}

export async function getUserInvestmentData(investmentId) {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_investmentCollectionId,
            [Query.equal("$id", investmentId),Query.orderDesc("$createdAt")]
        );

        return investment.documents;
    } catch (error) {
        throw new Error(error);
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
        throw new Error(error);
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
        console.log(error);
        throw new Error(error);
    }
}


export async function getUserTransactions(userId) {
    try {
        const transactions = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.transactionCollectionId,
            [Query.equal("user", userId),Query.orderDesc("$createdAt")]
        );
        return transactions.documents;
    } catch (error) {
        throw new Error(error);
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
        throw new Error(error);
    }
}

export async function getInvestment(investmentId) {
    try {
        const investment = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId,
            [Query.equal("$id", investmentId),Query.orderDesc("$createdAt")]
        );

        return investment.documents;
    } catch (error) {
        throw new Error(error);
    }
}
// Get investments that matches search query
export async function searchInvestments(data) {
    const {query, categorySelected:category} = data;
    try {
        if(query && category){
            const getTheSearch= async(field,queries) =>{
                const investments = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.investmentCollectionId,
                    [Query.search(field, queries),Query.orderDesc("$createdAt")]
                );
                if (!investments) return [];
                
                return investments.documents;
            }

            const [name, company_name,company_owner] = await Promise.all([
                getTheSearch("name",query),
                getTheSearch("company_name",query),
                getTheSearch("company_owner",query),
            ]);
            return [...new Set([...name,...company_name,...company_owner])].filter(x=>x.category === category)
        }else if(query && !category){
            const investments = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.investmentCollectionId,
                [Query.search("name", query),Query.orderDesc("$createdAt")]
            );
            if (!investments) throw new Error("Something went wrong");
            
            return investments.documents;
        }else if(!query && category){
            const investments = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.investmentCollectionId,
                [Query.search("category", category),Query.orderDesc("$createdAt")]
            );
            if (!investments) throw new Error("Something went wrong");
            
            return investments.documents;
        }else{
            throw new Error("Invalid search parameters");
        }
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
        throw new Error(error);
    }
}

export async function getCategories() {
    try {
        const response = await getAllInvestments()
        const categories = response.map((doc) => doc.category);
        return categories;
    } catch (error) {
        throw new Error(error);
    }
}
