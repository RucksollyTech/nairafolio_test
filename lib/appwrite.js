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

// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
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
        console.log(error);
        return null;
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

// Upload File
export async function uploadFile(file, type) {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
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
            appwriteConfig.videoCollectionId,
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

// Get all video Posts
export async function getAllInvestments() {
    try {
        const investments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.investmentCollectionId
        );

        return investments.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get video posts created by user
export async function getUserPosts(userId) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal("creator", userId)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get video posts that matches search query
export async function searchPosts(data) {
    const {query, categorySelected:category} = data;
    try {
        if(query && category){
            const buildQuery = (query, category) => {
                const queries = [];
    
                if (query) {
                    // Search only in text fields
                    queries.push(
                        Query.or(
                            Query.search("name", query),
                            Query.search("company_name", query),
                            Query.search("company_owner", query)
                        )
                    );
                }
    
                if (category) {
                    // Add category filter separately
                    queries.push(Query.equal("category", category));
                }
    
                return queries;
            };
            const posts = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.investmentCollectionId,
                buildQuery(query, category)
            );
    
            if (!posts) throw new Error("Something went wrong");
            
            return posts.documents;
        }else if(query && !category){
            const posts = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.investmentCollectionId,
                [Query.search("name", query)]
            );
            if (!posts) throw new Error("Something went wrong");
            
            return posts.documents;
        }else{
            throw new Error("Invalid search parameters");
        }
    } catch (error) {
        throw new Error(error);
    }
}

// Get latest created video posts
export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
