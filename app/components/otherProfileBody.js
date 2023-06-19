import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

export const Otherprofilebody = ({
  firstName,
  lastName,
  handle,
  followersCount,
  followingCount,
  recipesCount,
  userImage,
}) => {
  return (
    <View>
      <View style={styles.userHandleContainer}>
        <View style={styles.profileUsername}>
          <Text style={styles.username}>{handle}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.Picture}>
          <Image source={{ uri: userImage }} style={styles.profileImage} />
          <Text style={styles.userName}>
            {firstName} {lastName}
          </Text>
        </View>
      </View>

      <View style={styles.profileData}>
        <View style={styles.followers}>
          <Text style={styles.numFollowers}>{followersCount}</Text>
          <Text>Followers</Text>
        </View>
        <View style={styles.posts}>
          <Text style={styles.numPosts}>{recipesCount}</Text>
          <Text>Recipes</Text>
        </View>
        <View style={styles.following}>
          <Text style={styles.numFollowing}>{followingCount}</Text>
          <Text>Following</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  Picture: {
    alignItems: "center",
  },
  userHandleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileData: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-evenly",
  },
  profileUsername: {
    alignItems: "center",
    padding: 10,
  },
  username: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#04dec8",
  },
  profileImage: {
    resizeMode: "cover",
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  posts: {
    alignItems: "center",
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
  userName: {
    paddingVertical: 10,
    fontWeight: "bold",
    fontSize: 30,
  },
});
