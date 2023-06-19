import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../firebaseConfig";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");

  const handleChangePassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(userEmail)
      .then(() => {
        alert("Reset link has been sent");
      })
      .catch((error) => {
        alert(error.message);
      });
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <Text style={styles.forgotText}>Password Reset</Text>
      <Text style={styles.forgotSubText}>Please enter your email</Text>
      {/* Text Inputs */}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(userEmail) => setUserEmail(userEmail)}
          style={styles.input}
        ></TextInput>
      </View>

      {/* Buttons */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleChangePassword(userEmail)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eed9c4",
    marginTop: -150,
  },
  forgotText: {
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "baseline",
    paddingLeft: "10%",
    paddingBottom: 8,
  },
  forgotSubText: {
    fontSize: 16,
    alignSelf: "baseline",
    paddingLeft: "10%",
    color: "grey",
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
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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
  forgotButton: {
    marginTop: 10,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default ForgotPasswordScreen;
