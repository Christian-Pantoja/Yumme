import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const RecipeShowScreen = () => {
  const route = useRoute();
  let title = route.params.title;
  let ingredients = route.params.ingredients;
  let instructions = " " + route.params.instructions;
  let servings = route.params.servings;
  let ingredientsArray = ingredients.split("|");
  if (ingredientsArray[0] === "--dwigans fwds07a---")
    ingredientsArray.splice(0, 1);
  let instructionsArray = instructions.split(".");
  instructionsArray.map((item, index) => {
    if (item.length == 2) instructionsArray.splice(index, 1);
  });
  if (instructionsArray[0].length == 2) instructionsArray.splice(0, 1);
  instructionsArray.pop();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{title}</Text>
        <Text>{servings}</Text>
        <Text style={styles.ingredientsTitle}>Ingredients</Text>
        <FlatList
          scrollEnabled={false}
          data={ingredientsArray}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 10,
                maxWidth: "90%",
              }}
            >
              <Entypo
                name="dot-single"
                size={30}
                color="black"
                style={{ paddingTop: 0 }}
              />
              <Text style={styles.ingredients}>{item}</Text>
            </View>
          )}
        />
        <Text style={styles.ingredientsTitle}>Instructions</Text>
        <FlatList
          scrollEnabled={false}
          data={instructionsArray}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.instructions, { fontWeight: "bold" }]}>
                {`Step ${index + 1}:`}
                <Text style={[styles.instructions, { fontWeight: "400" }]}>
                  {item}
                </Text>
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eed9c4",
    flex: 1,
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  recipeTitle: {
    fontSize: 45,
    fontWeight: "bold",
  },
  ingredientsTitle: {
    fontSize: 30,
    fontWeight: 600,
    paddingVertical: 10,
  },
  ingredients: {
    paddingVertical: 5,
    fontSize: 16,
  },
  instructions: {
    paddingVertical: 5,
    fontSize: 16,
  },
});

export default RecipeShowScreen;
