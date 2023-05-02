import { useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from './utils/Colors';
import HomeScreen from './screens/Home';
import FormScreen from './screens/Form';
import SigninScreen from './screens/Signin';
import SignupScreen from './screens/Signup';
import DetailScreen from './screens/Detail';
import ProfileScreen from './screens/Profile';
import AuthContextProvider, { AuthContext } from './store/context/authContext';
import AlertContextProvider from './store/context/alertContext';
import is24Hours from './utils/is24Hours';
import Avatar from './components/Avatar';

type RootTabStackParamList = {
  Index: undefined;
  Form: undefined;
  Auth: undefined;
  Profile: undefined;
}

const Tabs = createBottomTabNavigator<RootTabStackParamList>();
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
  const { name, isAuth } = useContext(AuthContext);

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
              <Avatar text={name || ''} />
            )
          }} />
        )
      }
    </Tabs.Navigator>
  )
}

const Navigations = () => {
  const { authenticate } = useContext(AuthContext);
  useEffect(() => {
    const getSavedStorage = async () => {
      const savedStorage = await AsyncStorage.getItem('user');
      if (savedStorage) {
        const storage = JSON.parse(savedStorage);
        const isLessThen24Hours = is24Hours(storage.created_at);
        if (!isLessThen24Hours) {
          authenticate(storage.token, storage.name);
        }
      }
    }
    getSavedStorage();
  }, [])
  return (
    <NavigationContainer>
      <TabNavigation />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AuthContextProvider>
        <AlertContextProvider>
          <Navigations />
        </AlertContextProvider>
      </AuthContextProvider>
    </>
  );
}