import { View, Text, StyleSheet, Button, Alert } from "react-native";
import React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { firebase } from "../../firebaseConfig";
import { Otherprofilebody } from "../components/otherProfileBody";
import { useRoute } from "@react-navigation/native";

const OtherProfile = () => {
  const route = useRoute();

  return (
    <View style={styles.container}>
      <View style={styles.ConstInfo}>
        <Otherprofilebody
          firstName={route.params.firstName}
          lastName={route.params.lastName}
          handle={route.params.handle}
          recipesCount={route.params.recipesCount}
          followersCount={route.params.followersCount}
          followingCount={route.params.followingCount}
          userImage={route.params.userImage}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Follow"
          color="#04dec8"
          onPress={() => Alert.alert("Followed")}
        />

        <Button
          title="Message"
          color="#04dec8"
          onPress={() => Alert.alert("Messaging Coming Soon...")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginHorizontal: 8,
    fontSize: 10,
  },
});

export default OtherProfile;
