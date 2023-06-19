import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
} from "react-native";

import "react-native-get-random-values";
import { EvilIcons } from "@expo/vector-icons";
import { firebase } from "../../firebaseConfig";
import Swipelist from "react-native-swipeable-list-view";
import { TextInput } from "react-native-gesture-handler";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { AntDesign } from "@expo/vector-icons";

function GroceryListScreen() {
  const [item, setItem] = useState("");
  const [grocery, setGrocery] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("GroceryList")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setGrocery(snapshot.data().GroceryItem);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  onAdd = async (newItem) => {
    if (item.length === 0 || item === "" || item === " ") return;
    Keyboard.dismiss();
    setItem("");
    const newArr = [{ item: newItem, quantity: 1, checked: false }, ...grocery];
    setGrocery(newArr);
    await firebase
      .firestore()
      .collection("GroceryList")
      .doc(firebase.auth().currentUser.uid)
      .update("GroceryItem", newArr)
      .catch((error) => {
        alert(error.message);
      });
  };

  onIncrease = async (index) => {
    tempArr = [...grocery];
    tempArr[index].quantity += 1;
    setGrocery(tempArr);
    await firebase
      .firestore()
      .collection("GroceryList")
      .doc(firebase.auth().currentUser.uid)
      .update("GroceryItem", tempArr)
      .catch((error) => {
        alert(error.message);
      });
  };

  onDecrease = async (index) => {
    tempArr = [...grocery];
    if (tempArr[index].quantity === 1) {
      Alert.alert("Delete?", "Delete this item?", [
        {
          text: "Delete",
          onPress: () => onDelete(index),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
      return;
    }
    tempArr[index].quantity -= 1;

    setGrocery(tempArr);
    await firebase
      .firestore()
      .collection("GroceryList")
      .doc(firebase.auth().currentUser.uid)
      .update("GroceryItem", tempArr)
      .catch((error) => {
        alert(error.message);
      });
  };
  checkbox = async (index) => {
    tempArr = [...grocery];
    tempArr[index].checked = !tempArr[index].checked;
    setGrocery(tempArr);
    await firebase
      .firestore()
      .collection("GroceryList")
      .doc(firebase.auth().currentUser.uid)
      .update("GroceryItem", tempArr)
      .catch((error) => {
        alert(error.message);
      });
  };

  onDelete = async (index) => {
    tempArr = [...grocery];
    tempArr.splice(index, 1);
    setGrocery(tempArr);
    await firebase
      .firestore()
      .collection("GroceryList")
      .doc(firebase.auth().currentUser.uid)
      .update("GroceryItem", tempArr)
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={item}
          placeholder="Add Item..."
          placeholderTextColor="grey"
          onChangeText={(item) => setItem(item)}
          style={styles.input}
        ></TextInput>
        <TouchableOpacity onPress={() => onAdd(item)}>
          <View style={styles.btnContainer}>
            <Text style={{ color: "#eed9c4", fontWeight: "bold" }}>ADD</Text>
          </View>
        </TouchableOpacity>
      </View>
      {grocery.length > 0 ? (
        <ScrollView style={styles.list}>
          <Swipelist
            data={grocery}
            renderRightItem={(data, index) => (
              <View style={[styles.items, styles.elevation]}>
                <View>
                  <BouncyCheckbox
                    size={30}
                    fillColor="green"
                    unfillColor="#FFFFFF"
                    innerIconStyle={{ borderWidth: 0 }}
                    isChecked={data.checked}
                    onPress={() => checkbox(index)}
                  />
                </View>
                <View style={{ maxWidth: "50%" }}>
                  <Text style={[styles.listText, { color: "white" }]}>
                    {data.item}
                  </Text>
                </View>
                <View style={[styles.quantityContainer]}>
                  <TouchableOpacity onPress={() => onDecrease(index)}>
                    <AntDesign name="minuscircleo" size={24} color="white" />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.listText,
                      { color: "white", paddingHorizontal: 8 },
                      styles.quantity,
                    ]}
                  >
                    {data.quantity}
                  </Text>
                  <TouchableOpacity onPress={() => onIncrease(index)}>
                    <AntDesign name="pluscircleo" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            renderHiddenItem={(index) => (
              <View
                style={[
                  {
                    flexDirection: "row",
                    width: "87%",
                  },
                ]}
              >
                <TouchableOpacity
                  style={[styles.rightAction]}
                  onPress={() => onDelete(index)}
                >
                  <EvilIcons name="trash" size={40} color="black" />
                </TouchableOpacity>
              </View>
            )}
          ></Swipelist>
        </ScrollView>
      ) : (
        <View style={{ alignItems: "center", marginTop: "65%" }}>
          <Text style={{ fontSize: 25 }}>No Items in List</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eed9c4",
  },
  list: {
    width: "100%",
    marginTop: 20,
  },
  quantityContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  quantity: {
    overflow: "hidden",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "red",
  },
  items: {
    marginHorizontal: 20,
    paddingVertical: 25,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderRadius: 10,
    backgroundColor: "#3D3D3D",
  },
  inputContainer: {
    width: "88%",
    marginTop: 20,
    margin: 10,
    marginBottom: -5,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    gap: 10,
  },
  input: {
    borderWidth: 2,
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderRadius: 18,
    color: "black",
    width: "70%",
    height: 50,
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 18,
    width: 90,
    height: 50,
  },
  listText: {
    fontSize: 20,
  },
  elevation: {
    elevation: 100,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
});

export default GroceryListScreen;
