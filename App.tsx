import { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Colors from './utils/Colors';
import HomeScreen from './screens/Home';
import FormScreen from './screens/Form';
import SigninScreen from './screens/Signin';
import SignupScreen from './screens/Signup';
import DetailScreen from './screens/Detail';
import ProfileScreen from './screens/Profile';
import AuthContextProvider, { AuthContext } from './store/context/authContext';
import AlertContextProvider from './store/context/alertContext';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PostNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Detail' component={DetailScreen} />
    </Stack.Navigator>
  )
}

const AuthNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Signin' component={SigninScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  )
}

const TabNavigation = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <Tabs.Navigator screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: Colors.sky400,
      tabBarInactiveTintColor: Colors.gray300,
    }}>
      <Tabs.Screen name='Index' component={PostNavigation} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-home" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name='Form' component={FormScreen} options={{
        headerShown: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        )
      }} />
      {
        !isAuth ? (
          <Tabs.Screen name='Auth' component={AuthNavigation} options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="enter-outline" size={size} color={color} />
            )
          }} />
        ) : (
          <Tabs.Screen name='Profile' component={ProfileScreen} options={{
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" size={size} color={color} />
            )
          }} />
        )
      }
    </Tabs.Navigator>
  )
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthContextProvider>
        <AlertContextProvider>
          <NavigationContainer>
            <TabNavigation />
          </NavigationContainer>
        </AlertContextProvider>
      </AuthContextProvider>
    </>
  );
}