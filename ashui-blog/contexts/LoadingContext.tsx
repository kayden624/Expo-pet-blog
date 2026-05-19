import React, { createContext, ReactNode, useContext, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>("");

  const showLoading = (msg?: string) => {
    setMessage(msg || "loading...");
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage("");
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <Modal transparent={true} animationType="none" visible={isLoading}>
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color="#fff"
              />
              {message && <Text style={styles.loadingText}>{message}</Text>}
            </View>
          </View>
        </Modal>
      )}
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
  },
  activityIndicatorWrapper: {
    backgroundColor: "rgba(0,0,0,0.8)",
    height: 120,
    width: 120,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "white",
  },
});
