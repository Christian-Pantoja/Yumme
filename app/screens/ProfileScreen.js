import { View, StyleSheet } from "react-native";
import React from "react";
import { ProfileBody, ProfileButtons } from "../components/profile";
import TopTabView from "../components/TopTabView";

const ProfileScreen = () => {
  return (
    <>
      <View style={styles.container}>
        <ProfileBody />
        <ProfileButtons />
      </View>
      <TopTabView />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
});

export default ProfileScreen;
