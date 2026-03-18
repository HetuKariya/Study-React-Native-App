import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

type Strategy = "oauth_google" | "oauth_apple" | "oauth_github";

const useSocialAuth = () => {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleSocialAuth = async (strategy: Strategy) => {
    if (loadingStrategy) return; // guard against concurrent flows
    setLoadingStrategy(strategy);
    try {
      const redirectUrl = Linking.createURL("/(tabs)");

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (!createdSessionId || !setActive) {
        const provider =
          strategy === "oauth_google"
            ? "Google"
            : strategy === "oauth_apple"
            ? "Apple"
            : "Github";

        Alert.alert(
          "Sign-in incomplete",
          `${provider} sign-in did not complete. Please try again.`
        );
        return;
      }

      await setActive({ session: createdSessionId });

      // Explicitly navigate to tabs after session is activated
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Error in social auth:", error);
      const provider =
        strategy === "oauth_google"
          ? "Google"
          : strategy === "oauth_apple"
          ? "Apple"
          : "Github";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again`
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
};

export default useSocialAuth;