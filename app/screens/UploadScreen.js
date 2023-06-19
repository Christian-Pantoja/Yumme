import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import "react-native-get-random-values";
import * as Crypto from "expo-crypto";

backColor = "black";
cardColor = "#eed9c4";
textColor = "black";

const UploadScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const source = { uri: result.assets[0].uri };
        setImage(source);
      } else {
        navigation.goBack("Yumme");
      }
    });

    return unsubscribe;
  }, []);

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

  const uploadPost = async () => {
    setUploading(true);
    const UUID = Crypto.randomUUID();

    if (description == "" || description == " " || description == null)
      return alert("Please add description");

    const response = await fetch(image.uri);
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf("/") + 1);
    // Upload the image
    const ref = firebase.storage().ref().child(filename);
    const snapshot = await ref.put(blob);
    // Get URL of the uploaded image
    const downloadURL = await snapshot.ref.getDownloadURL();

    // Get the currently logged in user
    const currentUser = firebase.auth().currentUser;
    const { uid } = currentUser;
    const userRef = firebase.firestore().collection("Users").doc(uid);
    const userDoc = await userRef.get();
    const firstName = userDoc.data().firstName;
    const lastName = userDoc.data().lastName;
    const email = userDoc.data().email;

    const collectionRef = firebase.firestore().collection("Posts");
    try {
      await collectionRef.doc(UUID).set({
        downloadURL,
        description,
        likes: 0,
        dislikes: 0,
        comments: "",
        saves: "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        uid: uid,
      });
    } catch (e) {
      console.log(e.message);
    }
    setUploading(false);
    Alert.alert("Photo Uploaded Successfully!");
    setImage(null);
    setDescription("");
    navigation.goBack("Yumme");
  };

  function handleKeyPress(e) {
    if (e.nativeEvent.key == "Enter") {
      Keyboard.dismiss();
    }
  }

  if (uploading == true)
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator />
      </View>
    );

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={120}
      behavior={Platform.OS == "ios" ? "position" : "height" + 0.1}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {image && (
            <View style={{ width: "100%" }}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity onPress={pickImage} style={styles.selectButton}>
                <Text style={styles.buttonText}>Replace Image</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Enter Description..."
                  value={description}
                  onChangeText={setDescription}
                  onKeyPress={handleKeyPress}
                  multiline={true}
                />
              </View>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={uploadPost}
              >
                <Text style={styles.postText}>Upload Post</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  selectButton: {
    marginBottom: 16,
    marginTop: 16,
    alignSelf: "center",
  },
  uploadButton: {
    backgroundColor: "dodgerblue",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginTop: 16,
    width: "100%",
  },
  buttonText: {
    color: "dodgerblue",
    fontSize: 18,
    textDecorationLine: "underline",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,

    padding: 10,
    width: "100%",
    height: "100%",
  },
  image: {
    aspectRatio: 4 / 3,
    borderRadius: 8,
  },
  descriptionInput: {
    backgroundColor: cardColor,
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
    padding: 10,
    paddingTop: 10,
  },
  postText: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  indicatorWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
});
