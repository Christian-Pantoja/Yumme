import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-get-random-values";
import LoginScreen from "./app/screens/LoginScreen";
import ForgotPasswordScreen from "./app/screens/ForgotPasswordScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import DashboardScreen from "./app/screens/DashboardScreen";
import RecipeShowScreen from "./app/screens/RecipeShowScreen";
import RecipesScreen from "./app/screens/RecipesScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Forgot Password"
        component={ForgotPasswordScreen}
        options={{
          title: "Forgot Password",
          headerStyle: {
            backgroundColor: "#eed9c4",
          },
        }}
      />
      <Stack.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{
          title: "Sign Up",
          headerStyle: {
            backgroundColor: "#eed9c4",
          },
        }}
      />

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeShowScreen"
        component={RecipeShowScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipesScreen"
        component={RecipesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};
