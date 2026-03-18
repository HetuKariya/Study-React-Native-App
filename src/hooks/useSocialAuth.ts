import { useSSO } from "@clerk/expo";
import { Try } from "expo-router/build/views/Try";
import { useState } from "react";
import { Alert } from "react-native";

type Strategy = "oauth_google" | "oauth_apple" | "oauth_github";

const useSocialAuth = () => {

    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();
    const handleSocialAuth = async (strategy: Strategy) => {
        if(loadingStrategy) return; // guard against concurrent flows
        setLoadingStrategy(strategy);
        try {
            const { createdSessionId, setActive }= await startSSOFlow({strategy});
            if(!createdSessionId || !setActive) {
                const provider = strategy === "oauth_google" ? "Google" : strategy === "oauth_apple" ? "Apple" : "Github";

                Alert.alert("Sign-in incomplete", `${provider} sign-in did not complete. Please try again.`);
                return;
            }
            await setActive({session:createdSessionId});
        } catch (error) {
            console.log("Error in social auth:", error);
            const provider = strategy === "oauth_google" ? "Google" : strategy === "oauth_apple" ? "Apple" : "Github";
            Alert.alert("Error", `Failed to sign in with ${provider}. Please try again`);
        } finally {
            setLoadingStrategy(null);
        }
    }
    return {handleSocialAuth, loadingStrategy };
}
export default useSocialAuth;