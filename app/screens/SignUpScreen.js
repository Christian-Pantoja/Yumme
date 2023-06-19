import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { SALT } from "@env";
import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../firebaseConfig";
const CryptoJS = require("crypto-js");

function SignUpScreen() {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userHandle, setUserHandle] = useState("");

  const ref_handle = useRef();
  const ref_fname = useRef();
  const ref_lname = useRef();
  const ref_password = useRef();

  function encryptedPasswordFunction(userPassword) {
    var key128Bits = CryptoJS.PBKDF2(userPassword, SALT, {
      keySize: 128 / 32,
      iterations: 8,
    });
    return key128Bits.toString();
  }

  registerUser = async (
    userEmail,
    userPassword,
    userFirstName,
    userLastName,
    userHandle
  ) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(() => {
        firebase.auth().currentUser.sendEmailVerification({
          handleCodeInApp: true,
          url: "https://yumme-36fa8.firebaseapp.com",
        });
      })
      .then(() => {
        alert("Verification email sent \nPlease verify your email and login");
      })
      .catch((error) => {
        alert(error.message);
      });

    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
        password: userPassword,
        handle: userHandle,
        favorites: [],
        favoritesCount: 0,
        followingCount: 0,
        followersCount: 0,
        following: [],
        followers: [],
        recipesCount: 0,
        recipes: [],
        uid: firebase.auth().currentUser.uid,
        userImage:
          "https://firebasestorage.googleapis.com/v0/b/yumme-36fa8.appspot.com/o/661F4AC0-84B0-4DC6-94BD-BC91F787CE2D.jpg?alt=media&token=4567f8ee-a385-4bc3-b6bc-960e450377d3",
      });

    firebase
      .firestore()
      .collection("GroceryList")
      .doc(firebase.auth().currentUser.uid)
      .set({
        GroceryItem: [],
      });
    firebase.firestore().collection("Users").orderBy(" ", "desc");
    navigation.navigate("Login");
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <Text style={styles.loginText}>Create Account</Text>
      <Text style={styles.loginSubText}>Please fill out form below</Text>
      {/* Text Inputs */}

      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput
          placeholder="e.g. johndoe@gmail.com"
          keyboardType="email-address"
          onChangeText={(userEmail) => setUserEmail(userEmail)}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => ref_handle.current.focus()}
          style={styles.input}
        ></TextInput>
        <Text>User Handle</Text>
        <TextInput
          placeholder="e.g. @JohnDoe"
          onChangeText={(userHandle) => setUserHandle(userHandle)}
          returnKeyType="next"
          onSubmitEditing={() => ref_fname.current.focus()}
          ref={ref_handle}
          style={styles.input}
        ></TextInput>
        <Text>First Name</Text>
        <TextInput
          placeholder="e.g. John"
          onChangeText={(userFirstName) => setUserFirstName(userFirstName)}
          returnKeyType="next"
          onSubmitEditing={() => ref_lname.current.focus()}
          ref={ref_fname}
          style={styles.input}
        ></TextInput>
        <Text>Last Name</Text>
        <TextInput
          placeholder="e.g. Doe"
          onChangeText={(userLastName) => setUserLastName(userLastName)}
          returnKeyType="next"
          onSubmitEditing={() => ref_password.current.focus()}
          ref={ref_lname}
          style={styles.input}
        ></TextInput>
        <Text>Password</Text>
        <TextInput
          placeholder="Password"
          onChangeText={(password) => setUserPassword(password)}
          secureTextEntry
          ref={ref_password}
          style={styles.input}
        ></TextInput>
      </View>

      {/* Buttons */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            registerUser(
              userEmail,
              userPassword,
              userFirstName,
              userLastName,
              userHandle
            )
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loginText: {
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 8,
  },
  loginSubText: {
    fontSize: 16,
    color: "black",
    marginBottom: 35,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eed9c4",
  },
  createAccountText: {
    fontSize: 35,
    fontWeight: "bold",
    alignSelf: "baseline",
    paddingLeft: "10%",
    marginBottom: 110,
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
    marginBottom: 5,
    height: 35,
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 80,
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
});

export default SignUpScreen;
