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
import Icon from "react-native-vector-icons/SimpleLineIcons";

backColor = "black";
cardColor = "#eed9c4";
textColor = "black";

const FeedScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const PostRef = firebase
      .firestore()
      .collection("Posts")
      .orderBy("createdAt", "desc");
    PostRef.onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const {
          firstName,
          lastName,
          downloadURL,
          description,
          likes,
          dislikes,
          comments,
        } = doc.data();
        users.push({
          id: doc.id,
          firstName,
          lastName,
          downloadURL,
          description,
          likes,
          dislikes,
          comments,
        });
      });
      setUsers(users);
    });
  }, []);

  const goToUploadScreen = async () => {
    navigation.push("Upload");
  };

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

  const goToCommentScreen = (postId) => {
    navigation.navigate("Comment", { postId });
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
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.firstName}</Text>
              <Text style={styles.name}>{item.lastName}</Text>
            </View>
            <Image source={{ uri: item.downloadURL }} style={styles.image} />
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
                    { backgroundColor: isPressed ? "yellow" : "transparent" },
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
      <TouchableOpacity
        onPress={goToUploadScreen}
        style={styles.uploadButton}
        activeOpacity={1}
      >
        <Image
          source={require("../assets/uploadLogo.png")}
          style={styles.uploadButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eed9c4",
  },
  userContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,

    backgroundColor: "#eed9c4",

    marginBottom: 10,
    marginHorizontal: 5,
  },
  nameContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: textColor,
    marginRight: 5,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: textColor,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
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
});
