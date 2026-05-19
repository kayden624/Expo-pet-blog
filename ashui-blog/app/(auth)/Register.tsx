import { register } from "@/api/auth";
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

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // Form validation
    if (!email.trim()) {
      Alert.alert("Prompt", "Please enter your email");
      return;
    }
    if (!password) {
      Alert.alert("Prompt", "Please enter your password");
      return;
    }
    if (!confirmPassword) {
      Alert.alert("Prompt", "Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Prompt", "The passwords you entered do not match");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Prompt", "Please enter a valid email address");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Prompt",
        "Password length should be between 6 - 20 characters and must contain uppercase, lowercase letters and numbers."
      );
      return;
    }

    setLoading(true);
    try {
      // Add registration logic here
      const response = (await register(email, password)) as any;
      console.log("", response);
      if (response.userId) {
        // Redirect after successful registration
        Alert.alert(
          "Registration Successful",
          "Please log in to your account",
          [
            {
              text: "OK",
              onPress: () => router.replace("/Login"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Registration Failed",
          "This email may already be registered"
        );
      }
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        "This email may already be registered"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <Stack.Screen options={{ title: "Register", headerShown: true }} />

      <View className="flex-1 justify-center px-8">
        <Text className="text-3xl font-bold mb-8 text-center">
          Create an Account
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
        <View className="mb-4">
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

        {/* Confirm password input box */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Confirm Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2">
            <AntDesign name="lock" size={20} color="gray" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Please enter your password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <AntDesign
                name={showConfirmPassword ? "eye" : "eyeo"}
                size={20}
                color="gray"
              />
            </Pressable>
          </View>
        </View>

        {/* Register button */}
        <TouchableOpacity
          className={`py-3 rounded-lg ${
            loading ? "bg-blue-300" : "bg-blue-500"
          }`}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        {/* Login link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href="/Login" asChild>
            <Pressable>
              <Text className="text-blue-500 font-bold">Log in now</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
