export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    platfrom: "com.lumnaire.food.app",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID 
}