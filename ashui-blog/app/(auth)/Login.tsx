import { doLogin } from "@/api/auth";
import { useLoading } from "@/contexts/LoadingContext";
import useUtil from "@/hooks/useUtil";
import { AntDesign } from "@expo/vector-icons";
import { Link, Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const { setStorage } = useUtil();
  const handleLogin = async () => {
    // Form validation
    if (!email.trim()) {
      Alert.alert("Prompt", "Please enter your email");
      return;
    }
    if (!password) {
      Alert.alert("Prompt", "Please enter your password");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Prompt", "Please enter a valid email address");
      return;
    }
    // Password length should be 6 - 20 characters and must contain uppercase, lowercase letters and numbers.
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Prompt",
        "Password length should be between 6 - 20 characters and must contain uppercase, lowercase letters and numbers."
      );
      return;
    }

    setLoading(true);
    showLoading("Logging in");
    try {
      const data = await doLogin(email, password);
      console.log("🚀 ~ file: Login.tsx:54 ~ data:", data);
      if (!data) {
        Alert.alert("Login Failed", "Incorrect email or password");
        return;
      }
      //router.canGoBack() ? router.back() : router.replace("/");
      router.replace("/");
    } catch (error) {
      console.error("Login Failed", error);
      Alert.alert("Login Failed", "Incorrect email or password");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <Stack.Screen options={{ title: "Login", headerShown: true }} />

      <View className="flex-1 justify-center px-8">
        <Text className="text-3xl font-bold mb-8 text-center">
          Welcome Back
        </Text>

        {/* Email input box */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2">Email</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
            <AntDesign name="mail" size={20} color="gray" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Please enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password input box */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
            <AntDesign name="lock" size={20} color="gray" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Please enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <AntDesign
                name={showPassword ? "eye" : "eyeo"}
                size={20}
                color="gray"
              />
            </Pressable>
          </View>
        </View>

        {/* Login button */}
        <TouchableOpacity
          className={`py-3 rounded-lg ${
            loading ? "bg-blue-300" : "bg-blue-500"
          }`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Registration link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don't have an account?</Text>
          <Link href="/Register" asChild>
            <Pressable>
              <Text className="text-blue-500 font-bold">Register Now</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
