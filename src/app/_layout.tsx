import { Stack } from "expo-router";
import "../../global.css";
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache'
import { GestureHandlerRootView } from "react-native-gesture-handler";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function RootLayout() {
  return (
  <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
     <GestureHandlerRootView className="flex-1">
      <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(auth)"/>
        <Stack.Screen name="(tabs)"/>
      </Stack>
    </GestureHandlerRootView>
  </ClerkProvider>
);
}
