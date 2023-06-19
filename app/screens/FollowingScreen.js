import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { firebase } from "../../firebaseConfig";
let tempArr = [];

const FollowersScreen = () => {
  const navigation = useNavigation();
  const UserRef = firebase.firestore().collection("Users");

  //Gets the currents user's followers list
  const [currProfile, setCurrProfile] = useState([]);
  useEffect(() => {
    UserRef.doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setCurrProfile(snapshot.data());
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  if (currProfile.following != undefined) {
    tempArr = currProfile.following;
    tempArr.sort();
  }

  //Gets info about each follower
  const [users, setUsers] = useState([]);
  useEffect(() => {
    UserRef.onSnapshot((querySnapshot) => {
      let keyIterator = 0;
      let followerArrIterator = 0;
      const users = [];
      querySnapshot.forEach((doc) => {
        const {
          firstName,
          lastName,
          handle,
          uid,
          followersCount,
          followingCount,
          recipesCount,
          userImage,
        } = doc.data();
        if (uid == tempArr[followerArrIterator]) {
          followerArrIterator++;
          users.push({
            firstName,
            lastName,
            handle,
            uid,
            followersCount,
            followingCount,
            recipesCount,
            userImage,
            key: `${keyIterator++}`,
          });
        }
      });
      setUsers(users);
    });
  }, []);

  const goToOtherProfile = (key) => {
    navigation.push("OtherProfile", {
      firstName: users[key].firstName,
      lastName: users[key].lastName,
      handle: users[key].handle,
      followersCount: users[key].followersCount,
      followingCount: users[key].followingCount,
      recipesCount: users[key].recipesCount,
      userImage: users[key].userImage,
    });
  };

  return (
    <View style={styles.back}>
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <TouchableOpacity onPress={() => goToOtherProfile(item.key)}>
                <View style={styles.followerContainer}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.userImage }}
                  />
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.handle}>{item.handle}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                      <Button
                        title="Following"
                        style={styles.buttonColor}
                      ></Button>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        ></FlatList>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "white", fontSize: 22 }}>
            You are not following anyone
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    backgroundColor: "black",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  followerContainer: {
    backgroundColor: "#eed9c4",
    marginTop: 15,
    flex: 1,
    height: 80,
    borderRadius: 10,
    width: "95%",
    flexDirection: "row",
    alignSelf: "center",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    marginLeft: 10,
    marginTop: 14,
    marginRight: 16,
  },
  nameContainer: {
    justifyContent: "center",
    marginTop: -4,
  },
  name: {
    fontSize: 18,
  },
  handle: {
    fontSize: 14,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
    marginRight: 20,
  },
  button: {
    width: 100,
    borderRadius: 5,
    overflow: "hidden",
  },
});

export default FollowersScreen;
