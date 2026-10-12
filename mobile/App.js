// modules
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//Conponents
import HomeScreen from "./screens/Home";
import DoctorsScreen from "./screens/Doctor";
import SignUpScreen from "./screens/SignUp";
import LoginScreen from "./screens/Login";
import ProfileScreen from "./screens/Profile";
import UpdateProfileScreen from "./screens/UpdateProfile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007bff",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            textAlign: "left",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Doctors"
          component={DoctorsScreen}
          options={{
            title: "صفحة الأطباء",
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: " إنشاء حساب جديد",
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: " تسجيل دخول",
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "وجهات المستخدم",
          }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfileScreen}
          options={{
            title: "صفحة تحديث البيانات",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
