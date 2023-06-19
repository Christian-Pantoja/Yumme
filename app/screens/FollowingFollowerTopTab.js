import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FollowersScreen from "./FollowersScreen";
import FollowingScreen from "./FollowingScreen";
import { useRoute } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

function FollowingFollowerTopTab() {
  const route = useRoute();
  return (
    <Tab.Navigator
      initialRouteName={route.params.routeName}
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "dodgerblue", height: 3 },
        tabBarStyle: {
          backgroundColor: "#eed9c4",
        },
      }}
    >
      <Tab.Screen name="Followers" component={FollowersScreen} />
      <Tab.Screen name="Following" component={FollowingScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eed9c4",
  },
});

export default FollowingFollowerTopTab;
