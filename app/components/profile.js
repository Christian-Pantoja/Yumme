import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import FollowingScreen from "../screens/FollowingScreen";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../firebaseConfig";

export const ProfileBody = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState("");

  firebase
    .firestore()
    .collection("Users")
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        setUser(snapshot.data());
      }
    })
    .catch((error) => {
      alert(error.message);
    });

  return (
    <View>
      <View style={styles.userHandleContainer}>
        <View style={styles.profileUsername}>
          <Text style={styles.username}>{user.handle}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.NameAndPicture}>
          <Image source={{ uri: user.userImage }} style={styles.userImage} />
          <Text style={styles.accountName}>
            {user.firstName + " " + user.lastName}
          </Text>
        </View>
        <View style={styles.profileData}>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("FFTopTab", { routeName: "Followers" });
            }}
          >
            <View style={styles.followers}>
              <Text style={styles.numFollowers}>{user.followersCount}</Text>
              <Text>Followers</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.recipes}>
            <Text style={styles.numPosts}>{user.recipesCount}</Text>
            <Text>Recipes</Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("FFTopTab", { routeName: "Following" });
            }}
          >
            <View style={styles.following}>
              <Text style={styles.numFollowing}>{user.followingCount}</Text>
              <Text>Following</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

export const ProfileButtons = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setUser(snapshot.data());
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  const navigation = useNavigation();
  const goToEditScreen = () => {
    navigation.push("EditProfile", {
      firstName: user.firstName,
      lastName: user.lastName,
      userImage: user.userImage,
    });
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={goToEditScreen} style={styles.buttonSize}>
        <View style={styles.editButton}>
          <Text style={styles.buttonString}>Edit Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#eed9c4",
    height: "100%",
  },
  NameAndPicture: {
    alignItems: "center",
    marginTop: -140,
  },
  userHandleContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eed9c4",
  },
  profileData: {
    flexDirection: "row",
    padding: 22,
    justifyContent: "space-evenly",
    marginTop: -280,
  },
  profileUsername: {
    alignItems: "center",
    padding: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: "bold",
  },
  userImage: {
    resizeMode: "cover",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  recipes: {
    alignItems: "center",
    marginLeft: 50,
    marginRight: 50,
  },
  numPosts: {
    fontWeight: "bold",
    fontSize: 18,
  },
  followers: {
    alignItems: "center",
  },
  numFollowers: {
    fontWeight: "bold",
    fontSize: 18,
  },
  following: {
    alignItems: "center",
  },
  numFollowing: {
    fontWeight: "bold",
    fontSize: 18,
  },
  accountName: {
    paddingVertical: 10,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: 10,
    backgroundColor: "#eed9c4",
    marginTop: -90,
  },
  buttonSize: {
    width: "80%",
  },
  editButton: {
    width: "100%",
    height: 35,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eed9c4",
    marginTop: -10,
  },
  buttonString: {
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
    opacity: 0.8,
  },
});
