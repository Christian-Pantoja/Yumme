import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "../../firebaseConfig";

import GroceryListScreen from "./GroceryListScreen";
import RecipesScreen from "./RecipesScreen";
import ProfileScreen from "./ProfileScreen";
import FeedScreen from "./FeedScreen";
import UploadScreen from "./UploadScreen";
import CommentScreen from "./CommentScreen";
import RecipeShowScreen from "./RecipeShowScreen";
import EditProfileScreen from "./EditProfileScreen";

import FollowingFollowerTopTab from "./FollowingFollowerTopTab";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import OtherPofileScreen from "./OtherProfileScreen";

const DashboardScreen = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarInactiveTintColor: "grey",
        tabBarActiveTintColor: "#eed9c4",
        headerTitleAlign: "center",
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "black",
          borderColor: "black",
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Yumme"
        options={{
          headerTitleStyle: {
            color: "#eed9c4",
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
        component={FeedScreenStack}
      />
      <Tab.Screen
        name="Grocery List"
        options={{
          headerTitleStyle: {
            color: "#eed9c4",
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-ol" size={size} color={color} />
          ),
        }}
        component={GroceryListScreen}
      />
      <Tab.Screen
        name="Recipes"
        options={{
          headerTitleStyle: {
            color: "#eed9c4",
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
        component={RecipeScreenStack}
      />
      <Tab.Screen
        name="Profile"
        options={{
          swipeEnabled: false,
          headerTitleStyle: {
            color: "#eed9c4",
            fontSize: 30,
          },
          headerStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-circle" size={size} color={color} />
          ),
        }}
        component={ProfileScreenStack}
      />
    </Tab.Navigator>
  );
};

const FeedStack = createStackNavigator();
const FeedScreenStack = () => (
  <FeedStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
    <FeedStack.Screen
      name="Feed"
      component={FeedScreen}
      options={{
        headerShown: false,
      }}
    />
    <FeedStack.Screen
      options={{
        headerTintColor: "#eed9c4",
        headerTitleStyle: {
          color: "#eed9c4",
          fontSize: 20,
          alignItems: "center",
        },
        headerStyle: {
          backgroundColor: "black",
        },
      }}
      name="Upload"
      component={UploadScreen}
    />
    <FeedStack.Screen
      options={{
        headerTintColor: "#eed9c4",
        headerTitleStyle: {
          color: "#eed9c4",
          fontSize: 20,
        },
        headerStyle: {
          backgroundColor: "black",
        },
      }}
      name="Comment"
      component={CommentScreen}
    />
  </FeedStack.Navigator>
);

const RecipeStack = createStackNavigator();
const RecipeScreenStack = () => (
  <RecipeStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
    <RecipeStack.Screen
      name="Recipe Search"
      component={RecipesScreen}
      options={{
        headerShown: false,
      }}
    />
    <RecipeStack.Screen
      options={{
        title: " ",
        headerStyle: {
          backgroundColor: "#eed9c4",
        },
      }}
      name="Show"
      component={RecipeShowScreen}
    />
  </RecipeStack.Navigator>
);

const ProfileStack = createStackNavigator();

const ProfileScreenStack = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
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

  return (
    <ProfileStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <ProfileStack.Screen
        name="UserProfile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="FFTopTab"
        options={{
          headerBackTitle: " ",
          title: user.handle,

          headerTintColor: "#eed9c4",
          headerTitleStyle: {
            color: "#eed9c4",
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: "black",
          },
        }}
        component={FollowingFollowerTopTab}
      />
      <ProfileStack.Screen
        name="OtherProfile"
        options={{
          title: " ",
          headerStyle: {
            backgroundColor: "white",
          },
        }}
        component={OtherPofileScreen}
      />
    </ProfileStack.Navigator>
  );
};

export default DashboardScreen;
