import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { getServerURL } from "../utils/serverConnection";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SERVER_IP: "server_ip",
  SERVER_PORT: "server_port",
};

export default function HomeScreen() {
  const [serverURL, setServerURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSettings();
  }, []);

  const checkSettings = async () => {
    try {
      const ip = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_IP);
      const port = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_PORT);

      if (!ip || !port) {
        router.replace("/settings");
        return;
      }

      const url = await getServerURL();
      setServerURL(url);
      setError(null);
    } catch (error) {
      console.error("Error checking settings:", error);
      setError("Failed to check server settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    console.log("Retrying connection...");
    setError(null);
    checkSettings();
  };

  const goToSettings = () => {
    router.push("/settings");
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={retryConnection}>
            <Text style={styles.buttonText}>Retry Connection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={goToSettings}
          >
            <Text style={styles.buttonText}>Go to Settings</Text>
          </TouchableOpacity>
        </View>
      ) : (
        serverURL && (
          <WebView
            source={{ uri: serverURL }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="compatibility"
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
            originWhitelist={['*']}
            onShouldStartLoadWithRequest={() => true}
            onLoadStart={() => console.log("WebView starting to load...")}
            onLoad={() => console.log("WebView loaded successfully")}
            onLoadProgress={({ nativeEvent }) => {
              console.log(`WebView loading: ${nativeEvent.progress * 100}%`);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("WebView error:", nativeEvent);
              setError(
                `WebView error: ${nativeEvent.description}\n\n` +
                "Please verify:\n" +
                "1. The server is running\n" +
                "2. The IP and port are correct\n" +
                "3. The server is accessible"
              );
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("HTTP error:", nativeEvent);
              setError(
                `HTTP error: ${nativeEvent.statusCode}\n` +
                `URL: ${nativeEvent.url}\n\n` +
                "Please verify your server settings"
              );
            }}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
