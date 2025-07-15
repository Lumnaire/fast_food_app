import { CreateUserParams, SignInParams } from '@/type';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platfrom: "com.lumnaire.food.app",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: '686d140e00327cab4ff4',
    userCollectionId: '686d14550038ab05ac02',
    categoriesCollectionId: '687648b9000e934c5bd4',
    menuCollectionId: '6876494d0036bf323c5e',
    customizationsCollectionId: '68764a840022a4f935ed',
    menuCustomizationCollectionId: '68764b4c000d4c4a40e7'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platfrom);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

// export const signIn = async ({ email, password }: SignInParams) => {
//   try {
//     // Optional: delete existing session if any
//     try {
//       await account.deleteSession('current'); // safely delete current session
//     } catch (e) {
//       // no-op if session doesn't exist
//       console.log('No active session to delete before sign-in');
//     }

//     // Now create a new session
//     const session = await account.createEmailPasswordSession(email, password);
//     return session;
//   } catch (e) {
//     console.error("Sign-in error:", e);
//     throw new Error((e as Error).message);
//   }
// };

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}
