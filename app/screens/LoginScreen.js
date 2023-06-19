import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  NativeModules,
} from "react-native";
import { SALT } from "@env";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../firebaseConfig";
const CryptoJS = require("crypto-js");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  function encryptedPasswordFunction(userPassword) {
    var key128Bits = CryptoJS.PBKDF2(userPassword, SALT, {
      keySize: 128 / 32,
      iterations: 8,
    });
    return key128Bits.toString();
  }

  handleLogin = async (userEmail, userPassword) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
      if (firebase.auth().currentUser.emailVerified == false) {
        alert("Email has not been verified");
        navigation.navigate("Login");
      } else {
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  handleForgotPassword = async () => {
    navigation.navigate("Forgot Password");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <Text style={styles.loginText}>Yumme</Text>
      <Text style={styles.loginSubText}>Please sign in to continue</Text>
      {/* Text Inputs */}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="grey"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(userEmail) => setUserEmail(userEmail)}
          style={styles.input}
        ></TextInput>
        <TextInput
          placeholder="Password"
          placeholderTextColor="grey"
          onChangeText={(userPassword) => setUserPassword(userPassword)}
          secureTextEntry
          style={styles.input}
        ></TextInput>
      </View>

      {/* Buttons */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleLogin(userEmail, userPassword)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Sign Up")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleForgotPassword()}
          style={[styles.forgotButton]}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const { StatusBarManager } = NativeModules; // Used to get StatusBar Height on Andriod

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eed9c4",
  },
  loginText: {
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 8,
    letterSpacing: 2,
  },
  loginSubText: {
    fontSize: 16,
    color: "black",
    paddingBottom: 50,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    color: "black",
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "black",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "#adadad",
    marginTop: 5,
  },
  buttonOutlineText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  forgotButton: {
    marginTop: 10,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  forgotText: {
    color: "black",
    fontSize: 16,
    fontWeight: 700,
  },
});

export default LoginScreen;
