import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  const goToUploadScreen = () => {
    navigation.navigate("Upload");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={goToUploadScreen}
        style={styles.button}
        activeOpacity={1}
      >
        <Image
          source={require("../assets/uploadLogo.png")}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingRight: 20,
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  buttonImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 12,
  },
});
