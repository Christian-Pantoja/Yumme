import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { RECIPE_API_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";

const RecipesScreen = (e) => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(false);
  const [userInput, setUserInput] = useState();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  let message = "";
  if (search == false) message = "Search for a recipe above";
  else message = "No results found";

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const searchRecipe = async () => {
    setSearch(true);
    setLoading(true);
    await timeout(500);
    let options = {
      method: "GET",
      headers: { "x-api-key": RECIPE_API_KEY },
    };

    let url = "https://api.api-ninjas.com/v1/recipe?query=" + userInput;

    fetch(url, options)
      .then((res) => res.json()) // parse response as JSON
      .then((data) => {
        setResponse(data);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  if (loading == true)
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <FontAwesome
          name="search"
          size={20}
          color={"grey"}
          style={styles.search}
        />
        <TextInput
          placeholder="Search Recipe"
          returnKeyType="search"
          placeholderTextColor="grey"
          autoCapitalize="none"
          onChangeText={(userInput) => setUserInput(userInput)}
          onSubmitEditing={searchRecipe}
          style={styles.input}
        ></TextInput>
      </View>
      <View style={styles.listContainer}>
        {response.length > 0 ? (
          <FlatList
            data={response}
            renderItem={({ item }) => (
              <View style={[styles.recipeContainer, styles.elevation]}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("Show", {
                        title: item.title,
                        ingredients: item.ingredients,
                        instructions: item.instructions,
                        servings: item.servings,
                      });
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>View Recipe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={{ alignItems: "center", marginTop: "65%" }}>
            <Text style={{ fontSize: 25 }}>{message}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#eed9c4",
    flex: 1,
  },
  inputContainer: {
    marginTop: 15,
    width: "90%",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 18,
    height: 55,
    borderWidth: 2,
    marginBottom: 10,
  },
  input: {
    height: "100%",
    backgroundColor: "white",
    paddingHorizontal: 15,
    color: "black",
    width: "90%",
    borderBottomRightRadius: 18,
    borderTopRightRadius: 18,
    borderRightWidth: 2,
  },
  search: {
    paddingTop: 15,
    paddingLeft: 18,
  },
  recipeContainer: {
    flexDirection: "row",
    marginHorizontal: 18,
    paddingHorizontal: 15,
    paddingVertical: 28,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#3D3D3D",
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  title: {
    width: "60%",
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    width: Dimensions.get("window").width,
    height: "87%",
  },
  button: {
    backgroundColor: "#eed9c4",
    padding: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
  buttonText: {
    fontWeight: "bold",
  },
  indicatorWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eed9c4",
  },
  elevation: {
    elevation: 100,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
});

export default RecipesScreen;
