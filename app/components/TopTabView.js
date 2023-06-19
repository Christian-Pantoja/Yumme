import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { firebase } from "../../firebaseConfig";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Icon2 from "react-native-vector-icons/AntDesign";
import { AntDesign } from "@expo/vector-icons";
backColor = "black";
cardColor = "#eed9c4";
textColor = "black";

const TopTabView = () => {
  const [isPressed, setIsPressed] = useState(false);
  const UserRef = firebase.firestore().collection("Users");
  const [currentUser, setUser] = useState([]);
  useEffect(() => {
    UserRef.doc(firebase.auth().currentUser.uid)
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

  const MyRecipes = () => {
    const [user, setUsers] = useState([]);

    useEffect(() => {
      const PostRef = firebase
        .firestore()
        .collection("Posts")
        .orderBy("createdAt", "desc");
      PostRef.onSnapshot((querySnapshot) => {
        const user = [];

        querySnapshot.forEach((doc) => {
          const {
            firstName,
            lastName,
            downloadURL,
            description,
            likes,
            dislikes,
            uid,
          } = doc.data();
          if (uid == currentUser.uid) {
            user.push({
              id: doc.id,
              firstName,
              lastName,
              downloadURL,
              description,
              likes,
              dislikes,
            });
          }
        });
        setUsers(user);
      });
    }, []);

    const handleLike = (postId) => {
      const PostRef = firebase.firestore().collection("Posts").doc(postId);
      PostRef.update({
        likes: firebase.firestore.FieldValue.increment(1),
      });
    };

    const handleDislike = (postId) => {
      const PostRef = firebase.firestore().collection("Posts").doc(postId);
      PostRef.update({
        dislikes: firebase.firestore.FieldValue.increment(1),
      });
    };

    handleFavorites = (postId) => {
      setIsPressed(!isPressed);
      const currUserId = firebase.auth().currentUser.uid;
      const userDoc = firebase.firestore().collection("Users").doc(currUserId);

      userDoc.get().then((userData) => {
        let favorites = userData.data().favorites || [];
        let alreadyFav = false;
        for (let i = 0; i < favorites.length; i++) {
          if (favorites[i].id == postId) {
            favorites.splice(i, 1);
            alreadyFav = true;
            break;
          }
        }
        if (alreadyFav == false) {
          favorites.push(firebase.firestore().collection("Posts").doc(postId));
          userDoc.update(
            { fav: firebase.firestore.FieldValue.arrayUnion(postId) },
            { merge: true }
          );
        } else {
          userDoc.update(
            { fav: firebase.firestore.FieldValue.arrayRemove(postId) },
            { merge: true }
          );
        }
        userDoc.update({ favorites });
      });
    };

    return (
      <View style={styles.container}>
        {user.length > 0 ? (
          <FlatList
            data={user}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{item.firstName}</Text>
                  <Text style={styles.name}>{item.lastName}</Text>
                </View>
                <Image
                  source={{ uri: item.downloadURL }}
                  style={styles.image}
                />
                <Text style={styles.description}>
                  Description: {item.description}
                </Text>
                <View style={styles.ratingContainer}>
                  <TouchableOpacity
                    onPress={() => handleLike(item.id)}
                    style={styles.likesButton}
                  >
                    <Image
                      source={require("../assets/likeLogo.png")}
                      style={styles.likeButtonImage}
                    />
                  </TouchableOpacity>
                  <Text style={styles.likeText}>{item.likes}</Text>
                  <TouchableOpacity
                    onPress={() => handleDislike(item.id)}
                    style={styles.dislikesButton}
                  >
                    <Image
                      source={require("../assets/dislikeLogo.png")}
                      style={styles.dislikeButtonImage}
                    />
                  </TouchableOpacity>
                  <Text style={styles.dislikeText}>{item.dislikes}</Text>
                  <TouchableOpacity
                    onPress={() => goToCommentScreen(item.id)}
                    style={styles.commentButton}
                    activeOpacity={1}
                  >
                    <Image
                      source={require("../assets/commentLogo.png")}
                      style={styles.commentButtonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleFavorites(item.id)}
                    style={styles.starButton}
                  >
                    <View
                      style={[
                        styles.starContainer,
                        {
                          backgroundColor: isPressed ? "yellow" : "transparent",
                        },
                      ]}
                    >
                      <Icon
                        name="star"
                        size={30}
                        color={isPressed ? "black" : "black"}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>No posts yet</Text>
          </View>
        )}
      </View>
    );
  };

  const FavRecipes = () => {
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
      const currUserId = firebase.auth().currentUser.uid;
      const userDoc = firebase.firestore().collection("Users").doc(currUserId);
      userDoc.get().then((userData) => {
        const favorites = userData.data().favorites || [];
        const PostRef = firebase.firestore().collection("Posts");
        let favPosts;
        if (favorites.length != 0) {
          favPosts = PostRef.where(
            firebase.firestore.FieldPath.documentId(),
            "in",
            favorites
          );
          favPosts.onSnapshot((querySnapshot) => {
            const posts = [];
            querySnapshot.forEach((doc) => {
              const {
                firstName,
                lastName,
                downloadURL,
                description,
                likes,
                dislikes,
              } = doc.data();
              posts.push({
                id: doc.id,
                firstName,
                lastName,
                downloadURL,
                description,
                likes,
                dislikes,
              });
            });
            setFavorites(posts);
          });
        }
      });
    }, []);

    const handleLike = (postId) => {
      const PostRef = firebase.firestore().collection("Posts").doc(postId);
      PostRef.update({
        likes: firebase.firestore.FieldValue.increment(1),
      });
    };

    const handleDislike = (postId) => {
      const PostRef = firebase.firestore().collection("Posts").doc(postId);
      PostRef.update({
        dislikes: firebase.firestore.FieldValue.increment(1),
      });
    };

    handleFavorites = (postId) => {
      setIsPressed(!isPressed);
      const currUserId = firebase.auth().currentUser.uid;
      const userDoc = firebase.firestore().collection("Users").doc(currUserId);

      userDoc.get().then((userData) => {
        let favorites = userData.data().favorites || [];
        let alreadyFav = false;
        for (let i = 0; i < favorites.length; i++) {
          if (favorites[i].id == postId) {
            favorites.splice(i, 1);
            alreadyFav = true;
            break;
          }
        }
        if (alreadyFav == false) {
          favorites.push(firebase.firestore().collection("Posts").doc(postId));
          userDoc.update(
            { fav: firebase.firestore.FieldValue.arrayUnion(postId) },
            { merge: true }
          );
        } else {
          userDoc.update(
            { fav: firebase.firestore.FieldValue.arrayRemove(postId) },
            { merge: true }
          );
        }
        userDoc.update({ favorites });
      });
    };

    return (
      <View style={styles.container}>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            renderItem={({ item }) => (
              <View style={styles.userContainer}>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{item.firstName}</Text>
                  <Text style={styles.name}>{item.lastName}</Text>
                </View>
                <Image
                  source={{ uri: item.downloadURL }}
                  style={styles.image}
                />
                <Text style={styles.description}>
                  Description: {item.description}
                </Text>
                <View style={styles.ratingContainer}>
                  <TouchableOpacity
                    onPress={() => handleLike(item.id)}
                    style={styles.likesButton}
                  >
                    <Image
                      source={require("../assets/likeLogo.png")}
                      style={styles.likeButtonImage}
                    />
                  </TouchableOpacity>
                  <Text style={styles.likeText}>{item.likes}</Text>
                  <TouchableOpacity
                    onPress={() => handleDislike(item.id)}
                    style={styles.dislikesButton}
                  >
                    <Image
                      source={require("../assets/dislikeLogo.png")}
                      style={styles.dislikeButtonImage}
                    />
                  </TouchableOpacity>
                  <Text style={styles.dislikeText}>{item.dislikes}</Text>
                  <TouchableOpacity
                    onPress={() => goToCommentScreen(item.id)}
                    style={styles.commentButton}
                    activeOpacity={1}
                  >
                    <Image
                      source={require("../assets/commentLogo.png")}
                      style={styles.commentButtonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleFavorites(item.id)}
                    style={styles.starButton}
                  >
                    <View
                      style={[
                        styles.starContainer,
                        {
                          backgroundColor: isPressed ? "yellow" : "transparent",
                        },
                      ]}
                    >
                      <Icon
                        name="star"
                        size={30}
                        color={isPressed ? "black" : "black"}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>
              No favorites yet
            </Text>
          </View>
        )}
      </View>
    );
  };
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#eed9c4",
        },
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          backgroundColor: "grey",
          height: 5,
        },
      })}
    >
      <Tab.Screen
        name="MyRecipes"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" size={24} color={color} />
          ),
        }}
        component={MyRecipes}
      />
      <Tab.Screen
        name="FavRecipes"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="staro" size={24} color={color} />
          ),
        }}
        component={FavRecipes}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backColor,
  },
  userContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eed9c4",
    borderRadius: 20,
    marginHorizontal: 5,
    marginTop: 10,
  },
  nameContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginRight: 5,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555555",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#B2E5FF",
    marginRight: 8,
    borderRadius: 4,
  },
  likesText: {
    fontSize: 16,
    color: "#007AFF",
    marginRight: 8,
  },
  dislikesButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFB2B2",
    marginRight: 8,
    borderRadius: 4,
  },
  dislikesText: {
    fontSize: 16,
    color: "#FF3B30",
  },
  button: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#EAEAEA",
    borderRadius: 50,
    padding: 12,
    elevation: 2,
  },
  buttonImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  likesButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: "#B2E5FF",
    marginRight: 5,
    borderRadius: 50,
  },
  likeButtonImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  likeText: {
    fontSize: 16,
    color: textColor,
    marginRight: 30,
  },
  dislikesButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: "#FFB2B2",
    marginRight: 5,
    borderRadius: 50,
  },
  dislikeButtonImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  dislikeText: {
    fontSize: 16,
    color: textColor,
    marginRight: 30,
  },
  uploadButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#EAEAEA",
    borderRadius: 50,
    padding: 12,
    elevation: 2,
  },
  uploadButtonImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  commentButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    marginRight: 5,
    marginRight: 40,
  },
  commentButtonImage: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  starButton: {
    padding: 10,
    borderRadius: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default TopTabView;
