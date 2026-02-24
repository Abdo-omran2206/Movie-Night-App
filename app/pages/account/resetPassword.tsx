import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../api/supabase";
import { useStore } from "../../store/store";

export default function ResetPassword() {
  const router = useRouter();
  const { setMood } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(""); // New state for token
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Request email, 2: Enter token and new password

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "com.moodflix.app://reset-password", // Deep link for mobile
    });
    setLoading(false);
    if (error) {
      Alert.alert("Reset Failed", error.message);
    } else {
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox for the reset token.",
      );
      setStep(2); // Move to the next step to enter token and new password
    }
  };

  const handleConfirmReset = async () => {
    if (!token || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
    if (error) {
      setLoading(false);
      Alert.alert("Verification Failed", error.message);
      return;
    }

    // If OTP is verified, update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });
    setLoading(false);
    if (updateError) {
      Alert.alert("Password Update Failed", updateError.message);
    } else {
      Alert.alert(
        "Success",
        "Your password has been reset successfully. Please log in with your new password.",
      );
      setMood("Account");
      router.replace("/pages/account/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          {step === 1 ? (
            <Text style={styles.subtitle}>
              Enter your email to receive a reset token
            </Text>
          ) : (
            <Text style={styles.subtitle}>
              Enter the token from your email and your new password
            </Text>
          )}
        </View>
        <View style={styles.form}>
          {step === 1 && (
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#777"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          )}

          {step === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#777"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Reset Token"
                  placeholderTextColor="#777"
                  value={token}
                  onChangeText={setToken}
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#777"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  placeholderTextColor="#777"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#777"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#777"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={step === 1 ? handleRequestReset : handleConfirmReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>
                {step === 1 ? "Send Reset Token" : "Reset Password"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontFamily: "BebasNeue",
    color: "#fff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    fontFamily: "RobotoSlab",
    marginTop: 5,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontFamily: "RobotoSlab",
  },
  loginButton: {
    backgroundColor: "#E50914",
    borderRadius: 12,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#E50914",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "BebasNeue",
    letterSpacing: 1,
  },
});
