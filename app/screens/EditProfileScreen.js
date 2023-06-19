import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { firebase } from "../../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import "firebase/auth";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/EvilIcons";

const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { firstName, lastName, userImage } = route.params;
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const ref_lname = useRef();

  const updateUser = async (userFirstName, userLastName) => {
    if (image == null && !userFirstName && !userLastName) {
      navigation.navigate("UserProfile");
      return;
    }
    const push = {};

    if (image != null) {
      setUploading(true);
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);

      // Upload the image to Firebase Storage
      const ref = firebase.storage().ref().child(filename);
      const snapshot = await ref.put(blob);

      // Get the download URL of the uploaded image
      const userImage = await snapshot.ref.getDownloadURL();

      push["userImage"] = userImage;
    }
    if (userFirstName != "") {
      push["firstName"] = userFirstName;
    }
    if (userLastName != "") {
      push["lastName"] = userLastName;
    }

    try {
      await firebase
        .firestore()
        .collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .update(push);
      push["userImage"] = userImage;
    } catch (error) {
      alert(error.message);
    }

    setUploading(false);
    Alert.alert("Profile Updated!");
    navigation.push("UserProfile", push);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      setImage(source);
    }
  };

  handleLogout = async () => {
    navigation.navigate("Login");
  };

  if (uploading == true)
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator />
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="pencil-off-outline"
            style={{ fontSize: 35, color: "#990F02" }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Edit Profile</Text>
        <TouchableOpacity
          onPress={() => updateUser(userFirstName, userLastName)}
        >
          <Icon
            name="pencil-plus-outline"
            style={{ fontSize: 35, color: "#228B22" }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.pictureContainer}>
        {image == null ? (
          <Image
            source={{ uri: userImage }}
            style={{ width: 150, height: 150, borderRadius: 100 }}
          />
        ) : (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 150, height: 150, borderRadius: 100 }}
          />
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text style={{ color: "#3493D9", paddingTop: 10 }}>
            Change profile photo
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <View
          style={{
            flexDirection: "row",
            borderTopColor: "black",
            borderTopWidth: 2,
            padding: 15,
            marginBottom: 5,
          }}
        >
          <View style={styles.FnameDecor}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              First Name
            </Text>
          </View>
          <TextInput
            defaultValue={firstName}
            onChangeText={(userFirstName) => setUserFirstName(userFirstName)}
            returnKeyType="next"
            onSubmitEditing={() => ref_lname.current.focus()}
            style={styles.input}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderTopColor: "black",
            borderTopWidth: 2,
            padding: 15,
          }}
        >
          <View style={styles.LnameDecor}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Last Name
            </Text>
          </View>
          <TextInput
            defaultValue={lastName}
            onChangeText={(userLastName) => setUserLastName(userLastName)}
            ref={ref_lname}
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.logoutContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleLogout()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
    width: "100%",
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "100%",
  },
  input: {
    fontSize: 20,

    width: "100%",
    marginLeft: 45,
  },
  inputContainer: {
    width: "100%",
  },
  pictureContainer: {
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  FnameDecor: {
    flexDirection: "row",
  },
  LnameDecor: {
    flexDirection: "row",
  },
  userDecor: {
    flexDirection: "row",
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  button: {
    backgroundColor: "red",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eed9c4",
  },
});

export default EditProfileScreen;
